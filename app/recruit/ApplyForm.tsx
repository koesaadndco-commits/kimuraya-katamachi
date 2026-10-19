"use client";

import { useState, type FormEvent } from "react";

const STORES = [
  "食彩館大宮店",
  "食彩館四ツ居店",
  "食彩館やしろ店",
  "食彩館西福井店",
  "食彩館丸岡店",
  "食彩館みくに店",
  "食彩館東部店",
];

type Status = "idle" | "sending" | "done" | "error";

export default function ApplyForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      kana: data.get("kana"),
      phone: data.get("phone"),
      email: data.get("email"),
      employmentType: data.get("employmentType"),
      store: data.get("store"),
      message: data.get("message"),
      consent: data.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({ ok: false }));

      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMsg(
          res.status === 503
            ? "現在、応募フォームの受付設定を準備中です。お手数ですがお電話または店舗まで直接お問い合わせください。"
            : "送信に失敗しました。お手数ですが、しばらくしてから再度お試しください。"
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
      <div className="rc-apply-done rv">
        <p>ご応募ありがとうございます。内容を確認のうえ、担当者よりご連絡いたします。</p>
      </div>
    );
  }

  return (
    <form className="rc-apply rv" onSubmit={onSubmit}>
      <div className="rc-apply-grid">
        <label>
          お名前<span className="req">必須</span>
          <input name="name" required />
        </label>
        <label>
          フリガナ
          <input name="kana" />
        </label>
        <label>
          電話番号<span className="req">必須</span>
          <input name="phone" type="tel" required />
        </label>
        <label>
          メールアドレス
          <input name="email" type="email" />
        </label>
        <label>
          希望雇用形態
          <select name="employmentType" defaultValue="">
            <option value="">選択してください</option>
            <option>正社員（新卒）</option>
            <option>パート・アルバイト</option>
          </select>
        </label>
        <label>
          希望店舗
          <select name="store" defaultValue="">
            <option value="">選択してください</option>
            {STORES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="rc-apply-message">
        ご質問・メッセージ
        <textarea name="message" rows={4}></textarea>
      </label>
      <label className="rc-apply-consent">
        <input type="checkbox" name="consent" required />
        ご記入いただいた個人情報は、採用選考のご連絡以外の目的には使用しません。
      </label>
      {status === "error" && <p className="rc-apply-error">{errorMsg}</p>}
      <button className="btn btn-mitsu" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "送信中…" : "この内容で応募する"}
      </button>
    </form>
  );
}
