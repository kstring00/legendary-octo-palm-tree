type GeneratedLinkResponse = {
  action_link?: string;
  hashed_token?: string;
  verification_type?: string;
  properties?: {
    action_link?: string;
    hashed_token?: string;
    verification_type?: string;
  };
};

export type PortalVerifiedSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
};

function authConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error("Supabase server environment variables are not configured.");
  }

  return { url, secretKey };
}

async function authRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { url, secretKey } = authConfig();
  const response = await fetch(`${url}/auth/v1${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      apikey: secretKey,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Portal magic-link auth request failed", response.status, detail.slice(0, 500));
    throw new Error("Could not create or verify the portal sign-in link.");
  }

  return (await response.json()) as T;
}

export async function createPortalSignInUrl(email: string, publicOrigin: string) {
  const generated = await authRequest<GeneratedLinkResponse>("/admin/generate_link", {
    method: "POST",
    body: JSON.stringify({
      type: "magiclink",
      email: email.trim().toLowerCase(),
    }),
  });

  const properties = generated.properties ?? generated;
  const actionLink = properties.action_link ?? "";
  let tokenHash = properties.hashed_token ?? "";
  let verificationType = properties.verification_type ?? "";

  if (actionLink) {
    const generatedUrl = new URL(actionLink);
    tokenHash =
      tokenHash ||
      generatedUrl.searchParams.get("token") ||
      generatedUrl.searchParams.get("token_hash") ||
      "";
    verificationType =
      verificationType || generatedUrl.searchParams.get("type") || "magiclink";
  }

  if (!tokenHash) {
    throw new Error("Supabase did not return a usable magic-link token.");
  }

  const callback = new URL("/api/portal/auth/callback", publicOrigin);
  callback.searchParams.set("token_hash", tokenHash);
  callback.searchParams.set("type", verificationType || "magiclink");
  return callback.toString();
}

export async function verifyPortalSignInToken(tokenHash: string, type: string) {
  const verificationType = type === "email" ? "email" : "magiclink";
  return authRequest<PortalVerifiedSession>("/verify", {
    method: "POST",
    body: JSON.stringify({
      token_hash: tokenHash,
      type: verificationType,
    }),
  });
}

export async function sendPortalSignInEmail(email: string, signInUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const from =
    process.env.CAPTURE_FROM_EMAIL ||
    "Stringham Web Design <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your Stringham Web Design portal sign-in link",
      text: [
        "Your client portal sign-in link is ready.",
        "",
        signInUrl,
        "",
        "This link is single-use and expires shortly. If you did not request it, you can ignore this email.",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;background:#f5f0e8;padding:32px;color:#0d1b26">
          <div style="max-width:560px;margin:0 auto;background:#fffdf8;border:1px solid rgba(13,27,38,.12);padding:32px">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8f741c">Stringham Web Design</p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.1">Your portal sign-in link</h1>
            <p style="margin:0 0 24px;line-height:1.6;color:#485661">Open your private project workspace with the button below.</p>
            <p style="margin:0 0 24px"><a href="${signInUrl}" style="display:inline-block;background:#0d1b26;color:#fffdf8;text-decoration:none;padding:13px 18px;font-weight:700">Open client portal</a></p>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#6d787f">This link is single-use and expires shortly. If you did not request it, you can ignore this email.</p>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Portal sign-in email via Resend failed", response.status, detail.slice(0, 500));
    throw new Error("Could not send the portal sign-in email.");
  }
}
