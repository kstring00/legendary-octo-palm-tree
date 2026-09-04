import { NextResponse } from "next/server";

import { runIntakeInterview } from "../../../lib/openaiIntake";

export async function GET() {
  try {
    const result = await runIntakeInterview({
      intakeId: "00000000-0000-0000-0000-000000000000",
      intake: {
        name: null,
        business_name: null,
        email: null,
        phone: null,
        business_description: null,
        current_website: null,
        website_goals: null,
        success_definition: null,
        friction_points: [],
        pages_needed: [],
        integrations: [],
        color_preferences: [],
        inspiration_notes: null,
        desired_domain: null,
        current_domain: null,
        hosting_provider: null,
        budget_range: null,
        desired_timeline: null,
        additional_notes: null,
      },
      answeredFields: [],
      transcript: [
        {
          role: "user",
          content:
            "Hi, I'm Jordan and my email is jordan@example.com. I run a neighborhood bakery called Hearth & Crumb.",
        },
      ],
    });

    return NextResponse.json(
      {
        ok: true,
        extractedName: result.intake.name,
        extractedEmail: result.intake.email,
        answeredFields: result.answered_fields,
        hasReply: Boolean(result.reply),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message.slice(0, 300) : "unknown";
    return NextResponse.json(
      { ok: false, detail },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
