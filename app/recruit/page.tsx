import type { Metadata } from "next";
import Script from "next/script";
import ApplyForm from "./ApplyForm";
import { TIMEE_URL } from "../lib/links";
import "../kimura.css";

export const metadata: Metadata = {
  title: "採用情報｜木村グループ — ありがとうを、仕事にしよう。",
  description:
    "木村グループ（ハニー食彩館）の採用情報。正社員（新卒採用）・パート・アルバイトを福井市内・坂井市内の各店舗で募集しています。",
  robots: {
    index: false,
    follow: false,
  },
};

const STORES = [
  { name: "食彩館大宮店", url: "https://jobchan.net/search/detail/?id=9c4d500a-76ea-4bcc-9c6b-0ae701695bf2" },
  { name: "食彩館四ツ居店", url: "https://jobchan.net/search/detail/?id=d340cb39-b8c0-4f8c-8ed6-e9aef0194b1f" },
  { name: "食彩館やしろ店", url: "https://jobchan.net/search/detail/?id=17c974ca-c4aa-4849-8229-f6ee53468044" },
  { name: "食彩館西福井店", url: "https://jobchan.net/search/detail/?id=d14905dd-ea3e-4f13-9e09-3775912537fb" },
  { name: "食彩館丸岡店", url: "https://jobchan.net/search/detail/?id=f9065a8a-019f-467a-bd5a-46ec3f255db6" },
  { name: "食彩館みくに店", url: "https://jobchan.net/search/detail/?id=fc3264a3-a1e3-4fdd-a69f-fe648ed6b376" },
  { name: "食彩館東部店", url: "https://jobchan.net/search/detail/?id=13ce6bc2-23fc-4d01-a3af-3dc10d73bacd" },
];

const VOICES = [
  { i: "レ", q: "落ち込む日もあるけれど、その何倍もの「ありがとう」で、また笑顔になれるんです。", who: "レジチーフ ／ 平成22年入社" },
  { i: "青", q: "仕入れた野菜を、次の日に「おいしかった」と言ってもらえた。やっててよかった、と思いました。", who: "青果チーフ ／ 平成8年入社" },
  { i: "惣", q: "一品一品に愛情をこめて。気軽に声をかけてくださいね。", who: "惣菜担当 ／ 平成20年入社" },
  { i: "店", q: "お客様の「おはようございます」や「いつも大変だね」の声に、毎日励まされています。", who: "店長 ／ 平成12年入社" },
  { i: "副", q: "頑張った分だけ売上が伸びる。売り場づくりには、とてもやりがいがあります。", who: "副店長 ／ 平成22年入社" },
  { i: "パ", q: "良い商品と笑顔の接客で、地域のお客様に喜んでいただけることがやりがいです。", who: "パン担当・レジチーフ ／ 平成26年入社" },
];

export default function Recruit() {
  return (
    <>
      <header className="site" id="hdr">
        <div className="wrap hd">
          <a className="logo" href="/" aria-label="木村屋（木村グループ）ホーム">
            <img className="lg" src="/img/logo/kimuraya-lockup.png" alt="木村屋" width={1200} height={355} />
            <span className="lg-sub">
              <img className="lg2" src="/img/logo/shokusaikan-logo.png" alt="ハニー食彩館 FOOD MARKET" width={1200} height={567} />
            </span>
          </a>
          <nav className="gnav" aria-label="メインメニュー">
            <a href="/#promise">私たちの約束</a>
            <a href="/#story">80年の物語</a>
            <a href="/#fukui">福井の恵み</a>
            <a href="/#stores">店舗一覧</a>
            <a href="/blog">お店のたより</a>
            <a href="/recruit">採用情報</a>
          </nav>
          <a className="btn btn-mitsu" href="/#quick">今日のチラシ</a>
          <button className="menu-btn" type="button" aria-label="メニューを開く">MENU</button>
        </div>
      </header>

      <main id="top">
        <section className="rc-hero" aria-label="採用情報">
          <img src="/img/team-recruit.jpg" alt="経営陣・幹部の集合写真" />
          <div className="wrap">
            <div className="eyebrow">RECRUIT</div>
            <h1>「ありがとう」を、<br />仕事にしよう。</h1>
            <p>「また明日ね」と笑顔で言い合える職場を、一緒につくりませんか。正社員・パート・アルバイトを募集しています。</p>
          </div>
        </section>

        <section className="pad" style={{paddingBottom: 0}}>
          <div className="wrap">
            <div className="rc-block rv">
              <h3 className="rc-title">応募フォーム</h3>
              <p style={{margin: '0 0 22px'}}>お電話が苦手な方も、こちらから気軽にご応募いただけます。内容を確認のうえ、担当者よりご連絡します。</p>
              <ApplyForm />
            </div>
          </div>
        </section>

        <section className="pad">
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
                  <p style={{margin: '0 0 8px', fontWeight: 700}}>採用に関する特設サイトはこちら</p>
                  <a className="btn btn-mitsu" href="https://wandering-lotus-ad7.notion.site/acb272cd21c74f3cbc17b413c5796e45" target="_blank" rel="noopener noreferrer">新卒採用特設サイトを見る</a>
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
              <p>お気軽にお問い合わせ下さい。各店舗の求人ページからご応募いただけます。</p>
              <div className="rc-stores">
                {STORES.map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.name}<span>求人を見る ›</span>
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
      </main>

      <footer>
        <div className="wrap">
          <div className="grid">
            <div>
              <div className="ft-logos"><a className="logo" href="/" aria-label="木村屋（木村グループ）"><img className="lg-full" src="/img/logo/kimuraya-logo.png" alt="木村屋 SINCE 1946" width={1000} height={965} /></a><img className="ft-shoku" src="/img/logo/shokusaikan-logo.png" alt="ハニー食彩館 FOOD MARKET" width={1200} height={567} /></div>
              <p style={{marginTop: '18px', lineHeight: '2'}}>〒910-0016 福井県福井市大宮6丁目5-5<br />協同組合ハニー加盟</p>
              <div className="ft-line">
                <img src="/img/line-qr.svg" alt="木村グループ LINE公式アカウントのQRコード" width={120} height={120} />
                <div>
                  <b>LINE公式アカウント</b>
                  <span>友だち追加で、チラシやお得な情報をお届けします。</span>
                  <a className="btn btn-line" href="https://lin.ee/rNifBeB" target="_blank" rel="noopener noreferrer">友だち追加</a>
                </div>
              </div>
            </div>
            <ul><li><a href="/#promise">私たちの約束</a></li><li><a href="/#story">80年の物語</a></li><li><a href="/#fukui">福井の恵み</a></li><li><a href="/#stores">店舗一覧</a></li></ul>
            <ul><li><a href="/#news">お知らせ</a></li><li><a href="/blog">お店のたより</a></li><li><a href="/recruit">採用情報</a></li><li><a href="https://kimura-group48.jp/contact.php">お問い合わせ</a></li><li><a href="/">ホームへ戻る</a></li></ul>
          </div>
          <div className="copy"><span>© 2026 木村グループ</span><span>Design sample by KOESA Co.,Ltd. — AI SOLUTION STUDIO</span></div>
        </div>
      </footer>
      <Script src="/recruit.js" strategy="afterInteractive" />
    </>
  );
}
