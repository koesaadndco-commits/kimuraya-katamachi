import type { Metadata } from "next";
import Script from "next/script";
import "./kimura.css";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { DEFAULT_FLYER_URL, INSTAGRAM_URL, SITE_URL, TIMEE_URL } from "./lib/links";
import { flyerHref, listActivePosts, type Post } from "./lib/staff-store";
import { dotDate, getArticle, listPublishedArticles } from "./lib/articles";
import { contentGetter, loadOverrides } from "./lib/site-content";
import type { ReactNode } from "react";

// スタッフページ（/staff）の登録内容を毎回読むため、リクエスト時に描画する
export const dynamic = "force-dynamic";

const TITLE = "木村グループ｜ハニー食彩館 — ありがとうの、八十年。";
const DESCRIPTION =
  "昭和21年、福井の小さな食料品店「木村屋」から。福井市・坂井市で食彩館7店舗を展開する木村グループの公式サイト。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: SITE_URL },
  twitter: { title: TITLE, description: DESCRIPTION },
};

type Store = { name: string; address: string; tel: string; close: string };

const STORES: Store[] = [
  { name: "食彩館 大宮店", address: "福井県福井市大宮6丁目5-5", tel: "0776-27-1194", close: "24:00" },
  { name: "食彩館 四ツ居店", address: "福井県福井市北四ツ居1-9-1", tel: "0776-53-5535", close: "22:00" },
  { name: "食彩館 やしろ店", address: "福井県福井市若杉4丁目1021", tel: "0776-34-3030", close: "24:00" },
  { name: "食彩館 西福井店", address: "福井県福井市文京4丁目3-1", tel: "0776-26-6400", close: "23:00" },
  { name: "食彩館 丸岡店", address: "福井県坂井市丸岡町羽崎16字25", tel: "0776-67-3771", close: "24:00" },
  { name: "食彩館 みくに店", address: "福井県坂井市三国町三国東7-513", tel: "0776-81-6670", close: "24:00" },
  { name: "食彩館 東部店", address: "福井県福井市成和1丁目3210", tel: "0776-26-1002", close: "24:00" },
];

const STORES_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": STORES.map((s) => ({
    "@type": "GroceryStore",
    name: s.name,
    telephone: s.tel,
    address: { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "JP" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: s.close,
    },
    parentOrganization: { "@type": "Organization", name: "木村グループ", url: SITE_URL },
  })),
};

export default async function Home() {
  // 掲載期間内の「本日のチラシ・お知らせ」（期間外のものは含まれない）
  const active = await listActivePosts();
  const flyer = flyerHref(active, DEFAULT_FLYER_URL);
  // 公開中の社長ブログ・スタッフブログ・レシピ（新しい順）
  const latest = await listPublishedArticles(undefined, 5);
  // 「エリちゃんの今日のレシピ」：公開中のいちばん新しいレシピ（無ければ献立選びの見本を表示）
  const recipeSummary = (await listPublishedArticles("recipe", 1))[0];
  const todayRecipe = recipeSummary ? await getArticle(recipeSummary.id) : null;
  // スタッフ管理画面（/staff/site）で差し替えた写真・文章（ヒーロー部分は対象外）
  const c = contentGetter(await loadOverrides());
  return (
    <>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(STORES_JSON_LD) }}
  />
  <div className="theater" id="theater" role="dialog" aria-modal="true" aria-label="創業八十周年記念映像">
    <div className="th-glow"></div><div className="th-grain"></div>
    <video className="th-film" id="thFilm" playsInline preload="auto" poster="/img/archive-1946.jpg"><source src="/img/film.mp4" type="video/mp4" /></video>
    <div className="th-pre" id="thPre">
      <div className="th-kicker">1946 — 2026</div>
      <div className="th-sub">木村グループ　創業八十周年記念映像</div>
      <div className="th-title">ありがとうの、八十年。</div>
      <div className="th-rule"></div>
      <div className="th-actions">
        <button type="button" className="th-play" id="thPlay"><i></i>音声つきで上映する　<span style={{opacity: '.6', fontSize: '12px'}}>48秒</span></button>
        <button type="button" className="th-skip" id="thSkip">映像をとばしてサイトへ</button>
      </div>
    </div>
    <div className="th-ctrl" id="thCtrl"><button type="button" id="thMute">音を消す</button><button type="button" id="thEnd">スキップ ›</button></div>
    <div className="th-bar" id="thBar"></div>
    <div className="th-note">※本サイトの一部にAIを使用しています</div>
  </div>
  
  
  <SiteHeader flyerHref={flyer} />
  
  <main id="top">
  
  {/* HERO: scroll-expansion theater */}
  <section className="xp" id="xp" aria-label="木村屋から八十年">
    <div className="xp-stage">
      <img className="xp-bg" src="/img/old-shop.jpg" alt="" />
      <div className="xp-media">
        <video id="film" autoPlay muted playsInline loop preload="auto" poster="/img/old-shop.jpg"><source src="/img/hero.mp4" type="video/mp4" /></video>
      </div>
      <div className="xp-grain"></div>
      <h1 className="xp-title" aria-label="ありがとうの、八十年。"><span className="l">ありがとうの、</span><span className="r">八十年。</span></h1>
      <div className="xp-meta"><button type="button" className="voice-btn js-voice" aria-label="ナレーションを聴く"><span className="eq"><i></i><i></i><i></i></span>物語を聴く</button><span className="yr" aria-hidden="true">Since 1946 · Fukui</span><span aria-hidden="true">スクロールで、物語へ</span><span className="cue" aria-hidden="true"></span></div>
      <div className="xp-sub" id="xpSub" aria-live="polite"></div>
      <audio id="narr" preload="auto" src="/img/narration.mp3"></audio>
      <div className="xp-copy" id="xpCopy">
        <div className="wrap">
          <div className="year"><i></i>昭和二十一年 → 令和八年</div>
          <h2>あの日の「いらっしゃい」から、<br />今日の「ありがとう」まで。</h2>
          <p>戦後まもない福井の町に、小さな食料品店「木村屋」が生まれました。<br />八十年たった今も、私たちはこの町の台所です。</p>
          <div className="ctas"><a className="btn btn-mitsu" href="#story">80年の物語を見る</a><a className="btn btn-ghost" href="#quick">今日のチラシ</a><button type="button" className="voice-btn js-voice" aria-label="ナレーションを聴く"><span className="eq"><i></i><i></i><i></i></span>物語を聴く</button></div>
        </div>
      </div>
      <div className="xp-ctrl"><button type="button" id="pp" aria-label="映像を一時停止">Ⅱ 一時停止</button></div>
      <div className="xp-bar" id="xpBar"></div>
    </div>
  </section>
  
  {/* TODAY */}
  <div className="today" aria-label="今日のごあいさつ"><div className="wrap"><b id="wareki">令和8年9月27日（日）</b><span className="dot"></span><span className="season" id="season">実りの秋。新米が並びはじめました。</span><span className="dot"></span><span>創業から<b>80</b>年目の今日も、全店 8:00 開店です。</span></div></div>
  
  {/* QUICK */}
  <nav className="quick" id="quick" aria-label="よく使うメニュー">
    <ul>
      <li><a href={flyer}><svg viewBox="0 0 28 28"><rect x="5" y="3" width="18" height="22" rx="1"/><path d="M9 9h10M9 13h10M9 17h6"/></svg><span><span className="k">今日のチラシ</span><br /><span className="s">スマホで見やすく毎朝更新</span></span></a></li>
      <li><a href="#stores"><svg viewBox="0 0 28 28"><path d="M14 25s8-7.5 8-13.5A8 8 0 0 0 6 11.5C6 17.5 14 25 14 25z"/><circle cx="14" cy="11.5" r="3"/></svg><span><span className="k">店舗を探す</span><br /><span className="s">福井市・坂井市 7店舗</span></span></a></li>
      <li className="uber"><a href="#quick"><svg viewBox="0 0 28 28"><path d="M4 9h15l-1.5 10h-12z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/><path d="M20 13h4M21 17h3"/></svg><span><span className="k">お届け注文</span><br /><span className="s">Uber Eatsでお家まで</span></span></a></li>
      <li><a href="#goods"><svg viewBox="0 0 28 28"><rect x="4" y="6" width="20" height="18" rx="1"/><path d="M4 11h20M9 3v5M19 3v5M9 16h3M16 16h3M9 20h3"/></svg><span><span className="k">オードブル予約</span><br /><span className="s">ネットで24時間受付</span></span></a></li>
      <li><a href="https://lin.ee/rNifBeB"><svg viewBox="0 0 28 28"><path d="M14 5C8 5 3.5 8.8 3.5 13.4c0 4.1 3.6 7.5 8.5 8.2l-.6 3 4.2-2.8c5.4-.4 9.9-4 9.9-8.4C25.5 8.8 20 5 14 5z"/></svg><span><span className="k">LINE友だち</span><br /><span className="s">お得な情報をいち早く</span></span></a></li>
      <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 28 28"><rect x="5" y="5" width="18" height="18" rx="5"/><circle cx="14" cy="14" r="4.2"/><circle cx="19.2" cy="8.8" r=".9"/></svg><span><span className="k">Instagram</span><br /><span className="s">お店の最新情報を発信</span></span></a></li>
    </ul>
  </nav>

  <TodayNotice posts={active} />
  
  {/* MANIFESTO: reading reveal */}
  <section className="read" id="promise">
    <div className="read-stage">
      <div className="big80" aria-hidden="true">80</div>
      <div className="wrap read-in">
        <div>
          <div className="eyebrow">OUR PROMISE</div>
          <p className="read-text" id="readText">{rich(c("promise.text"))}</p>
          <div className="read-sign"><span>{c("promise.signLabel")}</span><b>{c("promise.sign")}</b></div>
        </div>
        <div className="read-side">
          <figure><img src={c("promise.img")} alt={c("promise.caption")} id="readImg" /></figure>
          <figcaption>{c("promise.caption")}</figcaption>
        </div>
      </div>
    </div>
  </section>
  
  {/* STORY: sticky horizontal */}
  <section className="hs" id="story">
    <div className="hs-stage">
      <div className="wrap hs-hd">
        <div><div className="eyebrow">OUR STORY · 1946 — 2026</div><h2>{c("story.heading")}</h2></div>
        <div className="hs-count" id="hsYear" aria-hidden="true">1946</div>
      </div>
      <div className="hs-track" id="hsTrack">
        <article className="hs-card" data-y="1946"><div className="ph"><img src={c("story.1.img")} alt={c("story.1.title")} loading="lazy" /></div><div className="era"><b>昭和21年</b><span>1946</span></div><h3>{c("story.1.title")}</h3><p>{c("story.1.text")}</p></article>
        <article className="hs-card" data-y="1965"><div className="ph"><img src={c("story.2.img")} alt={c("story.2.title")} loading="lazy" /></div><div className="era"><b>昭和40年</b><span>1965</span></div><h3>{c("story.2.title")}</h3><p>{c("story.2.text")}</p></article>
        <article className="hs-card" data-y="1971"><div className="ph type">昭和46</div><div className="era"><b>昭和46年</b><span>1971</span></div><h3>{c("story.3.title")}</h3><p>{c("story.3.text")}</p></article>
        <article className="hs-card" data-y="1983"><div className="ph"><img src={c("story.4.img")} alt={c("story.4.title")} loading="lazy" /></div><div className="era"><b>昭和58年</b><span>1983</span></div><h3>{c("story.4.title")}</h3><p>{c("story.4.text")}</p></article>
        <article className="hs-card" data-y="1986"><div className="ph type">足羽</div><div className="era"><b>昭和61年</b><span>1986</span></div><h3>{c("story.5.title")}</h3><p>{c("story.5.text")}</p></article>
        <article className="hs-card" data-y="1995"><div className="ph type">食彩館</div><div className="era"><b>平成7年〜</b><span>1995 —</span></div><h3>{c("story.6.title")}</h3><p>{c("story.6.text")}</p></article>
        <article className="hs-card" data-y="2026"><div className="ph now"><img src={c("story.7.img")} alt={c("story.7.title")} loading="lazy" /></div><div className="era"><b>令和8年</b><span>2026</span></div><h3>{c("story.7.title")}</h3><p>{c("story.7.text")}</p></article>
      </div>
      <div className="wrap"><div className="hs-prog"><i id="hsProg"></i></div><a className="hs-more" href="/history">会社の沿革をくわしく見る ›</a></div>
    </div>
  </section>
  
  {/* FUKUI: sticky wipe gallery */}
  <section className="wg" id="fukui" aria-label="福井の恵み">
    <div className="wg-stage">
      <div className="wg-slide"><img src={c("fukui.1.img")} alt={c("fukui.1.title")} loading="lazy" /></div>
      <div className="wg-slide"><img src={c("fukui.2.img")} alt={c("fukui.2.title")} loading="lazy" /></div>
      <div className="wg-slide"><img src={c("fukui.3.img")} alt={c("fukui.3.title")} loading="lazy" /></div>
      <div className="wg-shade"></div>
      <div className="wg-copy"><div className="wrap">
        <div className="eyebrow">FROM FUKUI</div>
        <div className="wg-titles" id="wgTitles"><span>{c("fukui.1.title")}</span><span className="in">{c("fukui.2.title")}</span><span className="in">{c("fukui.3.title")}</span></div>
        <p className="wg-sub" id="wgSub" data-subs={JSON.stringify([c("fukui.1.sub"), c("fukui.2.sub"), c("fukui.3.sub")])}>{c("fukui.1.sub")}</p>
        <div className="wg-dots" id="wgDots"><i className="on"></i><i></i><i></i></div>
      </div></div>
    </div>
  </section>
  
  <div className="goods-wrap" id="goods"><div className="wrap goods">
    <a className="good rv" href="#goods"><div className="ph"><img src={c("goods.1.img")} alt={c("goods.1.title")} loading="lazy" /></div><div className="t"><b>{c("goods.1.title")}</b><span>{c("goods.1.sub")}</span></div></a>
    <a className="good rv" href="#goods"><div className="ph"><img src={c("goods.2.img")} alt={c("goods.2.title")} loading="lazy" /></div><div className="t"><b>{c("goods.2.title")}</b><span>{c("goods.2.sub")}</span></div></a>
    <a className="good rv" href="#goods"><div className="ph"><img src={c("goods.3.img")} alt={c("goods.3.title")} loading="lazy" /></div><div className="t"><b>{c("goods.3.title")}</b><span>{c("goods.3.sub")}</span></div></a>
    <a className="good rv" href="#goods"><div className="ph"><img src={c("goods.4.img")} alt={c("goods.4.title")} loading="lazy" /></div><div className="t"><b>{c("goods.4.title")}</b><span>{c("goods.4.sub")}</span></div></a>
  </div></div>
  
  {/* DINNER PICKER */}
  <section className="dinner pad" id="dinner">
    <div className="wrap grid">
      <div className="rv">
        <div className="eri-hd">
          <img className="eri-chara" src="/img/eri.webp" alt="エリちゃんのイラスト" width={449} height={720} loading="lazy" />
          <div>
            <div className="eyebrow">ERI&apos;S RECIPE OF THE DAY</div>
            <h2 style={{fontSize: 'clamp(28px,3.6vw,46px)', lineHeight: '1.45', letterSpacing: '.04em', marginTop: '10px'}}>{lines(c("dinner.heading"))}</h2>
          </div>
        </div>
        <p style={{color: '#3c3a36', maxWidth: '26em'}}>{c("dinner.lead")}</p>
        {todayRecipe ? (
          <a className="btn btn-mitsu" href={`/blog/${todayRecipe.id}`} style={{marginTop: '8px'}}>作り方をくわしく見る</a>
        ) : (
          <>
        <div className="chips" role="group" aria-label="今日の気分">
            <button type="button" className="chip" data-k="warm" aria-pressed="true">あったまりたい</button>
            <button type="button" className="chip" data-k="fresh" aria-pressed="false">さっぱりしたい</button>
            <button type="button" className="chip" data-k="feast" aria-pressed="false">ごちそうの日</button>
            <button type="button" className="chip" data-k="quick" aria-pressed="false">10分で済ませたい</button>
          </div>
          </>
        )}
      </div>
      {todayRecipe ? (
        <article className="dish rv">
          <div className="ph">{todayRecipe.photos[0] && <img src={`/f/${todayRecipe.photos[0].id}`} alt={todayRecipe.alt || todayRecipe.title} />}</div>
          <div className="bd">
            <div className="tag">エリちゃんの今日のレシピ{todayRecipe.recipe?.time ? `　調理時間 ${todayRecipe.recipe.time}` : ""}</div>
            <h3>{todayRecipe.title}</h3>
            {todayRecipe.body && <p>{todayRecipe.body.split("\n")[0].slice(0, 90)}</p>}
            {todayRecipe.recipe && todayRecipe.recipe.ingredients.length > 0 && (
              <ul>{todayRecipe.recipe.ingredients.slice(0, 6).map((it, i) => <li key={i}>{it}</li>)}</ul>
            )}
            <a className="go" href={`/blog/${todayRecipe.id}`}>作り方を見る →</a>
          </div>
        </article>
      ) : (
      <article className="dish rv" id="dish" aria-live="polite">
          <div className="ph"><img id="dishImg" src="/img/table.jpg" alt="" /></div>
          <div className="bd">
            <div className="tag" id="dishTag">あったまりたい夜に</div>
            <h3 id="dishName">秋鮭と根菜の粕汁</h3>
            <p id="dishText">脂ののった秋鮭と、大根・人参・ごぼう。酒粕でコクを足せば、体の芯からぽかぽかに。</p>
            <ul id="dishList"><li><b>鮮魚</b>秋鮭</li><li><b>青果</b>大根・人参・ごぼう</li><li><b>日配</b>酒粕・油揚げ</li></ul>
            <a className="go" href={flyer}>今日のチラシでお買い得をチェック →</a>
          </div>
        </article>
      )}
    </div>
  </section>
  
  {/* PRESIDENT */}
  <section className="pres pad" id="message">
    <div className="wrap grid">
      <div className="screen rv">
        <img src={c("message.img")} alt="" loading="lazy" />
        <span className="tag">毎月配信</span>
        <div className="play"><i><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></i><span style={{fontFamily: 'var(--mincho)', fontSize: '18px', letterSpacing: '.1em'}}>{c("message.videoTitle")}</span></div>
      </div>
      <div className="rv">
        <div className="eyebrow">MESSAGE FROM THE PRESIDENT</div>
        <blockquote>{lines(c("message.quote"))}</blockquote>
        <p className="body">{c("message.body")}</p>
        <div className="pillars"><div><b>経営力</b><span>次の100年を描く</span></div><div><b>管理者力</b><span>人を育て、店を磨く</span></div><div><b>現場力</b><span>今日の一品に心を込める</span></div></div>
        <div className="who">{c("message.title")}<b>{c("message.name")}</b></div>
      </div>
    </div>
  </section>
  
  {/* PEOPLE: marquee */}
  <section className="people pad">
    <div className="wrap">
      <div className="sec-hd"><div><div className="eyebrow">PEOPLE</div><h2>{lines(c("people.heading"))}</h2></div><a className="btn btn-line" href="/recruit">スタッフの声をもっと読む</a></div>
      <div className="people-photos">
        <figure className="rv"><img src={c("people.1.img")} alt="スタッフの写真" loading="lazy" /></figure>
        <figure className="rv"><img src={c("people.2.img")} alt="スタッフの写真" loading="lazy" /></figure>
        <figure className="rv"><img src={c("people.3.img")} alt="スタッフの写真" loading="lazy" /></figure>
      </div>
    </div>
    <div className="mq" aria-label="スタッフの声">
      <div className="mq-row">
        {[false, true].map((dup) =>
          [1, 2, 3, 4, 5, 6].map((n) => {
            const who = c(`people.v${n}.who`);
            return (
              <div key={`${dup}-${n}`} className="vc" {...(dup ? { "aria-hidden": true } : {})}><q>{c(`people.v${n}.text`)}</q><div className="who"><i>{Array.from(who)[0] ?? ""}</i>{who}</div></div>
            );
          }),
        )}
      </div>
    </div>
  </section>
  
  {/* STORES */}
  <section className="stores pad" id="stores">
    <div className="wrap">
      <div className="sec-hd"><div><img className="st-logo" src="/img/logo/shokusaikan-logo.png" alt="ハニー食彩館 FOOD MARKET" width={1200} height={567} /><div className="eyebrow">STORES</div><h2>{lines(c("stores.heading"))}</h2></div><p style={{margin: '0', color: 'var(--hai)', maxWidth: '26em'}}>{c("stores.lead")}</p></div>
      <div className="store-grid">
      <div className="map rv" id="map" aria-label="店舗マップ（福井市・坂井市）"><svg id="mapSvg" viewBox="0 0 480 600" role="img" aria-label="福井市・坂井市の食彩館7店舗の位置"></svg>
        <div className="map-tools"><button type="button" id="nearBtn">現在地から近い店を探す</button><span id="nearOut"></span></div>
      </div>
      <div className="store-list one" id="storeList">
        <div className="store" data-close="24"><h3>食彩館 大宮店<span className="open"></span></h3><div className="addr">福井市大宮6丁目5-5 ／ TEL 0776-27-1194</div><div className="hrs"><b>8:00 – 24:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps?cid=698264289893347059">地図を開く</a><a href={flyer}>チラシ</a></div></div>
        <div className="store" data-close="22"><h3>食彩館 四ツ居店<span className="open"></span></h3><div className="addr">福井市北四ツ居1-9-1 ／ TEL 0776-53-5535</div><div className="hrs"><b>8:00 – 22:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館四ツ居店">地図を開く</a><a href={flyer}>チラシ</a></div></div>
        <div className="store" data-close="24"><h3>食彩館 やしろ店<span className="open"></span></h3><div className="addr">福井市若杉4丁目1021 ／ TEL 0776-34-3030</div><div className="hrs"><b>8:00 – 24:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館やしろ店">地図を開く</a><a href={flyer}>チラシ</a></div></div>
        <div className="store" data-close="23"><h3>食彩館 西福井店<span className="open"></span></h3><div className="addr">福井市文京4丁目3-1 ／ TEL 0776-26-6400</div><div className="hrs"><b>8:00 – 23:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館西福井">地図を開く</a><a href={flyer}>チラシ</a></div></div>
        <div className="store" data-close="24"><h3>食彩館 丸岡店<span className="open"></span></h3><div className="addr">坂井市丸岡町羽崎16字25 ／ TEL 0776-67-3771</div><div className="hrs"><b>8:00 – 24:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館丸岡店">地図を開く</a><a href={flyer}>チラシ</a></div></div>
        <div className="store" data-close="24"><h3>食彩館 みくに店<span className="open"></span></h3><div className="addr">坂井市三国町三国東7-513 ／ TEL 0776-81-6670</div><div className="hrs"><b>8:00 – 24:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館みくに">地図を開く</a><a href={flyer}>チラシ</a></div></div>
        <div className="store" data-close="24"><h3>食彩館 東部店<span className="open"></span></h3><div className="addr">福井市成和1丁目3210 ／ TEL 0776-26-1002</div><div className="hrs"><b>8:00 – 24:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館東部店">地図を開く</a><a href={flyer}>チラシ</a></div></div>
      </div>
      </div>
    </div>
  </section>
  
  {/* MEMORIES */}
  <section className="mem pad" id="memories">
    <div className="wrap grid">
      <div className="rv">
        <div className="eyebrow">YOUR MEMORIES</div>
        <h2 style={{fontSize: 'clamp(28px,3.6vw,46px)', lineHeight: '1.45', letterSpacing: '.04em', marginTop: '10px'}}>{lines(c("memories.heading"))}</h2>
        <p style={{color: '#3c3a36', maxWidth: '28em'}}>{c("memories.lead")}</p>
      </div>
      <form className="mem-form rv" id="memForm" noValidate>
        <label htmlFor="mName">お名前（ニックネーム可）<input id="mName" name="name" autoComplete="nickname" placeholder="例：大宮のおばあちゃん子" /></label>
        <label htmlFor="mStore">思い出のお店<select id="mStore" name="store"><option>片町フードセンター・木村屋のころ</option><option>食彩館 大宮店</option><option>食彩館 四ツ居店</option><option>食彩館 やしろ店</option><option>食彩館 西福井店</option><option>食彩館 丸岡店</option><option>食彩館 みくに店</option><option>食彩館 東部店</option></select></label>
        <label htmlFor="mText">思い出<textarea id="mText" name="text" placeholder="いつ、だれと、どんなことがありましたか？"></textarea></label>
        <button type="submit" className="btn btn-mitsu">思い出を届ける</button>
      </form>
    </div>
  </section>
  
  {/* NEWS */}
  <section className="news pad" id="news">
    <div className="wrap">
      <div className="sec-hd"><div><div className="eyebrow">NEWS &amp; JOURNAL</div><h2>{c("news.heading")}</h2></div></div>
      <div className="grid">
        <div className="rv"><h3 className="col">お知らせ</h3><ul>
          <li><a href="https://kimura-group48.jp/news.php?335"><time>2026.09.01</time><span className="tt"><span className="cat">イベント</span>9月のコジカ・週間イベントのご案内</span></a></li>
          <li><a href="https://kimura-group48.jp/news.php?336"><time>2026.08.26</time><span className="tt"><span className="cat">おトク</span>9月のピンクレシートのご案内</span></a></li>
          <li><a href="https://kimura-group48.jp/news.php?314"><time>2026.08.01</time><span className="tt"><span className="cat">会員</span>最大特典付き！オーナーズクラブのご案内</span></a></li>
          <li><a href="https://kimura-group48.jp/news.php?326"><time>2026.07.19</time><span className="tt"><span className="cat">ご予約</span>秋の特製オードブル、ご予約受付中</span></a></li>
        </ul></div>
        <div className="rv"><h3 className="col">社長・スタッフのブログ・レシピ</h3><ul>
          {latest.length > 0 ? (
            latest.map((a) => (
              <li key={a.id}><a href={`/blog/${a.id}`}><time>{dotDate(a.publishedAt)}</time><span className="tt"><span className="cat">{a.type === "ceo" ? "社長" : a.type === "recipe" ? "エリちゃんのレシピ" : a.category}</span>{a.title}{a.author ? ` ― ${a.author}` : ""}</span></a></li>
            ))
          ) : null}
          <li className="more"><a href="/blog"><span className="tt">お店のたより一覧へ →</span></a></li>
        </ul></div>
      </div>
    </div>
  </section>
  
  {/* RECRUIT */}
  <section className="recruit" id="recruit">
    <div className="grid">
      <figure><img src={c("recruit.img")} alt="木村グループのスタッフ" loading="lazy" /></figure>
      <div className="txt rv">
        <div className="eyebrow">RECRUIT</div>
        <h2>{lines(c("recruit.heading"))}</h2>
        <p>{c("recruit.text")}</p>
        <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px'}}><a className="btn btn-mitsu" href="/recruit">採用情報を見る</a><a className="btn btn-ghost" href="/recruit">先輩の声を読む</a><a className="btn btn-ghost" href={TIMEE_URL} target="_blank" rel="noopener noreferrer">タイミーでお試しバイト</a></div>
      </div>
    </div>
  </section>
  
  {/* FINALE FILM */}
  <section className="finale" id="finale" aria-label="今日も、いただきます">
    <img className="poster" src={c("finale.img")} alt="" />
    <video id="finaleFilm" muted playsInline loop preload="none" poster={c("finale.img")}><source src="/img/finale.mp4" type="video/mp4" /></video>
    <div className="in rv">
      <div className="count">1946 — 2026 — </div>
      <h2>{lines(c("finale.heading"))}</h2>
      <p>{c("finale.text")}</p>
      <div className="ctas"><a className="btn btn-mitsu" href="#stores">お近くの食彩館へ</a><button type="button" className="replay js-replay">▶ 記念映像をもう一度</button></div>
    </div>
  </section>
  </main>
  
  <SiteFooter />
      <Script src="/kimura.js" strategy="afterInteractive" />
    </>
  );
}

/** 改行（\n）を <br /> にして表示する */
function lines(text: string): ReactNode {
  const parts = text.split("\n");
  return parts.map((p, i) => (
    <span key={i}>{i > 0 && <br />}{p}</span>
  ));
}

/** 《 》で囲んだ部分に金色の下線（.mk）を付けて表示する */
function rich(text: string): ReactNode {
  return text.split(/(《[^》]*》)/).map((part, i) =>
    part.startsWith("《") && part.endsWith("》") ? <span key={i} className="mk">{part.slice(1, -1)}</span> : <span key={i}>{part}</span>,
  );
}

// スタッフページで登録した「本日のチラシ・お知らせ」。掲載期間内のものだけが渡される
function TodayNotice({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="notice" id="notice" aria-label="本日のチラシ・お知らせ">
      <div className="wrap">
        <div className="notice-hd"><span className="eyebrow">TODAY</span><h2>本日のチラシ・お知らせ</h2></div>
        <ul>
          {posts.map((p) => {
            const images = p.files.filter((f) => f.type !== "application/pdf");
            const pdf = p.files.find((f) => f.type === "application/pdf");
            const isFlyer = p.kind === "flyer";
            const href = isFlyer && p.files.length > 0 ? "/flyer" : p.files.length > 0 ? `/f/${p.files[0].id}` : p.linkUrl || "";
            const external = href.startsWith("http");
            return (
              <li key={p.id} className={p.kind}>
                {images.length > 0 && (
                  <a className="thumbs" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {images.slice(0, 2).map((f) => (
                      <img key={f.id} src={`/f/${f.id}`} alt={p.title} loading="lazy" />
                    ))}
                  </a>
                )}
                <div className="txt">
                  <span className="tag">{isFlyer ? "チラシ" : "お知らせ"}</span>
                  <h3>{p.title}</h3>
                  {p.body && <p>{p.body}</p>}
                  {href && (
                    <a className="go" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {isFlyer ? (images.length === 0 && pdf ? "チラシ（PDF）を開く →" : "チラシを大きく見る →") : "くわしく見る →"}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
