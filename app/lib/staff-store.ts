import { getCloudflareContext } from "@opennextjs/cloudflare";

// ---- 型 ----

export type PostKind = "flyer" | "info";

export type Post = {
  id: string;
  kind: PostKind;
  title: string;
  body: string;
  linkUrl: string;
  /** アップロードしたファイル（画像・PDF）のID。無ければ空文字 */
  fileId: string;
  fileName: string;
  fileType: string;
  /** 掲載開始・終了（日本時間、"YYYY-MM-DDTHH:mm"） */
  startAt: string;
  endAt: string;
  createdAt: string;
};

export type PostStatus = "scheduled" | "live" | "ended";

// @cloudflare/workers-types を入れていないので、使う分だけ KV の型を定義する
type KVMetadata = { type: string; name: string };
export type KVNamespace = {
  get<T = unknown>(key: string, type: "json"): Promise<T | null>;
  getWithMetadata<M>(
    key: string,
    type: "arrayBuffer",
  ): Promise<{ value: ArrayBuffer | null; metadata: M | null }>;
  put(key: string, value: string | ArrayBuffer, options?: { metadata?: KVMetadata }): Promise<void>;
  delete(key: string): Promise<void>;
};

type StaffEnv = {
  STAFF_KV?: KVNamespace;
  STAFF_PASSWORD?: string;
};

const POSTS_KEY = "posts";
const FILE_PREFIX = "file:";

export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

// ---- 環境 ----

export async function getStaffEnv(): Promise<StaffEnv> {
  const { env } = await getCloudflareContext({ async: true });
  return env as StaffEnv;
}

async function kv(): Promise<KVNamespace | null> {
  const env = await getStaffEnv();
  return env.STAFF_KV ?? null;
}

// ---- 日時（日本時間） ----

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 現在の日本時間を "YYYY-MM-DDTHH:mm" で返す（datetime-local と同じ形式） */
export function nowJst(): string {
  return new Date(Date.now() + JST_OFFSET_MS).toISOString().slice(0, 16);
}

/** "YYYY-MM-DDTHH:mm" を「2026年10月21日 08:00」の形に */
export function formatJst(v: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(v);
  if (!m) return v;
  return `${m[1]}年${Number(m[2])}月${Number(m[3])}日 ${m[4]}:${m[5]}`;
}

export function isValidDateTime(v: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
}

export function postStatus(p: Post, now = nowJst()): PostStatus {
  if (now < p.startAt) return "scheduled";
  if (now > p.endAt) return "ended";
  return "live";
}

// ---- 読み書き ----

export async function listPosts(): Promise<Post[]> {
  const store = await kv();
  if (!store) return [];
  const posts = (await store.get<Post[]>(POSTS_KEY, "json")) ?? [];
  // 新しい開始日時が上
  return posts.sort((a, b) => (a.startAt < b.startAt ? 1 : a.startAt > b.startAt ? -1 : 0));
}

/** 掲載期間内のものだけ（公開ページ用）。期間が終われば自動的に外れる */
export async function listActivePosts(): Promise<Post[]> {
  const now = nowJst();
  return (await listPosts()).filter((p) => postStatus(p, now) === "live");
}

export async function addPost(
  input: Omit<Post, "id" | "createdAt" | "fileId" | "fileName" | "fileType">,
  file: { bytes: ArrayBuffer; name: string; type: string } | null,
): Promise<Post> {
  const store = await kv();
  if (!store) throw new Error("STAFF_KV is not configured");

  const id = crypto.randomUUID();
  let fileId = "";
  if (file) {
    fileId = crypto.randomUUID();
    await store.put(FILE_PREFIX + fileId, file.bytes, {
      metadata: { type: file.type, name: file.name },
    });
  }
  const post: Post = {
    ...input,
    id,
    fileId,
    fileName: file?.name ?? "",
    fileType: file?.type ?? "",
    createdAt: nowJst(),
  };
  const posts = (await store.get<Post[]>(POSTS_KEY, "json")) ?? [];
  posts.push(post);
  await store.put(POSTS_KEY, JSON.stringify(posts));
  return post;
}

export async function deletePost(id: string): Promise<void> {
  const store = await kv();
  if (!store) throw new Error("STAFF_KV is not configured");
  const posts = (await store.get<Post[]>(POSTS_KEY, "json")) ?? [];
  const target = posts.find((p) => p.id === id);
  if (!target) return;
  await store.put(POSTS_KEY, JSON.stringify(posts.filter((p) => p.id !== id)));
  if (target.fileId) await store.delete(FILE_PREFIX + target.fileId);
}

export async function getFile(
  fileId: string,
): Promise<{ bytes: ArrayBuffer; type: string; name: string } | null> {
  const store = await kv();
  if (!store) return null;
  const { value, metadata } = await store.getWithMetadata<{ type: string; name: string }>(
    FILE_PREFIX + fileId,
    "arrayBuffer",
  );
  if (!value) return null;
  return { bytes: value, type: metadata?.type ?? "application/octet-stream", name: metadata?.name ?? "" };
}

/** 公開ページ用：チラシへのリンク先（掲載中のチラシが無ければ既定URL） */
export function flyerHref(active: Post[], fallback: string): string {
  const flyer = active.find((p) => p.kind === "flyer");
  if (!flyer) return fallback;
  if (flyer.fileId) return `/f/${flyer.fileId}`;
  if (flyer.linkUrl) return flyer.linkUrl;
  return "#notice";
}
