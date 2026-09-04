import { NextRequest, NextResponse } from "next/server";

import {
  createIntakeToken,
  hashIntakeToken,
  INTAKE_COOKIE_MAX_AGE,
  INTAKE_COOKIE_NAME,
} from "../../../lib/intakeSession";
import { supabaseAdminRequest } from "../../../lib/supabaseAdmin";

type IntakeSession = {
  id: string;
  status: "started" | "in_progress" | "completed" | "contacted" | "archived";
  completion_percent: number;
  current_step: string | null;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
};

type RateEntry = {
  count: number;
  resetAt: number;
};

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 12;
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
  const select = [
    "id",
    "status",
    "completion_percent",
    "current_step",
    "created_at",
    "updated_at",
    "last_activity_at",
  ].join(",");

  const rows = await supabaseAdminRequest<IntakeSession[]>(
    `intakes?client_token_hash=eq.${encodeURIComponent(tokenHash)}&select=${select}&limit=1`,
  );

  return rows[0] ?? null;
}

function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: INTAKE_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: INTAKE_COOKIE_MAX_AGE,
  });
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(INTAKE_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ intake: null }, { status: 200 });
    }

    const intake = await findIntakeByToken(token);

    if (!intake) {
      const response = NextResponse.json({ intake: null }, { status: 200 });
      response.cookies.delete(INTAKE_COOKIE_NAME);
      return response;
    }

    return NextResponse.json({ intake }, { status: 200 });
  } catch (error) {
    console.error("Intake session lookup failed", error);
    return NextResponse.json(
      { error: "The intake session could not be loaded." },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many intake attempts. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  try {
    const existingToken = request.cookies.get(INTAKE_COOKIE_NAME)?.value;

    if (existingToken) {
      const existing = await findIntakeByToken(existingToken);
      if (existing) {
        return NextResponse.json({ intake: existing, resumed: true }, { status: 200 });
      }
    }

    const token = createIntakeToken();
    const tokenHash = hashIntakeToken(token);

    const created = await supabaseAdminRequest<IntakeSession[]>("intakes", {
      method: "POST",
      returnRepresentation: true,
      body: JSON.stringify({
        client_token_hash: tokenHash,
        status: "started",
        completion_percent: 0,
        current_step: "business",
        source: "ai_intake",
      }),
    });

    const intake = created[0];
    if (!intake) {
      throw new Error("Supabase did not return the created intake.");
    }

    const response = NextResponse.json(
      { intake, resumed: false },
      { status: 201 },
    );
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Intake session creation failed", error);
    return NextResponse.json(
      { error: "The intake could not be started right now." },
      { status: 503 },
    );
  }
}
