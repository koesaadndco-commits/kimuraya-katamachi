"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isStaffLoggedIn, loginStaff, logoutStaff } from "../lib/staff-auth";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILES,
  MAX_FILE_BYTES,
  addPost,
  deletePost,
  type PostKind,
} from "../lib/staff-store";

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

async function requireLogin() {
  if (!(await isStaffLoggedIn())) redirect("/staff?error=login");
}

function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/flyer");
  revalidatePath("/staff");
}

const WEEKDAYS = "日月火水木金土";

/** "YYYY-MM-DD" に日数を足す（日本時間の暦日として扱う） */
function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function validDate(v: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
}

function validTime(v: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}

export async function login(formData: FormData) {
  const next = str(formData, "next");
  // 戻り先は /staff 配下だけ許可（外部サイトへの転送を防ぐ）
  const safeNext = /^\/staff(\/[\w\-/]*)?(\?[\w=&\-%]*)?$/.test(next) ? next : "/staff";
  const ok = await loginStaff(str(formData, "password"));
  if (!ok) redirect(`/staff?error=password${safeNext !== "/staff" ? `&next=${encodeURIComponent(safeNext)}` : ""}`);
  redirect(safeNext);
}

export async function logout() {
  await logoutStaff();
  redirect("/staff");
}

export async function createPost(formData: FormData) {
  await requireLogin();

  const kind: PostKind = str(formData, "kind") === "info" ? "info" : "flyer";
  const body = str(formData, "body");
  const linkUrl = str(formData, "linkUrl");
  const startDate = str(formData, "startDate");
  const days = Math.min(31, Math.max(1, Math.floor(Number(str(formData, "days"))) || 1));
  const startTime = str(formData, "startTime") || "00:00";
  const endTime = str(formData, "endTime") || "23:59";
  const replaceSameDay = formData.get("replaceSameDay") === "on";

  if (!validDate(startDate) || !validTime(startTime) || !validTime(endTime)) redirect("/staff?error=period");
  const startAt = `${startDate}T${startTime}`;
  const endAt = `${addDays(startDate, days - 1)}T${endTime}`;
  if (endAt <= startAt) redirect("/staff?error=period_order");
  if (linkUrl && !/^https?:\/\//.test(linkUrl)) redirect("/staff?error=url");

  // チラシはタイトル省略可（「10月22日（水）本日のチラシ」を自動で付ける）
  let title = str(formData, "title");
  if (!title) {
    if (kind === "info") redirect("/staff?error=title");
    const d = new Date(`${startDate}T00:00:00Z`);
    title = `${d.getUTCMonth() + 1}月${d.getUTCDate()}日（${WEEKDAYS[d.getUTCDay()]}）本日のチラシ`;
  }

  const files: { bytes: ArrayBuffer; name: string; type: string }[] = [];
  for (const entry of formData.getAll("files")) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    if (!ALLOWED_FILE_TYPES.includes(entry.type)) redirect("/staff?error=file_type");
    if (entry.size > MAX_FILE_BYTES) redirect("/staff?error=file_size");
    files.push({ bytes: await entry.arrayBuffer(), name: entry.name, type: entry.type });
  }
  if (files.length > MAX_FILES) redirect("/staff?error=file_count");
  if (kind === "flyer" && files.length === 0 && !linkUrl) redirect("/staff?error=flyer_empty");

  const { replaced } = await addPost({ kind, title, body, linkUrl, startAt, endAt }, files, { replaceSameDay });
  refreshPublicPages();
  redirect(`/staff?saved=1${replaced ? `&replaced=${replaced}` : ""}`);
}

export async function removePost(formData: FormData) {
  await requireLogin();
  const id = str(formData, "id");
  if (id) await deletePost(id);
  refreshPublicPages();
  redirect("/staff?deleted=1");
}
