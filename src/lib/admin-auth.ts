import { createHmac, timingSafeEqual } from "node:crypto";

export type AdminAuthResult = "authorized" | "unauthorized" | "unconfigured";
export const ADMIN_SESSION_COOKIE = "supreme_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function sessionSignature(expiresAt: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return createHmac("sha256", secret).update(expiresAt).digest("base64url");
}

export function createAdminSession(username: string, password: string) {
  const configuredUsername = process.env.ADMIN_USERNAME;
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredUsername || !configuredPassword) return { result: "unconfigured" as const };
  if (username !== configuredUsername || password !== configuredPassword) {
    return { result: "unauthorized" as const };
  }

  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS);
  const signature = sessionSignature(expiresAt);
  if (!signature) return { result: "unconfigured" as const };
  return { result: "authorized" as const, token: `${expiresAt}.${signature}`, maxAge: SESSION_DURATION_SECONDS };
}

export function checkAdminSession(cookieHeader: string | null): AdminAuthResult {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) return "unconfigured";
  const cookie = cookieHeader?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  if (!cookie) return "unauthorized";

  const token = cookie.slice(ADMIN_SESSION_COOKIE.length + 1);
  const [expiresAt, suppliedSignature] = token.split(".");
  if (!expiresAt || !suppliedSignature || !/^\d+$/.test(expiresAt) || Number(expiresAt) <= Math.floor(Date.now() / 1000)) {
    return "unauthorized";
  }

  const expectedSignature = sessionSignature(expiresAt);
  if (!expectedSignature) return "unconfigured";
  const expected = Buffer.from(expectedSignature);
  const supplied = Buffer.from(suppliedSignature);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied) ? "authorized" : "unauthorized";
}
