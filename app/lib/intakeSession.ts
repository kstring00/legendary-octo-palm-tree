import { createHash, randomBytes } from "crypto";

export const INTAKE_COOKIE_NAME = "ks_intake_session";
export const INTAKE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function createIntakeToken() {
  return randomBytes(32).toString("base64url");
}

export function hashIntakeToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
