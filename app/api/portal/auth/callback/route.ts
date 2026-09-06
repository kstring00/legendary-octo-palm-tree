import { NextRequest, NextResponse } from "next/server";

import {
  setPortalCookies,
  validatePortalTokens,
} from "../../../../lib/portalSupabase";
import { verifyPortalSignInToken } from "../../../../lib/portalMagicLink";

function portalRedirect(request: NextRequest, reason?: string) {
  const target = new URL("/portal", request.url);
  if (reason) target.searchParams.set("auth", reason);
  return target;
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash")?.trim() ?? "";
  const type = request.nextUrl.searchParams.get("type")?.trim() || "magiclink";

  if (!tokenHash) {
    return NextResponse.redirect(portalRedirect(request, "invalid-link"));
  }

  try {
    const session = await verifyPortalSignInToken(tokenHash, type);

    if (!session.access_token || !session.refresh_token) {
      throw new Error("Supabase did not return a complete session.");
    }

    const validated = await validatePortalTokens(session.access_token);
    if (!validated) {
      return NextResponse.redirect(portalRedirect(request, "not-invited"));
    }

    await setPortalCookies(
      session.access_token,
      session.refresh_token,
      Math.max(60, Math.min(session.expires_in ?? 3600, 7200)),
    );

    return NextResponse.redirect(portalRedirect(request));
  } catch (error) {
    console.error("Portal magic-link callback failed", error);
    return NextResponse.redirect(portalRedirect(request, "expired-link"));
  }
}
