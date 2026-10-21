import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// `next dev` でも Cloudflare のバインディング（KV など）をローカルで使えるようにする
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // スタッフページからのチラシ画像・PDFアップロード用（既定は1MB）
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
