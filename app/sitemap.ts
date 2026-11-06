import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/links";
import { listPublishedArticles } from "./lib/articles";

// 公開中の記事一覧をsitemapに含めるため、リクエストごとに生成する
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listPublishedArticles();

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.id}`,
    lastModified: new Date(a.updatedAt || a.publishedAt || a.createdAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/recruit`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/company`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/history`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/news`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.7 },
    ...articleEntries,
  ];
}
