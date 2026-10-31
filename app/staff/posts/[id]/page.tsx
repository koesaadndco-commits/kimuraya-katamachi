import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasSeparateAdmin } from "../../../lib/staff-auth";
import { STATUS_LABEL, TYPE_LABEL, formatDate, getArticle } from "../../../lib/articles";
import StaffShell, { type NavKey } from "../../StaffShell";
import { staffGate } from "../../gate";
import ArticleForm from "../ArticleForm";
import { changeStatusAction, deleteArticleAction } from "../actions";
import { POST_ERRORS, missingText } from "../messages";

export const metadata: Metadata = { title: "記事の編集｜スタッフ専用", robots: { index: false, follow: false } };

type Search = Record<string, string | string[] | undefined>;

const SAVED: Record<string, string> = {
  save: "保存しました。",
  draft: "下書きとして保存しました。",
  review: "保存して、管理者へ確認を依頼しました。",
  publish: "公開しました。お店のたよりにすぐ反映されます。",
};
const CHANGED: Record<string, string> = {
  published: "公開しました。",
  review: "管理者へ確認を依頼しました。",
  draft: "下書きに戻しました。",
};

export default async function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Search> }) {
  const { id } = await params;
  const sp = await searchParams;
  const gate = await staffGate({ next: `/staff/posts/${id}` });
  if ("screen" in gate) return gate.screen;
  const role = gate.role;

  const article = await getArticle(id);
  if (!article) notFound();

  const error = typeof sp.error === "string" ? POST_ERRORS[sp.error] : undefined;
  const missing = typeof sp.missing === "string" ? sp.missing : "";
  const saved = typeof sp.saved === "string" ? SAVED[sp.saved] : undefined;
  const changed = typeof sp.changed === "string" ? CHANGED[sp.changed] : undefined;
  const separateAdmin = await hasSeparateAdmin();
  const readOnly = article.status === "published" && role !== "admin";
  const active: NavKey = `new-${article.type}`;

  return (
    <StaffShell active={active} role={role} crumb={`お店のたより ／ ${TYPE_LABEL[article.type]}の編集`}>
      <div className="st-top-tag">
        <span className={`st-tag ${article.status === "published" ? "live" : article.status === "review" ? "scheduled" : ""}`}>{STATUS_LABEL[article.status]}</span>
        <small className="st-muted"> 最終更新 {formatDate(article.updatedAt)}{article.publishedAt ? ` ／ 公開 ${formatDate(article.publishedAt)}` : ""}</small>
      </div>
      <h1>{article.title || "（タイトル未入力）"}</h1>

      {error && <div className="st-msg err">{error}</div>}
      {saved && <div className="st-msg">{saved}</div>}
      {changed && <div className="st-msg">{changed}</div>}
      {missing && <div className="st-msg err">管理者への確認依頼・公開には、次の項目が必要です：{missingText(missing)}。入力した内容は下書きとして保存してあります。</div>}
      {article.note && article.status === "draft" && <div className="st-msg">管理者からのひとこと：{article.note}</div>}
      {article.status === "review" && role === "admin" && <div className="st-msg">確認待ちの記事です。内容を確認して「公開する」を押すと公開されます。</div>}

      {readOnly ? (
        <section className="st-card"><p className="st-muted">この記事は公開中です。内容の変更は管理者が行います。</p></section>
      ) : (
        <ArticleForm article={article} role={role} separateAdmin={separateAdmin} isNew={false} />
      )}

      <section className="st-card">
        <h2>そのほかの操作</h2>
        <div className="st-actions">
          {article.status === "published" && (
            <Link className="st-btn" href={`/blog/${article.id}`} target="_blank">公開ページを開く ↗</Link>
          )}
          {article.status !== "published" && (
            <Link className="st-btn" href={`/blog/${article.id}`} target="_blank">プレビューを開く ↗</Link>
          )}
          {role === "admin" && article.status === "published" && (
            <form action={changeStatusAction}>
              <input type="hidden" name="id" value={article.id} /><input type="hidden" name="to" value="draft" />
              <button className="st-btn" type="submit">公開を取り下げる（下書きに戻す）</button>
            </form>
          )}
          {role === "admin" && article.status === "review" && (
            <form action={changeStatusAction} className="st-inline">
              <input type="hidden" name="id" value={article.id} /><input type="hidden" name="to" value="draft" />
              <input type="text" name="note" placeholder="差し戻しのひとこと（任意）" maxLength={120} />
              <button className="st-btn" type="submit">下書きに差し戻す</button>
            </form>
          )}
          {(role === "admin" || article.status !== "published") && (
            <form action={deleteArticleAction}>
              <input type="hidden" name="id" value={article.id} />
              <button className="st-del" type="submit" data-confirm={`「${article.title || "無題"}」を削除します。よろしいですか？`}>この記事を削除</button>
            </form>
          )}
        </div>
      </section>
    </StaffShell>
  );
}
