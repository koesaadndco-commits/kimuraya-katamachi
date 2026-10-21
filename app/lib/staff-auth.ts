import { cookies } from "next/headers";
import { getStaffEnv } from "./staff-store";

export const SESSION_COOKIE = "staff_session";
const SESSION_DAYS = 30;

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** パスワードから導出したセッショントークン。パスワードを変えると全員ログアウトになる */
async function sessionToken(password: string): Promise<string> {
  return sha256Hex(`kimuraya-staff-session-v1:${password}`);
}

export async function getStaffPassword(): Promise<string | null> {
  const env = await getStaffEnv();
  const pw = env.STAFF_PASSWORD?.trim();
  return pw ? pw : null;
}

export async function isStaffLoggedIn(): Promise<boolean> {
  const pw = await getStaffPassword();
  if (!pw) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return token === (await sessionToken(pw));
}

/** 正しいパスワードならセッションCookieを発行して true */
export async function loginStaff(password: string): Promise<boolean> {
  const pw = await getStaffPassword();
  if (!pw || password !== pw) return false;
  (await cookies()).set(SESSION_COOKIE, await sessionToken(pw), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return true;
}

export async function logoutStaff(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
