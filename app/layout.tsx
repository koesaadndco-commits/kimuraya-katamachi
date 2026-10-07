import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "木村グループ｜ハニー食彩館 — ありがとうの、八十年。",
  description:
    "昭和21年、福井の小さな食料品店「木村屋」から。ハニー食彩館を営む木村グループのトップページ提案サンプル。",
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
      <body className="has-ribbon">{children}</body>
    </html>
  );
}
