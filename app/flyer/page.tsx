import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import "../kimura.css";
import { DEFAULT_FLYER_URL } from "../lib/links";
import { formatJst, listActivePosts } from "../lib/staff-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "今日のチラシ｜木村グループ・ハニー食彩館",
  robots: { index: false, follow: false },
};

export default async function FlyerPage() {
  const flyers = (await listActivePosts()).filter((p) => p.kind === "flyer");
  // 掲載中のチラシが無いときは、これまでどおり外部のチラシページへ
  if (flyers.length === 0) redirect(DEFAULT_FLYER_URL);
  // 画像・PDFが無く、リンク先だけが登録されているチラシはそのリンクへ
  if (flyers.length === 1 && flyers[0].files.length === 0 && flyers[0].linkUrl) redirect(flyers[0].linkUrl);

  return (
    <>
      <header className="flyer-hd">
        <Link className="flyer-back" href="/">‹ ホームへ戻る</Link>
        <span>木村グループ ／ ハニー食彩館</span>
      </header>
      <main className="flyer-main">
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
