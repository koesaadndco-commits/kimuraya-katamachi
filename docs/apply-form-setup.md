# 応募フォームのメール通知設定（残り作業）

`/recruit` に自社専用の応募フォームを実装済み。コード側は完成しているが、
メール通知を実際に受け取るには、Cloudflareダッシュボードでの設定が**あと1つ**必要。

外部サービス（Resendなど）やAPIキーは不要。Cloudflareの「Email Routing」機能
（以前「ヒーローズワーカー」のときにも使ったもの）だけで完結する。

## 必要な作業（Cloudflareダッシュボード側）

1. [Cloudflareダッシュボード](https://dash.cloudflare.com) → `kimuraya-katamachi.co.jp` のゾーンを選択
2. **Email** → **Email Routing** を開く（未設定なら有効化する）
3. **Destination addresses**（宛先アドレス）で、応募通知を受け取りたい実際の
   メールアドレスを追加する → そのアドレス宛てに確認メールが届くので、
   メール内のリンクをクリックして認証する
4. 認証が完了したら、そのメールアドレスを教えてもらう

## 必要な作業（こちら側・アドレスを聞いたら実施）

1. `wrangler.jsonc` の `"APPLY_NOTIFY_EMAIL": ""` に、認証したメールアドレスを入れる
2. コミット・プッシュ → 自動的に再デプロイされ、フォームからの応募が
   そのメールアドレスに届くようになる

## 仕組み

- フォーム送信 → `/api/apply`（Next.js API route）→ Cloudflareの
  `send_email` バインディング（`env.EMAIL.send()`）でメール送信
- 送信元：`no-reply@kimuraya-katamachi.co.jp`（ドメインがCloudflare DNS管理下にあるため追加設定不要）
- 送信先：`APPLY_NOTIFY_EMAIL` 環境変数で指定した認証済みアドレス
- 料金：Email Routingの認証済み宛先への送信は無料（Workers Free/Paid共通）
