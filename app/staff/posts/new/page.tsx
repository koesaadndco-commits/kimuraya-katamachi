import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasSeparateAdmin } from "../../../lib/staff-auth";
import { TYPE_LABEL, isArticleType, newArticle } from "../../../lib/articles";
import StaffShell, { type NavKey } from "../../StaffShell";
import { staffGate } from "../../gate";
import ArticleForm from "../ArticleForm";
import { POST_ERRORS } from "../messages";

export const metadata: Metadata = { title: "記事を書く｜スタッフ専用", robots: { index: false, follow: false } };

type Search = Record<string, string | string[] | undefined>;

export default async function NewPostPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const type = typeof sp.type === "string" ? sp.type : "";
  if (!isArticleType(type)) redirect("/staff/posts");
  const gate = await staffGate({ next: `/staff/posts/new?type=${type}` });
  if ("screen" in gate) return gate.screen;

  const error = typeof sp.error === "string" ? POST_ERRORS[sp.error] : undefined;
  const active = (`new-${type}` as NavKey);
  return (
    <StaffShell active={active} role={gate.role} crumb={`お店のたより ／ 新しい${TYPE_LABEL[type]}`}>
      <div className="st-top-tag"><span className="st-tag">下書き</span></div>
      <h1>{type === "recipe" ? "今日の食卓を、届けよう。" : type === "ceo" ? "社長の言葉を、届けよう。" : "今日のお店を、届けよう。"}</h1>
      <p className="st-lead">
        {type === "recipe" ? "おすすめの食材を使ったレシピを、材料と作り方に分けて書けます。" : type === "ceo" ? "社長のメッセージや想いを記事に。写真や動画も一緒に届けられます。" : "売り場の発見や、スタッフの想いを記事に。写真や動画も一緒に届けられます。"}
      </p>
      {error && <div className="st-msg err">{error}</div>}
      <ArticleForm article={newArticle(type)} role={gate.role} separateAdmin={await hasSeparateAdmin()} isNew />
    </StaffShell>
  );
}
