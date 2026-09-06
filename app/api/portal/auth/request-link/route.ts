import { NextRequest, NextResponse } from "next/server";

import {
  adminRest,
  bootstrapAdminIfNeeded,
} from "../../../../lib/portalSupabase";
import {
  createPortalSignInUrl,
  sendPortalSignInEmail,
} from "../../../../lib/portalMagicLink";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRODUCTION_ORIGIN = "https://www.stringhamwebdesign.com";

function getPublicOrigin(request: NextRequest) {
  const configured = process.env.PORTAL_PUBLIC_URL?.trim();
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      console.error("PORTAL_PUBLIC_URL is invalid; falling back to request host.");
    }
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host")?.trim() || "";
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || "https";

  if (host && !/^localhost(?::\d+)?$/i.test(host) && host !== "127.0.0.1:3000") {
    return `${protocol}://${host}`;
  }

  return PRODUCTION_ORIGIN;
}

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
    const signInUrl = await createPortalSignInUrl(email, getPublicOrigin(request));
    await sendPortalSignInEmail(email, signInUrl);
  } catch (error) {
    console.error("Portal sign-in email failed", error);
    return NextResponse.json(
      { error: "I couldn't send the sign-in link. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
