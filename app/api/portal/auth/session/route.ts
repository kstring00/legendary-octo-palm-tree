import { NextRequest, NextResponse } from "next/server";

import {
  clearPortalCookies,
  getPortalSession,
  setPortalCookies,
  validatePortalTokens,
} from "../../../../lib/portalSupabase";

export async function GET() {
  const session = await getPortalSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session.profile,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | {
        accessToken?: string;
        refreshToken?: string;
        expiresIn?: number;
      }
    | null;

  const accessToken = body?.accessToken ?? "";
  const refreshToken = body?.refreshToken ?? "";

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: "Missing session tokens." }, { status: 400 });
  }

  const validated = await validatePortalTokens(accessToken);

  if (!validated) {
    return NextResponse.json(
      { error: "This account is not invited to the client portal." },
      { status: 403 },
    );
  }

  await setPortalCookies(
    accessToken,
    refreshToken,
    Math.max(60, Math.min(body?.expiresIn ?? 3600, 7200)),
  );

  return NextResponse.json({
    authenticated: true,
    user: validated.profile,
  });
}

export async function DELETE() {
  await clearPortalCookies();
  return NextResponse.json({ ok: true });
}
