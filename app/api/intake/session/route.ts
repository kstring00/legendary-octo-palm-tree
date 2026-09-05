import { NextRequest, NextResponse } from "next/server";

import {
  hashIntakeToken,
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

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(INTAKE_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { intake: null },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      );
    }

    const intake = await findIntakeByToken(token);

    if (!intake) {
      const response = NextResponse.json(
        { intake: null },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      );
      response.cookies.delete(INTAKE_COOKIE_NAME);
      return response;
    }

    return NextResponse.json(
      { intake },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Intake session lookup failed", error);
    return NextResponse.json(
      { intake: null },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(request: NextRequest) {
  // Session creation is intentionally deferred to the first valid message.
  // The message endpoint owns the atomic create + save flow, which removes a
  // fragile extra startup request and prevents a visitor from being blocked
  // before they can send their first answer.
  try {
    const token = request.cookies.get(INTAKE_COOKIE_NAME)?.value;

    if (token) {
      const existing = await findIntakeByToken(token);
      if (existing) {
        return NextResponse.json(
          { intake: existing, resumed: true, deferred: false },
          { status: 200, headers: { "Cache-Control": "no-store" } },
        );
      }
    }
  } catch (error) {
    console.error("Intake session preflight failed; deferring creation", error);
  }

  return NextResponse.json(
    { intake: null, resumed: false, deferred: true },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
