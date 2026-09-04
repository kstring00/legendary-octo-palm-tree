export type SensitiveInputKind =
  | "password"
  | "verification_code"
  | "api_key_or_token"
  | "jwt";

export type ScrubResult = {
  text: string;
  redacted: boolean;
  kinds: SensitiveInputKind[];
};

const REDACTED = "[REDACTED]";

const rules: Array<{
  kind: SensitiveInputKind;
  pattern: RegExp;
  replacement: string;
}> = [
  {
    kind: "password",
    pattern:
      /\b(password|passcode|pwd|login password|account password)\s*(?:is|=|:|-)\s*([^\s,;]{4,})/gi,
    replacement: `$1: ${REDACTED}`,
  },
  {
    kind: "verification_code",
    pattern:
      /\b(verification code|security code|one[- ]time(?: password| code)?|otp|2fa code|mfa code)\s*(?:is|=|:|-)\s*([A-Za-z0-9-]{4,12})/gi,
    replacement: `$1: ${REDACTED}`,
  },
  {
    kind: "api_key_or_token",
    pattern:
      /\b(api[ _-]?key|secret key|access[ _-]?token|auth(?:orization)?[ _-]?token|bearer token)\s*(?:is|=|:|-)\s*([A-Za-z0-9._~+/=-]{8,})/gi,
    replacement: `$1: ${REDACTED}`,
  },
  {
    kind: "api_key_or_token",
    pattern: /\bsk_(?:live|test)_[A-Za-z0-9]{12,}\b/g,
    replacement: REDACTED,
  },
  {
    kind: "api_key_or_token",
    pattern: /\bsk-[A-Za-z0-9_-]{16,}\b/g,
    replacement: REDACTED,
  },
  {
    kind: "api_key_or_token",
    pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
    replacement: REDACTED,
  },
  {
    kind: "api_key_or_token",
    pattern: /\bAKIA[0-9A-Z]{16}\b/g,
    replacement: REDACTED,
  },
  {
    kind: "api_key_or_token",
    pattern: /\bAIza[0-9A-Za-z_-]{30,}\b/g,
    replacement: REDACTED,
  },
  {
    kind: "jwt",
    pattern:
      /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
    replacement: REDACTED,
  },
];

/**
 * Scrub obvious credentials before an intake message reaches persistence,
 * logs, analytics, email, or the model transcript store.
 *
 * This is deliberately conservative and is not a complete secret scanner.
 * The intake API should still instruct the model to refuse credentials and
 * should never email a raw transcript.
 */
export function scrubSensitiveInput(raw: string): ScrubResult {
  let text = raw;
  const kinds = new Set<SensitiveInputKind>();

  for (const rule of rules) {
    const detector = new RegExp(rule.pattern.source, rule.pattern.flags.replace("g", ""));

    if (detector.test(text)) {
      kinds.add(rule.kind);
      text = text.replace(rule.pattern, rule.replacement);
    }
  }

  return {
    text,
    redacted: kinds.size > 0,
    kinds: [...kinds],
  };
}

export const CREDENTIAL_REFUSAL_MESSAGE =
  "For your security, please do not send passwords, verification codes, API keys, or account credentials here. Tell me only the domain name and provider. If we work together, access can be shared securely after kickoff.";
