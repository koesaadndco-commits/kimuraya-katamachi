/* eslint-disable @next/next/no-html-link-for-pages -- ホーム（/）は kimura.js の初期化が必要なため、通常のページ読み込みで遷移させる */
import type { Metadata } from "next";
import "../kimura.css";
import { formatJst, listActivePosts } from "../lib/staff-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "今日のチラシ｜木村グループ・ハニー食彩館",
  robots: { index: false, follow: false },
};

export default async function FlyerPage() {
  const flyers = (await listActivePosts()).filter((p) => p.kind === "flyer");

  return (
    <>
      <header className="flyer-hd">
        <a className="flyer-back" href="/">‹ ホームへ戻る</a>
        <span>木村グループ ／ ハニー食彩館</span>
      </header>
      <main className="flyer-main">
        {flyers.length === 0 && (
          <div className="flyer-empty">
            <h1>今日のチラシ</h1>
            <p>本日のチラシは準備中です。<br />毎朝、店舗の開店前に更新しています。しばらくしてから、もう一度ご覧ください。</p>
            <p><a className="btn btn-mitsu" href="/#stores">店舗一覧を見る</a></p>
          </div>
        )}
        {flyers.map((p) => (
          <article key={p.id} className="flyer-item">
            <h1>{p.title}</h1>
            <p className="flyer-period">掲載期間：{formatJst(p.startAt)} 〜 {formatJst(p.endAt)}</p>
            {p.body && <p className="flyer-body">{p.body}</p>}
            <div className="flyer-pages">
              {p.files.map((f, i) =>
                f.type === "application/pdf" ? (
                  <a key={f.id} className="btn btn-mitsu" href={`/f/${f.id}`} target="_blank" rel="noopener noreferrer">チラシ（PDF）を開く</a>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={f.id} src={`/f/${f.id}`} alt={`${p.title}（${i + 1}枚目）`} loading={i === 0 ? "eager" : "lazy"} />
                ),
              )}
            </div>
            {p.linkUrl && <p><a className="btn btn-line" href={p.linkUrl} target="_blank" rel="noopener noreferrer">くわしくはこちら</a></p>}
          </article>
        ))}
      </main>
    </>
  );
}
