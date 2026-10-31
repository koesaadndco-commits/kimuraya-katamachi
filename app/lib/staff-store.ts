import { getCloudflareContext } from "@opennextjs/cloudflare";

// ---- 型 ----

export type PostKind = "flyer" | "info";

export type PostFile = { id: string; name: string; type: string };

export type Post = {
  id: string;
  kind: PostKind;
  title: string;
  body: string;
  linkUrl: string;
  /** アップロードした画像・PDF（チラシの表・裏など、最大4枚） */
  files: PostFile[];
  /** 掲載開始・終了（日本時間、"YYYY-MM-DDTHH:mm"） */
  startAt: string;
  endAt: string;
  createdAt: string;
};

/** 旧形式（ファイル1つ）で保存されたデータも読めるようにする */
type StoredPost = Omit<Post, "files"> & {
  files?: PostFile[];
  fileId?: string;
  fileName?: string;
  fileType?: string;
};

function normalize(p: StoredPost): Post {
  const files = p.files ?? (p.fileId ? [{ id: p.fileId, name: p.fileName ?? "", type: p.fileType ?? "" }] : []);
  const { fileId: _a, fileName: _b, fileType: _c, ...rest } = p;
  void _a; void _b; void _c;
  return { ...rest, files };
}

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
export const MAX_FILES = 4;

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
  const posts = ((await store.get<StoredPost[]>(POSTS_KEY, "json")) ?? []).map(normalize);
  // 新しい開始日時が上
  return posts.sort((a, b) => (a.startAt < b.startAt ? 1 : a.startAt > b.startAt ? -1 : 0));
}

/** 掲載期間内のものだけ（公開ページ用）。期間が終われば自動的に外れる */
export async function listActivePosts(): Promise<Post[]> {
  const now = nowJst();
  return (await listPosts()).filter((p) => postStatus(p, now) === "live");
}

export async function addPost(
  input: Omit<Post, "id" | "createdAt" | "files">,
  files: { bytes: ArrayBuffer; name: string; type: string }[],
  opts: { replaceSameDay: boolean } = { replaceSameDay: false },
): Promise<{ post: Post; replaced: number }> {
  const store = await kv();
  if (!store) throw new Error("STAFF_KV is not configured");

  const fileRefs: PostFile[] = [];
  for (const f of files) {
    const id = crypto.randomUUID();
    await store.put(FILE_PREFIX + id, f.bytes, { metadata: { type: f.type, name: f.name } });
    fileRefs.push({ id, name: f.name, type: f.type });
  }
  const post: Post = { ...input, id: crypto.randomUUID(), files: fileRefs, createdAt: nowJst() };

  let posts = ((await store.get<StoredPost[]>(POSTS_KEY, "json")) ?? []).map(normalize);
  let removed: Post[] = [];
  if (opts.replaceSameDay && input.kind === "flyer") {
    // 毎日の更新用：同じ開始日のチラシは新しいものに置き換える
    const day = input.startAt.slice(0, 10);
    removed = posts.filter((p) => p.kind === "flyer" && p.startAt.slice(0, 10) === day);
    posts = posts.filter((p) => !removed.includes(p));
  }
  posts.push(post);
  await store.put(POSTS_KEY, JSON.stringify(posts));
  // 新しい登録を保存できてから、置き換えられた古いファイルを消す
  for (const r of removed) for (const f of r.files) await store.delete(FILE_PREFIX + f.id);
  return { post, replaced: removed.length };
}

export async function deletePost(id: string): Promise<void> {
  const store = await kv();
  if (!store) throw new Error("STAFF_KV is not configured");
  const posts = ((await store.get<StoredPost[]>(POSTS_KEY, "json")) ?? []).map(normalize);
  const target = posts.find((p) => p.id === id);
  if (!target) return;
  await store.put(POSTS_KEY, JSON.stringify(posts.filter((p) => p.id !== id)));
  for (const f of target.files) await store.delete(FILE_PREFIX + f.id);
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

/** 公開ページ用：「今日のチラシ」のリンク先。掲載中のチラシが無ければ既定のURL */
export function flyerHref(active: Post[], fallback: string): string {
  const flyer = active.find((p) => p.kind === "flyer");
  if (!flyer) return fallback;
  if (flyer.files.length === 0 && flyer.linkUrl) return flyer.linkUrl;
  return "/flyer";
}
