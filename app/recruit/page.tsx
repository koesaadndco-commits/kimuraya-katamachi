import type { Metadata } from "next";
import Script from "next/script";
import ApplyForm from "./ApplyForm";
import { SITE_URL, TIMEE_URL } from "../lib/links";
import { youtubeId } from "../lib/articles";
import { contentGetter, loadOverrides } from "../lib/site-content";
import "../kimura.css";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const TITLE = "採用情報｜木村グループ — ありがとうを、仕事にしよう。";
const DESCRIPTION =
  "木村グループ（ハニー食彩館）の採用情報。正社員（新卒採用）・パート・アルバイトを福井市内・坂井市内の各店舗で募集しています。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/recruit` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/recruit`,
    images: [{ url: "/img/team-recruit.jpg", width: 2016, height: 1512, alt: "木村グループのスタッフ" }],
  },
  twitter: { title: TITLE, description: DESCRIPTION, images: ["/img/team-recruit.jpg"] },
};

const STORES = [
  { name: "食彩館大宮店" },
  { name: "食彩館四ツ居店" },
  { name: "食彩館やしろ店" },
  { name: "食彩館西福井店" },
  { name: "食彩館丸岡店" },
  { name: "食彩館みくに店" },
  { name: "食彩館東部店" },
];

const VOICES = [
  { i: "レ", q: "落ち込む日もあるけれど、その何倍もの「ありがとう」で、また笑顔になれるんです。", who: "レジチーフ ／ 平成22年入社" },
  { i: "青", q: "仕入れた野菜を、次の日に「おいしかった」と言ってもらえた。やっててよかった、と思いました。", who: "青果チーフ ／ 平成8年入社" },
  { i: "惣", q: "一品一品に愛情をこめて。気軽に声をかけてくださいね。", who: "惣菜担当 ／ 平成20年入社" },
  { i: "店", q: "お客様の「おはようございます」や「いつも大変だね」の声に、毎日励まされています。", who: "店長 ／ 平成12年入社" },
  { i: "副", q: "頑張った分だけ売上が伸びる。売り場づくりには、とてもやりがいがあります。", who: "副店長 ／ 平成22年入社" },
  { i: "パ", q: "良い商品と笑顔の接客で、地域のお客様に喜んでいただけることがやりがいです。", who: "パン担当・レジチーフ ／ 平成26年入社" },
];

// 管理画面で登録した動画（YouTube）を毎回読むため、リクエスト時に描画する
export const dynamic = "force-dynamic";

const NUMBERS = [
  { n: "1946", u: "年創業", s: "福井の小さな食料品店から" },
  { n: "7", u: "店舗", s: "福井市・坂井市の食彩館" },
  { n: "2", u: "回／年", s: "賞与（8月・12月）" },
  { n: "96", u: "日", s: "年間休日（基本週休2日）" },
];

export default async function Recruit() {
  const c = contentGetter(await loadOverrides());
  const videos = [1, 2, 3, 4, 5, 6]
    .map((n) => ({ id: youtubeId(c(`rv.${n}.url`)), title: c(`rv.${n}.title`) }))
    .filter((v): v is { id: string; title: string } => !!v.id);
  return (
    <>
      <SiteHeader solid />

      <main id="top">
        <section className="rc2-hero" aria-label="採用情報">
          <img className="rc2-bg" src="/img/team-recruit.jpg" alt="" width={2016} height={1512} />
          <div className="rc2-shade"></div>
          <div className="wrap rc2-in">
            <div className="eyebrow">RECRUIT 2026 — 木村グループ 採用特設ページ</div>
            <h1><span>「ありがとう」を、</span><span>仕事にしよう。</span></h1>
            <p>「また明日ね」と笑顔で言い合える職場を、一緒につくりませんか。<br />正社員（新卒）・パート・アルバイトを募集しています。</p>
            <div className="rc2-ctas">
              <a className="btn btn-mitsu" href="#apply">応募する</a>
              <a className="btn btn-ghost" href="#movie">▶ 動画を見る</a>
              <a className="btn btn-ghost" href="#jobs">募集要項</a>
            </div>
          </div>
        </section>

        <section className="rc2-nums" aria-label="数字で見る木村グループ">
          <div className="wrap rc2-nums-in">
            {NUMBERS.map((x) => (
              <div key={x.s} className="rv"><b>{x.n}<small>{x.u}</small></b><span>{x.s}</span></div>
            ))}
          </div>
        </section>

        <section className="rc2-movie pad" id="movie">
          <div className="wrap">
            <div className="sec-hd"><div><div className="eyebrow">MOVIE</div><h2>動画で知る、<br />私たちの仕事。</h2></div><p className="rc2-lead">{c("rv.lead")}</p></div>
            {videos.length > 0 ? (
              <div className={`rc2-vids n${Math.min(videos.length, 3)}`}>
                {videos.map((v, i) => (
                  <figure key={v.id + i} className={`rv${i === 0 ? " main" : ""}`}>
                    <div className="rc2-frame">
                      <iframe src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0`} title={v.title || "採用動画"} loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen></iframe>
                    </div>
                    {v.title && <figcaption>{v.title}</figcaption>}
                  </figure>
                ))}
              </div>
            ) : (
              <div className="rc2-vids n1">
                <figure className="rv main">
                  <div className="rc2-frame"><video controls playsInline preload="none" poster="/img/archive-1946.jpg"><source src="/img/film.mp4" type="video/mp4" /></video></div>
                  <figcaption>木村グループ 創業八十周年記念映像（48秒）</figcaption>
                </figure>
              </div>
            )}
          </div>
        </section>

        <section className="pad" id="jobs">
          <div className="wrap">
            <div className="rc-persona rv">
              <div className="eyebrow">求める人物像・採用基準</div>
              <ul>
                <li>食品の販売・製造に興味がある方</li>
                <li>接客や人とコミュニケーションを取る仕事がしたい方</li>
                <li>店内の演出や陳列に興味がある方</li>
                <li>食彩館スタッフと一緒に働きませんか？</li>
              </ul>
            </div>

            <div className="rc-block rv">
              <h3 className="rc-title">正社員（新卒採用）</h3>
              <div className="rc-special">
                <div>
                  <p style={{margin: '0 0 8px', fontWeight: 700}}>会社説明会は随時実施しています。まずはお気軽にご応募ください。</p>
                  <a className="btn btn-mitsu" href="#apply">応募フォームへ</a>
                </div>
              </div>
              <div className="rc-job">
                <dl className="row">
                  <dt>雇用形態</dt>
                  <dd>正社員</dd>
                  <dt>勤務地</dt>
                  <dd>福井市内・坂井市内</dd>
                  <dt>勤務時間</dt>
                  <dd>土・日・祝日を含む交替制勤務　（月間平均実働時間176時間）</dd>
                  <dt>採用ステップ</dt>
                  <dd>会社説明会（随時実施） → エントリーシート提出 → 書類選考 → 一次面接（面接・筆記試験） → 最終面接</dd>
                  <dt>給与・福利厚生</dt>
                  <dd>
                    初任給　大卒：208,000円程度　短大専門卒：180,000円程度<br />
                    諸手当　役職手当、通勤手当、資格者手当等<br />
                    賞与　年２回（８月、１２月）<br />
                    昇給　年１回
                  </dd>
                  <dt>休日</dt>
                  <dd>
                    基本週休２日（年間96日、元日休業）<br />
                    有給休暇、産休、育休あり
                  </dd>
                </dl>
              </div>
            </div>

            <div className="rc-block rv">
              <h3 className="rc-title">パート・アルバイト</h3>
              <p>お気軽にお問い合わせ下さい。働きたいお店を選ぶと、このページの応募フォームからそのままご応募いただけます。</p>
              <div className="rc-stores">
                {STORES.map((s) => (
                  <a key={s.name} href={`?store=${encodeURIComponent(s.name)}&type=${encodeURIComponent("パート・アルバイト")}#apply`}>
                    {s.name}<span>このお店に応募する ›</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rc-block rv">
              <h3 className="rc-title">スポットバイト（お試し）</h3>
              <p>「いきなり長く働くのは不安」という方は、まず1日だけ。タイミーのお試しバイトで、売り場の雰囲気を体験できます。</p>
              <div className="rc-special">
                <div>
                  <p style={{margin: '0 0 8px', fontWeight: 700}}>スキマ時間にアプリで応募</p>
                  <a className="btn btn-mitsu" href={TIMEE_URL} target="_blank" rel="noopener noreferrer">タイミーでお試しバイトを探す</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="people pad" style={{paddingTop: 0}}>
          <div className="wrap">
            <div className="sec-hd"><div><div className="eyebrow">VOICE</div><h2>先輩たちからの<br />メッセージ</h2></div></div>
          </div>
          <div className="mq" aria-label="スタッフの声">
            <div className="mq-row">
              {VOICES.concat(VOICES).map((v, idx) => (
                <div className="vc" key={idx} aria-hidden={idx >= VOICES.length}>
                  <q>{v.q}</q>
                  <div className="who"><i>{v.i}</i>{v.who}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="pad rc2-apply" id="apply">
          <div className="wrap">
            <div className="rc-block rv">
              <h3 className="rc-title">応募フォーム</h3>
              <p style={{margin: '0 0 22px'}}>お電話が苦手な方も、こちらから気軽にご応募いただけます。内容を確認のうえ、担当者よりご連絡します。</p>
              <ApplyForm />
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
      <Script src="/recruit.js" strategy="afterInteractive" />
    </>
  );
}
