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
// ロゴは public/img/logo/honey-logo.png に保存し、HONEY_LOGO にそのパスを入れる。
export const HONEY_URL = "";
export const HONEY_LOGO = "";
