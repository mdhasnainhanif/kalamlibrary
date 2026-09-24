import type { MetadataRoute } from "next";
import { ROBOTS_DISALLOW_KALAM_PREFIXES } from "@/utils/kalam";
import { SITE_CONFIG } from "@/utils/seoConfig";

export default function robots(): MetadataRoute.Robots {
  // Staging / Preview protection: if not in production environment or preview host
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
        allow: [
          "/",
          "/kalams",
          "/authors",
          "/poets",
          "/kalam/",
          "/author/",
          "/poet/",
          "/about",
          "/lyrics",
          "/lyrics/",
          "/services",
          "/contact",
          "/favicon.ico",
          "/favicon.webp",
          "/icon.png",
          "/icon-192.png",
          "/icon-512.png",
          "/apple-icon.png",
          "/manifest.webmanifest",
          "/og-default.jpg",
          "/ads.txt",
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/search",
          "/kalams?letter=",
          ...ROBOTS_DISALLOW_KALAM_PREFIXES,
        ],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "ClaudeBot", "AnthropicAI"],
        disallow: [
          "/api/",
          "/_next/",
          "/search",
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.siteUrl}/sitemap.xml`,
  };
}
