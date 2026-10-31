import type { Metadata } from "next";
import "./staff.css";
import { formatJst, listPosts, nowJst, postStatus, type Post } from "../lib/staff-store";
import DeleteForm from "./DeleteForm";
import FlyerForm from "./FlyerForm";
import StaffShell from "./StaffShell";
import { staffGate } from "./gate";

export const metadata: Metadata = {
  title: "スタッフ専用｜今日のチラシ登録",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  password: "パスワードが違います。",
  login: "ログインの有効期限が切れました。もう一度ログインしてください。",
  title: "お知らせにはタイトルが必要です。",
  period: "掲載する日・時刻を確認してください。",
  period_order: "掲載終了は掲載開始より後の日時にしてください。",
  url: "リンクURLは http:// または https:// から始めてください。",
  file_type: "ファイルは JPEG・PNG・WebP の画像、または PDF のみ登録できます。",
  file_size: "ファイルサイズは 1枚あたり 10MB 以内にしてください。",
  file_count: "チラシは最大4枚までです。",
  flyer_empty: "チラシの写真かPDFを選んでください（外部のチラシのリンクURLだけでも登録できます）。",
};

const STATUS_LABEL = { live: "掲載中", scheduled: "掲載予定", ended: "掲載終了" } as const;
const KIND_LABEL = { flyer: "チラシ", info: "お知らせ" } as const;
const WEEKDAYS = "日月火水木金土";

type Search = Record<string, string | string[] | undefined>;

function weekdayOf(date: string): string {
  return WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
}

export default async function StaffPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? ERRORS[sp.error] : undefined;
  const saved = sp.saved === "1";
  const replaced = typeof sp.replaced === "string" ? Number(sp.replaced) : 0;
  const deleted = sp.deleted === "1";

  const next = typeof sp.next === "string" ? sp.next : undefined;
  const gate = await staffGate({ error, next });
  if ("screen" in gate) return gate.screen;
  const role = gate.role;

  const now = nowJst();
  const today = now.slice(0, 10);
  const posts = await listPosts();
  const liveFlyers = posts.filter((p) => p.kind === "flyer" && postStatus(p, now) === "live");
  const upcoming = posts.filter((p) => postStatus(p, now) === "scheduled").length;

  return (
    <StaffShell active="flyer" role={role} crumb="お店のたより ／ 今日のチラシ">
        <h1>今日のチラシを、届けよう。</h1>
        <p className="st-lead">毎日の更新はこの画面だけで完了します。写真を選んで「アップロードして公開する」を押すと、ホームページの「今日のチラシ」がすぐに切り替わります。（日本時間 {formatJst(now)} 現在）</p>

        {error && <div className="st-msg err">{error}</div>}
        {saved && <div className="st-msg">登録しました。{replaced > 0 ? `同じ日の古いチラシ${replaced}件を置き換えました。` : ""}掲載期間内であれば、ホームページにすぐ反映されます。</div>}
        {deleted && <div className="st-msg">削除しました。</div>}

        <div className="st-columns">
          <div>
            <section className="st-card" id="upload">
              <h2>新しく登録する</h2>
              <FlyerForm today={today} weekday={weekdayOf(today)} />
            </section>

            <section className="st-card" id="list">
              <h2>登録済みの一覧</h2>
              {posts.length === 0 ? (
                <p className="st-empty">まだ登録がありません。</p>
              ) : (
                <ul className="st-list">
                  {posts.map((p) => <PostRow key={p.id} post={p} now={now} />)}
                </ul>
              )}
            </section>
          </div>

          <div>
            <section className="st-card">
              <h2>いま公開中のチラシ</h2>
              {liveFlyers.length === 0 ? (
                <p className="st-alert">今日のチラシはまだ登録されていません。<br />ホームページの「今日のチラシ」は、外部の既定ページに飛んでいます。</p>
              ) : (
                liveFlyers.map((p) => (
                  <div key={p.id} className="st-now">
                    <span className="st-tag ok">公開中</span>
                    <strong>{p.title}</strong>
                    <div className="st-now-imgs">
                      {p.files.map((f) => f.type === "application/pdf"
                        ? <a key={f.id} href={`/f/${f.id}`} target="_blank" rel="noopener noreferrer" className="st-pdf">PDF</a>
                        : /* eslint-disable-next-line @next/next/no-img-element */ <img key={f.id} src={`/f/${f.id}`} alt={p.title} />)}
                    </div>
                    <small>〜 {formatJst(p.endAt)} まで</small>
                  </div>
                ))
              )}
              {upcoming > 0 && <p className="st-help">このほか、掲載予定が{upcoming}件あります。</p>}
            </section>

            <section className="st-card">
              <h2>毎日のながれ</h2>
              <p className="st-muted">① 今日のチラシを撮影（またはPDFを用意）<br />② 写真を選ぶ（表・裏は2枚まで続けて選べます）<br />③ 「アップロードして公開する」を押す</p>
              <hr />
              <p className="st-help">日付はふだん「今日」のままで大丈夫です。同じ日にもう一度登録すると、古いチラシは新しいものに置き換わります。</p>
            </section>
          </div>
        </div>
    </StaffShell>
  );
}

function PostRow({ post, now }: { post: Post; now: string }) {
  const status = postStatus(post, now);
  return (
    <li>
      <span className={`st-tag ${status}`}>{STATUS_LABEL[status]}</span>
      <div>
        <div className="st-tt"><span className="st-kind-label">{KIND_LABEL[post.kind]}</span>{post.title}</div>
        <div className="st-meta">
          掲載期間：{formatJst(post.startAt)} 〜 {formatJst(post.endAt)}
          {post.files.length > 0 && <> ／ {post.files.map((f, i) => (
            <span key={f.id}>{i > 0 && "・"}<a href={`/f/${f.id}`} target="_blank" rel="noopener noreferrer">{f.type === "application/pdf" ? "PDF" : `${i + 1}枚目`}</a></span>
          ))}</>}
          {post.linkUrl && <> ／ <a href={post.linkUrl} target="_blank" rel="noopener noreferrer">リンク先</a></>}
        </div>
        {post.body && <div className="st-body">{post.body}</div>}
      </div>
      <DeleteForm id={post.id} title={post.title} />
    </li>
  );
}
