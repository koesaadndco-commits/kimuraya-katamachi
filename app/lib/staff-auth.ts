import { cookies } from "next/headers";
import { getStaffEnv } from "./staff-store";

export const SESSION_COOKIE = "staff_session";
const SESSION_DAYS = 30;

/** admin = 記事の公開・取り下げ・削除ができる。staff = 下書きと確認依頼まで */
export type Role = "admin" | "staff";

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** パスワードから導出したセッショントークン。パスワードを変えると全員ログアウトになる */
function staffToken(password: string): Promise<string> {
  return sha256Hex(`kimuraya-staff-session-v1:${password}`); // v1のまま（既存のログインを切らない）
}
function adminToken(password: string): Promise<string> {
  return sha256Hex(`kimuraya-staff-session-v2:admin:${password}`);
}

async function passwords(): Promise<{ staff: string | null; admin: string | null }> {
  const env = await getStaffEnv();
  const staff = env.STAFF_PASSWORD?.trim() || null;
  const admin = env.ADMIN_PASSWORD?.trim() || null;
  return { staff, admin };
}

export async function getStaffPassword(): Promise<string | null> {
  return (await passwords()).staff;
}

/** 管理者パスワード（ADMIN_PASSWORD）が設定されているか。未設定なら、スタッフがそのまま公開できる */
export async function hasSeparateAdmin(): Promise<boolean> {
  return (await passwords()).admin !== null;
}

/** いまログインしている人の役割（未ログインは null） */
export async function getRole(): Promise<Role | null> {
  const { staff, admin } = await passwords();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  if (admin && token === (await adminToken(admin))) return "admin";
  if (staff && token === (await staffToken(staff))) return admin ? "staff" : "admin";
  return null;
}

export async function isStaffLoggedIn(): Promise<boolean> {
  return (await getRole()) !== null;
}

/** 正しいパスワードならセッションCookieを発行して true（管理者パスワードを先に照合） */
export async function loginStaff(password: string): Promise<boolean> {
  const { staff, admin } = await passwords();
  let token: string | null = null;
  if (admin && password === admin) token = await adminToken(admin);
  else if (staff && password === staff) token = await staffToken(staff);
  if (!token) return false;
  (await cookies()).set(SESSION_COOKIE, token, {
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
