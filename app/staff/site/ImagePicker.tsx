"use client";

import { useEffect, useRef, useState } from "react";
import { shrinkImage } from "../shrink";

/** 写真の差し替え欄。選んだ写真をその場で縮小し、見え方を表示する */
export default function ImagePicker({ name, current, label }: { name: string; current: string; label: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sendRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f || !sendRef.current) return;
    setBusy(true);
    const out = await shrinkImage(f);
    const dt = new DataTransfer();
    dt.items.add(out);
    sendRef.current.files = dt.files;
    setPreview(URL.createObjectURL(out));
    setBusy(false);
  }

  function clear() {
    if (sendRef.current) sendRef.current.files = new DataTransfer().files;
    setPreview(null);
  }

  return (
    <div className="st-site-img">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={preview ?? current} alt={label} />
      <div>
        {preview && <span className="st-tag scheduled">保存すると、この写真に変わります</span>}
        <label className="st-btn small">
          {busy ? "写真を準備中…" : "写真を選ぶ・撮る"}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} hidden />
        </label>
        {preview && <button type="button" className="st-btn small" onClick={clear}>選び直す（取り消し）</button>}
        <input ref={sendRef} type="file" name={name} hidden />
      </div>
    </div>
  );
}
