import { cache } from "react";
import { supabase } from "@/utils/supabase";
import { cleanKalamSlug, filterIndexableKalams, isIndexableKalam } from "@/utils/kalam";

export type AuthorRecord = {
  id?: string;
  name_roman: string;
  name_urdu?: string | null;
  bio?: string | null;
};

export type KalamRecord = {
  id: string;
  slug: string;
  author_id?: string | null;
  primary_title_roman: string;
  primary_title_urdu?: string | null;
  created_at?: string | null;
  authors?: AuthorRecord | AuthorRecord[] | null;
};

export type TranslationRecord = {
  id?: string;
  kalam_id?: string;
  language: string;
  title: string;
  lyrics: string;
};

/**
 * A failed query throws instead of reading as "missing". Thrown, the render is a 500 that
 * nothing caches (and ISR keeps serving the last good copy). Read as missing, it would be
 * a 404, or a page with sections dropped, cached like a real result.
 */
function throwIfFailed(error: { message: string } | null, what: string) {
  if (error) throw new Error(`Supabase ${what} failed: ${error.message}`);
}

export async function findKalamBySlug(rawSlug: string): Promise<KalamRecord | null> {
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug);
  } catch {
    decodedSlug = rawSlug;
  }
  const cleaned = cleanKalamSlug(decodedSlug);

  for (const candidate of [decodedSlug, rawSlug, cleaned]) {
    if (!candidate) continue;
    const { data, error } = await supabase
      .from("kalams")
      .select("*, authors(*)")
      .eq("slug", candidate)
      .maybeSingle();
    throwIfFailed(error, "kalam lookup");
    if (data) return data as KalamRecord;
  }

  if (cleaned) {
    const { data, error } = await supabase
      .from("kalams")
      .select("*, authors(*)")
      .ilike("slug", `${cleaned}%`)
      .limit(8);
    throwIfFailed(error, "kalam prefix lookup");

    const match = (data || []).find(
      (row) => cleanKalamSlug(row.slug) === cleaned || row.slug.startsWith(cleaned)
    );
    if (match) return match as KalamRecord;
  }

  return null;
}

export const getKalamPageData = cache(async function getKalamPageData(rawSlug: string) {
  // Dev-only fixture so the Urdu-only redirect can be requested locally. Not in the database.
  if (process.env.NODE_ENV === "development" && cleanKalamSlug(rawSlug) === "fixture-urdu-only") {
    return {
      kalam: {
        id: "fixture-urdu-only",
        slug: "fixture-urdu-only",
        primary_title_roman: "Fixture Urdu Only",
        primary_title_urdu: "فکسچر",
        created_at: "2026-11-10T00:00:00.000Z",
      },
      author: null,
      translations: [
        { id: "fixture-urdu", kalam_id: "fixture-urdu-only", language: "urdu", title: "فکسچر", lyrics: "فکسچر" },
      ],
      relatedKalams: [],
      shouldNoindex: false,
      cleanSlug: "fixture-urdu-only",
    };
  }

  const kalam = await findKalamBySlug(rawSlug);
  if (!kalam) return null;

  const { data: translations, error: transError } = await supabase
    .from("kalam_translations")
    .select("*")
    .eq("kalam_id", kalam.id);

  throwIfFailed(transError, "translations");
  if (!translations || translations.length === 0) {
    return null;
  }

  let relatedKalams: Array<{
    id: string;
    slug: string;
    primary_title_roman: string;
    primary_title_urdu: string | null;
  }> = [];

  if (kalam.author_id) {
    const { data: siblings, error: siblingsError } = await supabase
      .from("kalams")
      .select("id, slug, primary_title_roman, primary_title_urdu")
      .eq("author_id", kalam.author_id)
      .neq("id", kalam.id)
      .limit(12);
    throwIfFailed(siblingsError, "related kalams");

    relatedKalams = filterIndexableKalams(siblings).slice(0, 6);
  }

  const author = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;

  return {
    kalam,
    author,
    translations: translations as TranslationRecord[],
    relatedKalams,
    shouldNoindex: !isIndexableKalam(kalam),
    cleanSlug: cleanKalamSlug(kalam.slug),
  };
});
