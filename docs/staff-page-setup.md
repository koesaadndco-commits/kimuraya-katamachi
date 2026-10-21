# スタッフ専用ページ（本日のチラシ・お知らせ）の設定

`/staff` に、スタッフだけが入れる「本日のチラシ・お知らせ」の設定ページを実装済み。
コード側は完成しているが、使い始めるには Cloudflare ダッシュボードで
**パスワードの設定があと1つ**必要。

## できること（/staff）

- パスワードでログイン（ログイン状態は30日間保持）
- 「チラシ」または「お知らせ・情報」を登録
  - タイトル（必須）、本文、チラシの画像（JPEG/PNG/WebP）または PDF（10MBまで）、リンクURL
  - **掲載開始・掲載終了の日時**（必須）
- 登録済み一覧（掲載中／掲載予定／掲載終了のラベル付き）と削除

## 公開ページへの反映

- 掲載期間内のものだけがホームページに出る。**掲載終了の日時を過ぎると自動的に消える**（操作不要）
- ホームの「よく使うメニュー」直下に「本日のチラシ・お知らせ」ブロックが出る（掲載中のものが無ければブロック自体が出ない）
- ホーム各所の「今日のチラシ」リンク（ヘッダー・ヒーロー・メニュー・今夜の献立・店舗一覧）は、
  掲載中のチラシがあればそのチラシ（画像/PDF）に、無ければ従来どおり外部の
  `kimura-group48.jp/flyer.php` に飛ぶ
- 掲載中のチラシが複数あるときは、掲載開始が新しいものがリンク先になる

## 必要な作業（Cloudflareダッシュボード側）

1. [Cloudflareダッシュボード](https://dash.cloudflare.com) → **Workers & Pages** → `kimuraya-katamachi`
2. **Settings** → **Variables and Secrets** → **Add**
3. Type を **Secret**、Variable name を `STAFF_PASSWORD`、Value にスタッフ用のパスワードを入れて **Deploy**
4. `https://kimuraya-katamachi.co.jp/staff` を開き、そのパスワードでログインできれば完了

パスワードを変えると、ログイン中のスタッフは全員ログアウトになる（再ログインすればよい）。

## 仕組み

- 保存先：Cloudflare KV（`wrangler.jsonc` の `STAFF_KV`、namespace `kimuraya-katamachi-staff`）。作成済み
- 登録内容は `posts` キーに JSON、アップロードした画像/PDF は `file:<id>` キーに保存
- 配信：`/f/<id>`（`app/f/[id]/route.ts`）
- 認証：`STAFF_PASSWORD` と照合し、パスワードから導出したトークンを HttpOnly Cookie に保存（`app/lib/staff-auth.ts`）
- ローカル開発：`.dev.vars` に `STAFF_PASSWORD=任意` を書けば `npm run dev` でそのまま動く（KV はローカルの擬似ストレージ）

## スポットバイトについて

- マイチームのスポットバイトは別で制作し、約2ヶ月後にこのサイトへ繋ぐ予定
- それまでは、ホームの RECRUIT セクションと `/recruit` の「スポットバイト（お試し）」にタイミーのボタンを置いている
- リンク先は `app/lib/links.ts` の `TIMEE_URL`。現在はタイミー公式トップ。**店舗専用の募集URLが決まったらここを差し替える**
