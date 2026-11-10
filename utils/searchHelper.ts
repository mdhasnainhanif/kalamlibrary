import { authorLabelFromRoman } from "@/utils/authorHelper";
import { supabase } from "@/utils/supabase";

export const MIN_SEARCH_LENGTH = 2;
export const MAX_KALAM_RESULTS = 10;
export const MAX_POET_RESULTS = 5;
export const MAX_POET_SAMPLE = 3;
const LYRIC_MATCH_LIMIT = 8;
const SNIPPET_CHARS = 120;

/** Edge-only, two minutes. s-maxage disables stale-while-revalidate on Workers Caching. */
export const SEARCH_CACHE_CONTROL = "public, max-age=0, s-maxage=120";

export interface SearchResultItem {
  kalam_id: string;
  title: string;
  matched_title: string;
  language: string;
  slug: string;
  author_name: string;
  author_slug: string;
  /** Short excerpt, only when the match was inside the lyrics. Never the full text. */
  snippet?: string;
}

export interface SearchPoetResult {
  name: string;
  slug: string;
  kalam_count: number;
  /** At most MAX_POET_SAMPLE titles. Not the poet's whole catalogue. */
  kalams: Array<{ title: string; slug: string }>;
}

export interface SearchResponse {
  kalams: SearchResultItem[];
  poets: SearchPoetResult[];
}

const EMPTY: SearchResponse = { kalams: [], poets: [] };

/**
 * Makes a query safe to interpolate into a PostgREST `.or()` filter.
 * Commas, parentheses and quotes are filter syntax; % and _ are LIKE wildcards.
 */
export function sanitizeSearchQuery(raw: string): string {
  return (raw || "")
    .replace(/[,()"'\\%_*]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

export function stripUrduAerab(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F\u0670\u0671\u0640\u0654]/g, "")
    .replace(/[\u0622\u0623\u0625]/g, "\u0627")
    .replace(/[\u06C1\u06C2\u06D5]/g, "\u06C1")
    .replace(/[\u0649\u064A]/g, "\u06CC")
    .replace(/\s+/g, " ")
    .trim();
}

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function relationCount(value: unknown): number {
  const row = one(value as { count?: number } | Array<{ count?: number }> | null);
  return typeof row?.count === "number" ? row.count : 0;
}

function snippetAround(lyrics: string, query: string): string {
  const flat = lyrics.replace(/\s+/g, " ").trim();
  const at = flat.toLowerCase().indexOf(query.toLowerCase());
  const start = at < 0 ? 0 : Math.max(0, at - 30);
  const slice = flat.slice(start, start + SNIPPET_CHARS).trim();
  return `${start > 0 ? "…" : ""}${slice}${start + SNIPPET_CHARS < flat.length ? "…" : ""}`;
}

type KalamJoin = {
  primary_title_roman: string;
  primary_title_urdu?: string | null;
  slug: string;
  authors?: { name_roman?: string } | Array<{ name_roman?: string }> | null;
};

function isJunk(title: string, slug: string): boolean {
  const t = title.toLowerCase().trim();
  return !title || !slug || t === "deegar" || t === "دیگر" || slug.startsWith("deegar") || slug.startsWith("digar");
}

export async function searchKalams(rawQuery: string): Promise<SearchResponse> {
  const query = sanitizeSearchQuery(rawQuery);
  if (query.length < MIN_SEARCH_LENGTH) return EMPTY;

  const lower = query.toLowerCase();
  const norm = stripUrduAerab(lower);
  const like = `%${query}%`;
  // Quoted so spaces and dots stay inside the value and cannot start a new filter.
  const orValue = `"${like}"`;
  const kalams = new Map<string, SearchResultItem & { score: number }>();

  const add = (item: Omit<SearchResultItem, "snippet"> & { snippet?: string }, score: number) => {
    if (isJunk(item.title, item.slug) || isJunk(item.matched_title, item.slug)) return;
    const prev = kalams.get(item.kalam_id);
    if (!prev || score > prev.score) kalams.set(item.kalam_id, { ...item, score });
  };

  const fromJoin = (join: KalamJoin | null, fallbackTitle: string, language: string, kalamId: string) => {
    if (!join) return null;
    const authorName = authorLabelFromRoman(one(join.authors)?.name_roman);
    return {
      kalam_id: kalamId,
      title: join.primary_title_roman,
      matched_title: fallbackTitle || join.primary_title_roman,
      language: language || "roman_english",
      slug: join.slug,
      author_name: authorName || "",
      author_slug: authorName ? slugify(authorName) : "",
    };
  };

  const scoreTitle = (title: string, primary: string, urdu: string, author: string) => {
    const fields = [stripUrduAerab(title.toLowerCase()), primary.toLowerCase(), stripUrduAerab((urdu || "").toLowerCase())];
    let score = 0;
    if (fields.some((f) => f === norm || f === lower)) score = 300;
    else if (fields.some((f) => f.startsWith(norm) || f.startsWith(lower))) score = 200;
    else if (fields.some((f) => f.includes(norm) || f.includes(lower))) score = 150;
    const authorLower = author.toLowerCase();
    if (authorLower === lower) score += 80;
    else if (authorLower.includes(lower)) score += 40;
    return score;
  };

  try {
    const { data: byTitle } = await supabase
      .from("kalam_translations")
      .select("kalam_id, title, language, kalams!inner(primary_title_roman, primary_title_urdu, slug, authors(name_roman))")
      .ilike("title", like)
      .limit(20);

    for (const row of byTitle ?? []) {
      const join = one(row.kalams as KalamJoin | KalamJoin[] | null);
      const item = fromJoin(join, row.title, row.language, row.kalam_id);
      if (!item) continue;
      add(item, scoreTitle(row.title, item.title, join?.primary_title_urdu || "", item.author_name));
    }

    const { data: byKalam } = await supabase
      .from("kalams")
      .select("id, primary_title_roman, primary_title_urdu, slug, authors(name_roman)")
      .or(`primary_title_roman.ilike.${orValue},primary_title_urdu.ilike.${orValue},slug.ilike.${orValue}`)
      .limit(20);

    for (const row of byKalam ?? []) {
      const authorName = authorLabelFromRoman(one(row.authors as KalamJoin["authors"])?.name_roman);
      add(
        {
          kalam_id: row.id,
          title: row.primary_title_roman,
          matched_title: row.primary_title_roman,
          language: "roman_english",
          slug: row.slug,
          author_name: authorName || "",
          author_slug: authorName ? slugify(authorName) : "",
        },
        scoreTitle(row.primary_title_roman, row.primary_title_roman, row.primary_title_urdu || "", authorName || "")
      );
    }

    // Lyrics are fetched only for this small set, and only a snippet leaves the server.
    const { data: byLyrics } = await supabase
      .from("kalam_translations")
      .select("kalam_id, title, language, lyrics, kalams!inner(primary_title_roman, primary_title_urdu, slug, authors(name_roman))")
      .ilike("lyrics", like)
      .limit(LYRIC_MATCH_LIMIT);

    for (const row of byLyrics ?? []) {
      const join = one(row.kalams as KalamJoin | KalamJoin[] | null);
      const item = fromJoin(join, row.title, row.language, row.kalam_id);
      if (!item || !row.lyrics) continue;
      const base = scoreTitle(row.title, item.title, join?.primary_title_urdu || "", item.author_name);
      add({ ...item, snippet: snippetAround(row.lyrics, query) }, base + 140);
    }

    const { data: authors } = await supabase
      .from("authors")
      .select("id, name_roman, name_urdu, kalams(count)")
      .or(`name_roman.ilike.${orValue},name_urdu.ilike.${orValue}`)
      .limit(MAX_POET_RESULTS);

    const poets: SearchPoetResult[] = [];
    for (const author of authors ?? []) {
      const name = authorLabelFromRoman(author.name_roman) || author.name_roman;
      if (!name) continue;
      const { data: sample } = await supabase
        .from("kalams")
        .select("primary_title_roman, slug")
        .eq("author_id", author.id)
        .order("primary_title_roman", { ascending: true })
        .limit(MAX_POET_SAMPLE);
      poets.push({
        name,
        slug: slugify(author.name_roman),
        kalam_count: relationCount(author.kalams),
        kalams: (sample ?? [])
          .filter((k) => !isJunk(k.primary_title_roman, k.slug))
          .map((k) => ({ title: k.primary_title_roman, slug: k.slug })),
      });
    }

    const ranked = [...kalams.values()].sort((a, b) => b.score - a.score).slice(0, MAX_KALAM_RESULTS);
    const response: SearchResponse = {
      kalams: ranked.map(({ score: _score, ...item }) => item),
      poets,
    };

    // Hard cap so a surprise column can never balloon the payload.
    if (Buffer.byteLength(JSON.stringify(response)) > 24_000) {
      response.kalams = response.kalams.map(({ snippet: _snippet, ...item }) => item);
    }
    return response;
  } catch (err) {
    console.error("Search execution error:", err);
    return EMPTY;
  }
}
