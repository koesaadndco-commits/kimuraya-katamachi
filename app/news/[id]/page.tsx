/* eslint-disable @next/next/no-html-link-for-pages -- 共通ヘッダー（kimura.js）と同じく通常のページ読み込みで遷移させる */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../kimura.css";
import { BlogFooter, BlogHeader, Eyebrow } from "../../blog/SiteChrome";
import { getPost, nowJst } from "../../lib/staff-store";

export const dynamic = "force-dynamic";

async function load(id: string) {
  const p = await getPost(id);
  if (!p || p.kind !== "info" || p.startAt > nowJst()) return null;
  return p;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await load((await params).id);
  return { title: p ? `${p.title}｜お知らせ｜木村グループ` : "お知らせ｜木村グループ" };
}

export default async function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const p = await load((await params).id);
  if (!p) notFound();
  return (
    <>
      <BlogHeader />
      <main className="bl-main">
        <article className="wrap nw">
          <Eyebrow>NEWS</Eyebrow>
          <p className="nw-date">{p.startAt.slice(0, 10).replace(/-/g, ".")}</p>
          <h1 className="bl-h1">{p.title}</h1>
          {p.body && p.body.split(/\n{2,}/).map((para, i) => <p key={i} className="nw-body">{para}</p>)}
          <div className="nw-files">
            {p.files.map((f, i) =>
              f.type === "application/pdf" ? (
                <a key={f.id} className="btn btn-mitsu" href={`/f/${f.id}`} target="_blank" rel="noopener noreferrer">PDFを開く</a>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={f.id} src={`/f/${f.id}`} alt={`${p.title}（${i + 1}枚目）`} loading={i === 0 ? "eager" : "lazy"} />
              ),
            )}
          </div>
          {p.linkUrl && <p><a className="btn btn-line" href={p.linkUrl} target="_blank" rel="noopener noreferrer">関連リンク</a></p>}
          <p className="bl-back"><a href="/news">‹ お知らせ一覧へ</a></p>
        </article>
      </main>
      <BlogFooter />
    </>
  );
}
