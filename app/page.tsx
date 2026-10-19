import type { Metadata } from "next";
import Script from "next/script";
import "./kimura.css";

export const metadata: Metadata = {
  title: "木村グループ｜ハニー食彩館 — ありがとうの、八十年。",
  description:
    "昭和21年、福井の小さな食料品店「木村屋」から。ハニー食彩館を営む木村グループのトップページ提案サンプル（v4）。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Home() {
  return (
    <>
  <div className="theater" id="theater" role="dialog" aria-modal="true" aria-label="創業八十周年記念映像">
    <div className="th-glow"></div><div className="th-grain"></div>
    <video className="th-film" id="thFilm" playsInline preload="auto" poster="/img/archive-1946.jpg"><source src="/img/film.mp4" type="video/mp4" /></video>
    <div className="th-pre" id="thPre">
      <div className="th-kicker">1946 — 2026</div>
      <div className="th-sub">木村グループ　創業八十周年記念映像</div>
      <div className="th-title">ありがとうの、八十年。</div>
      <div className="th-rule"></div>
      <div className="th-actions">
        <button type="button" className="th-play" id="thPlay"><i></i>音声つきで上映する　<span style={{opacity: '.6', fontSize: '12px'}}>40秒</span></button>
        <button type="button" className="th-skip" id="thSkip">映像をとばしてサイトへ</button>
      </div>
    </div>
    <div className="th-ctrl" id="thCtrl"><button type="button" id="thMute">音を消す</button><button type="button" id="thEnd">スキップ ›</button></div>
    <div className="th-bar" id="thBar"></div>
    <div className="th-note">※映像・写真はAIによるイメージです（提案用サンプル）</div>
  </div>
  
  <div className="ribbon">提案用トップページ・デザインサンプル v4 <b>／</b> 株式会社KOESA　※写真・映像はAI生成のイメージです（本番では御社の写真・映像に差し替えます）</div>
  
  <header className="site" id="hdr">
    <div className="wrap hd">
      <a className="logo" href="#top" aria-label="木村グループ ホーム">
        <span className="mark">木</span>
        <span><span className="t1">木村グループ</span><br /><span className="t2">HONEY 食彩館</span></span>
      </a>
      <nav className="gnav" aria-label="メインメニュー">
        <a href="#promise">私たちの約束</a>
        <a href="#story">80年の物語</a>
        <a href="#fukui">福井の恵み</a>
        <a href="#dinner">今日の献立</a>
        <a href="#stores">店舗一覧</a>
        <a href="/recruit">採用情報</a>
      </nav>
      <a className="btn btn-mitsu" href="#quick">今日のチラシ</a>
      <button className="menu-btn" type="button" aria-label="メニューを開く">MENU</button>
    </div>
  </header>
  
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
      <audio id="narr" preload="auto" src="/img/narration.wav"></audio>
      <div className="xp-copy" id="xpCopy">
        <div className="wrap">
          <div className="year"><i></i>昭和二十一年 → 令和八年</div>
          <h2>あの日の「いらっしゃい」から、<br />今日の「ありがとう」まで。</h2>
          <p>戦後まもない福井の町に、小さな食料品店「木村屋」が生まれました。八十年たった今も、私たちはこの町の台所です。</p>
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
      <li><a href="https://kimura-group48.jp/flyer.php"><svg viewBox="0 0 28 28"><rect x="5" y="3" width="18" height="22" rx="1"/><path d="M9 9h10M9 13h10M9 17h6"/></svg><span><span className="k">今日のチラシ</span><br /><span className="s">スマホで見やすく毎朝更新</span></span></a></li>
      <li><a href="#stores"><svg viewBox="0 0 28 28"><path d="M14 25s8-7.5 8-13.5A8 8 0 0 0 6 11.5C6 17.5 14 25 14 25z"/><circle cx="14" cy="11.5" r="3"/></svg><span><span className="k">店舗を探す</span><br /><span className="s">福井市・坂井市 7店舗</span></span></a></li>
      <li className="uber"><a href="#quick"><svg viewBox="0 0 28 28"><path d="M4 9h15l-1.5 10h-12z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/><path d="M20 13h4M21 17h3"/></svg><span><span className="k">お届け注文</span><br /><span className="s">Uber Eatsでお家まで</span></span></a></li>
      <li><a href="#goods"><svg viewBox="0 0 28 28"><rect x="4" y="6" width="20" height="18" rx="1"/><path d="M4 11h20M9 3v5M19 3v5M9 16h3M16 16h3M9 20h3"/></svg><span><span className="k">オードブル予約</span><br /><span className="s">ネットで24時間受付</span></span></a></li>
      <li><a href="https://lin.ee/rNifBeB"><svg viewBox="0 0 28 28"><path d="M14 5C8 5 3.5 8.8 3.5 13.4c0 4.1 3.6 7.5 8.5 8.2l-.6 3 4.2-2.8c5.4-.4 9.9-4 9.9-8.4C25.5 8.8 20 5 14 5z"/></svg><span><span className="k">LINE友だち</span><br /><span className="s">お得な情報をいち早く</span></span></a></li>
    </ul>
  </nav>
  
  {/* MANIFESTO: reading reveal */}
  <section className="read" id="promise">
    <div className="read-stage">
      <div className="big80" aria-hidden="true">80</div>
      <div className="wrap read-in">
        <div>
          <div className="eyebrow">OUR PROMISE</div>
          <p className="read-text" id="readText">「おいしかったよ」のひとことのために、<span className="mk">今日も朝いちばんに</span>売り場に立つ。私たちが売っているのは、食材だけではありません。福井の家族の、<span className="mk">今日の晩ごはんの時間</span>です。</p>
          <div className="read-sign"><span>経営理念</span><b>食を通じて、ありがとうの溢れる豊かな社会を実現する</b></div>
        </div>
        <div className="read-side">
          <figure><img src="/img/morning.jpg" alt="開店前、青果売り場でトマトを並べるスタッフ" id="readImg" /></figure>
          <figcaption>開店前の青果売り場（イメージ）</figcaption>
        </div>
      </div>
    </div>
  </section>
  
  {/* STORY: sticky horizontal */}
  <section className="hs" id="story">
    <div className="hs-stage">
      <div className="wrap hs-hd">
        <div><div className="eyebrow">OUR STORY · 1946 — 2026</div><h2>木村屋から、ハニー食彩館へ。</h2></div>
        <div className="hs-count" id="hsYear" aria-hidden="true">1946</div>
      </div>
      <div className="hs-track" id="hsTrack">
        <article className="hs-card" data-y="1946"><div className="ph"><img src="/img/old-shop.jpg" alt="戦後の小さな食料品店（イメージ）" loading="lazy" /></div><div className="era"><b>昭和21年</b><span>1946</span></div><h3>食料品店「木村屋」創業</h3><p>戦後の福井で、町の人の暮らしを支える小さな店として始まりました。</p></article>
        <article className="hs-card" data-y="1965"><div className="ph"><img src="/img/old-opening.jpg" alt="昭和のスーパーマーケット開店日（イメージ）" loading="lazy" /></div><div className="era"><b>昭和40年</b><span>1965</span></div><h3>株式会社片町フードセンター設立</h3><p>対面販売から、セルフサービスのスーパーマーケットへ。</p></article>
        <article className="hs-card" data-y="1971"><div className="ph type">昭和46</div><div className="era"><b>昭和46年</b><span>1971</span></div><h3>株式会社松本フードセンター設立</h3><p>地域に根ざした店づくりを広げていきました。</p></article>
        <article className="hs-card" data-y="1983"><div className="ph"><img src="/img/hands.jpg" alt="惣菜づくり（イメージ）" loading="lazy" /></div><div className="era"><b>昭和58年</b><span>1983</span></div><h3>株式会社木村フーズ設立</h3><p>惣菜と精肉を自社で供給。手づくりの味を毎日の食卓へ。</p></article>
        <article className="hs-card" data-y="1986"><div className="ph type">足羽</div><div className="era"><b>昭和61年</b><span>1986</span></div><h3>ハニー足羽店 開店</h3><p>協同組合ハニーの中核企業として、店舗展開が始まります。</p></article>
        <article className="hs-card" data-y="1995"><div className="ph type">食彩館</div><div className="era"><b>平成7年〜</b><span>1995 —</span></div><h3>「食彩館」の時代へ</h3><p>みくに店を皮切りに、丸岡・四ツ居・大宮・東部・西福井・やしろへ。</p></article>
        <article className="hs-card" data-y="2026"><div className="ph now"><img src="/img/register.jpg" alt="レジでお客様に袋を手渡すスタッフ（イメージ）" loading="lazy" /></div><div className="era"><b>令和8年</b><span>2026</span></div><h3>創業80年。次の100年へ。</h3><p>経営力・管理者力・現場力。三位一体で、100年ビジョンの実現へ歩みます。</p></article>
      </div>
      <div className="wrap"><div className="hs-prog"><i id="hsProg"></i></div></div>
    </div>
  </section>
  
  {/* FUKUI: sticky wipe gallery */}
  <section className="wg" id="fukui" aria-label="福井の恵み">
    <div className="wg-stage">
      <div className="wg-slide"><img src="/img/fields.jpg" alt="朝もやの田んぼと白山を望む福井の風景（イメージ）" loading="lazy" /></div>
      <div className="wg-slide"><img src="/img/crab.jpg" alt="越前の鮮魚（イメージ）" loading="lazy" /></div>
      <div className="wg-slide"><img src="/img/table.jpg" alt="家族で囲む夕食の食卓（イメージ）" loading="lazy" /></div>
      <div className="wg-shade"></div>
      <div className="wg-copy"><div className="wrap">
        <div className="eyebrow">FROM FUKUI</div>
        <div className="wg-titles" id="wgTitles"><span>九頭竜の、田んぼから。</span><span className="in">越前の、海から。</span><span className="in">そして、あなたの食卓へ。</span></div>
        <p className="wg-sub" id="wgSub">福井の恵みを知りつくした目利きが、毎朝売り場に並べます。</p>
        <div className="wg-dots" id="wgDots"><i className="on"></i><i></i><i></i></div>
      </div></div>
    </div>
  </section>
  
  <div className="goods-wrap" id="goods"><div className="wrap goods">
    <a className="good rv" href="#goods"><div className="ph"><img src="/img/crab.jpg" alt="越前の鮮魚（イメージ）" loading="lazy" /></div><div className="t"><b>越前の鮮魚</b><span>港から、その日のうちに</span></div></a>
    <a className="good rv" href="#goods"><div className="ph"><img src="/img/hands.jpg" alt="手づくり惣菜（イメージ）" loading="lazy" /></div><div className="t"><b>手づくり惣菜</b><span>木村フーズの台所から</span></div></a>
    <a className="good rv" href="#goods"><div className="ph"><img src="/img/table.jpg" alt="特製オードブル（イメージ）" loading="lazy" /></div><div className="t"><b>特製オードブル</b><span>ネットで予約・店頭で受取</span></div></a>
    <a className="good rv" href="#goods"><div className="ph"><img src="/img/fields.jpg" alt="ふくいの特産（イメージ）" loading="lazy" /></div><div className="t"><b>ふくいの贈りもの</b><span>オンラインショップ［準備中］</span></div></a>
  </div></div>
  
  {/* DINNER PICKER */}
  <section className="dinner pad" id="dinner">
    <div className="wrap grid">
      <div className="rv">
        <div className="eyebrow">TONIGHT&apos;S TABLE</div>
        <h2 style={{fontSize: 'clamp(28px,3.6vw,46px)', lineHeight: '1.45', letterSpacing: '.04em', marginTop: '10px'}}>今日の晩ごはん、<br />なににしよう？</h2>
        <p style={{color: '#3c3a36', maxWidth: '26em'}}>いまの気分を選ぶと、食彩館でそろう献立をご提案します。毎日の「困った」に、いちばん近い台所から。</p>
        <div className="chips" role="group" aria-label="今日の気分">
          <button type="button" className="chip" data-k="warm" aria-pressed="true">あったまりたい</button>
          <button type="button" className="chip" data-k="fresh" aria-pressed="false">さっぱりしたい</button>
          <button type="button" className="chip" data-k="feast" aria-pressed="false">ごちそうの日</button>
          <button type="button" className="chip" data-k="quick" aria-pressed="false">10分で済ませたい</button>
        </div>
        <p className="note-s">［サンプル］本番では、その日のチラシのお買い得品と連動して毎朝更新できます。</p>
      </div>
      <article className="dish rv" id="dish" aria-live="polite">
        <div className="ph"><img id="dishImg" src="/img/table.jpg" alt="" /></div>
        <div className="bd">
          <div className="tag" id="dishTag">あったまりたい夜に</div>
          <h3 id="dishName">秋鮭と根菜の粕汁</h3>
          <p id="dishText">脂ののった秋鮭と、大根・人参・ごぼう。酒粕でコクを足せば、体の芯からぽかぽかに。</p>
          <ul id="dishList"><li><b>鮮魚</b>秋鮭</li><li><b>青果</b>大根・人参・ごぼう</li><li><b>日配</b>酒粕・油揚げ</li></ul>
          <a className="go" href="https://kimura-group48.jp/flyer.php">今日のチラシでお買い得をチェック →</a>
        </div>
      </article>
    </div>
  </section>
  
  {/* PRESIDENT */}
  <section className="pres pad" id="message">
    <div className="wrap grid">
      <div className="screen rv">
        <img src="/img/morning.jpg" alt="" loading="lazy" />
        <span className="tag">毎月配信</span>
        <div className="play"><i><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></i><span style={{fontFamily: 'var(--mincho)', fontSize: '18px', letterSpacing: '.1em'}}>社長メッセージ　令和8年9月号</span><span style={{fontSize: '12px', color: '#d6d0c4'}}>［社長メッセージ動画をここに配信］</span></div>
      </div>
      <div className="rv">
        <div className="eyebrow">MESSAGE FROM THE PRESIDENT</div>
        <blockquote>お客様、社員さん、取引業者さん、<br />そして地域のみなさまから<br />喜ばれる店でありたい。</blockquote>
        <p className="body">当社は食料品木村屋として創業以来、この想いで商いを続けてきました。「食」という普遍的なテーマを、時代の変化に合わせて追求し続けます。</p>
        <div className="pillars"><div><b>経営力</b><span>次の100年を描く</span></div><div><b>管理者力</b><span>人を育て、店を磨く</span></div><div><b>現場力</b><span>今日の一品に心を込める</span></div></div>
        <div className="who">代表取締役社長<b>木村 博常</b></div>
      </div>
    </div>
  </section>
  
  {/* PEOPLE: marquee */}
  <section className="people pad">
    <div className="wrap">
      <div className="sec-hd"><div><div className="eyebrow">PEOPLE</div><h2>売り場には、<br />名前のある人がいる。</h2></div><a className="btn btn-line" href="/recruit">スタッフの声をもっと読む</a></div>
      <div className="people-photos">
        <figure className="rv"><img src="/img/register.jpg" alt="レジで笑顔で接客するスタッフ（イメージ）" loading="lazy" /><figcaption>（イメージ）</figcaption></figure>
        <figure className="rv"><img src="/img/hands.jpg" alt="惣菜をつくる手（イメージ）" loading="lazy" /><figcaption>（イメージ）</figcaption></figure>
        <figure className="rv"><img src="/img/morning.jpg" alt="青果を並べるスタッフ（イメージ）" loading="lazy" /><figcaption>（イメージ）</figcaption></figure>
      </div>
    </div>
    <div className="mq" aria-label="スタッフの声">
      <div className="mq-row">
        <div className="vc"><q>落ち込む日もあるけれど、その何倍もの「ありがとう」で、また笑顔になれるんです。</q><div className="who"><i>レ</i>レジチーフ ／ 平成22年入社</div></div>
        <div className="vc"><q>仕入れた野菜を、次の日に「おいしかった」と言ってもらえた。やっててよかった、と思いました。</q><div className="who"><i>青</i>青果チーフ ／ 平成8年入社</div></div>
        <div className="vc"><q>一品一品に愛情をこめて。気軽に声をかけてくださいね。</q><div className="who"><i>惣</i>惣菜担当 ／ 平成20年入社</div></div>
        <div className="vc"><q>お客様の「おはようございます」や「いつも大変だね」の声に、毎日励まされています。</q><div className="who"><i>店</i>店長 ／ 平成12年入社</div></div>
        <div className="vc"><q>頑張った分だけ売上が伸びる。売り場づくりには、とてもやりがいがあります。</q><div className="who"><i>副</i>副店長 ／ 平成22年入社</div></div>
        <div className="vc"><q>良い商品と笑顔の接客で、地域のお客様に喜んでいただけることがやりがいです。</q><div className="who"><i>パ</i>パン担当・レジチーフ ／ 平成26年入社</div></div>
        <div className="vc" aria-hidden="true"><q>落ち込む日もあるけれど、その何倍もの「ありがとう」で、また笑顔になれるんです。</q><div className="who"><i>レ</i>レジチーフ ／ 平成22年入社</div></div>
        <div className="vc" aria-hidden="true"><q>仕入れた野菜を、次の日に「おいしかった」と言ってもらえた。やっててよかった、と思いました。</q><div className="who"><i>青</i>青果チーフ ／ 平成8年入社</div></div>
        <div className="vc" aria-hidden="true"><q>一品一品に愛情をこめて。気軽に声をかけてくださいね。</q><div className="who"><i>惣</i>惣菜担当 ／ 平成20年入社</div></div>
        <div className="vc" aria-hidden="true"><q>お客様の「おはようございます」や「いつも大変だね」の声に、毎日励まされています。</q><div className="who"><i>店</i>店長 ／ 平成12年入社</div></div>
        <div className="vc" aria-hidden="true"><q>頑張った分だけ売上が伸びる。売り場づくりには、とてもやりがいがあります。</q><div className="who"><i>副</i>副店長 ／ 平成22年入社</div></div>
        <div className="vc" aria-hidden="true"><q>良い商品と笑顔の接客で、地域のお客様に喜んでいただけることがやりがいです。</q><div className="who"><i>パ</i>パン担当・レジチーフ ／ 平成26年入社</div></div>
      </div>
    </div>
  </section>
  
  {/* STORES */}
  <section className="stores pad" id="stores">
    <div className="wrap">
      <div className="sec-hd"><div><div className="eyebrow">STORES</div><h2>いつもの店が、<br />あなたの近くに。</h2></div><p style={{margin: '0', color: 'var(--hai)', maxWidth: '26em'}}>すべて年中無休。いまの営業状況を表示しています。</p></div>
      <div className="store-grid">
      <div className="map rv" id="map" aria-label="店舗マップ（福井市・坂井市）"><svg id="mapSvg" viewBox="0 0 480 600" role="img" aria-label="福井市・坂井市の食彩館7店舗の位置"></svg>
        <div className="map-tools"><button type="button" id="nearBtn">現在地から近い店を探す</button><span id="nearOut"></span></div>
      </div>
      <div className="store-list one" id="storeList">
        <div className="store" data-close="24"><h3>食彩館 大宮店<span className="open"></span></h3><div className="addr">福井市大宮6丁目5-5 ／ TEL 0776-27-1194</div><div className="hrs"><b>8:00 – 24:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps?cid=698264289893347059">地図を開く</a><a href="https://kimura-group48.jp/flyer.php">チラシ</a></div></div>
        <div className="store" data-close="22"><h3>食彩館 四ツ居店<span className="open"></span></h3><div className="addr">福井市北四ツ居1-9-1 ／ TEL 0776-53-5535</div><div className="hrs"><b>8:00 – 22:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館四ツ居店">地図を開く</a><a href="https://kimura-group48.jp/flyer.php">チラシ</a></div></div>
        <div className="store" data-close="24"><h3>食彩館 やしろ店<span className="open"></span></h3><div className="addr">福井市若杉4丁目1021 ／ TEL 0776-34-3030</div><div className="hrs"><b>8:00 – 24:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館やしろ店">地図を開く</a><a href="https://kimura-group48.jp/flyer.php">チラシ</a></div></div>
        <div className="store" data-close="23"><h3>食彩館 西福井店<span className="open"></span></h3><div className="addr">福井市文京4丁目3-1 ／ TEL 0776-26-6400</div><div className="hrs"><b>8:00 – 23:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館西福井">地図を開く</a><a href="https://kimura-group48.jp/flyer.php">チラシ</a></div></div>
        <div className="store" data-close="24"><h3>食彩館 丸岡店<span className="open"></span></h3><div className="addr">坂井市丸岡町羽崎16字25 ／ TEL 0776-67-3771</div><div className="hrs"><b>8:00 – 24:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館丸岡店">地図を開く</a><a href="https://kimura-group48.jp/flyer.php">チラシ</a></div></div>
        <div className="store" data-close="24"><h3>食彩館 みくに店<span className="open"></span></h3><div className="addr">坂井市三国町三国東7-513 ／ TEL 0776-81-6670</div><div className="hrs"><b>8:00 – 24:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館みくに">地図を開く</a><a href="https://kimura-group48.jp/flyer.php">チラシ</a></div></div>
        <div className="store" data-close="24"><h3>食彩館 東部店<span className="open"></span></h3><div className="addr">福井市成和1丁目3210 ／ TEL 0776-26-1002</div><div className="hrs"><b>8:00 – 24:00</b><span>年中無休</span></div><div className="links"><a href="https://www.google.com/maps/search/?api=1&amp;query=ハニー食彩館東部店">地図を開く</a><a href="https://kimura-group48.jp/flyer.php">チラシ</a></div></div>
      </div>
      </div>
    </div>
  </section>
  
  {/* MEMORIES */}
  <section className="mem pad" id="memories">
    <div className="wrap grid">
      <div className="rv">
        <div className="eyebrow">YOUR MEMORIES</div>
        <h2 style={{fontSize: 'clamp(28px,3.6vw,46px)', lineHeight: '1.45', letterSpacing: '.04em', marginTop: '10px'}}>あなたの<br />「食彩館の思い出」を<br />聞かせてください。</h2>
        <p style={{color: '#3c3a36', maxWidth: '28em'}}>母と通った片町フードセンター。部活帰りのコロッケ。はじめてのおつかい。80年のあいだに、この町の人たちとつくってきた思い出を、次の世代へつなぎます。</p>
        <div className="mem-cards">
          <div className="mem-card"><div className="ph">［お客様から届いた思い出を、ここに掲載します］</div><div className="meta">— 掲載イメージ</div></div>
          <div className="mem-card"><div className="ph">［写真つきの投稿も掲載できます］</div><div className="meta">— 掲載イメージ</div></div>
        </div>
      </div>
      <form className="mem-form rv" id="memForm" noValidate>
        <label htmlFor="mName">お名前（ニックネーム可）<input id="mName" name="name" autoComplete="nickname" placeholder="例：大宮のおばあちゃん子" /></label>
        <label htmlFor="mStore">思い出のお店<select id="mStore" name="store"><option>片町フードセンター・木村屋のころ</option><option>食彩館 大宮店</option><option>食彩館 四ツ居店</option><option>食彩館 やしろ店</option><option>食彩館 西福井店</option><option>食彩館 丸岡店</option><option>食彩館 みくに店</option><option>食彩館 東部店</option></select></label>
        <label htmlFor="mText">思い出<textarea id="mText" name="text" placeholder="いつ、だれと、どんなことがありましたか？"></textarea></label>
        <button type="submit" className="btn btn-mitsu">思い出を届ける</button>
        <p className="note-s" style={{margin: '0'}}>［サンプル］本番では投稿を管理画面で確認してから掲載します。</p>
      </form>
    </div>
  </section>
  
  {/* NEWS */}
  <section className="news pad" id="news">
    <div className="wrap">
      <div className="sec-hd"><div><div className="eyebrow">NEWS &amp; JOURNAL</div><h2>お店から、今日のたより。</h2></div></div>
      <div className="grid">
        <div className="rv"><h3 className="col">お知らせ</h3><ul>
          <li><a href="https://kimura-group48.jp/news.php?335"><time>2026.09.01</time><span className="tt"><span className="cat">イベント</span>9月のコジカ・週間イベントのご案内</span></a></li>
          <li><a href="https://kimura-group48.jp/news.php?336"><time>2026.08.26</time><span className="tt"><span className="cat">おトク</span>9月のピンクレシートのご案内</span></a></li>
          <li><a href="https://kimura-group48.jp/news.php?314"><time>2026.08.01</time><span className="tt"><span className="cat">会員</span>最大特典付き！オーナーズクラブのご案内</span></a></li>
          <li><a href="https://kimura-group48.jp/news.php?326"><time>2026.07.19</time><span className="tt"><span className="cat">ご予約</span>秋の特製オードブル、ご予約受付中</span></a></li>
        </ul></div>
        <div className="rv"><h3 className="col">社長・スタッフのブログ</h3><ul>
          <li><a href="#news"><time>［日付］</time><span className="tt"><span className="cat">社長</span>［社長ブログのタイトル］</span></a></li>
          <li><a href="#news"><time>［日付］</time><span className="tt"><span className="cat">青果</span>［今が旬の福井の野菜 ― 青果チーフより］</span></a></li>
          <li><a href="#news"><time>［日付］</time><span className="tt"><span className="cat">惣菜</span>［今週の手づくり惣菜 ― 惣菜担当より］</span></a></li>
          <li><a href="#news"><time>［日付］</time><span className="tt"><span className="cat">店舗</span>［店長のひとこと ― 大宮店より］</span></a></li>
        </ul></div>
      </div>
    </div>
  </section>
  
  {/* RECRUIT */}
  <section className="recruit" id="recruit">
    <div className="grid">
      <figure><img src="/img/team-recruit.jpg" alt="経営陣・幹部の集合写真" loading="lazy" /></figure>
      <div className="txt rv">
        <div className="eyebrow">RECRUIT</div>
        <h2>「ありがとう」を、<br />仕事にしよう。</h2>
        <p>「また明日ね」と笑顔で言い合える職場を、一緒につくりませんか。正社員・パート・アルバイトを募集しています。</p>
        <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px'}}><a className="btn btn-mitsu" href="/recruit">採用情報を見る</a><a className="btn btn-ghost" href="/recruit">先輩の声を読む</a></div>
      </div>
    </div>
  </section>
  
  {/* FINALE FILM */}
  <section className="finale" id="finale" aria-label="今日も、いただきます">
    <img className="poster" src="/img/family.jpg" alt="" />
    <video id="finaleFilm" muted playsInline loop preload="none" poster="/img/family.jpg"><source src="/img/finale.mp4" type="video/mp4" /></video>
    <div className="in rv">
      <div className="count">1946 — 2026 — </div>
      <h2>今日も、<br />いただきます。</h2>
      <p>八十年分の「ありがとう」をこめて。これからも、福井の台所であり続けます。</p>
      <div className="ctas"><a className="btn btn-mitsu" href="#stores">お近くの食彩館へ</a><button type="button" className="replay js-replay">▶ 記念映像をもう一度</button></div>
    </div>
  </section>
  </main>
  
  <footer>
    <div className="wrap">
      <div className="grid">
        <div>
          <a className="logo" href="#top"><span className="mark">木</span><span><span className="t1">木村グループ</span><br /><span className="t2">HONEY 食彩館</span></span></a>
          <p style={{marginTop: '18px', lineHeight: '2'}}>〒910-0016 福井県福井市大宮6丁目5-5<br />協同組合ハニー加盟</p>
        </div>
        <ul><li><a href="#promise">私たちの約束</a></li><li><a href="#story">80年の物語</a></li><li><a href="#fukui">福井の恵み</a></li><li><a href="#stores">店舗一覧</a></li></ul>
        <ul><li><a href="#news">お知らせ・ブログ</a></li><li><a href="/recruit">採用情報</a></li><li><a href="https://kimura-group48.jp/contact.php">お問い合わせ</a></li><li><a href="#top">プライバシーポリシー</a></li></ul>
      </div>
      <div className="copy"><span>© 2026 木村グループ</span><span>Design sample by KOESA Co.,Ltd. — AI SOLUTION STUDIO</span></div>
    </div>
  </footer>
      <Script src="/kimura.js" strategy="afterInteractive" />
    </>
  );
}
