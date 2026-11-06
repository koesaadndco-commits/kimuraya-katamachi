// 外部リンクの一元管理

// 本番ドメイン（sitemap・OGP・構造化データの絶対URL生成に使う）
export const SITE_URL = "https://kimuraya-katamachi.co.jp";

// 「今日のチラシ」の既定リンク。スタッフページでチラシが掲載中のときは
// そちらが優先され、掲載が無いときはこの外部ページに飛ぶ。
// （旧）外部のチラシページ。サイト内で完結させるため、現在は使っていない
export const DEFAULT_FLYER_URL = "https://kimura-group48.jp/flyer.php";

// スポットバイト：当面はタイミーの「お試しバイト」に誘導する。
// マイチームのスポットバイト（別途制作・約2ヶ月後）が出来たら、ここを差し替える。
// ※店舗専用の募集ページURLが決まり次第、このURLを置き換える。
export const TIMEE_URL = "https://timee.co.jp/";

// 公式Instagram（ハニー食彩館）
export const INSTAGRAM_URL = "https://www.instagram.com/honey_syokusaikan/";

// お問い合わせ・採用応募の受付メールアドレス（フォームの通知先は wrangler.jsonc の *_NOTIFY_EMAIL）
export const CONTACT_EMAIL = "info@kimura-group48.jp";

// 協同組合ハニー（本部）の公式サイトURLとロゴ。URLが空のあいだは文字だけを表示する。
// ロゴはウィキメディア・コモンズの「Honey logo.png」を public/img/logo/honey-logo.png に保存（URLはWikipediaの記載より）
export const HONEY_URL = "http://www.honey.jp/";
export const HONEY_LOGO = "/img/logo/honey-logo.png";

// ナポリの窯 やしろ店（木村グループがフランチャイズで運営。食彩館やしろ店の北側駐車場内）
// 店舗ページ・ロゴはナポリの窯公式サイトより。Instagramはやしろ店のアカウント（ご指定）
export const NAPOLI = {
  name: "ナポリの窯 やしろ店",
  url: "https://www.napolipizza.jp/store/2302/",
  instagram: "https://www.instagram.com/naporino_kama/",
  // 配達（Uber Eats のやしろ店ページ）
  delivery: "https://www.ubereats.com/jp/store/%E3%83%8A%E3%83%9B%E3%83%AA%E3%81%AE%E7%AA%AF-%E3%82%84%E3%81%97%E3%82%8D%E5%BA%97/A1mHJHuKUVyTjkBBZQlUew",
  logo: "/img/logo/napoli-logo.svg",
  addr: "福井市若杉4-1021（食彩館やしろ店 北側駐車場内）",
  tel: "0776-50-7550",
  hours: "10:00〜21:00（L.O. 20:30）",
};

// 代表取締役社長 木村 博常 のお写真（沿革の年表・ごあいさつで使用。トップの社長メッセージ欄は site-content の message.img）
export const PRESIDENT_PHOTO = "/img/president-fist.webp";
