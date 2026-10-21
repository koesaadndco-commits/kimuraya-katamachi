"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isStaffLoggedIn, loginStaff, logoutStaff } from "../lib/staff-auth";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_BYTES,
  addPost,
  deletePost,
  isValidDateTime,
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
  revalidatePath("/staff");
}

export async function login(formData: FormData) {
  const ok = await loginStaff(str(formData, "password"));
  if (!ok) redirect("/staff?error=password");
  redirect("/staff");
}

export async function logout() {
  await logoutStaff();
  redirect("/staff");
}

export async function createPost(formData: FormData) {
  await requireLogin();

  const kindRaw = str(formData, "kind");
  const kind: PostKind = kindRaw === "flyer" ? "flyer" : "info";
  const title = str(formData, "title");
  const body = str(formData, "body");
  const linkUrl = str(formData, "linkUrl");
  const startAt = str(formData, "startAt");
  const endAt = str(formData, "endAt");

  if (!title) redirect("/staff?error=title");
  if (!isValidDateTime(startAt) || !isValidDateTime(endAt)) redirect("/staff?error=period");
  if (endAt <= startAt) redirect("/staff?error=period_order");
  if (linkUrl && !/^https?:\/\//.test(linkUrl)) redirect("/staff?error=url");

  const fileEntry = formData.get("file");
  let file: { bytes: ArrayBuffer; name: string; type: string } | null = null;
  if (fileEntry instanceof File && fileEntry.size > 0) {
    if (!ALLOWED_FILE_TYPES.includes(fileEntry.type)) redirect("/staff?error=file_type");
    if (fileEntry.size > MAX_FILE_BYTES) redirect("/staff?error=file_size");
    file = { bytes: await fileEntry.arrayBuffer(), name: fileEntry.name, type: fileEntry.type };
  }

  await addPost({ kind, title, body, linkUrl, startAt, endAt }, file);
  refreshPublicPages();
  redirect("/staff?saved=1");
}

export async function removePost(formData: FormData) {
  await requireLogin();
  const id = str(formData, "id");
  if (id) await deletePost(id);
  refreshPublicPages();
  redirect("/staff?deleted=1");
}
