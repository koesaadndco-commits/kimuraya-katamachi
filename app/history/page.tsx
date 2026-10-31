import type { Metadata } from "next";
import "../kimura.css";
import { BlogFooter, BlogHeader, Eyebrow } from "../blog/SiteChrome";

export const metadata: Metadata = {
  title: "会社の沿革｜木村グループ（ハニー食彩館）",
  description: "昭和21年、福井の小さな食料品店「木村屋」から。木村グループ80年のあゆみ。",
  robots: { index: false, follow: false },
};

type Item = { wa: string; year: string; title: string; text: string; img?: { src: string; alt: string } };

// トップページ「80年の物語」と同じ内容。年表を更新するときは両方をそろえる。
const HISTORY: Item[] = [
  { wa: "昭和21年", year: "1946", title: "食料品店「木村屋」創業", text: "戦後の福井で、町の人の暮らしを支える小さな店として始まりました。", img: { src: "/img/old-shop.jpg", alt: "戦後の小さな食料品店（イメージ）" } },
  { wa: "昭和40年", year: "1965", title: "株式会社片町フードセンター設立", text: "対面販売から、セルフサービスのスーパーマーケットへ。", img: { src: "/img/old-opening.jpg", alt: "昭和のスーパーマーケット開店日（イメージ）" } },
  { wa: "昭和46年", year: "1971", title: "株式会社松本フードセンター設立", text: "地域に根ざした店づくりを広げていきました。" },
  { wa: "昭和58年", year: "1983", title: "株式会社木村フーズ設立", text: "惣菜と精肉を自社で供給。手づくりの味を毎日の食卓へ。", img: { src: "/img/hands.jpg", alt: "惣菜づくり（イメージ）" } },
  { wa: "昭和61年", year: "1986", title: "ハニー足羽店 開店", text: "協同組合ハニーの中核企業として、店舗展開が始まります。" },
  { wa: "平成7年〜", year: "1995 —", title: "「食彩館」の時代へ", text: "みくに店を皮切りに、丸岡・四ツ居・大宮・東部・西福井・やしろへ。" },
  { wa: "令和8年", year: "2026", title: "創業80年。次の100年へ。", text: "経営力・管理者力・現場力。三位一体で、100年ビジョンの実現へ歩みます。", img: { src: "/img/register.jpg", alt: "レジでお客様に袋を手渡すスタッフ（イメージ）" } },
];

export default function HistoryPage() {
  return (
    <>
      <BlogHeader />
      <main className="bl-main">
        <div className="wrap">
          <Eyebrow>HISTORY · 1946 — 2026</Eyebrow>
          <h1 className="bl-h1">会社の沿革</h1>
          <p className="bl-lead">昭和21年、福井の小さな食料品店「木村屋」から。80年のあゆみをご紹介します。</p>
          <ol className="hi-list">
            {HISTORY.map((h) => (
              <li key={h.year} className="hi-item">
                <div className="hi-when"><b>{h.wa}</b><span>{h.year}</span></div>
                <div className="hi-body">
                  <h2>{h.title}</h2>
                  <p>{h.text}</p>
                  {h.img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={h.img.src} alt={h.img.alt} loading="lazy" />
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className="hi-motto"><span>経営理念</span>食を通じて、ありがとうの溢れる豊かな社会を実現する</p>
          <p className="hi-note">※写真はイメージです。</p>
        </div>
      </main>
      <BlogFooter />
    </>
  );
}
