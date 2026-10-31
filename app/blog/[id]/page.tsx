import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../kimura.css";
import { TYPE_LABEL, formatDate, getArticle, paragraphs, youtubeId } from "../../lib/articles";
import { getRole } from "../../lib/staff-auth";
import { BlogFooter, BlogHeader } from "../SiteChrome";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const a = await getArticle(id);
  return { title: a ? `${a.title}｜お店のたより｜木村グループ` : "お店のたより", robots: { index: false, follow: false } };
}

export default async function ArticlePage({ params }: Params) {
  const { id } = await params;
  const a = await getArticle(id);
  if (!a) notFound();
  // 未公開の記事は、ログイン中のスタッフだけがプレビューできる
  const preview = a.status !== "published";
  if (preview && !(await getRole())) notFound();

  const yt = a.videoUrl ? youtubeId(a.videoUrl) : null;
  const meta = a.recipe ? [a.recipe.servings, a.recipe.time].filter(Boolean) : [];

  return (
    <>
      <BlogHeader />
      <main className="bl-main">
        <article className="bl-article">
          {preview && <div className="bl-preview">プレビュー（まだ公開されていません）</div>}
          <div className="bl-tags"><span className={`bl-type ${a.type}`}>{TYPE_LABEL[a.type]}</span><span className="bl-cat">{a.category}</span></div>
          <h1>{a.title}</h1>
          <p className="bl-byline">
            {a.publishedAt ? <time>{formatDate(a.publishedAt)}</time> : <span>未公開</span>}
            {a.author && <span>{a.author}</span>}
          </p>

          {a.photos.length > 0 && (
            <div className={`bl-photos n${Math.min(a.photos.length, 3)}`}>
              {a.photos.map((p, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={p.id} src={`/f/${p.id}`} alt={a.alt || a.title} loading={i === 0 ? "eager" : "lazy"} />
              ))}
            </div>
          )}
          {a.credit && <p className="bl-credit">{a.credit}</p>}

          {a.recipe && (
            <div className="bl-recipe">
              {meta.length > 0 && <p className="bl-recipe-meta">{meta.map((m) => <span key={m}>{m}</span>)}</p>}
              <h2>材料</h2>
              <ul className="bl-ing">{a.recipe.ingredients.map((l, i) => <li key={i}>{l}</li>)}</ul>
              <h2>作り方</h2>
              <ol className="bl-steps">{a.recipe.steps.map((l, i) => <li key={i}>{l}</li>)}</ol>
            </div>
          )}

          {paragraphs(a.body).length > 0 && (
            <div className="bl-text">
              {a.recipe && <h2>ひとこと・コツ</h2>}
              {paragraphs(a.body).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}

          {a.videoUrl && (
            <div className="bl-video">
              {yt ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${yt}`}
                  title={`${a.title}の動画`}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <a className="btn btn-mitsu" href={a.videoUrl} target="_blank" rel="noopener noreferrer">動画を見る</a>
              )}
            </div>
          )}

          <p className="bl-back"><Link href={`/blog${a.type ? `?type=${a.type}` : ""}`}>‹ {TYPE_LABEL[a.type]}の一覧へ</Link> ／ <Link href="/blog">お店のたより トップへ</Link></p>
        </article>
      </main>
      <BlogFooter />
    </>
  );
}
