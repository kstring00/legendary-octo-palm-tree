import { NextRequest, NextResponse } from "next/server";

import { hashIntakeToken, INTAKE_COOKIE_NAME } from "../../../lib/intakeSession";
import {
  getAnsweredFields,
  getProgress,
  mergeAnsweredFields,
  mergeStructuredBrief,
  sanitizeIntakePatch,
  type IntakeData,
} from "../../../lib/intakeProgress";
import { runIntakeInterview } from "../../../lib/openaiIntake";
import {
  CREDENTIAL_REFUSAL_MESSAGE,
  scrubSensitiveInput,
} from "../../../lib/scrubSensitiveInput";
import { supabaseAdminRequest } from "../../../lib/supabaseAdmin";

type IntakeRecord = IntakeData & {
  id: string;
  status: "started" | "in_progress" | "completed" | "contacted" | "archived";
  completion_percent: number;
  current_step: string | null;
  structured_brief: Record<string, unknown>;
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

const intakeSelect = [
  "id",
  "status",
  "completion_percent",
  "current_step",
  "structured_brief",
  "name",
  "business_name",
  "email",
  "phone",
  "business_description",
  "current_website",
  "website_goals",
  "success_definition",
  "friction_points",
  "pages_needed",
  "integrations",
  "color_preferences",
  "inspiration_notes",
  "desired_domain",
  "current_domain",
  "hosting_provider",
  "budget_range",
  "desired_timeline",
  "additional_notes",
].join(",");

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
    `intakes?client_token_hash=eq.${encodeURIComponent(tokenHash)}&select=${intakeSelect}&limit=1`,
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

async function loadRecentTranscript(intakeId: string) {
  const messages = await supabaseAdminRequest<IntakeMessage[]>(
    `intake_messages?intake_id=eq.${encodeURIComponent(intakeId)}&select=id,role,content,created_at,was_redacted,redaction_kinds&order=created_at.desc&limit=18`,
  );

  return messages.reverse();
}

function toIntakeData(intake: IntakeRecord): IntakeData {
  return {
    name: intake.name,
    business_name: intake.business_name,
    email: intake.email,
    phone: intake.phone,
    business_description: intake.business_description,
    current_website: intake.current_website,
    website_goals: intake.website_goals,
    success_definition: intake.success_definition,
    friction_points: intake.friction_points,
    pages_needed: intake.pages_needed,
    integrations: intake.integrations,
    color_preferences: intake.color_preferences,
    inspiration_notes: intake.inspiration_notes,
    desired_domain: intake.desired_domain,
    current_domain: intake.current_domain,
    hosting_provider: intake.hosting_provider,
    budget_range: intake.budget_range,
    desired_timeline: intake.desired_timeline,
    additional_notes: intake.additional_notes,
  };
}

function getSessionToken(request: NextRequest) {
  return request.cookies.get(INTAKE_COOKIE_NAME)?.value ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json(
        { messages: [], progress: null },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      );
    }

    const intake = await findIntakeByToken(token);
    if (!intake) {
      return NextResponse.json(
        { messages: [], progress: null },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      );
    }

    const messages = await supabaseAdminRequest<IntakeMessage[]>(
      `intake_messages?intake_id=eq.${encodeURIComponent(intake.id)}&select=id,role,content,created_at,was_redacted,redaction_kinds&order=created_at.asc`,
    );

    return NextResponse.json(
      {
        messages,
        progress: {
          completionPercent: intake.completion_percent,
          currentStep: intake.current_step,
          status: intake.status,
        },
      },
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

    // Hard safety boundary: the raw message is scrubbed before persistence,
    // OpenAI, analytics, email, or any logging. Never log rawMessage.
    const scrubbed = scrubSensitiveInput(rawMessage);

    const userMessage = await insertMessage(
      intake.id,
      "user",
      scrubbed.text,
      { redacted: scrubbed.redacted, kinds: scrubbed.kinds },
    );

    if (scrubbed.redacted) {
      await supabaseAdminRequest(
        `intakes?id=eq.${encodeURIComponent(intake.id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "in_progress",
            last_activity_at: new Date().toISOString(),
          }),
        },
      );

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
          progress: {
            completionPercent: intake.completion_percent,
            currentStep: intake.current_step,
            status: "in_progress",
          },
        },
        {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const transcript = await loadRecentTranscript(intake.id);
    const existingAnswered = getAnsweredFields(intake.structured_brief);

    let modelTurn;
    try {
      modelTurn = await runIntakeInterview({
        intakeId: intake.id,
        intake: toIntakeData(intake),
        answeredFields: existingAnswered,
        transcript: transcript.map(({ role, content }) => ({ role, content })),
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message.slice(0, 240) : "unknown error";
      console.error("OpenAI intake turn failed", detail);

      return NextResponse.json(
        {
          accepted: true,
          saved: true,
          userMessage,
          assistantMessage: null,
          error: "I saved that answer, but I could not continue the conversation just now. Please try again.",
        },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const fieldUpdates = sanitizeIntakePatch(modelTurn.intake);
    const answeredFields = mergeAnsweredFields(
      existingAnswered,
      modelTurn.answered_fields,
    );
    const progress = getProgress(answeredFields);
    const now = new Date().toISOString();
    const structuredBrief = mergeStructuredBrief({
      existing: intake.structured_brief,
      answeredFields,
      completionPercent: progress.completionPercent,
      currentStep: progress.currentStep,
    });

    await supabaseAdminRequest(
      `intakes?id=eq.${encodeURIComponent(intake.id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          ...fieldUpdates,
          status: progress.complete ? "completed" : "in_progress",
          completion_percent: progress.completionPercent,
          current_step: progress.currentStep,
          structured_brief: structuredBrief,
          last_activity_at: now,
          ...(progress.complete ? { completed_at: now } : {}),
        }),
      },
    );

    const assistantText = progress.complete
      ? "Perfect. I have enough to put together your project brief. Kyle will review what you shared and follow up directly. You will also be able to review a summary of your intake here."
      : modelTurn.reply;

    // Defense in depth: assistant output is scrubbed before persistence too.
    const safeAssistant = scrubSensitiveInput(assistantText);
    const assistantMessage = await insertMessage(
      intake.id,
      "assistant",
      safeAssistant.text,
      { redacted: safeAssistant.redacted, kinds: safeAssistant.kinds },
    );

    return NextResponse.json(
      {
        accepted: true,
        sensitiveInputBlocked: false,
        userMessage,
        assistantMessage,
        progress: {
          completionPercent: progress.completionPercent,
          currentStep: progress.currentStep,
          status: progress.complete ? "completed" : "in_progress",
        },
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
