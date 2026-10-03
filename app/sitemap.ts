import type { MetadataRoute } from "next";
import { supabase } from "@/utils/supabase";
import { SITE_CONFIG } from "@/utils/seoConfig";
import {
  cleanKalamSlug,
  FEATURED_KALAM_SLUGS,
  filterIndexableKalams,
  kalamHref,
  SITEMAP_KALAM_LANG_PATHS,
} from "@/utils/kalam";
/** Cached sitemap; refreshes from Supabase daily (not on every crawl). */
export const revalidate = 86400;

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

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
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.88,
    },
    {
      url: `${baseUrl}/durood-o-salam`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
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

  const kalamRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: kalams, error: kalamError } = await supabase
      .from("kalams")
      .select("id, slug, primary_title_roman, created_at")
      .order("created_at", { ascending: false });

    if (kalamError) {
      console.error("Sitemap kalam fetch error:", kalamError);
    }

    if (kalams) {
      const indexable = filterIndexableKalams(kalams);
      const featuredSet = new Set<string>(FEATURED_KALAM_SLUGS);

      const ids = indexable.map((k) => k.id);
      const urduKalamIds = new Set<string>();
      if (ids.length > 0) {
        const { data: urduRows } = await supabase
          .from("kalam_translations")
          .select("kalam_id")
          .in("kalam_id", ids)
          .eq("language", "urdu");
        (urduRows || []).forEach((row) => urduKalamIds.add(row.kalam_id));
      }

      const sorted = [...indexable].sort((a, b) => {
        const aFeat = featuredSet.has(cleanKalamSlug(a.slug)) ? 0 : 1;
        const bFeat = featuredSet.has(cleanKalamSlug(b.slug)) ? 0 : 1;
        return aFeat - bFeat;
      });

      sorted.forEach((kalam) => {
        const lastMod = kalam.created_at ? new Date(kalam.created_at) : new Date();
        const slug = cleanKalamSlug(kalam.slug);
        const isFeatured = featuredSet.has(slug);

        kalamRoutes.push({
          url: `${baseUrl}${kalamHref(slug)}`,
          lastModified: lastMod,
          changeFrequency: "weekly",
          priority: isFeatured ? 0.95 : 0.9,
        });

        if (urduKalamIds.has(kalam.id)) {
          for (const langPath of SITEMAP_KALAM_LANG_PATHS) {
            kalamRoutes.push({
              url: `${baseUrl}${kalamHref(slug, langPath)}`,
              lastModified: lastMod,
              changeFrequency: "monthly",
              priority: isFeatured ? 0.9 : 0.85,
            });
          }
        }
      });
    }
  } catch (err) {
    console.error("Sitemap kalam fetch error:", err);
  }

  return [...staticRoutes, ...authorRoutes, ...kalamRoutes];
}
