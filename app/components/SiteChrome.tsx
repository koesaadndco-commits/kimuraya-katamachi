/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element -- ホーム（/）は kimura.js の初期化が必要なため、通常のページ読み込みで遷移させる */
import Script from "next/script";
import { HONEY_LOGO, HONEY_URL, INSTAGRAM_URL, NAPOLI } from "../lib/links";

// 全ページ共通のヘッダー（メニューボタンで、どのページからでも一瞬で行き来できる）とフッター

type NavItem = { href: string; label: string; ext?: boolean };

/** メニューの中身（ヘッダーのメニュー・フッターで共通） */
export const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "木村屋について",
    items: [
      { href: "/", label: "ホーム" },
      { href: "/#promise", label: "私たちの約束" },
      { href: "/#story", label: "80年の物語" },
      { href: "/company", label: "会社概要" },
      { href: "/history", label: "会社の沿革" },
      { href: "/#message", label: "社長メッセージ" },
    ],
  },
  {
    title: "お買いもの",
    items: [
      { href: "/flyer", label: "今日のチラシ" },
      { href: "/#stores", label: "店舗一覧" },
      { href: "/#fukui", label: "福井の恵み" },
      { href: "/#dinner", label: "エリちゃんの今日のレシピ" },
    ],
  },
  {
    title: "お知らせ・その他",
    items: [
      { href: "/#news", label: "お知らせ" },
      { href: "/blog", label: "お店のたより" },
      { href: "/recruit", label: "採用情報" },
      { href: "/contact", label: "お問い合わせ" },
      { href: "/privacy", label: "プライバシーポリシー" },
    ],
  },
];

/** ヘッダーに常に見せる主なリンク（パソコン幅のみ） */
const MAIN_NAV: NavItem[] = [
  { href: "/#promise", label: "私たちの約束" },
  { href: "/#story", label: "80年の物語" },
  { href: "/#fukui", label: "福井の恵み" },
  { href: "/#dinner", label: "今日のレシピ" },
  { href: "/#stores", label: "店舗一覧" },
  { href: "/blog", label: "お店のたより" },
  { href: "/recruit", label: "採用情報" },
];

function A({ item }: { item: NavItem }) {
  return item.ext ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
  ) : (
    <a href={item.href}>{item.label}</a>
  );
}

export function SiteHeader({ solid = false, flyerHref = "/flyer" }: { solid?: boolean; flyerHref?: string }) {
  return (
    <>
      <header className={`site${solid ? " solid" : ""}`} id="hdr">
        <div className="wrap hd">
          <a className="logo" href="/" aria-label="木村屋（木村グループ）ホーム">
            <img className="lg" src="/img/logo/kimuraya-lockup.png" alt="木村屋" width={1200} height={355} />
            <span className="lg-sub">
              <img className="lg2" src="/img/logo/shokusaikan-logo.png" alt="ハニー食彩館 FOOD MARKET" width={1200} height={567} />
            </span>
          </a>
          <a className="hd-honey" href={HONEY_URL} target="_blank" rel="noopener noreferrer" aria-label="協同組合ハニー 本部サイト（新しいタブで開く）">
            <img src={HONEY_LOGO} alt="協同組合ハニー" width={220} height={62} />
          </a>
          <nav className="gnav" aria-label="メインメニュー">
            {MAIN_NAV.map((n) => <A key={n.href} item={n} />)}
          </nav>
          <a className="btn btn-mitsu" href={flyerHref}>今日のチラシ</a>
          <button className="menu-btn" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="siteMenu" data-menu-open>
            <span className="menu-ico" aria-hidden="true"><i></i><i></i><i></i></span>MENU
          </button>
        </div>
      </header>
      <div className="site-menu" id="siteMenu" role="dialog" aria-modal="true" aria-label="サイトメニュー" hidden>
        <div className="site-menu-in">
          <div className="site-menu-top">
            <a className="logo" href="/" aria-label="ホーム">
              <img className="lg" src="/img/logo/kimuraya-lockup.png" alt="木村屋" width={1200} height={355} />
            </a>
            <button type="button" className="site-menu-close" aria-label="メニューを閉じる" data-menu-close>✕ 閉じる</button>
          </div>
          <div className="site-menu-grid">
            {NAV_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="site-menu-h">{g.title}</div>
                <ul>{g.items.map((n) => <li key={n.href}><A item={n} /></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="site-menu-sns">
            <a className="btn btn-mitsu" href={flyerHref}>今日のチラシを見る</a>
            <a className="btn btn-insta" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>
      <Script src="/menu.js" strategy="afterInteractive" />
    </>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <NapoliPR compact />
        <div className="ft-grid">
          <div className="ft-about">
            <div className="ft-logos">
              <a className="logo" href="/" aria-label="木村屋（木村グループ）"><img className="lg-full" src="/img/logo/kimuraya-logo.png" alt="木村屋 SINCE 1946" width={1000} height={965} /></a>
              <img className="ft-shoku" src="/img/logo/shokusaikan-logo.png" alt="ハニー食彩館 FOOD MARKET" width={1200} height={567} />
            </div>
            <p className="ft-addr">〒910-0016 福井県福井市大宮6丁目5-5</p>
            <HoneyMark />
          </div>
          <nav className="ft-nav" aria-label="フッターメニュー">
            {NAV_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="ft-nav-h">{g.title}</div>
                <ul>{g.items.map((n) => <li key={n.href}><A item={n} /></li>)}</ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="copy"><span className="ft-ai"><img src="/ai-mark/ai-mark-ornate-navy-sm.webp" alt="AI使用マーク" width={96} height={76} /><span>本サイトの一部にAIを使用しています</span></span><span className="ft-cr">© 2026 木村グループ<br />Produced by AISSK</span></div>
      </div>
    </footer>
  );
}

/** ナポリの窯 やしろ店（FC運営）のPR。トップページの2画面目と、全ページのフッター（compact）に表示 */
export function NapoliPR({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`np-pr${compact ? " compact" : ""}`} aria-label="ナポリの窯 やしろ店のご案内">
      <div className="np-pr-logo">
        <img src={NAPOLI.logo} alt="ナポリの窯 PIZZERIA" width={125} height={36} />
      </div>
      <div className="np-pr-body">
        <p className="np-pr-kicker">木村グループが運営しています</p>
        <h2 className="np-pr-h">{NAPOLI.name}</h2>
        {!compact && <p className="np-pr-lead">食彩館やしろ店の北側駐車場に、テイクアウト専門の本格ナポリピザのお店があります。お買い物の前に注文しておけば、帰りに焼きたてを受け取れます。</p>}
        <p className="np-pr-info">{NAPOLI.addr}<br />TEL <a href={`tel:${NAPOLI.tel.replace(/-/g, "")}`}>{NAPOLI.tel}</a>　営業 {NAPOLI.hours}</p>
      </div>
      <div className="np-pr-btns">
        <a className="btn np-btn" href={NAPOLI.url} target="_blank" rel="noopener noreferrer">メニュー・ご注文</a>
        <a className="btn btn-insta" href={NAPOLI.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </aside>
  );
}

/** 協同組合ハニー加盟の表示（ロゴを押すとハニー本部のサイトへ） */
function HoneyMark() {
  const inner = HONEY_LOGO ? (
    <><img src={HONEY_LOGO} alt="協同組合ハニー" className="ft-honey-logo" /><span>協同組合ハニー加盟</span></>
  ) : (
    <span>協同組合ハニー加盟</span>
  );
  return HONEY_URL ? (
    <a className="ft-honey" href={HONEY_URL} target="_blank" rel="noopener noreferrer" aria-label="協同組合ハニー 本部サイト（新しいタブで開く）">{inner}</a>
  ) : (
    <p className="ft-honey">{inner}</p>
  );
}
