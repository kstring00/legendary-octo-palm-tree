import { NextRequest, NextResponse } from "next/server";

import { hashIntakeToken, INTAKE_COOKIE_NAME } from "../../../lib/intakeSession";
import {
  CREDENTIAL_REFUSAL_MESSAGE,
  scrubSensitiveInput,
} from "../../../lib/scrubSensitiveInput";
import { supabaseAdminRequest } from "../../../lib/supabaseAdmin";

type IntakeRecord = {
  id: string;
  status: "started" | "in_progress" | "completed" | "contacted" | "archived";
};

type IntakeMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  was_redacted: boolean;
  redaction_kinds: string[];
};

type RateEntry = {
  count: number;
  resetAt: number;
};

const MAX_MESSAGE_LENGTH = 4000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 60;
const rateStore = new Map<string, RateEntry>();

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = rateStore.get(ip);

  if (!current || current.resetAt <= now) {
    rateStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT) return true;

  current.count += 1;
  rateStore.set(ip, current);
  return false;
}

async function findIntakeByToken(token: string) {
  const tokenHash = hashIntakeToken(token);
  const rows = await supabaseAdminRequest<IntakeRecord[]>(
    `intakes?client_token_hash=eq.${encodeURIComponent(tokenHash)}&select=id,status&limit=1`,
  );

  return rows[0] ?? null;
}

async function insertMessage(
  intakeId: string,
  role: "user" | "assistant",
  content: string,
  redaction?: { redacted: boolean; kinds: string[] },
) {
  const rows = await supabaseAdminRequest<IntakeMessage[]>("intake_messages", {
    method: "POST",
    returnRepresentation: true,
    body: JSON.stringify({
      intake_id: intakeId,
      role,
      content,
      was_redacted: redaction?.redacted ?? false,
      redaction_kinds: redaction?.kinds ?? [],
    }),
  });

  const message = rows[0];
  if (!message) throw new Error("Supabase did not return the created message.");
  return message;
}

async function touchIntake(intakeId: string) {
  await supabaseAdminRequest(
    `intakes?id=eq.${encodeURIComponent(intakeId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status: "in_progress",
        last_activity_at: new Date().toISOString(),
      }),
    },
  );
}

function getSessionToken(request: NextRequest) {
  return request.cookies.get(INTAKE_COOKIE_NAME)?.value ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const intake = await findIntakeByToken(token);
    if (!intake) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const messages = await supabaseAdminRequest<IntakeMessage[]>(
      `intake_messages?intake_id=eq.${encodeURIComponent(intake.id)}&select=id,role,content,created_at,was_redacted,redaction_kinds&order=created_at.asc`,
    );

    return NextResponse.json(
      { messages },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Intake messages could not be loaded", error);
    return NextResponse.json(
      { error: "The conversation could not be loaded." },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "This endpoint accepts JSON only." },
      { status: 415 },
    );
  }

  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Start an intake before sending a message.", code: "start_session" },
        { status: 401 },
      );
    }

    const intake = await findIntakeByToken(token);
    if (!intake) {
      return NextResponse.json(
        { error: "Your intake session could not be found.", code: "start_session" },
        { status: 401 },
      );
    }

    if (intake.status === "completed" || intake.status === "archived") {
      return NextResponse.json(
        { error: "This intake is already closed." },
        { status: 409 },
      );
    }

    const body = (await request.json()) as { message?: unknown };
    if (typeof body.message !== "string") {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 },
      );
    }

    const rawMessage = body.message.trim();
    if (!rawMessage) {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 },
      );
    }

    if (rawMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
        { status: 413 },
      );
    }

    // Safety boundary: the raw message is scrubbed before persistence, model use,
    // analytics, email, or any logging. Never log rawMessage above this point.
    const scrubbed = scrubSensitiveInput(rawMessage);

    const userMessage = await insertMessage(
      intake.id,
      "user",
      scrubbed.text,
      { redacted: scrubbed.redacted, kinds: scrubbed.kinds },
    );

    await touchIntake(intake.id);

    if (scrubbed.redacted) {
      const assistantMessage = await insertMessage(
        intake.id,
        "assistant",
        CREDENTIAL_REFUSAL_MESSAGE,
      );

      return NextResponse.json(
        {
          accepted: true,
          sensitiveInputBlocked: true,
          userMessage,
          assistantMessage,
        },
        {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    // OpenAI will be added at the next layer. At this point the message has
    // already crossed the credential scrub and persistence boundary safely.
    return NextResponse.json(
      {
        accepted: true,
        sensitiveInputBlocked: false,
        userMessage,
        assistantMessage: null,
      },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    // Do not include request content in this log.
    console.error("Intake message processing failed", error);
    return NextResponse.json(
      { error: "Your message could not be saved right now." },
      { status: 503 },
    );
  }
}
