/* eslint-disable @next/next/no-html-link-for-pages -- 共通ヘッダー（kimura.js）と同じく通常のページ読み込みで遷移させる */
import type { Metadata } from "next";
import "../kimura.css";
import { BlogFooter, BlogHeader, Eyebrow } from "../blog/SiteChrome";
import { SITE_URL } from "../lib/links";

export const metadata: Metadata = {
  title: "会社の沿革｜木村グループ（ハニー食彩館）",
  description: "昭和21年、福井の小さな食料品店「木村屋」から。木村グループ80年のあゆみ。",
  alternates: { canonical: `${SITE_URL}/history` },
};

type Event = { title: string; note?: string };
type Item = {
  wa: string;
  year: string;
  events: Event[];
  img?: { src: string; alt: string; caption: string; tall?: boolean; cutout?: boolean };
};

// 出典：木村グループ 30周年記念誌・40周年記念誌の年表。トップページ「80年の物語」は、この中から主な出来事を抜き出している。
const HISTORY: Item[] = [
  { wa: "昭和21年", year: "1946", events: [{ title: "食料品店「木村屋」を開業", note: "福井市馬場通り" }] },
  {
    wa: "昭和40年12月", year: "1965",
    events: [{ title: "株式会社 片町フードセンターを設立", note: "福井市錦町801　代表取締役 木村常治" }],
    img: { src: "/img/history/retro/1965-katamachi-rooftop.jpg", alt: "片町店の屋上に立つ木村逸子夫人と木村常治会長", caption: "昭和40年　片町店開業時、屋上にて逸子夫人と故木村常治会長" },
  },
  { wa: "昭和42年8月", year: "1967", events: [{ title: "片町フードセンターの住所変更", note: "福井市順化1丁目17番5号" }] },
  {
    wa: "昭和46年8月", year: "1971",
    events: [{ title: "株式会社 松本フードセンターを設立", note: "福井市松本2丁目16-5　代表取締役 木村常治" }],
    img: { src: "/img/history/retro/1971-matsumoto.jpg", alt: "松本フードセンターのレジに座る木村常雄社長", caption: "昭和46年頃　松本フードセンター　木村常雄社長", tall: true },
  },
  { wa: "昭和52年7月", year: "1977", events: [{ title: "ハニー大宮店をオープン", note: "福井市大宮6丁目5-5" }] },
  { wa: "昭和55年8月", year: "1980", events: [{ title: "ハニー四ツ居店をオープン", note: "福井市北四ツ居1丁目9-1" }] },
  { wa: "昭和58年10月", year: "1983", events: [{ title: "株式会社 キムラフーズを設立", note: "福井市大宮6丁目531　代表取締役 木村常治" }] },
  {
    wa: "昭和61年", year: "1986",
    events: [
      { title: "7月　松本フードセンターの住所変更", note: "福井市桃園1丁目1-10" },
      { title: "7月　ハニー松本北店を閉店" },
      { title: "8月　ハニー足羽店をオープン" },
    ],
    img: { src: "/img/history/retro/store-asuwa.jpg", alt: "ハニー足羽店", caption: "ハニー足羽店" },
  },
  { wa: "昭和62年10月", year: "1987", events: [{ title: "松本フードセンターの代表者変更", note: "代表取締役 木村常雄" }] },
  {
    wa: "昭和63年", year: "1988",
    events: [
      { title: "7月　片町フードセンターの住所・代表者変更", note: "福井市大宮6丁目5-5　代表取締役 木村常雄" },
      { title: "11月　キムラフーズの代表者変更", note: "代表取締役 木村常雄" },
    ],
  },
  { wa: "平成2年3月", year: "1990", events: [{ title: "ハニー宝永店をオープン", note: "福井市宝永3丁目10-1" }] },
  { wa: "平成7年4月", year: "1995", events: [{ title: "ハニー丸岡店をオープン", note: "坂井郡丸岡町羽崎16-25" }] },
  {
    wa: "平成10年8月", year: "1998",
    events: [{ title: "ハニー食彩館みくにをオープン", note: "坂井郡三国町三国東7丁目513" }],
    img: { src: "/img/history/retro/store-mikuni.jpg", alt: "ハニー食彩館みくに店", caption: "ハニー食彩館みくに店" },
  },
  {
    wa: "平成14年2月", year: "2002",
    events: [{ title: "東部プラザと合併", note: "福井市成和1丁目3210番" }],
    img: { src: "/img/history/retro/store-tobu.jpg", alt: "ハニー食彩館東部店（東部プラザ）", caption: "ハニー食彩館東部店" },
  },
  {
    wa: "平成15年11月", year: "2003",
    events: [{ title: "ハニー食彩館丸岡店をリニューアル", note: "坂井市丸岡町羽崎16-25" }],
    img: { src: "/img/history/retro/store-maruoka.jpg", alt: "ハニー食彩館丸岡店", caption: "ハニー食彩館丸岡店" },
  },
  {
    wa: "平成17年8月", year: "2005",
    events: [{ title: "ハニー塚町店をリニューアル" }],
    img: { src: "/img/history/retro/store-tsukamachi.jpg", alt: "ハニー塚町店", caption: "ハニー塚町店" },
  },
  {
    wa: "平成18年10月", year: "2006",
    events: [{ title: "ハニー食彩館四ツ居店をリニューアル", note: "福井市北四ツ居1丁目9-1" }],
    img: { src: "/img/history/retro/store-yotsui.jpg", alt: "ハニー食彩館四ツ居店", caption: "ハニー食彩館四ツ居店" },
  },
  {
    wa: "平成20年8月", year: "2008",
    events: [{ title: "ハニー食彩館大宮店を新築開店", note: "福井市大宮6丁目5-5" }],
    img: { src: "/img/history/retro/store-oomiya.jpg", alt: "ハニー食彩館大宮店", caption: "ハニー食彩館大宮店" },
  },
  {
    wa: "平成23年", year: "2011",
    events: [
      { title: "2月　ハニー宝永店を閉店" },
      { title: "7月　ハニー食彩館東部店をリニューアル", note: "福井市成和1丁目3210番" },
    ],
  },
  {
    wa: "令和元年10月", year: "2019",
    events: [{ title: "木村 博常が代表取締役社長に就任", note: "これからも、お客様、社員さん、取引業者さん、そして地域のみなさまに「ありがとう」を伝え続けてまいります。" }],
    img: { src: "/img/history/retro/president-fist.webp", alt: "代表取締役社長 木村 博常", caption: "代表取締役社長　木村 博常", cutout: true },
  },
  {
    wa: "令和8年", year: "2026",
    events: [{ title: "創業80年。次の100年へ。", note: "経営力・管理者力・現場力。三位一体で、100年ビジョンの実現へ歩みます。" }],
  },
];

export default function HistoryPage() {
  return (
    <>
      <BlogHeader />
      <main className="bl-main">
        <div className="wrap">
          <Eyebrow>HISTORY · 1946 — 2026</Eyebrow>
          <h1 className="bl-h1">会社の沿革</h1>
          <p className="bl-lead">昭和21年、福井の小さな食料品店「木村屋」から。80年のあゆみをご紹介します。<br /><small>（30周年・40周年記念誌の年表より）</small></p>
          <ol className="hi-list">
            {HISTORY.map((h) => (
              <li key={h.wa} className="hi-item">
                <div className="hi-when"><b>{h.wa}</b><span>{h.year}</span></div>
                <div className="hi-body">
                  {h.events.map((e) => (
                    <div key={e.title} className="hi-ev">
                      <h2>{e.title}</h2>
                      {e.note && <p>{e.note}</p>}
                    </div>
                  ))}
                  {h.img && (
                    <figure className={`hi-fig${h.img.tall ? " tall" : ""}${h.img.cutout ? " cutout" : ""}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={h.img.src} alt={h.img.alt} loading="lazy" />
                      <figcaption>{h.img.caption}</figcaption>
                    </figure>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <a className="hi-tocompany" href="/company">
            <span>経営理念・ごあいさつ・会社概要は</span><b>会社概要ページへ ›</b>
          </a>
        </div>
      </main>
      <BlogFooter />
    </>
  );
}
