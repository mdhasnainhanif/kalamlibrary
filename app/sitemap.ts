import { MetadataRoute } from "next";
import { supabase } from "@/utils/supabase";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kalamlibrary.me";

  // 1. Static base & site routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kalams`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 2. Author routes
  let authorRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: authors } = await supabase.from("authors").select("name_roman, created_at");
    if (authors) {
      authorRoutes = authors.map((author) => ({
        url: `${baseUrl}/author/${slugify(author.name_roman)}`,
        lastModified: author.created_at ? new Date(author.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Sitemap author fetch error:", err);
  }

  // 3. Dynamic Kalam routes (Async fetch query mapping over all kalam records)
  let kalamRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: kalams } = await supabase.from("kalams").select("slug, created_at");
    if (kalams) {
      kalamRoutes = kalams.map((kalam) => ({
        url: `${baseUrl}/kalam/${kalam.slug}`,
        lastModified: kalam.created_at ? new Date(kalam.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      }));
    }
  } catch (err) {
    console.error("Sitemap kalam fetch error:", err);
  }

  return [...staticRoutes, ...authorRoutes, ...kalamRoutes];
}
