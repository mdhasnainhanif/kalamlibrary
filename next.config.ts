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
  async headers() {
    return [
      {
        source: "/ads.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" },
        ],
      },
      // Language of the response for crawlers that read headers (the <html lang> is set client-side; see utils/htmlLang.ts)
      { source: "/", headers: [{ key: "Cache-Tag", value: "home" }] },
      { source: "/robots.txt", headers: [{ key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" }] },
      { source: "/search", headers: [{ key: "Cache-Control", value: "public, max-age=0, s-maxage=120" }] },
      { source: "/contact", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
      { source: "/api/contact", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
      { source: "/api/reviews", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
      { source: "/api/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
      { source: "/auth/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
      { source: "/api/revalidate", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
      { source: "/kalam/:slug", headers: [{ key: "Content-Language", value: "ur-Latn" }] },
      { source: "/kalam/:slug/urdu", headers: [{ key: "Content-Language", value: "ur" }] },
      { source: "/kalam/:slug/hindi", headers: [{ key: "Content-Language", value: "hi" }] },
      { source: "/kalam/:slug/bangla", headers: [{ key: "Content-Language", value: "bn" }] },
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
