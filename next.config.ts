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
  async redirects() {
    return [
      {
        source: "/poets",
        destination: "/authors",
        permanent: true,
      },
      {
        source: "/poet/:slug*",
        destination: "/author/:slug*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/ads.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
