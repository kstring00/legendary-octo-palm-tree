import { NextRequest, NextResponse } from "next/server";

import {
  adminRest,
  bootstrapAdminIfNeeded,
  sendPortalMagicLink,
} from "../../../../lib/portalSupabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PORTAL_URL = "https://www.stringhamwebdesign.com/portal";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string }
    | null;
  const email = body?.email?.trim().toLowerCase() ?? "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await bootstrapAdminIfNeeded(email);
  } catch (error) {
    console.error("Admin bootstrap failed", error);
    return NextResponse.json(
      { error: "I couldn't prepare this portal account. Please try again." },
      { status: 500 },
    );
  }

  let profile: { id: string }[];
  try {
    profile = await adminRest<{ id: string }[]>(
      `users?email=eq.${encodeURIComponent(email)}&select=id&limit=1`,
    );
  } catch (error) {
    console.error("Portal account lookup failed", error);
    return NextResponse.json(
      { error: "I couldn't check this portal account. Please try again." },
      { status: 500 },
    );
  }

  // Deliberately return the same response for unknown addresses.
  if (!profile[0]) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendPortalMagicLink(email, PORTAL_URL);
  } catch (error) {
    console.error("Portal sign-in email failed", error);
    return NextResponse.json(
      { error: "I couldn't send the sign-in link. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
