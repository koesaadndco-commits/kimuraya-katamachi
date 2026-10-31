/* eslint-disable @next/next/no-html-link-for-pages -- ホーム（/）は kimura.js の初期化が必要なため、通常のページ読み込みで遷移させる */
import type { ReactNode } from "react";
import Link from "next/link";
import "./staff.css";
import ConfirmButtons from "./ConfirmButtons";
import type { Role } from "../lib/staff-auth";
import { logout } from "./actions";

export type NavKey = "flyer" | "posts" | "new-ceo" | "new-staff" | "new-recipe";

const NAV: { key: NavKey; href: string; label: string }[] = [
  { key: "flyer", href: "/staff", label: "今日のチラシ" },
  { key: "posts", href: "/staff/posts", label: "記事の一覧・確認" },
  { key: "new-ceo", href: "/staff/posts/new?type=ceo", label: "社長ブログを書く" },
  { key: "new-staff", href: "/staff/posts/new?type=staff", label: "スタッフブログを書く" },
  { key: "new-recipe", href: "/staff/posts/new?type=recipe", label: "レシピを書く" },
];

export default function StaffShell({
  active,
  role,
  crumb,
  children,
}: {
  active: NavKey;
  role: Role;
  crumb: string;
  children: ReactNode;
}) {
  return (
    <div className="st-shell">
      <aside className="st-side">
        <a className="st-brand" href="/" aria-label="木村屋 ホームページへ">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="st-brand-k" src="/img/logo/kimuraya-lockup.png" alt="木村屋" width={1200} height={355} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="st-brand-s" src="/img/logo/shokusaikan-logo.png" alt="ハニー食彩館 FOOD MARKET" width={1200} height={567} />
        </a>
        <small>お店のたより 管理画面</small>
        <nav aria-label="管理メニュー">
          {NAV.map((n) => (
            <Link key={n.key} href={n.href} className={n.key === active ? "on" : ""}>{n.label}</Link>
          ))}
          <a href="/blog" target="_blank" rel="noopener noreferrer">お店のたよりを見る ↗</a>
          <a href="/" target="_blank" rel="noopener noreferrer">ホームページを見る ↗</a>
        </nav>
      </aside>
      <main className="st-main">
        <div className="st-top">
          <span>{crumb}</span>
          <span className="st-top-r">
            <span className="st-role">{role === "admin" ? "管理者" : "スタッフ"}</span>
            <form action={logout}><button type="submit" className="st-btn small">ログアウト</button></form>
          </span>
        </div>
        {children}
        <ConfirmButtons />
      </main>
    </div>
  );
}
