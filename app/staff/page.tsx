import type { Metadata } from "next";
import "../kimura.css";
import "./staff.css";
import { getStaffPassword, isStaffLoggedIn } from "../lib/staff-auth";
import { formatJst, listPosts, nowJst, postStatus, type Post } from "../lib/staff-store";
import { createPost, login, logout } from "./actions";
import DeleteForm from "./DeleteForm";

export const metadata: Metadata = {
  title: "スタッフ専用｜本日のチラシ・お知らせ設定",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  password: "パスワードが違います。",
  login: "ログインの有効期限が切れました。もう一度ログインしてください。",
  title: "タイトルを入力してください。",
  period: "掲載開始・終了の日時を入力してください。",
  period_order: "掲載終了は掲載開始より後の日時にしてください。",
  url: "リンクURLは http:// または https:// から始めてください。",
  file_type: "ファイルは JPEG・PNG・WebP の画像、または PDF のみ登録できます。",
  file_size: "ファイルサイズは 10MB 以内にしてください。",
};

const STATUS_LABEL = { live: "掲載中", scheduled: "掲載予定", ended: "掲載終了" } as const;
const KIND_LABEL = { flyer: "チラシ", info: "お知らせ" } as const;

type Search = Record<string, string | string[] | undefined>;

export default async function StaffPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? ERRORS[sp.error] : undefined;
  const saved = sp.saved === "1";
  const deleted = sp.deleted === "1";

  const password = await getStaffPassword();
  if (!password) return <NotConfigured />;

  if (!(await isStaffLoggedIn())) return <Login error={error} />;

  const now = nowJst();
  const posts = await listPosts();
  const today = now.slice(0, 10);

  return (
    <div className="st">
      <div className="inner">
        <div className="st-head">
          <div>
            <h1>スタッフ専用：本日のチラシ・お知らせ</h1>
            <div className="sub">ここで登録した内容が、ホームページの「今日のチラシ」と「本日のお知らせ」に表示されます（日本時間 {formatJst(now)} 現在）</div>
          </div>
          <form action={logout}><button type="submit" className="st-btn ghost">ログアウト</button></form>
        </div>

        {error && <div className="st-msg err">{error}</div>}
        {saved && <div className="st-msg">登録しました。掲載期間内であれば、ホームページにすぐ反映されます。</div>}
        {deleted && <div className="st-msg">削除しました。</div>}

        <section className="st-card">
          <h2>新しく登録する</h2>
          <form action={createPost} className="st-form">
            <div className="st-kind" role="radiogroup" aria-label="種類">
              <label><input type="radio" name="kind" value="flyer" defaultChecked /> チラシ</label>
              <label><input type="radio" name="kind" value="info" /> お知らせ・情報</label>
            </div>
            <label>タイトル <small>（必須）</small>
              <input type="text" name="title" required maxLength={80} placeholder="例：10月21日（火）本日のチラシ／本日は鮮魚が大特価" />
            </label>
            <label>本文 <small>（任意）</small>
              <textarea name="body" maxLength={1000} placeholder="例：今日のおすすめ・営業時間の変更などを自由に書けます" />
            </label>
            <label>チラシの画像・PDF <small>（任意／JPEG・PNG・WebP・PDF、10MBまで）</small>
              <input type="file" name="file" accept="image/jpeg,image/png,image/webp,application/pdf" />
            </label>
            <label>リンクURL <small>（任意／外部のチラシページなどに飛ばしたい場合）</small>
              <input type="url" name="linkUrl" placeholder="https://" />
            </label>
            <div className="st-row">
              <label>掲載開始 <small>（必須）</small>
                <input type="datetime-local" name="startAt" required defaultValue={`${today}T00:00`} />
              </label>
              <label>掲載終了 <small>（必須）</small>
                <input type="datetime-local" name="endAt" required defaultValue={`${today}T23:59`} />
              </label>
            </div>
            <p className="st-note">掲載終了の日時を過ぎると、ホームページから自動的に消えます。チラシが複数「掲載中」のときは、掲載開始が新しいものが「今日のチラシ」のリンク先になります。</p>
            <div><button type="submit" className="st-btn">登録する</button></div>
          </form>
        </section>

        <section className="st-card">
          <h2>登録済み一覧</h2>
          {posts.length === 0 ? (
            <p className="st-empty">まだ登録がありません。</p>
          ) : (
            <ul className="st-list">
              {posts.map((p) => <PostRow key={p.id} post={p} now={now} />)}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function PostRow({ post, now }: { post: Post; now: string }) {
  const status = postStatus(post, now);
  return (
    <li>
      <span className={`st-badge ${status}`}>{STATUS_LABEL[status]}</span>
      <div>
        <div className="tt"><span className="kind">{KIND_LABEL[post.kind]}</span>{post.title}</div>
        <div className="meta">
          掲載期間：{formatJst(post.startAt)} 〜 {formatJst(post.endAt)}
          {post.fileId && <> ／ <a href={`/f/${post.fileId}`} target="_blank" rel="noopener noreferrer">{post.fileName || "ファイルを開く"}</a></>}
          {post.linkUrl && <> ／ <a href={post.linkUrl} target="_blank" rel="noopener noreferrer">リンク先</a></>}
        </div>
        {post.body && <div className="body">{post.body}</div>}
      </div>
      <DeleteForm id={post.id} title={post.title} />
    </li>
  );
}

function Login({ error }: { error?: string }) {
  return (
    <div className="st">
      <div className="st-login st-card">
        <h2>スタッフ専用ページ</h2>
        {error && <div className="st-msg err">{error}</div>}
        <form action={login} className="st-form">
          <label>パスワード
            <input type="password" name="password" required autoComplete="current-password" autoFocus />
          </label>
          <div><button type="submit" className="st-btn">ログイン</button></div>
        </form>
      </div>
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="st">
      <div className="st-login st-card">
        <h2>スタッフ専用ページ（準備中）</h2>
        <p className="st-note">
          パスワードがまだ設定されていません。Cloudflare ダッシュボードで
          <code> STAFF_PASSWORD </code>
          を設定すると使えるようになります（手順は docs/staff-page-setup.md）。
        </p>
      </div>
    </div>
  );
}
