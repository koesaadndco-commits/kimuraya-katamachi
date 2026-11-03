import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// お問い合わせフォーム（/contact）→ CONTACT_NOTIFY_EMAIL にメールで届ける（仕組みは採用応募 /api/apply と同じ）
const SENDER_ADDRESS = "no-reply@kimuraya-katamachi.co.jp";
const CONTACT_TOPICS = ["商品・売り場について", "店舗について", "チラシ・お知らせについて", "ご予約・ご注文について", "採用について", "その他"];

type ContactEnv = {
  EMAIL?: { send: (message: Record<string, unknown>) => Promise<unknown> };
  CONTACT_NOTIFY_EMAIL?: string;
};

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const s = (k: string, max = 200) => String(body[k] ?? "").trim().slice(0, max);
  const name = s("name", 100);
  const email = s("email", 200);
  const phone = s("phone", 40);
  const topic = s("topic", 60);
  const store = s("store", 60);
  const message = s("message", 4000);
  const consent = Boolean(body.consent);

  if (!name || !message || !consent || (!email && !phone)) {
    return NextResponse.json({ ok: false, error: "missing_required_fields" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (topic && !CONTACT_TOPICS.includes(topic)) {
    return NextResponse.json({ ok: false, error: "invalid_topic" }, { status: 400 });
  }

  const { env } = getCloudflareContext() as { env: ContactEnv };
  const to = env.CONTACT_NOTIFY_EMAIL;
  if (!to || !env.EMAIL) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  const text =
    "木村グループ ホームページのお問い合わせフォーム（/contact）から送信がありました。\n\n" +
    `お名前：${name}\n` +
    (email ? `メールアドレス：${email}\n` : "") +
    (phone ? `電話番号：${phone}\n` : "") +
    (topic ? `お問い合わせの種類：${topic}\n` : "") +
    (store ? `店舗：${store}\n` : "") +
    `\nお問い合わせ内容：\n${message}\n`;

  try {
    await env.EMAIL.send({ from: SENDER_ADDRESS, to, subject: `【お問い合わせ】${topic || "ホームページ"}（${name} 様）`, text });
  } catch (err) {
    console.error("contact: send failed", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
