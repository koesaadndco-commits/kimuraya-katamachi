"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getRole, type Role } from "../../lib/staff-auth";
import {
  CATEGORIES,
  MAX_PHOTOS,
  articleIssues,
  deleteArticle,
  deletePhotoFiles,
  getArticle,
  isArticleType,
  newArticle,
  saveArticle,
  savePhotos,
  type Article,
} from "../../lib/articles";
import { MAX_FILE_BYTES, nowJst } from "../../lib/staff-store";

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  // ブラウザは改行を CRLF で送るため、LF にそろえる（段落の判定のため）
  return typeof v === "string" ? v.replace(/\r\n?/g, "\n").trim() : "";
}
function lines(text: string): string[] {
  return text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

async function requireRole(): Promise<Role> {
  const role = await getRole();
  if (!role) redirect("/staff?error=login");
  return role;
}

/** 入力画面に戻る（新規なら種類つき）。error は画面に出す案内の種類 */
function editUrl(article: Article, id: string, error: string): string {
  return id ? `/staff/posts/${id}?error=${error}` : `/staff/posts/new?type=${article.type}&error=${error}`;
}

function refresh(id: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${id}`);
  revalidatePath("/staff/posts");
}

/**
 * 記事の保存。intent:
 *   save    … 内容を保存（状態は変えない。新規は下書き）
 *   review  … 管理者へ確認を依頼（スタッフ）
 *   publish … 公開する（管理者）
 * 確認依頼・公開に必要な項目が足りないときは、入力内容を失わないよう、まず保存してから案内する。
 */
export async function saveArticleAction(formData: FormData) {
  const role = await requireRole();
  const intent = str(formData, "intent");
  const id = str(formData, "id");

  let article: Article;
  if (id) {
    const existing = await getArticle(id);
    if (!existing) redirect("/staff/posts?error=notfound");
    if (existing.status === "published" && role !== "admin") redirect(`/staff/posts/${id}?error=locked`);
    article = existing;
  } else {
    const type = str(formData, "type");
    if (!isArticleType(type)) redirect("/staff/posts?error=type");
    article = newArticle(type);
  }

  const category = str(formData, "category");
  const videoUrl = str(formData, "videoUrl");
  if (videoUrl && !/^https?:\/\//.test(videoUrl)) redirect(editUrl(article, id, "videoUrl"));

  // 写真：残す既存の写真 ＋ 新しく選んだ写真
  const keep = new Set(formData.getAll("keep").filter((v): v is string => typeof v === "string"));
  const kept = article.photos.filter((p) => keep.has(p.id));
  const removed = article.photos.filter((p) => !keep.has(p.id)).map((p) => p.id);
  const incoming: { bytes: ArrayBuffer; name: string; type: string }[] = [];
  for (const entry of formData.getAll("files")) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    if (!PHOTO_TYPES.includes(entry.type)) redirect(editUrl(article, id, "photoType"));
    if (entry.size > MAX_FILE_BYTES) redirect(editUrl(article, id, "photoSize"));
    incoming.push({ bytes: await entry.arrayBuffer(), name: entry.name, type: entry.type });
  }
  if (kept.length + incoming.length > MAX_PHOTOS) redirect(editUrl(article, id, "photoCount"));
  const added = incoming.length > 0 ? await savePhotos(incoming) : [];

  article = {
    ...article,
    title: str(formData, "title"),
    category: (CATEGORIES as readonly string[]).includes(category) ? category : article.category,
    author: str(formData, "author"),
    body: str(formData, "body"),
    credit: str(formData, "credit"),
    alt: str(formData, "alt"),
    permission: formData.get("permission") === "on",
    videoUrl,
    photos: [...kept, ...added],
    recipe:
      article.type === "recipe"
        ? {
            servings: str(formData, "servings"),
            time: str(formData, "time"),
            ingredients: lines(str(formData, "ingredients")),
            steps: lines(str(formData, "steps")),
          }
        : null,
  };

  // まず内容を保存（状態は変えない）
  const issues = articleIssues(article);
  const wantsChange = intent === "review" || intent === "publish";
  if (intent === "publish" && role !== "admin") redirect(`/staff/posts/${article.id}?error=notAdmin`);

  if (wantsChange && issues.length === 0) {
    if (intent === "publish") {
      article.status = "published";
      article.publishedAt = article.publishedAt || nowJst();
    } else if (article.status === "draft") {
      article.status = "review";
    }
    article.note = "";
  }
  await saveArticle(article);
  if (removed.length > 0) await deletePhotoFiles(removed);
  refresh(article.id);

  if (wantsChange && issues.length > 0) {
    redirect(`/staff/posts/${article.id}?saved=draft&missing=${issues.join(",")}`);
  }
  redirect(`/staff/posts/${article.id}?saved=${intent === "save" || !wantsChange ? "save" : intent}`);
}

/** 状態の変更：差し戻し・取り下げ・公開・確認依頼 */
export async function changeStatusAction(formData: FormData) {
  const role = await requireRole();
  const id = str(formData, "id");
  const to = str(formData, "to");
  const back = str(formData, "back") === "list" ? "/staff/posts" : `/staff/posts/${id}`;
  const article = await getArticle(id);
  if (!article) redirect("/staff/posts?error=notfound");

  if (to === "published") {
    if (role !== "admin") redirect(`${back}?error=notAdmin`);
    const issues = articleIssues(article);
    if (issues.length > 0) redirect(`/staff/posts/${id}?missing=${issues.join(",")}`);
    article.status = "published";
    article.publishedAt = article.publishedAt || nowJst();
    article.note = "";
  } else if (to === "review") {
    if (article.status === "published") redirect(`${back}?error=locked`);
    const issues = articleIssues(article);
    if (issues.length > 0) redirect(`/staff/posts/${id}?missing=${issues.join(",")}`);
    article.status = "review";
    article.note = "";
  } else if (to === "draft") {
    // 取り下げ・差し戻しは管理者のみ
    if (role !== "admin") redirect(`${back}?error=notAdmin`);
    article.status = "draft";
    const note = str(formData, "note");
    if (note) article.note = note;
  } else {
    redirect(`${back}?error=type`);
  }
  await saveArticle(article);
  refresh(id);
  redirect(`${back}?changed=${to}`);
}

export async function deleteArticleAction(formData: FormData) {
  const role = await requireRole();
  const id = str(formData, "id");
  const article = await getArticle(id);
  if (article) {
    if (article.status === "published" && role !== "admin") redirect(`/staff/posts/${id}?error=notAdmin`);
    await deleteArticle(id);
    refresh(id);
  }
  redirect("/staff/posts?deleted=1");
}
