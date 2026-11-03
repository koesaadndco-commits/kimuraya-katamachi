/* eslint-disable @next/next/no-html-link-for-pages -- ホーム（/）は kimura.js の初期化が必要なため、通常のページ読み込みで遷移させる */
import type { Metadata } from "next";
import "../kimura.css";
import { BlogFooter, BlogHeader, Eyebrow } from "../blog/SiteChrome";
import { CONTACT_EMAIL, SITE_URL } from "../lib/links";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ｜木村グループ（ハニー食彩館）",
  description: "木村グループ（ハニー食彩館）へのお問い合わせはこちらから。",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <>
      <BlogHeader />
      <main className="bl-main">
        <div className="wrap ct">
          <Eyebrow>CONTACT</Eyebrow>
          <h1 className="bl-h1">お問い合わせ</h1>
          <p className="bl-lead">商品・店舗・ご予約など、お気軽にお問い合わせください。内容を確認のうえ、担当者よりご連絡いたします。</p>
          <ContactForm />
          <div className="ct-alt">
            <b>メールでのお問い合わせ</b>
            <p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
            <p className="ct-hint">お急ぎの場合や、お買い上げ商品についてのお問い合わせは、各店舗へ直接お電話ください（<a href="/#stores">店舗一覧</a>）。</p>
          </div>
        </div>
      </main>
      <BlogFooter />
    </>
  );
}
