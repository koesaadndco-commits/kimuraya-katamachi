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
  "木村グループ（ハニー食彩館）の採用情報。新卒正社員・中途正社員・パート・アルバイトを福井市内・坂井市内の各店舗で募集しています。";

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

const POINTS = [
  { no: "01", t: "地域貢献", img: "/img/register.jpg", d: "福井市・坂井市の7店舗で、毎日の食卓を支える仕事。「いつもありがとう」の声が、いちばんのやりがいです。" },
  { no: "02", t: "成長できる", img: "/img/morning.jpg", d: "社内外の研修を積極的に開催しています。売り場づくりも、仕入れも、接客も、先輩が一つずつ教えるので、未経験からでも少しずつ任せられることが増えていきます。" },
  { no: "03", t: "プライベートも充実！", img: "/img/family.jpg", d: "基本週休2日、有給休暇・産休・育休あり。家族との時間や自分の時間も大切にしながら働けます。" },
];

const NUMBERS = [
  { n: "1946", u: "年創業", s: "福井の小さな食料品店から" },
  { n: "7", u: "店舗", s: "福井市・坂井市の食彩館" },
  { n: "2", u: "回／年", s: "賞与（8月・12月）" },
  { n: "96", u: "日", s: "年間休日（基本週休2日）" },
];

export default async function Recruit() {
  // 採用ページのデザイン：金の版（未来的な版の作りを金色にしたもの）
  const theme = "rc-future rc-gold";
  const c = contentGetter(await loadOverrides());
  const videos = [1, 2, 3, 4, 5, 6]
    .map((n) => ({ id: youtubeId(c(`rv.${n}.url`)), title: c(`rv.${n}.title`) }))
    .filter((v): v is { id: string; title: string } => !!v.id);
  return (
    <>
      <SiteHeader solid />

      {/* 採用ページの見出し・数字用の書体 */}
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@900&family=Space+Grotesk:wght@500;700&display=swap" />
      <main id="top" className={theme}>
        <section className="rc2-hero" aria-label="採用情報">
          <img className="rc2-bg" src="/img/team-recruit.jpg" alt="" width={2016} height={1512} />
          <div className="rc2-shade"></div>
          <div className="wrap rc2-in"><div className="rc2-card">
            <div className="eyebrow">RECRUIT 2026 — 木村グループ 採用特設ページ</div>
            <h1><span>「ありがとう」を、</span><span>仕事にしよう。</span></h1>
            <p className="rc2-lead2"><span>「また明日ね」と笑顔で言い合える職場を、</span><span>一緒につくりませんか。</span><br /><span>正社員・パート・アルバイトを</span><span>募集しています。</span></p>
            <ul className="rc2-tags"><li>地域貢献</li><li>成長できる</li><li>プライベートも充実！</li></ul>
            <div className="rc2-ctas">
              <a className="btn btn-mitsu" href="#apply">応募する</a>
              <a className="btn rc2-btn2" href="#movie">▶ 動画を見る</a>
              <a className="btn rc2-btn2" href="#jobs">募集要項</a>
            </div>
          </div></div>
        </section>

        <section className="rc2-points pad" aria-label="木村グループで働く魅力">
          <div className="wrap">
            <div className="sec-hd"><div><div className="eyebrow">WHY KIMURA</div><h2>ここで働く、<br />3つのいいところ。</h2></div></div>
            <div className="rc2-points-in">
              {POINTS.map((p) => (
                <article key={p.t} className="rc2-point rv" style={{ backgroundImage: `url(${p.img})` }}>
                  <div className="rc2-point-in">
                    <span className="rc2-point-no">{p.no}</span>
                    <h3>{p.t}</h3>
                    <p>{p.d}</p>
                  </div>
                </article>
              ))}
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
              <h3 className="rc-title">新卒正社員</h3>
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
              <h3 className="rc-title">中途正社員</h3>
              <p>社会人経験のある方、異業種から転職を考えている方も歓迎します。勤務地・勤務時間・給与は、これまでのご経験やご希望をうかがったうえでご相談します。</p>
              <div className="rc-special">
                <div>
                  <p style={{margin: '0 0 8px', fontWeight: 700}}>まずは応募フォームからお気軽にどうぞ。</p>
                  <a className="btn btn-mitsu" href={`?type=${encodeURIComponent("中途正社員")}#apply`}>中途正社員に応募する</a>
                </div>
              </div>
            </div>

            <div className="rc-block rv">
              <h3 className="rc-title">パート・アルバイト</h3>
              <p>お気軽にお問い合わせ下さい。働きたいお店を選ぶと、このページの応募フォームからそのままご応募いただけます（パート・アルバイトの別はフォームでお選びください）。</p>
              <div className="rc-stores">
                {STORES.map((s) => (
                  <a key={s.name} href={`?store=${encodeURIComponent(s.name)}#apply`}>
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
