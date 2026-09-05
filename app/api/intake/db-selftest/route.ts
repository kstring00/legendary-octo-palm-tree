import { NextResponse } from "next/server";

import { supabaseAdminRequest } from "../../../lib/supabaseAdmin";

export async function GET() {
  let intakeId: string | null = null;

  try {
    const created = await supabaseAdminRequest<Array<{ id: string }>>("intakes", {
      method: "POST",
      returnRepresentation: true,
      body: JSON.stringify({
        client_token_hash: `db-selftest-${crypto.randomUUID()}`,
        status: "started",
        completion_percent: 0,
        current_step: "business",
        source: "db_selftest",
      }),
    });

    intakeId = created[0]?.id ?? null;
    if (!intakeId) throw new Error("Intake insert returned no id.");

    const messages = await supabaseAdminRequest<Array<{ id: string }>>("intake_messages", {
      method: "POST",
      returnRepresentation: true,
      body: JSON.stringify({
        intake_id: intakeId,
        role: "user",
        content: "Database self-test message",
        was_redacted: false,
        redaction_kinds: [],
      }),
    });

    if (!messages[0]?.id) throw new Error("Message insert returned no id.");

    await supabaseAdminRequest(`intakes?id=eq.${encodeURIComponent(intakeId)}`, {
      method: "DELETE",
    });

    return NextResponse.json({ ok: true, stages: ["intake", "message", "cleanup"] });
  } catch (error) {
    if (intakeId) {
      await supabaseAdminRequest(`intakes?id=eq.${encodeURIComponent(intakeId)}`, {
        method: "DELETE",
      }).catch(() => undefined);
    }

    console.error("Intake DB self-test failed", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown" },
      { status: 503 },
    );
  }
}
