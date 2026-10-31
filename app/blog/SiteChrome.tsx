import Link from "next/link";
import type { ReactNode } from "react";

/** お店のたより（/blog）用の共通ヘッダー・フッター */
export function BlogHeader() {
  return (
    <header className="site solid" id="hdr">
      <div className="wrap hd">
        <Link className="logo" href="/" aria-label="木村屋（木村グループ）ホーム">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lg" src="/img/logo/kimuraya-lockup.png" alt="木村屋" width={1200} height={355} />
          <span className="lg-sub">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="lg2" src="/img/logo/shokusaikan-logo.png" alt="ハニー食彩館 FOOD MARKET" width={1200} height={567} />
          </span>
        </Link>
        <nav className="gnav" aria-label="メインメニュー">
          <Link href="/#promise">私たちの約束</Link>
          <Link href="/#story">80年の物語</Link>
          <Link href="/#stores">店舗一覧</Link>
          <Link href="/blog">お店のたより</Link>
          <a href="/recruit">採用情報</a>
        </nav>
        <a className="btn btn-mitsu" href="/flyer">今日のチラシ</a>
      </div>
    </header>
  );
}

export function BlogFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="copy" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
          <span>© 2026 木村グループ</span>
          <Link href="/">ホームへ戻る</Link>
        </div>
      </div>
    </footer>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}
