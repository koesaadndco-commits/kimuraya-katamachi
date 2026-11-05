/* eslint-disable @next/next/no-html-link-for-pages -- 共通ヘッダー（kimura.js）と同じく通常のページ読み込みで遷移させる */
import type { Metadata } from "next";
import "../kimura.css";
import { BlogFooter, BlogHeader, Eyebrow } from "../blog/SiteChrome";
import { PRESIDENT_PHOTO, SITE_URL } from "../lib/links";

export const metadata: Metadata = {
  title: "会社概要｜木村グループ（ハニー食彩館）",
  description: "木村グループ（ハニー食彩館）の経営理念・ごあいさつ・会社概要・店舗一覧。",
  alternates: { canonical: `${SITE_URL}/company` },
};

const MOTTO = ["食を通じて、", "ありがとうの溢れる", "豊かな社会を実現する"];

const MESSAGE = [
  "昭和二十一年、戦後まもない福井の町で、小さな食料品店「木村屋」は生まれました。",
  "あの日から変わらないのは、お客様の「おいしかったよ」のひとことのために、毎朝いちばんに売り場に立つこと。",
  "お客様、社員さん、取引業者さん、そして地域のみなさまに喜ばれる店であり続けるために。",
  "八十年分の「ありがとう」を胸に、これからも福井の台所として、次の百年へ歩んでまいります。",
];

const COMPANIES = ["株式会社 片町フードセンター", "株式会社 松本フードセンター", "株式会社 東部プラザ"];

const PROFILE: [string, string][] = [
  ["名称", "木村グループ"],
  ["創業", "昭和21年（1946年）　食料品店「木村屋」として開業"],
  ["代表者", "代表取締役社長　木村 博常"],
  ["所在地", "〒910-0016 福井県福井市大宮6丁目5-5"],
  ["グループ会社", "株式会社 片町フードセンター\n株式会社 松本フードセンター\n株式会社 東部プラザ"],
  ["事業内容", "食品スーパーマーケット「ハニー食彩館」の運営\n惣菜の製造・販売"],
  ["店舗数", "7店舗（福井市・坂井市）"],
  ["加盟団体", "協同組合ハニー"],
  ["お問い合わせ", "info@kimura-group48.jp"],
];

const STORES = [
  { name: "食彩館 大宮店", addr: "福井市大宮6丁目5-5", tel: "0776-27-1194" },
  { name: "食彩館 四ツ居店", addr: "福井市北四ツ居1-9-1", tel: "0776-53-5535" },
  { name: "食彩館 やしろ店", addr: "福井市若杉4丁目1021", tel: "0776-34-3030" },
  { name: "食彩館 西福井店", addr: "福井市文京4丁目3-1", tel: "0776-26-6400" },
  { name: "食彩館 丸岡店", addr: "坂井市丸岡町羽崎16字25", tel: "0776-67-3771" },
  { name: "食彩館 みくに店", addr: "坂井市三国町三国東7-513", tel: "0776-81-6670" },
  { name: "食彩館 東部店", addr: "福井市成和1丁目3210", tel: "0776-26-1002" },
];

const BRUSH_TEXT = [...MOTTO, ...MESSAGE, ...COMPANIES, "経営理念代表取締役社長木村博常"].join("");

export default function CompanyPage() {
  return (
    <>
      <BlogHeader />
      <main className="bl-main">
        <div className="wrap">
          <Eyebrow>COMPANY</Eyebrow>
          <h1 className="bl-h1">会社概要</h1>
          <p className="bl-lead">昭和21年、福井の小さな食料品店「木村屋」から。木村グループの想いと概要をご紹介します。</p>
          {/* 筆文字（Yuji Syuku）は、このまとまりで使う文字だけを読み込む */}
          <link rel="stylesheet" precedence="default" href={`https://fonts.googleapis.com/css2?family=Yuji+Syuku&display=swap&text=${encodeURIComponent(BRUSH_TEXT)}`} />
          <section className="hi-motto2" aria-label="経営理念とごあいさつ">
            <div className="hi-motto2-label">経営理念</div>
            <p className="hi-motto2-text">{MOTTO.map((l) => <span key={l}>{l}</span>)}</p>
            <div className="hi-motto2-rule" aria-hidden="true"></div>
            <div className="hi-motto2-msg">{MESSAGE.map((l, i) => <p key={i}>{l}</p>)}</div>
            <div className="hi-motto2-sign">
              <div className="hi-sign-text">
                <ul>{COMPANIES.map((c) => <li key={c}>{c}</li>)}</ul>
                <p><span>代表取締役社長</span><b>木村 博常</b></p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hi-sign-photo" src={PRESIDENT_PHOTO} alt="代表取締役社長 木村 博常" loading="lazy" />
            </div>
          </section>

          <section className="co-profile" aria-label="会社概要">
            <h2>会社概要</h2>
            <dl>
              {PROFILE.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v.split("\n").map((l, i) => <span key={i}>{l}</span>)}</dd></div>
              ))}
            </dl>
          </section>

          <section className="co-profile" aria-label="店舗一覧">
            <h2>店舗一覧</h2>
            <ul className="co-stores">
              {STORES.map((s) => (
                <li key={s.name}><b>{s.name}</b><span>{s.addr}</span><a href={`tel:${s.tel.replace(/-/g, "")}`}>TEL {s.tel}</a></li>
              ))}
            </ul>
          </section>

          <a className="hi-tocompany" href="/history">
            <span>昭和21年からのあゆみは</span><b>会社の沿革へ ›</b>
          </a>
        </div>
      </main>
      <BlogFooter />
    </>
  );
}
