import type { MetadataRoute } from "next";
import { ROBOTS_DISALLOW_KALAM_PREFIXES } from "@/utils/kalam";
import { SITE_CONFIG } from "@/utils/seoConfig";

export default function robots(): MetadataRoute.Robots {
  const isPreviewOrStaging =
    process.env.VERCEL_ENV === "preview" ||
    (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("kalamlibrary.me"));

  if (isPreviewOrStaging) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/api/og",
        disallow: [
          "/api/",
          "/admin",
          "/search",
          ...ROBOTS_DISALLOW_KALAM_PREFIXES,
        ],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "ClaudeBot", "AnthropicAI"],
        disallow: ["/api/", "/_next/", "/search"],
      },
    ],
    sitemap: `${SITE_CONFIG.siteUrl}/sitemap.xml`,
  };
}
