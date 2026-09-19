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
    const { data } = await supabase
      .from("kalams")
      .select("*, authors(*)")
      .eq("slug", candidate)
      .maybeSingle();
    if (data) return data as KalamRecord;
  }

  if (cleaned) {
    const { data } = await supabase
      .from("kalams")
      .select("*, authors(*)")
      .ilike("slug", `${cleaned}%`)
      .limit(8);

    const match = (data || []).find(
      (row) => cleanKalamSlug(row.slug) === cleaned || row.slug.startsWith(cleaned)
    );
    if (match) return match as KalamRecord;
  }

  return null;
}

export async function getKalamPageData(rawSlug: string) {
  const kalam = await findKalamBySlug(rawSlug);
  if (!kalam) return null;

  const { data: translations, error: transError } = await supabase
    .from("kalam_translations")
    .select("*")
    .eq("kalam_id", kalam.id);

  if (transError || !translations || translations.length === 0) {
    return null;
  }

  let relatedKalams: Array<{
    id: string;
    slug: string;
    primary_title_roman: string;
    primary_title_urdu: string | null;
  }> = [];

  if (kalam.author_id) {
    const { data: siblings } = await supabase
      .from("kalams")
      .select("id, slug, primary_title_roman, primary_title_urdu")
      .eq("author_id", kalam.author_id)
      .neq("id", kalam.id)
      .limit(12);

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
}
