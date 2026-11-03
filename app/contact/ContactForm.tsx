"use client";

import { useState, type FormEvent } from "react";

const TOPICS = ["商品・売り場について", "店舗について", "チラシ・お知らせについて", "ご予約・ご注文について", "採用について", "その他"];
const STORES = ["食彩館大宮店", "食彩館四ツ居店", "食彩館やしろ店", "食彩館西福井店", "食彩館丸岡店", "食彩館みくに店", "食彩館東部店"];
type Status = "idle" | "sending" | "done" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    if (!String(d.get("email") ?? "").trim() && !String(d.get("phone") ?? "").trim()) {
      setStatus("error");
      setErrorMsg("ご返信のため、メールアドレスか電話番号のどちらかをご記入ください。");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.get("name"), email: d.get("email"), phone: d.get("phone"),
          topic: d.get("topic"), store: d.get("store"), message: d.get("message"),
          consent: d.get("consent") === "on",
        }),
      });
      const json = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMsg(
          res.status === 503
            ? "現在、フォームの受付設定を準備中です。お手数ですが info@kimura-group48.jp までメールでお問い合わせください。"
            : json.error === "invalid_email"
              ? "メールアドレスの形式をご確認ください。"
              : "送信に失敗しました。お手数ですが、しばらくしてから再度お試しください。",
        );
        return;
      }
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("送信に失敗しました。通信環境をご確認のうえ、再度お試しください。");
    }
  }

  if (status === "done") {
    return (
      <div className="rc-apply-done">
        <p>お問い合わせありがとうございます。内容を確認のうえ、担当者よりご連絡いたします。<br />内容によってはお返事までお時間をいただく場合があります。</p>
      </div>
    );
  }

  return (
    <form className="rc-apply" onSubmit={onSubmit}>
      <div className="rc-apply-grid">
        <label>お名前<span className="req">必須</span><input name="name" required autoComplete="name" /></label>
        <label>お問い合わせの種類
          <select name="topic" defaultValue=""><option value="">選択してください</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        <label>メールアドレス<input name="email" type="email" autoComplete="email" /></label>
        <label>電話番号<input name="phone" type="tel" autoComplete="tel" /></label>
        <label>店舗（該当する場合）
          <select name="store" defaultValue=""><option value="">選択してください</option>{STORES.map((s) => <option key={s}>{s}</option>)}</select>
        </label>
      </div>
      <p className="ct-hint">※ご返信のため、メールアドレスか電話番号のどちらかは必ずご記入ください。</p>
      <label className="rc-apply-message">お問い合わせ内容<span className="req">必須</span><textarea name="message" rows={6} required></textarea></label>
      <label className="rc-apply-consent">
        <input type="checkbox" name="consent" required />
        <span>ご記入いただいた個人情報は、お問い合わせへの回答のためにのみ使用します（<a href="/privacy" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>に同意のうえ送信）。</span>
      </label>
      {status === "error" && <p className="rc-apply-error">{errorMsg}</p>}
      <button className="btn btn-mitsu" type="submit" disabled={status === "sending"}>{status === "sending" ? "送信中…" : "この内容で送信する"}</button>
    </form>
  );
}
