import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // inlineCss breaks static CSS on OpenNext/Cloudflare (/_next/static/*.css 530 → layout overlap)
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./utils/empty-polyfill.js",
      "@next/polyfill-module": "./utils/empty-polyfill.js",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "../build/polyfills/polyfill-module": path.resolve(__dirname, "utils/empty-polyfill.js"),
      "@next/polyfill-module": path.resolve(__dirname, "utils/empty-polyfill.js"),
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/poets",
        destination: "/authors",
      },
      {
        source: "/poet/:slug*",
        destination: "/author/:slug*",
      },
    ];
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
