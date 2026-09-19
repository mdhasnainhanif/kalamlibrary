import type { MetadataRoute } from "next";
import { supabase } from "@/utils/supabase";
import { SITE_CONFIG } from "@/utils/seoConfig";
import { cleanKalamSlug, filterIndexableKalams, LYRIC_LANGUAGES } from "@/utils/kalam";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  // 1. Static high-value landing and directory routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/kalams`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lyrics/roman-english`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/lyrics/urdu`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/lyrics/hindi`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/lyrics/bangla`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 2. Author / Poet profile routes
  let authorRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: authors } = await supabase
      .from("authors")
      .select("name_roman, created_at");
    if (authors) {
      authorRoutes = authors.map((author) => ({
        url: `${baseUrl}/author/${slugify(author.name_roman)}`,
        lastModified: author.created_at ? new Date(author.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      }));
    }
  } catch (err) {
    console.error("Sitemap author fetch error:", err);
  }

  // 3. Kalam canonical reader and language-specific routes
  const kalamRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: kalams } = await supabase
      .from("kalams")
      .select("slug, created_at")
      .order("created_at", { ascending: false });

    if (kalams) {
      const indexable = filterIndexableKalams(kalams);
      const directoryPages = Math.ceil(indexable.length / 48) || 1;
      for (let page = 2; page <= directoryPages; page += 1) {
        kalamRoutes.push({
          url: `${baseUrl}/kalams?page=${page}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }

      indexable.forEach((kalam) => {
        const lastMod = kalam.created_at ? new Date(kalam.created_at) : new Date();
        const slug = cleanKalamSlug(kalam.slug);

        kalamRoutes.push({
          url: `${baseUrl}/kalam/${slug}`,
          lastModified: lastMod,
          changeFrequency: "weekly",
          priority: 0.9,
        });

        Object.keys(LYRIC_LANGUAGES).forEach((lang) => {
          kalamRoutes.push({
            url: `${baseUrl}/kalam/${slug}/${lang}`,
            lastModified: lastMod,
            changeFrequency: "monthly",
            priority: 0.8,
          });
        });
      });
    }
  } catch (err) {
    console.error("Sitemap kalam fetch error:", err);
  }

  return [...staticRoutes, ...authorRoutes, ...kalamRoutes];
}
