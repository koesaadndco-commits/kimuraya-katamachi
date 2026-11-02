import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

/** お店のたより（/blog）などの下層ページ用：サイト共通のヘッダー・フッターを使う */
export function BlogHeader() {
  return <SiteHeader solid />;
}

export function BlogFooter() {
  return <SiteFooter />;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}
