import { getFile } from "../../lib/staff-store";

// スタッフページでアップロードしたチラシ（画像・PDF）を配信する
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("Not found", { status: 404 });

  const file = await getFile(id);
  if (!file) return new Response("Not found", { status: 404 });

  const headers = new Headers({
    "Content-Type": file.type,
    "Cache-Control": "public, max-age=300",
    "X-Robots-Tag": "noindex, nofollow",
  });
  if (file.name) {
    headers.set("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(file.name)}`);
  }
  return new Response(file.bytes, { headers });
}
