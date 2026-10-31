"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createPost } from "./actions";

const MAX_FILES = 4;
const MAX_EDGE = 2400; // 長辺がこれより大きい写真は縮小する（スマホの写真は大きいため）
const SHRINK_OVER_BYTES = 2.5 * 1024 * 1024;

type Item = { file: File; url: string; isPdf: boolean };

/** スマホで撮った大きな写真を、チラシが読める画質のまま軽くする */
async function shrink(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size <= SHRINK_OVER_BYTES) {
      bmp.close();
      return file;
    }
    const w = Math.max(1, Math.round(bmp.width * scale));
    const h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function SubmitButton({ busy }: { busy: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="st-btn primary" disabled={pending || busy}>
      {pending ? "アップロード中…（そのままお待ちください）" : busy ? "写真を準備中…" : "アップロードして公開する"}
    </button>
  );
}

export default function FlyerForm({ today, weekday }: { today: string; weekday: string }) {
  const [kind, setKind] = useState<"flyer" | "info">("flyer");
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const sendRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState({ title: "", body: "" });

  // 送信用の（非表示の）ファイル欄を、画面で選んだ内容とそろえる
  useEffect(() => {
    if (!sendRef.current) return;
    const dt = new DataTransfer();
    items.forEach((i) => dt.items.add(i.file));
    sendRef.current.files = dt.files;
  }, [items]);

  useEffect(() => () => items.forEach((i) => URL.revokeObjectURL(i.url)), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;
    setBusy(true);
    setNotice("");
    const added: Item[] = [];
    for (const f of picked) {
      if (!["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(f.type)) {
        setNotice("JPEG・PNG・WebP の画像か PDF だけ登録できます。");
        continue;
      }
      const out = await shrink(f);
      added.push({ file: out, url: URL.createObjectURL(out), isPdf: out.type === "application/pdf" });
    }
    setItems((prev) => {
      const next = [...prev, ...added];
      if (next.length > MAX_FILES) {
        next.slice(MAX_FILES).forEach((i) => URL.revokeObjectURL(i.url));
        setNotice(`チラシは最大${MAX_FILES}枚までです。`);
      }
      return next.slice(0, MAX_FILES);
    });
    setBusy(false);
  }

  function remove(idx: number) {
    setItems((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
    setNotice("");
  }

  function move(idx: number, dir: -1 | 1) {
    setItems((prev) => {
      const j = idx + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }

  function openPreview() {
    const fd = new FormData(formRef.current!);
    const [y, m, d] = String(fd.get("startDate") || today).split("-").map(Number);
    const autoTitle = `${m}月${d}日（${weekday}）本日のチラシ`;
    setPreview({ title: String(fd.get("title") || "").trim() || (kind === "flyer" ? autoTitle : "タイトル未入力"), body: String(fd.get("body") || "") });
    void y;
    dialogRef.current?.showModal();
  }

  return (
    <form ref={formRef} action={createPost} className="st-form">
      <div className="st-kind" role="radiogroup" aria-label="種類">
        <label><input type="radio" name="kind" value="flyer" checked={kind === "flyer"} onChange={() => setKind("flyer")} /> 本日のチラシ</label>
        <label><input type="radio" name="kind" value="info" checked={kind === "info"} onChange={() => setKind("info")} /> お知らせ・情報</label>
      </div>

      <div>
        <span className="st-label">{kind === "flyer" ? "チラシの写真・PDF" : "写真・PDF（任意）"} <small>JPEG・PNG・WebP・PDF／最大{MAX_FILES}枚（表・裏など）</small></span>
        <label className="st-drop">
          <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={onPick} />
          <strong>📷 写真を選ぶ・撮る</strong>
          <span>スマホではカメラで撮影もできます。大きな写真は自動で軽くします。</span>
        </label>
        <input ref={sendRef} type="file" name="files" multiple hidden />
        {notice && <p className="st-warn">{notice}</p>}
        {items.length > 0 && (
          <ul className="st-thumbs">
            {items.map((it, i) => (
              <li key={it.url}>
                {it.isPdf ? <div className="st-pdf">PDF</div> : /* eslint-disable-next-line @next/next/no-img-element */ <img src={it.url} alt={it.file.name} />}
                <div className="st-thumb-bar">
                  <span>{i + 1}枚目</span>
                  <span>
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="前へ">◀</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="後ろへ">▶</button>
                    <button type="button" onClick={() => remove(i)} aria-label="取り消す">✕</button>
                  </span>
                </div>
                <small>{(it.file.size / 1024 / 1024).toFixed(1)}MB</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="st-row">
        <label>掲載する日（開始）
          <input type="date" name="startDate" required defaultValue={today} />
        </label>
        <label>何日間掲載するか
          <select name="days" defaultValue="1">
            <option value="1">当日のみ（1日）</option>
            <option value="2">2日間</option>
            <option value="3">3日間</option>
            <option value="5">5日間</option>
            <option value="7">1週間</option>
          </select>
        </label>
      </div>
      <p className="st-help">掲載期間が終わると、ホームページから自動的に消えます。前日までに「明日の日付」で登録しておくこともできます。</p>

      <label>タイトル <small>{kind === "flyer" ? "（空欄なら「10月22日（水）本日のチラシ」と自動で付きます）" : "（必須）"}</small>
        <input type="text" name="title" maxLength={80} required={kind === "info"} placeholder={kind === "flyer" ? "例：秋の大感謝祭チラシ" : "例：本日は鮮魚が大特価"} />
      </label>
      <label>ひとこと <small>（任意／チラシの下に表示されます）</small>
        <textarea name="body" maxLength={1000} placeholder="例：今日は新米フェア。鮮魚は秋鮭がおすすめです。" />
      </label>

      <details className="st-details">
        <summary>くわしい設定（時刻・外部リンク）</summary>
        <div className="st-row">
          <label>掲載開始の時刻<input type="time" name="startTime" defaultValue="00:00" /></label>
          <label>掲載終了の時刻<input type="time" name="endTime" defaultValue="23:59" /></label>
        </div>
        <label>リンクURL <small>（任意／外部のチラシページなどに飛ばしたい場合）</small>
          <input type="url" name="linkUrl" placeholder="https://" />
        </label>
      </details>

      {kind === "flyer" && (
        <label className="st-check">
          <input type="checkbox" name="replaceSameDay" defaultChecked />
          同じ日のチラシが既にあるときは、新しいチラシに置き換える
        </label>
      )}

      <div className="st-actions">
        <SubmitButton busy={busy} />
        <button type="button" className="st-btn" onClick={openPreview}>見え方を確認</button>
      </div>

      <dialog ref={dialogRef} className="st-dialog" onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current?.close(); }}>
        <button type="button" className="st-btn" onClick={() => dialogRef.current?.close()}>閉じる</button>
        <p className="st-help">表示プレビュー・まだ公開されていません</p>
        <h2>{preview.title}</h2>
        <div className="st-prev-imgs">
          {items.map((it) => it.isPdf ? <div key={it.url} className="st-pdf">PDF：{it.file.name}</div> : /* eslint-disable-next-line @next/next/no-img-element */ <img key={it.url} src={it.url} alt="" />)}
          {items.length === 0 && <p className="st-help">写真が選ばれていません。</p>}
        </div>
        {preview.body && <p className="st-prev-body">{preview.body}</p>}
      </dialog>
    </form>
  );
}
