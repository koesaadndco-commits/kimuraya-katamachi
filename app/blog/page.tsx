import type { Metadata } from "next";
import Link from "next/link";
import "../kimura.css";
import { TYPE_LABEL, dotDate, isArticleType, listPublishedArticles } from "../lib/articles";
import { BlogFooter, BlogHeader, Eyebrow } from "./SiteChrome";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "お店のたより｜社長ブログ・スタッフブログ・レシピ｜木村グループ",
  description: "木村グループ（ハニー食彩館）の、社長ブログ・スタッフブログ・おすすめレシピ。",
  robots: { index: false, follow: false },
};

type Search = Record<string, string | string[] | undefined>;
const TABS = [
  { key: "", label: "すべて" },
  { key: "ceo", label: TYPE_LABEL.ceo },
  { key: "staff", label: TYPE_LABEL.staff },
  { key: "recipe", label: TYPE_LABEL.recipe },
] as const;

export default async function BlogIndex({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const type = typeof sp.type === "string" && isArticleType(sp.type) ? sp.type : undefined;
  const items = await listPublishedArticles(type);

  return (
    <>
      <BlogHeader />
      <main className="bl-main">
        <div className="wrap">
          <Eyebrow>JOURNAL</Eyebrow>
          <h1 className="bl-h1">お店のたより</h1>
          <p className="bl-lead">社長のことば、売り場のスタッフの発見、食卓がたのしくなるレシピ。</p>
          <nav className="bl-tabs" aria-label="記事の種類">
            {TABS.map((t) => (
              <Link key={t.key} href={t.key ? `/blog?type=${t.key}` : "/blog"} className={(type ?? "") === t.key ? "on" : ""}>{t.label}</Link>
            ))}
          </nav>
          {items.length === 0 ? (
            <p className="bl-empty">まだ記事がありません。もうしばらくお待ちください。</p>
          ) : (
            <ul className="bl-grid">
              {items.map((a) => (
                <li key={a.id}>
                  <Link href={`/blog/${a.id}`} className="bl-card">
                    <span className="bl-thumb">
                      {a.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`/f/${a.cover}`} alt="" loading="lazy" />
                      ) : (
                        <span className="bl-noimg">{TYPE_LABEL[a.type]}</span>
                      )}
                    </span>
                    <span className="bl-body">
                      <span className="bl-tags"><span className={`bl-type ${a.type}`}>{TYPE_LABEL[a.type]}</span><span className="bl-cat">{a.category}</span></span>
                      <span className="bl-title">{a.title}</span>
                      {a.excerpt && <span className="bl-ex">{a.excerpt}</span>}
                      <span className="bl-meta"><time>{dotDate(a.publishedAt)}</time>{a.author && <span>{a.author}</span>}</span>
                    </span>
                  </Link>
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
