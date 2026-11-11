import { isSupabaseConfigured, supabase } from "@/utils/supabase";
import { SITE_CONFIG } from "@/utils/seoConfig";
import { filterListedAuthors } from "@/utils/authorHelper";
import {
  cleanKalamSlug,
  FEATURED_KALAM_SLUGS,
  filterIndexableKalams,
} from "@/utils/kalam";
import { planKalamRoutes } from "@/utils/kalamRouting";
import { SITEMAP_LANGUAGES } from "@/utils/sitemapConfig";

/** Google allows 50,000 URLs / 50 MB per sitemap file; stay safely below. */
export const MAX_URLS_PER_SITEMAP = 45000;

/**
 * Fixed lastmod for hand-written static pages (never `new Date()` per build).
 * Bump this when the content of the static pages changes meaningfully.
 */
export const STATIC_PAGES_LASTMOD = "2026-11-10";

const PAGE_SIZE = 1000; // Supabase/PostgREST returns at most 1000 rows per request.

export type SitemapEntry = {
  url: string;
  lastModified: Date | string;
  changeFrequency?: "daily" | "weekly" | "monthly";
  priority?: number;
  /** hreflang → absolute URL (includes x-default). */
  alternates?: Record<string, string>;
};

type StaticRoute = {
  path: string;
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>;
  priority: number;
};

const STATIC_ROUTES: StaticRoute[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/kalams", changeFrequency: "daily", priority: 0.95 },
  { path: "/authors", changeFrequency: "weekly", priority: 0.9 },
  { path: "/trending", changeFrequency: "daily", priority: 0.88 },
  { path: "/durood-o-salam", changeFrequency: "weekly", priority: 0.88 },
  { path: "/aurad-o-wazaif", changeFrequency: "weekly", priority: 0.88 },
  { path: "/lyrics/roman-english", changeFrequency: "weekly", priority: 0.85 },
  { path: "/lyrics/urdu", changeFrequency: "weekly", priority: 0.85 },
  { path: "/lyrics/hindi", changeFrequency: "weekly", priority: 0.85 },
  { path: "/lyrics/bangla", changeFrequency: "weekly", priority: 0.85 },
  // /kalams/page/N, /lyrics/{lang}/page/N and /lyrics/{lang}/letter/{a} are noindex, so they stay out.
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/services", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/terms-and-conditions", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy-policy", changeFrequency: "monthly", priority: 0.5 },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

type Row = Record<string, string | null | undefined>;

/** Pages through a PostgREST query (max 1000 rows per request). */
async function fetchAll(build: (from: number, to: number) => PromiseLike<{ data: Row[] | null; error: { message: string } | null }>): Promise<Row[]> {
  const rows: Row[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await build(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
  }
  return rows;
}

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function rowTimestamp(row: Row): Date | null {
  return toDate(row.created_at);
}

function latest(a: Date | null, b: Date | null): Date | null {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

/** Every URL we want crawled, in priority order. */
export async function buildSitemapEntries(): Promise<SitemapEntry[]> {
  const baseUrl = SITE_CONFIG.url;

  const staticEntries: SitemapEntry[] = STATIC_ROUTES.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: STATIC_PAGES_LASTMOD,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  if (!isSupabaseConfigured()) {
    console.warn("Sitemap: Supabase not configured — serving static routes only.");
    return staticEntries;
  }

  // ---- authors
  let authorEntries: SitemapEntry[] = [];
  try {
    const { data: authors } = await supabase.from("authors").select("name_roman, created_at");
    if (authors) {
      authorEntries = filterListedAuthors(authors).map((author) => ({
        url: `${baseUrl}/author/${slugify(author.name_roman)}`,
        lastModified: toDate(author.created_at) ?? STATIC_PAGES_LASTMOD,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
    }
  } catch (err) {
    console.error("Sitemap author fetch error:", err);
  }

  // ---- kalams + language URLs
  const kalamEntries: SitemapEntry[] = [];
  try {
    const kalamRows = await fetchAll((from, to) =>
      supabase
        .from("kalams")
        .select("id, slug, primary_title_roman, created_at")
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(from, to)
    );

    const translationRows = await fetchAll((from, to) =>
      supabase
        .from("kalam_translations")
        .select("kalam_id, language, created_at")
        .in("language", ["roman_english", "urdu", "hindi", "bangla"])
        .not("lyrics", "is", null)
        .neq("lyrics", "")
        .order("kalam_id", { ascending: true })
        .order("language", { ascending: true })
        .range(from, to)
    );

    // kalam_id -> translations that have real lyrics
    const byKalam = new Map<string, Array<{ language: string; at: Date | null }>>();
    for (const row of translationRows) {
      const id = row.kalam_id as string;
      if (!id) continue;
      const list = byKalam.get(id) ?? [];
      list.push({ language: row.language as string, at: rowTimestamp(row) });
      byKalam.set(id, list);
    }

    const featuredSet = new Set<string>(FEATURED_KALAM_SLUGS);
    const enabledLanguages = new Set<string>(SITEMAP_LANGUAGES);
    const indexable = filterIndexableKalams(
      kalamRows as Array<{ id: string; slug: string; primary_title_roman: string; created_at: string }>
    ).sort(
      (a, b) =>
        (featuredSet.has(cleanKalamSlug(a.slug)) ? 0 : 1) - (featuredSet.has(cleanKalamSlug(b.slug)) ? 0 : 1)
    );

    for (const kalam of indexable) {
      const translations = byKalam.get(kalam.id);
      if (!translations || translations.length === 0) continue; // page would 404

      const slug = cleanKalamSlug(kalam.slug);
      const isFeatured = featuredSet.has(slug);

      let lastModified = rowTimestamp(kalam as unknown as Row);
      for (const t of translations) lastModified = latest(lastModified, t.at);
      const lastmod = lastModified ?? STATIC_PAGES_LASTMOD;

      // Same decision the page uses: a base URL that redirects is dropped,
      // and an Urdu-only kalam keeps the base URL instead of /urdu.
      const plan = planKalamRoutes(slug, translations);
      // Staged rollout: the primary URL is always listed; other language URLs only when enabled.
      const listedPaths = plan.indexPaths.filter(
        (path, index) => index === 0 || enabledLanguages.has(path.slice(path.lastIndexOf("/") + 1))
      );
      const listedUrls = new Set(listedPaths.map((path) => `${baseUrl}${path}`));
      const alternates = Object.fromEntries(
        Object.entries(plan.alternates).filter(([, href]) => listedUrls.has(href))
      );
      listedPaths.forEach((path, index) => {
        kalamEntries.push({
          url: `${baseUrl}${path}`,
          lastModified: lastmod,
          changeFrequency: "weekly",
          priority: index === 0 ? (isFeatured ? 0.95 : 0.9) : 0.8,
          alternates,
        });
      });
    }
  } catch (err) {
    console.error("Sitemap kalam fetch error:", err);
  }

  return [...staticEntries, ...authorEntries, ...kalamEntries];
}
