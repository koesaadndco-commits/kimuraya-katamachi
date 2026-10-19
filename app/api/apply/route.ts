import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const STORES = [
  "食彩館大宮店",
  "食彩館四ツ居店",
  "食彩館やしろ店",
  "食彩館西福井店",
  "食彩館丸岡店",
  "食彩館みくに店",
  "食彩館東部店",
];
const EMPLOYMENT_TYPES = ["正社員（新卒）", "パート・アルバイト"];

const SENDER_ADDRESS = "no-reply@kimuraya-katamachi.co.jp";

type ApplyEnv = {
  EMAIL?: { send: (message: Record<string, unknown>) => Promise<unknown> };
  APPLY_NOTIFY_EMAIL?: string;
};

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const kana = String(body.kana ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const store = String(body.store ?? "").trim();
  const employmentType = String(body.employmentType ?? "").trim();
  const message = String(body.message ?? "").trim();
  const consent = Boolean(body.consent);

  if (!name || !phone || !consent) {
    return NextResponse.json({ ok: false, error: "missing_required_fields" }, { status: 400 });
  }
  if (store && !STORES.includes(store)) {
    return NextResponse.json({ ok: false, error: "invalid_store" }, { status: 400 });
  }
  if (employmentType && !EMPLOYMENT_TYPES.includes(employmentType)) {
    return NextResponse.json({ ok: false, error: "invalid_employment_type" }, { status: 400 });
  }

  const { env } = getCloudflareContext() as { env: ApplyEnv };
  const to = env.APPLY_NOTIFY_EMAIL;
  const emailBinding = env.EMAIL;

  if (!to || !emailBinding) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const text =
    "木村グループ 採用ページ（/recruit）から応募がありました。\n\n" +
    `お名前：${name}\n` +
    (kana ? `フリガナ：${kana}\n` : "") +
    `電話番号：${phone}\n` +
    (email ? `メールアドレス：${email}\n` : "") +
    (employmentType ? `希望雇用形態：${employmentType}\n` : "") +
    (store ? `希望店舗：${store}\n` : "") +
    (message ? `\nメッセージ：\n${message}\n` : "");

  try {
    await emailBinding.send({
      from: SENDER_ADDRESS,
      to,
      subject: `【採用応募】${name} 様より（${employmentType || "希望未選択"}）`,
      text,
    });
  } catch (err) {
    console.error("apply: send failed", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
