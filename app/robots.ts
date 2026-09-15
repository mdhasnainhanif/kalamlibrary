import type { MetadataRoute } from "next";
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
          "/services",
          "/contact",
          "/icon.png",
          "/og-default.jpg",
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/search",
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
