/* eslint-disable @next/next/no-html-link-for-pages -- 共通ヘッダー（kimura.js）と同じく通常のページ読み込みで遷移させる */
import type { Metadata } from "next";
import "../kimura.css";
import { BlogFooter, BlogHeader, Eyebrow } from "../blog/SiteChrome";
import { SITE_URL } from "../lib/links";
import { listPublishedInfo } from "../lib/staff-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "お知らせ｜木村グループ（ハニー食彩館）",
  description: "木村グループ（ハニー食彩館）からのお知らせ。",
  alternates: { canonical: `${SITE_URL}/news` },
};

export default async function NewsIndex() {
  const items = await listPublishedInfo(100);
  return (
    <>
      <BlogHeader />
      <main className="bl-main">
        <div className="wrap nw">
          <Eyebrow>NEWS</Eyebrow>
          <h1 className="bl-h1">お知らせ</h1>
          <p className="bl-lead">イベント・おトク情報・ご予約のご案内など、食彩館からのお知らせです。</p>
          {items.length === 0 ? (
            <p className="bl-empty">現在、お知らせはありません。</p>
          ) : (
            <ul className="nw-list">
              {items.map((n) => (
                <li key={n.id}>
                  <a href={`/news/${n.id}`}>
                    <time>{n.startAt.slice(0, 10).replace(/-/g, ".")}</time>
                    <span>{n.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <BlogFooter />
    </>
  );
}
