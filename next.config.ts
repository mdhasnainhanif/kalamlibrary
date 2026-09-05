import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
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
};

export default nextConfig;
