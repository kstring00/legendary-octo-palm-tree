import { NextResponse } from "next/server";

import { supabaseAdminRequest } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const marker = `selftest-${crypto.randomUUID()}`;
    const created = await supabaseAdminRequest<Array<{ id: string }>>("intakes", {
      method: "POST",
      returnRepresentation: true,
      body: JSON.stringify({
        client_token_hash: marker,
        status: "started",
        completion_percent: 0,
        current_step: "business",
        source: "session_selftest",
      }),
    });

    const id = created[0]?.id;
    if (!id) throw new Error("Insert succeeded without a returned id.");

    await supabaseAdminRequest(`intakes?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Intake session self-test failed", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown" },
      { status: 503 },
    );
  }
}
