import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_URL } from "./lib/links";

// Google アナリティクス 4（測定ID）
const GA_ID = "G-PXFHKP760D";

const SITE_TITLE = "木村グループ｜ハニー食彩館 — ありがとうの、八十年。";
const SITE_DESCRIPTION =
  "昭和21年、福井の小さな食料品店「木村屋」から。福井市・坂井市で食彩館7店舗を展開する木村グループの公式サイト。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "木村グループ｜ハニー食彩館",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/img/family.jpg", width: 1344, height: 752, alt: "木村グループ ハニー食彩館" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/img/family.jpg"],
  },
  verification: {
    google: "gGsQl4NudA9ZPoDGyZaR9PGt8Q3gT_Im7a1sQhUhkL4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@500;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Cormorant+Garamond:ital,wght@0,500;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {/* Google tag (gtag.js) — 全ページ共通 */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
