"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveArticleAction } from "./actions";
import { shrinkImage } from "../shrink";
import { CATEGORIES, MAX_PHOTOS, TYPE_LABEL, paragraphs, youtubeId, type Article } from "../../lib/articles";
import type { Role } from "../../lib/staff-auth";

type NewPhoto = { file: File; url: string };

function Buttons({ article, role, busy }: { article: Article; role: Role; busy: boolean }) {
  const { pending } = useFormStatus();
  const off = pending || busy;
  const published = article.status === "published";
  return (
    <div className="st-actions">
      <button type="submit" name="intent" value="save" className={published ? "st-btn primary" : "st-btn"} disabled={off}>
        {pending ? "保存中…" : published ? "変更を保存（公開中のまま）" : "下書きを保存"}
      </button>
      {!published && role === "admin" && (
        <button type="submit" name="intent" value="publish" className="st-btn primary" disabled={off}>公開する</button>
      )}
      {!published && role === "staff" && (
        <button type="submit" name="intent" value="review" className="st-btn primary" disabled={off || article.status === "review"}>
          {article.status === "review" ? "確認待ちです" : "管理者へ確認を依頼"}
        </button>
      )}
    </div>
  );
}

export default function ArticleForm({ article, role, separateAdmin, isNew }: { article: Article; role: Role; separateAdmin: boolean; isNew: boolean }) {
  const [keep, setKeep] = useState(article.photos);
  const [added, setAdded] = useState<NewPhoto[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const sendRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<{ title: string; author: string; body: string; ing: string[]; steps: string[]; meta: string; video: string } | null>(null);
  const r = article.recipe;

  useEffect(() => {
    if (!sendRef.current) return;
    const dt = new DataTransfer();
    added.forEach((p) => dt.items.add(p.file));
    sendRef.current.files = dt.files;
  }, [added]);
  useEffect(() => () => added.forEach((p) => URL.revokeObjectURL(p.url)), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;
    setBusy(true);
    setNotice("");
    const next: NewPhoto[] = [];
    for (const f of picked) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
        setNotice("写真は JPEG・PNG・WebP のみ選べます。");
        continue;
      }
      const out = await shrinkImage(f);
      next.push({ file: out, url: URL.createObjectURL(out) });
    }
    setAdded((prev) => {
      const room = Math.max(0, MAX_PHOTOS - keep.length - prev.length);
      if (next.length > room) {
        next.slice(room).forEach((p) => URL.revokeObjectURL(p.url));
        setNotice(`写真は最大${MAX_PHOTOS}枚までです。`);
      }
      return [...prev, ...next.slice(0, room)];
    });
    setBusy(false);
  }

  function openPreview() {
    const fd = new FormData(formRef.current!);
    const lines = (k: string) => String(fd.get(k) || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const meta = article.type === "recipe" ? [String(fd.get("servings") || ""), String(fd.get("time") || "")].filter(Boolean).join(" ／ ") : "";
    setView({
      title: String(fd.get("title") || "").trim() || "タイトル未入力",
      author: String(fd.get("author") || ""),
      body: String(fd.get("body") || ""),
      ing: lines("ingredients"),
      steps: lines("steps"),
      meta,
      video: String(fd.get("videoUrl") || "").trim(),
    });
    dialogRef.current?.showModal();
  }

  const total = keep.length + added.length;
  const photoUrls = [...keep.map((p) => `/f/${p.id}`), ...added.map((p) => p.url)];

  return (
    <form ref={formRef} action={saveArticleAction} className="st-form">
      <input type="hidden" name="id" value={isNew ? "" : article.id} />
      <input type="hidden" name="type" value={article.type} />

      <section className="st-card">
        <h2>{TYPE_LABEL[article.type]}の内容</h2>
        <div className="st-form">
          <label>タイトル <small>必須</small>
            <input type="text" name="title" maxLength={120} defaultValue={article.title} placeholder={article.type === "recipe" ? "例：秋鮭と根菜のあったか粕汁" : article.type === "ceo" ? "例：創業八十年、これからも福井の台所として" : "例：福井の秋を味わう、新米が届きました"} />
          </label>
          <div className="st-row">
            <label>カテゴリー
              <select name="category" defaultValue={article.category}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>掲載する担当者名・店舗
              <input type="text" name="author" maxLength={60} defaultValue={article.author} placeholder={article.type === "ceo" ? "例：代表取締役 ○○" : "例：大宮店 青果担当"} />
            </label>
          </div>

          {article.type === "recipe" && (
            <>
              <div className="st-row">
                <label>分量
                  <input type="text" name="servings" maxLength={30} defaultValue={r?.servings} placeholder="例：2〜3人分" />
                </label>
                <label>調理時間
                  <input type="text" name="time" maxLength={30} defaultValue={r?.time} placeholder="例：約20分" />
                </label>
              </div>
              <label>材料 <small>必須／1行に1品ずつ書いてください</small>
                <textarea name="ingredients" className="st-ta-m" defaultValue={r?.ingredients.join("\n")} placeholder={"秋鮭　2切れ\n大根　1/4本\n人参　1/2本\n酒粕　大さじ3"} />
              </label>
              <label>作り方 <small>必須／1行に1手順ずつ書いてください（番号は自動で付きます）</small>
                <textarea name="steps" className="st-ta-m" defaultValue={r?.steps.join("\n")} placeholder={"鮭は一口大に切り、根菜は薄く切る。\n鍋にだしと根菜を入れて煮る。\n鮭を加え、酒粕を溶き入れて仕上げる。"} />
              </label>
            </>
          )}

          <label>{article.type === "recipe" ? "ひとこと・おいしく作るコツ" : "本文"} {article.type !== "recipe" && <small>必須</small>}
            <textarea name="body" className="st-ta-l" defaultValue={article.body} placeholder={article.type === "recipe" ? "例：酒粕は少しのお湯で溶いてから入れると、ダマになりません。" : "お店であったことや、商品のおすすめを自由にお書きください。空行を入れると段落が分かれます。"} />
          </label>
        </div>
      </section>

      <section className="st-card" id="photos">
        <h2>写真・提供素材</h2>
        <label className="st-drop">
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onPick} />
          <strong>📷 写真を選ぶ・撮る</strong>
          <span>最大{MAX_PHOTOS}枚。大きな写真は自動で軽くします。1枚目が一覧の表紙になります。</span>
        </label>
        <input ref={sendRef} type="file" name="files" multiple hidden />
        {keep.map((p) => <input key={p.id} type="hidden" name="keep" value={p.id} />)}
        {notice && <p className="st-warn">{notice}</p>}
        {total > 0 && (
          <ul className="st-thumbs">
            {keep.map((p, i) => (
              <li key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/f/${p.id}`} alt={p.name} />
                <div className="st-thumb-bar"><span>{i + 1}枚目</span><button type="button" onClick={() => setKeep((k) => k.filter((x) => x.id !== p.id))} aria-label="取り消す">✕</button></div>
              </li>
            ))}
            {added.map((p, i) => (
              <li key={p.url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.file.name} />
                <div className="st-thumb-bar">
                  <span>{keep.length + i + 1}枚目（新）</span>
                  <button type="button" onClick={() => { URL.revokeObjectURL(p.url); setAdded((a) => a.filter((x) => x !== p)); }} aria-label="取り消す">✕</button>
                </div>
                <small>{(p.file.size / 1024 / 1024).toFixed(1)}MB</small>
              </li>
            ))}
          </ul>
        )}
        <div className="st-form" style={{ marginTop: 18 }}>
          <label>写真の提供者・クレジット
            <input type="text" name="credit" maxLength={80} defaultValue={article.credit} placeholder="例：写真提供 ○○様" />
          </label>
          <label>写真の説明 <small>何が写っているかを短く（目の不自由な方への読み上げにも使われます）</small>
            <input type="text" name="alt" maxLength={120} defaultValue={article.alt} placeholder="例：売り場に並んだ新米と、笑顔の青果担当" />
          </label>
          <label className="st-check">
            <input type="checkbox" name="permission" defaultChecked={article.permission} />
            提供された写真について、サイトへの掲載可否を確認しました。（写真を載せる場合は必須）
          </label>
        </div>
      </section>

      <section className="st-card" id="video">
        <h2>動画（任意）</h2>
        <label>動画の共有URL <small>YouTube のURLなら記事の中に埋め込んで表示します。それ以外は「動画を見る」ボタンになります</small>
          <input type="url" name="videoUrl" defaultValue={article.videoUrl} placeholder="https://…" />
        </label>
      </section>

      <section className="st-card">
        <h2>公開までの流れ</h2>
        <p className="st-muted">
          ① スタッフが下書き<br />② 管理者へ確認を依頼<br />③ 管理者が確認して公開
        </p>
        {!separateAdmin && <p className="st-help" style={{ marginTop: 8 }}>※いまは管理者用のパスワードが未設定のため、ログインした人がそのまま公開できます。</p>}
        <hr />
        <Buttons article={article} role={role} busy={busy} />
        <p className="st-help" style={{ marginTop: 10 }}>{busy ? "写真を準備しています…" : "足りない項目があっても、入力した内容は下書きとして保存されます。"}</p>
        <div style={{ marginTop: 12 }}><button type="button" className="st-btn" onClick={openPreview}>記事の見え方を確認</button></div>
      </section>

      <dialog ref={dialogRef} className="st-dialog" onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current?.close(); }}>
        <button type="button" className="st-btn" onClick={() => dialogRef.current?.close()}>閉じる</button>
        <p className="st-help">表示プレビュー・まだ公開されていません</p>
        {view && (
          <>
            <h2>{view.title}</h2>
            {view.author && <p className="st-muted">{view.author}</p>}
            {view.meta && <p className="st-muted">{view.meta}</p>}
            <div className="st-prev-imgs">{photoUrls.map((u) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={u} src={u} alt="" />)}</div>
            {view.ing.length > 0 && <><h3>材料</h3><ul>{view.ing.map((l, i) => <li key={i}>{l}</li>)}</ul></>}
            {view.steps.length > 0 && <><h3>作り方</h3><ol>{view.steps.map((l, i) => <li key={i}>{l}</li>)}</ol></>}
            {paragraphs(view.body).map((p, i) => <p key={i} className="st-prev-body">{p}</p>)}
            {view.video && <p className="st-muted">{youtubeId(view.video) ? "（YouTube の動画がここに埋め込まれます）" : `動画リンク：${view.video}`}</p>}
          </>
        )}
      </dialog>
    </form>
  );
}
