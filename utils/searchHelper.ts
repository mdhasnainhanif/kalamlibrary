import { supabase } from "@/utils/supabase";

export interface SearchResultItem {
  kalam_id: string;
  title: string;
  matched_title: string;
  language: string;
  slug: string;
  author_name: string;
  author_slug: string;
  score?: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

export async function searchKalams(rawQuery: string, limit = 40): Promise<SearchResultItem[]> {
  const query = rawQuery.trim();
  if (!query) return [];

  const lowerQuery = query.toLowerCase();

  // Extract individual words for multi-term fallback matching
  const queryWords = lowerQuery
    .replace(/[^\w\s\u0600-\u06FF\u0900-\u097F\u0980-\u09FF]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const resultMap = new Map<string, SearchResultItem>();

  const processKalamRecord = (
    kalamId: string,
    primaryTitleRoman: string,
    primaryTitleUrdu: string | null,
    slug: string,
    matchedTitle: string,
    language: string,
    authorName: string,
    lyricsSample = ""
  ) => {
    if (
      !kalamId ||
      !primaryTitleRoman ||
      primaryTitleRoman.toLowerCase().trim() === "deegar" ||
      matchedTitle.toLowerCase().trim() === "deegar" ||
      matchedTitle.trim() === "دیگر" ||
      slug.startsWith("deegar") ||
      slug.startsWith("digar")
    ) {
      return;
    }

    const titleLower = matchedTitle.toLowerCase();
    const primaryLower = primaryTitleRoman.toLowerCase();
    const urduLower = (primaryTitleUrdu || "").toLowerCase();
    const authorLower = authorName.toLowerCase();
    const lyricsLower = lyricsSample.toLowerCase();

    let score = 0;

    // 1. Exact match in title
    if (titleLower === lowerQuery || primaryLower === lowerQuery || urduLower === lowerQuery) {
      score += 200;
    }
    // 2. Starts with query
    else if (titleLower.startsWith(lowerQuery) || primaryLower.startsWith(lowerQuery)) {
      score += 130;
    }
    // 3. Substring match in title
    else if (titleLower.includes(lowerQuery) || primaryLower.includes(lowerQuery) || urduLower.includes(lowerQuery)) {
      score += 90;
    }

    // 4. Author match
    if (authorLower === lowerQuery) {
      score += 150;
    } else if (authorLower.includes(lowerQuery)) {
      score += 70;
    }

    // 5. Word-by-word match
    if (queryWords.length > 1) {
      let matchedWordCount = 0;
      queryWords.forEach((word) => {
        if (
          titleLower.includes(word) ||
          primaryLower.includes(word) ||
          urduLower.includes(word) ||
          authorLower.includes(word)
        ) {
          matchedWordCount++;
        }
      });

      if (matchedWordCount === queryWords.length) {
        score += 80;
      } else {
        score += matchedWordCount * 20;
      }
    }

    // 6. Lyrics match
    if (lyricsLower.includes(lowerQuery)) {
      score += 30;
    }

    const existing = resultMap.get(kalamId);
    if (!existing || (existing.score || 0) < score) {
      resultMap.set(kalamId, {
        kalam_id: kalamId,
        title: primaryTitleRoman,
        matched_title: matchedTitle,
        language: language || "roman_english",
        slug,
        author_name: authorName || "Unknown Poet",
        author_slug: authorName ? slugify(authorName) : "",
        score,
      });
    }
  };

  try {
    // STAGE 1: Search in kalam_translations (title or lyrics)
    const { data: translationData } = await supabase
      .from("kalam_translations")
      .select("kalam_id, title, language, lyrics, kalams(primary_title_roman, primary_title_urdu, slug, authors(name_roman, name_urdu))")
      .or(`title.ilike.%${query}%,lyrics.ilike.%${query}%`)
      .limit(150);

    if (translationData) {
      for (const item of translationData) {
        const kalam = (Array.isArray(item.kalams) ? item.kalams[0] : item.kalams) as { primary_title_roman: string; primary_title_urdu?: string; slug: string; authors?: { name_roman: string } | { name_roman: string }[] } | null;
        if (!kalam) continue;
        const authorData = kalam.authors;
        const authorName = (Array.isArray(authorData) ? authorData[0]?.name_roman : authorData?.name_roman) || "Unknown Poet";

        processKalamRecord(
          item.kalam_id,
          kalam.primary_title_roman,
          kalam.primary_title_urdu || null,
          kalam.slug,
          item.title,
          item.language,
          authorName,
          item.lyrics
        );
      }
    }

    // STAGE 2: Search in kalams table (primary titles or slug)
    const { data: kalamsData } = await supabase
      .from("kalams")
      .select("id, primary_title_roman, primary_title_urdu, slug, authors(name_roman, name_urdu), kalam_translations(id, title, language, lyrics)")
      .or(`primary_title_roman.ilike.%${query}%,primary_title_urdu.ilike.%${query}%,slug.ilike.%${query}%`)
      .limit(150);

    if (kalamsData) {
      for (const item of kalamsData) {
        const authorData = item.authors as { name_roman: string } | { name_roman: string }[] | null;
        const authorName = (Array.isArray(authorData) ? authorData[0]?.name_roman : authorData?.name_roman) || "Unknown Poet";
        const translations = (item.kalam_translations || []) as { id: string; title: string; language: string; lyrics: string }[];
        const primaryTrans = translations[0] || {};

        processKalamRecord(
          item.id,
          item.primary_title_roman,
          item.primary_title_urdu || null,
          item.slug,
          primaryTrans.title || item.primary_title_roman,
          primaryTrans.language || "roman_english",
          authorName,
          primaryTrans.lyrics || ""
        );
      }
    }

    // STAGE 3: Search by Author Name (e.g. "Ala Hazrat", "Bedam", "Iqbal")
    const { data: authorsData } = await supabase
      .from("authors")
      .select("id, name_roman, name_urdu, kalams(id, primary_title_roman, primary_title_urdu, slug, kalam_translations(id, title, language, lyrics))")
      .or(`name_roman.ilike.%${query}%,name_urdu.ilike.%${query}%`)
      .limit(50);

    if (authorsData) {
      for (const author of authorsData) {
        const authorName = author.name_roman;
        const kalams = (author.kalams || []) as { id: string; primary_title_roman: string; primary_title_urdu?: string; slug: string; kalam_translations?: { id: string; title: string; language: string; lyrics: string }[] }[];
        for (const kalam of kalams) {
          const translations = kalam.kalam_translations || [];
          const primaryTrans = translations[0] || {};
          processKalamRecord(
            kalam.id,
            kalam.primary_title_roman,
            kalam.primary_title_urdu || null,
            kalam.slug,
            primaryTrans.title || kalam.primary_title_roman,
            primaryTrans.language || "roman_english",
            authorName,
            primaryTrans.lyrics || ""
          );
        }
      }
    }

    // STAGE 4: Fallback search on individual keywords if query has multiple words but yielded few matches
    if (resultMap.size < 5 && queryWords.length > 1) {
      const longestWord = queryWords.reduce((max, curr) => (curr.length > max.length ? curr : max), "");
      if (longestWord.length >= 3 && longestWord !== lowerQuery) {
        const { data: fallbackData } = await supabase
          .from("kalam_translations")
          .select("kalam_id, title, language, lyrics, kalams(primary_title_roman, primary_title_urdu, slug, authors(name_roman, name_urdu))")
          .or(`title.ilike.%${longestWord}%,lyrics.ilike.%${longestWord}%`)
          .limit(100);

        if (fallbackData) {
          for (const item of fallbackData) {
            const kalam = (Array.isArray(item.kalams) ? item.kalams[0] : item.kalams) as { primary_title_roman: string; primary_title_urdu?: string; slug: string; authors?: { name_roman: string } | { name_roman: string }[] } | null;
            if (!kalam) continue;
            const authorData = kalam.authors;
            const authorName = (Array.isArray(authorData) ? authorData[0]?.name_roman : authorData?.name_roman) || "Unknown Poet";

            processKalamRecord(
              item.kalam_id,
              kalam.primary_title_roman,
              kalam.primary_title_urdu || null,
              kalam.slug,
              item.title,
              item.language,
              authorName,
              item.lyrics
            );
          }
        }
      }
    }

    // Sort all results by relevance score descending
    const sorted = Array.from(resultMap.values()).sort((a, b) => (b.score || 0) - (a.score || 0));
    return sorted.slice(0, limit);
  } catch (err) {
    console.error("Multi-stage search execution error:", err);
    return Array.from(resultMap.values()).slice(0, limit);
  }
}
