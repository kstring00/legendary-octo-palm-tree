import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

function safeEqualHex(left: string, right: string) {
  try {
    const a = Buffer.from(left, "hex");
    const b = Buffer.from(right, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestampPart || signatures.length === 0) return false;

  const timestamp = Number(timestampPart.slice(2));
  if (!Number.isFinite(timestamp)) return false;

  const age = Math.abs(Math.floor(Date.now() / 1000) - timestamp);
  if (age > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex");

  return signatures.some((signature) => safeEqualHex(expected, signature));
}

async function notifyPaymentEvent(event: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const type = typeof event.type === "string" ? event.type : "stripe.event";
  const data = event.data as { object?: Record<string, unknown> } | undefined;
  const object = data?.object || {};
  const metadata = (object.metadata as Record<string, unknown> | undefined) || {};

  const customerEmail =
    (object.customer_details as { email?: string } | undefined)?.email ||
    (typeof object.customer_email === "string" ? object.customer_email : "") ||
    (typeof object.receipt_email === "string" ? object.receipt_email : "");

  const amount =
    typeof object.amount_total === "number"
      ? object.amount_total
      : typeof object.amount_paid === "number"
        ? object.amount_paid
        : typeof object.amount_received === "number"
          ? object.amount_received
          : null;

  const currency = typeof object.currency === "string" ? object.currency.toUpperCase() : "USD";
  const reference =
    typeof metadata.quote_reference === "string"
      ? metadata.quote_reference
      : typeof metadata.reference === "string"
        ? metadata.reference
        : "Not attached";

  const lines = [
    "Stripe payment update",
    "",
    `Event: ${type}`,
    `Quote reference: ${reference}`,
    `Customer email: ${customerEmail || "Not provided"}`,
    `Amount: ${amount === null ? "Not available" : `${currency} ${(amount / 100).toFixed(2)}`}`,
    `Stripe object: ${typeof object.id === "string" ? object.id : "Unknown"}`,
  ];

  const to = process.env.CAPTURE_TO_EMAIL || "stringham00@gmail.com";
  const from = process.env.CAPTURE_FROM_EMAIL || "Website Payments <onboarding@resend.dev>";

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Stripe update: ${type}`,
        text: lines.join("\n"),
      }),
    });
  } catch (error) {
    console.error("Stripe webhook email notification failed", error);
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  if (!verifyStripeSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const type = typeof event.type === "string" ? event.type : "unknown";

  switch (type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.async_payment_failed":
    case "invoice.paid":
    case "invoice.payment_failed":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      console.log("Stripe webhook received", type);
      await notifyPaymentEvent(event);
      break;
    default:
      console.log("Stripe webhook ignored", type);
  }

  return NextResponse.json({ received: true });
}
