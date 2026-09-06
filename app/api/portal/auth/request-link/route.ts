import { NextRequest, NextResponse } from "next/server";

import {
  adminRest,
  bootstrapAdminIfNeeded,
  sendPortalMagicLink,
} from "../../../../lib/portalSupabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string }
    | null;
  const email = body?.email?.trim().toLowerCase() ?? "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  await bootstrapAdminIfNeeded(email).catch((error) => {
    console.error("Admin bootstrap failed", error);
  });

  const profile = await adminRest<{ id: string }[]>(
    `users?email=eq.${encodeURIComponent(email)}&select=id&limit=1`,
  ).catch(() => []);

  // Deliberately return the same response for unknown addresses.
  if (!profile[0]) {
    return NextResponse.json({ ok: true });
  }

  const redirectTo = new URL("/portal", request.nextUrl.origin).toString();

  try {
    await sendPortalMagicLink(email, redirectTo);
  } catch (error) {
    console.error("Portal sign-in email failed", error);
    return NextResponse.json(
      { error: "I couldn't send the sign-in link. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
