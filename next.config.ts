import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// `next dev` でも Cloudflare のバインディング（KV など）をローカルで使えるようにする
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // スタッフページからのチラシ画像・PDF（最大4枚）アップロード用（既定は1MB）
      bodySizeLimit: "40mb",
    },
  },
};

export default nextConfig;
