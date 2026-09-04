import { NextResponse } from "next/server";

import { supabaseAdminRequest } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    await supabaseAdminRequest<Array<{ id: string }>>(
      "intakes?select=id&limit=1",
    );

    return NextResponse.json(
      { ok: true },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Intake health check failed", error);
    return NextResponse.json(
      { ok: false },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
