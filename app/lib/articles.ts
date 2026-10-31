import { FILE_PREFIX, kv, nowJst, type PostFile } from "./staff-store";

// ---- 種類・状態・カテゴリー ----

export type ArticleType = "ceo" | "staff" | "recipe";
export type ArticleStatus = "draft" | "review" | "published";

export const TYPE_LABEL: Record<ArticleType, string> = {
  ceo: "社長ブログ",
  staff: "スタッフブログ",
  recipe: "レシピ",
};
export const STATUS_LABEL: Record<ArticleStatus, string> = {
  draft: "下書き",
  review: "確認待ち",
  published: "公開中",
};
export const CATEGORIES = ["店舗から", "青果", "鮮魚", "精肉", "惣菜", "ベーカリー", "社長より", "お知らせ"] as const;
export const DEFAULT_CATEGORY: Record<ArticleType, string> = { ceo: "社長より", staff: "店舗から", recipe: "惣菜" };

export const MAX_PHOTOS = 6;

export function isArticleType(v: unknown): v is ArticleType {
  return v === "ceo" || v === "staff" || v === "recipe";
}

// ---- 型 ----

export type Recipe = {
  servings: string; // 例：2〜3人分
  time: string; // 例：20分
  ingredients: string[]; // 1行1品
  steps: string[]; // 1行1手順
};

export type Article = {
  id: string;
  type: ArticleType;
  status: ArticleStatus;
  title: string;
  category: string;
  author: string; // 掲載する担当者名・店舗
  body: string;
  photos: PostFile[];
  credit: string; // 写真の提供者・クレジット
  alt: string; // 写真の説明
  permission: boolean; // 写真の掲載可否を確認した
  videoUrl: string;
  recipe: Recipe | null;
  /** 管理者からのひとこと（差し戻し時など） */
  note: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string; // 初めて公開した日時。未公開は空
};

/** 一覧用の軽い情報（本文は含まない） */
export type ArticleSummary = Pick<
  Article,
  "id" | "type" | "status" | "title" | "category" | "author" | "createdAt" | "updatedAt" | "publishedAt"
> & { cover: string; excerpt: string };

const INDEX_KEY = "articles:index";
const KEY = (id: string) => `article:${id}`;

function summarize(a: Article): ArticleSummary {
  const text = a.type === "recipe" && a.recipe ? `${a.body}\n${a.recipe.ingredients.join("、")}` : a.body;
  return {
    id: a.id,
    type: a.type,
    status: a.status,
    title: a.title,
    category: a.category,
    author: a.author,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    publishedAt: a.publishedAt,
    cover: a.photos[0]?.id ?? "",
    excerpt: text.replace(/\s+/g, " ").trim().slice(0, 90),
  };
}

// ---- 読み取り ----

async function readIndex(): Promise<ArticleSummary[]> {
  const store = await kv();
  if (!store) return [];
  return (await store.get<ArticleSummary[]>(INDEX_KEY, "json")) ?? [];
}

/** スタッフ用：すべての記事（更新が新しい順） */
export async function listAllArticles(): Promise<ArticleSummary[]> {
  return (await readIndex()).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
}

/** 公開用：公開中の記事だけ（公開が新しい順）。種類で絞り込める */
export async function listPublishedArticles(type?: ArticleType, limit = 60): Promise<ArticleSummary[]> {
  return (await readIndex())
    .filter((a) => a.status === "published" && (!type || a.type === type))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0))
    .slice(0, limit);
}

export async function getArticle(id: string): Promise<Article | null> {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const store = await kv();
  if (!store) return null;
  return await store.get<Article>(KEY(id), "json");
}

// ---- 書き込み ----

export function newArticle(type: ArticleType): Article {
  const now = nowJst();
  return {
    id: crypto.randomUUID(),
    type,
    status: "draft",
    title: "",
    category: DEFAULT_CATEGORY[type],
    author: "",
    body: "",
    photos: [],
    credit: "",
    alt: "",
    permission: false,
    videoUrl: "",
    recipe: type === "recipe" ? { servings: "", time: "", ingredients: [], steps: [] } : null,
    note: "",
    createdAt: now,
    updatedAt: now,
    publishedAt: "",
  };
}

export async function saveArticle(article: Article): Promise<void> {
  const store = await kv();
  if (!store) throw new Error("STAFF_KV is not configured");
  const saved = { ...article, updatedAt: nowJst() };
  await store.put(KEY(saved.id), JSON.stringify(saved));
  const index = (await store.get<ArticleSummary[]>(INDEX_KEY, "json")) ?? [];
  const next = index.filter((e) => e.id !== saved.id);
  next.push(summarize(saved));
  await store.put(INDEX_KEY, JSON.stringify(next));
}

export async function deleteArticle(id: string): Promise<void> {
  const store = await kv();
  if (!store) throw new Error("STAFF_KV is not configured");
  const article = await getArticle(id);
  if (!article) return;
  const index = (await store.get<ArticleSummary[]>(INDEX_KEY, "json")) ?? [];
  await store.put(INDEX_KEY, JSON.stringify(index.filter((e) => e.id !== id)));
  await store.delete(KEY(id));
  for (const p of article.photos) await store.delete(FILE_PREFIX + p.id);
}

/** 写真（画像ファイル）を保存して参照を返す */
export async function savePhotos(files: { bytes: ArrayBuffer; name: string; type: string }[]): Promise<PostFile[]> {
  const store = await kv();
  if (!store) throw new Error("STAFF_KV is not configured");
  const refs: PostFile[] = [];
  for (const f of files) {
    const id = crypto.randomUUID();
    await store.put(FILE_PREFIX + id, f.bytes, { metadata: { type: f.type, name: f.name } });
    refs.push({ id, name: f.name, type: f.type });
  }
  return refs;
}

export async function deletePhotoFiles(ids: string[]): Promise<void> {
  const store = await kv();
  if (!store) return;
  for (const id of ids) await store.delete(FILE_PREFIX + id);
}

// ---- 表示用 ----

/** "2026-10-31T15:53" → "2026年10月31日" */
export function formatDate(v: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
  return m ? `${m[1]}年${Number(m[2])}月${Number(m[3])}日` : v;
}

/** "2026-10-31T15:53" → "2026.10.31" */
export function dotDate(v: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : v;
}

/** 本文を空行ごとの段落に分ける */
export function paragraphs(text: string): string[] {
  return text.replace(/\r\n?/g, "\n").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

/** YouTube のURLなら埋め込み用のIDを返す */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = /^\/(embed|shorts|live)\/([\w-]{6,})/.exec(u.pathname);
      if (m) return m[2];
    }
  } catch {}
  return null;
}

/** 確認依頼・公開の前に必要な項目の不足（空なら、そのまま進められる） */
export function articleIssues(a: Article): string[] {
  const issues: string[] = [];
  if (!a.title.trim()) issues.push("title");
  if (a.type === "recipe") {
    if (!a.recipe || a.recipe.ingredients.length === 0) issues.push("ingredients");
    if (!a.recipe || a.recipe.steps.length === 0) issues.push("steps");
  } else if (!a.body.trim()) {
    issues.push("body");
  }
  if (a.photos.length > 0 && !a.permission) issues.push("permission");
  return issues;
}

export const ISSUE_LABEL: Record<string, string> = {
  title: "タイトル",
  body: "本文",
  ingredients: "材料",
  steps: "作り方",
  permission: "写真の掲載可否の確認（チェック）",
};
