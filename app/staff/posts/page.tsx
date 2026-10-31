import type { Metadata } from "next";
import Link from "next/link";
import { hasSeparateAdmin } from "../../lib/staff-auth";
import {
  STATUS_LABEL,
  TYPE_LABEL,
  formatDate,
  isArticleType,
  listAllArticles,
  type ArticleStatus,
  type ArticleSummary,
} from "../../lib/articles";
import StaffShell from "../StaffShell";
import { staffGate } from "../gate";
import { changeStatusAction } from "./actions";
import { POST_ERRORS } from "./messages";

export const metadata: Metadata = { title: "記事の一覧・確認｜スタッフ専用", robots: { index: false, follow: false } };

type Search = Record<string, string | string[] | undefined>;

const STATUSES: ArticleStatus[] = ["review", "draft", "published"];

export default async function PostsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const gate = await staffGate({ next: "/staff/posts" });
  if ("screen" in gate) return gate.screen;
  const role = gate.role;

  const type = typeof sp.type === "string" && isArticleType(sp.type) ? sp.type : undefined;
  const status = typeof sp.status === "string" && (STATUSES as string[]).includes(sp.status) ? (sp.status as ArticleStatus) : undefined;
  const error = typeof sp.error === "string" ? POST_ERRORS[sp.error] : undefined;
  const deleted = sp.deleted === "1";
  const changed = typeof sp.changed === "string";

  const all = await listAllArticles();
  const rows = all.filter((a) => (!type || a.type === type) && (!status || a.status === status));
  const reviewCount = all.filter((a) => a.status === "review").length;
  const chip = (label: string, href: string, on: boolean) => (
    <Link key={label} href={href} className={`st-chip ${on ? "on" : ""}`}>{label}</Link>
  );
  const q = (t?: string, s?: string) => `/staff/posts${t || s ? `?${[t && `type=${t}`, s && `status=${s}`].filter(Boolean).join("&")}` : ""}`;

  return (
    <StaffShell active="posts" role={role} crumb="お店のたより ／ 記事の一覧・確認">
      <h1>お店のたより</h1>
      <p className="st-lead">社長ブログ・スタッフブログ・レシピを書いて、管理者の確認を経て公開します。</p>
      {error && <div className="st-msg err">{error}</div>}
      {deleted && <div className="st-msg">削除しました。</div>}
      {changed && <div className="st-msg">更新しました。</div>}
      {role === "admin" && reviewCount > 0 && (
        <div className="st-alert" style={{ marginBottom: 20 }}>確認待ちの記事が {reviewCount} 件あります。内容を確認して公開してください。</div>
      )}
      {!(await hasSeparateAdmin()) && (
        <p className="st-help" style={{ marginBottom: 18 }}>※管理者用のパスワード（ADMIN_PASSWORD）が未設定のため、ログインした人がそのまま公開できます。確認の流れを使うには docs/staff-page-setup.md を参照してください。</p>
      )}

      <div className="st-actions" style={{ marginBottom: 22 }}>
        <Link className="st-btn primary" href="/staff/posts/new?type=ceo">＋ 社長ブログを書く</Link>
        <Link className="st-btn primary" href="/staff/posts/new?type=staff">＋ スタッフブログを書く</Link>
        <Link className="st-btn primary" href="/staff/posts/new?type=recipe">＋ レシピを書く</Link>
      </div>

      <section className="st-card">
        <div className="st-chips">
          {chip("すべて", q(undefined, status), !type)}
          {(["ceo", "staff", "recipe"] as const).map((t) => chip(TYPE_LABEL[t], q(t, status), type === t))}
          <span className="st-chips-sep" />
          {chip("すべての状態", q(type), !status)}
          {STATUSES.map((s) => chip(STATUS_LABEL[s], q(type, s), status === s))}
        </div>
        {rows.length === 0 ? (
          <p className="st-empty">該当する記事はありません。</p>
        ) : (
          <ul className="st-list">
            {rows.map((a) => <Row key={a.id} a={a} role={role} />)}
          </ul>
        )}
      </section>
    </StaffShell>
  );
}

function Row({ a, role }: { a: ArticleSummary; role: "admin" | "staff" }) {
  return (
    <li>
      <span className={`st-tag ${a.status === "published" ? "live" : a.status === "review" ? "scheduled" : ""}`}>{STATUS_LABEL[a.status]}</span>
      <div>
        <div className="st-tt"><span className="st-kind-label">{TYPE_LABEL[a.type]}</span>{a.title || "（タイトル未入力）"}</div>
        <div className="st-meta">
          {a.category}{a.author ? ` ／ ${a.author}` : ""} ／ 更新 {formatDate(a.updatedAt)}{a.publishedAt ? ` ／ 公開 ${formatDate(a.publishedAt)}` : ""}
        </div>
      </div>
      <div className="st-row-actions">
        <Link className="st-btn small" href={`/staff/posts/${a.id}`}>{a.status === "published" && role !== "admin" ? "見る" : "編集"}</Link>
        {role === "admin" && a.status === "review" && (
          <form action={changeStatusAction}>
            <input type="hidden" name="id" value={a.id} /><input type="hidden" name="to" value="published" /><input type="hidden" name="back" value="list" />
            <button className="st-btn small primary" type="submit">公開する</button>
          </form>
        )}
      </div>
    </li>
  );
}
