"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getRole } from "../../lib/staff-auth";
import { SECTIONS, saveSection } from "../../lib/site-content";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/** ホームページの写真・文章を、セクション単位で保存する（管理者のみ） */
export async function saveSiteSection(formData: FormData) {
  const role = await getRole();
  if (!role) redirect("/staff?error=login&next=/staff/site");
  if (role !== "admin") redirect("/staff/site?error=role");

  const sectionId = String(formData.get("section") ?? "");
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section || section.locked) redirect("/staff/site?error=locked");

  const texts: Record<string, string> = {};
  const images: Record<string, { bytes: ArrayBuffer; name: string; type: string }> = {};
  const resets: string[] = [];

  for (const f of section.fields) {
    if (formData.get(`reset:${f.key}`) === "on") {
      resets.push(f.key);
      continue;
    }
    if (f.type === "image") {
      const file = formData.get(`img:${f.key}`);
      if (file instanceof File && file.size > 0) {
        if (!IMAGE_TYPES.includes(file.type)) redirect(`/staff/site?error=file_type#${sectionId}`);
        if (file.size > MAX_IMAGE_BYTES) redirect(`/staff/site?error=file_size#${sectionId}`);
        images[f.key] = { bytes: await file.arrayBuffer(), name: file.name, type: file.type };
      }
    } else {
      const v = formData.get(`txt:${f.key}`);
      if (typeof v === "string") texts[f.key] = v;
    }
  }

  await saveSection(sectionId, texts, images, resets);
  revalidatePath("/");
  revalidatePath("/staff/site");
  redirect(`/staff/site?saved=${sectionId}#${sectionId}`);
}
