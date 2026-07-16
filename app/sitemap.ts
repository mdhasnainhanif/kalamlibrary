import { MetadataRoute } from "next";
import { supabase } from "@/utils/supabase";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

const LANGUAGES = ["roman-english", "urdu", "hindi", "bangla"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kalamlibrary.com";

  // 1. Static Routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // 2. Dynamic Author Routes
  const { data: authors } = await supabase.from("authors").select("name_roman");
  const authorRoutes = (authors || []).map((author) => ({
    url: `${baseUrl}/author/${slugify(author.name_roman)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 3. Dynamic Kalam Routes (For each Kalam and each translation language)
  const { data: kalams } = await supabase.from("kalams").select("slug");
  const kalamRoutes: MetadataRoute.Sitemap = [];

  (kalams || []).forEach((kalam) => {
    LANGUAGES.forEach((lang) => {
      kalamRoutes.push({
        url: `${baseUrl}/kalam/${kalam.slug}/${lang}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    });
  });

  return [...staticRoutes, ...authorRoutes, ...kalamRoutes];
}
