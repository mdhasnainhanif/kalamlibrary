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

export function stripUrduAerab(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F\u0670\u0671\u0640\u0654]/g, "") // Aerab / diacritics / tatweel / hamza above
    .replace(/[\u0622\u0623\u0625]/g, "\u0627") // Alif variants -> Alif
    .replace(/[\u06C1\u06C2\u06D5]/g, "\u06C1") // Heh variants
    .replace(/[\u0649\u064A]/g, "\u06CC") // Arabic Yeh -> Urdu Ye
    .replace(/\s+/g, " ")
    .trim();
}

export async function searchKalams(rawQuery: string, limit = 40): Promise<SearchResultItem[]> {
  const query = rawQuery.trim();
  if (!query) return [];

  const lowerQuery = query.toLowerCase();
  const normQuery = stripUrduAerab(lowerQuery);

  // Extract individual words for multi-term matching
  const queryWords = lowerQuery
    .replace(/[^\w\s\u0600-\u06FF\u0900-\u097F\u0980-\u09FF]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const normQueryWords = queryWords.map((w) => stripUrduAerab(w)).filter((w) => w.length > 0);

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

    const titleLower = (matchedTitle || "").toLowerCase();
    const primaryLower = (primaryTitleRoman || "").toLowerCase();
    const urduLower = (primaryTitleUrdu || "").toLowerCase();
    const authorLower = (authorName || "").toLowerCase();
    const lyrics = lyricsSample || "";

    const titleNorm = stripUrduAerab(titleLower);
    const primaryNorm = stripUrduAerab(primaryLower);
    const urduNorm = stripUrduAerab(urduLower);
    const lyricsNorm = stripUrduAerab(lyrics.toLowerCase());

    let score = 0;

    // 1. Exact match in title (with aerab normalization)
    if (titleNorm === normQuery || primaryNorm === lowerQuery || urduNorm === normQuery) {
      score += 300;
    }
    // 2. Starts with query
    else if (titleNorm.startsWith(normQuery) || primaryNorm.startsWith(lowerQuery) || urduNorm.startsWith(normQuery)) {
      score += 200;
    }
    // 3. Substring match in title
    else if (titleNorm.includes(normQuery) || primaryNorm.includes(lowerQuery) || urduNorm.includes(normQuery)) {
      score += 150;
    }

    // 4. Author match
    if (authorLower === lowerQuery) {
      score += 180;
    } else if (authorLower.includes(lowerQuery)) {
      score += 80;
    }

    // 5. Check lyrics line-by-line for full phrase or verse match
    let lineMatched = false;
    if (lyricsNorm.includes(normQuery)) {
      score += 140;
      lineMatched = true;
    }

    // 6. Word-by-word matching (words must co-occur in the SAME LINE or TITLE)
    if (normQueryWords.length > 1) {
      let matchedInTitleCount = 0;
      let maxMatchedInSingleLine = 0;

      normQueryWords.forEach((w) => {
        if (titleNorm.includes(w) || primaryNorm.includes(w) || urduNorm.includes(w) || authorLower.includes(w)) {
          matchedInTitleCount++;
        }
      });

      const lines = lyricsNorm.split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        let count = 0;
        for (const w of normQueryWords) {
          if (line.includes(w)) count++;
        }
        if (count > maxMatchedInSingleLine) {
          maxMatchedInSingleLine = count;
        }
      }

      const bestCount = Math.max(matchedInTitleCount, maxMatchedInSingleLine);
      const ratio = bestCount / normQueryWords.length;

      // STRICT RULES FOR SENTENCES / MULTI-WORD QUERIES:
      // If user typed 4+ words (e.g. a full verse), do NOT match unless at least 65% of words co-occur in the same line or title!
      if (normQueryWords.length >= 4) {
        if (score === 0 && ratio < 0.65) {
          return; // Ignore false positives
        }
      } else if (normQueryWords.length >= 2) {
        if (score === 0 && ratio < 0.6) {
          return; // Ignore weak partials
        }
      }

      if (bestCount === normQueryWords.length) {
        score += 110;
      } else {
        score += Math.round(ratio * 75);
      }
    }

    // Minimum score threshold to prevent showing random noise for full line queries
    const minScore = normQueryWords.length >= 4 ? 80 : 30;

    if (score >= minScore) {
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
    }
  };

  try {
    // STAGE 1: Direct search in kalam_translations on full query or normalized query
    const { data: translationData } = await supabase
      .from("kalam_translations")
      .select("kalam_id, title, language, lyrics, kalams(primary_title_roman, primary_title_urdu, slug, authors(name_roman, name_urdu))")
      .or(`title.ilike.%${query}%,lyrics.ilike.%${query}%`)
      .limit(100);

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

    // STAGE 2: Direct search in kalams table (primary titles or slug)
    const { data: kalamsData } = await supabase
      .from("kalams")
      .select("id, primary_title_roman, primary_title_urdu, slug, authors(name_roman, name_urdu), kalam_translations(id, title, language, lyrics)")
      .or(`primary_title_roman.ilike.%${query}%,primary_title_urdu.ilike.%${query}%,slug.ilike.%${query}%`)
      .limit(80);

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

    // STAGE 3: Search by Author Name
    const { data: authorsData } = await supabase
      .from("authors")
      .select("id, name_roman, name_urdu, kalams(id, primary_title_roman, primary_title_urdu, slug, kalam_translations(id, title, language, lyrics))")
      .or(`name_roman.ilike.%${query}%,name_urdu.ilike.%${query}%`)
      .limit(40);

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

    // STAGE 4: Multi-word query fallback using distinctive content keywords (e.g. for Urdu verses with aerab)
    const commonUrduStopwords = new Set(["ہے", "ہیں", "تھا", "تھی", "تھے", "اور", "کا", "کی", "کے", "کو", "سے", "میں", "پر", "نہ", "نہیں", "جو", "وہ", "یہ", "تو", "ہم", "تم", "آپ", "ان", "اس", "کہ", "kar", "mein", "hai", "hain", "ko", "se", "ka", "ki", "ke"]);
    const distinctiveWords = normQueryWords
      .filter((w) => !commonUrduStopwords.has(w) && w.length >= 3)
      .sort((a, b) => b.length - a.length);

    if (resultMap.size < 5 && distinctiveWords.length > 0) {
      // 4a. Query kalams table for top distinctive keywords
      const orFiltersKalams = distinctiveWords.slice(0, 3).map((w) => `primary_title_roman.ilike.%${w}%,primary_title_urdu.ilike.%${w}%`).join(",");
      const { data: wordKalams } = await supabase
        .from("kalams")
        .select("id, primary_title_roman, primary_title_urdu, slug, authors(name_roman, name_urdu), kalam_translations(id, title, language, lyrics)")
        .or(orFiltersKalams)
        .limit(60);

      if (wordKalams) {
        for (const k of wordKalams) {
          const authorData = k.authors as { name_roman: string } | { name_roman: string }[] | null;
          const authorName = (Array.isArray(authorData) ? authorData[0]?.name_roman : authorData?.name_roman) || "Unknown Poet";
          const translations = (k.kalam_translations || []) as { id: string; title: string; language: string; lyrics: string }[];
          for (const t of translations) {
            processKalamRecord(
              k.id,
              k.primary_title_roman,
              k.primary_title_urdu || null,
              k.slug,
              t.title,
              t.language,
              authorName,
              t.lyrics
            );
          }
        }
      }

      // 4b. Query kalam_translations table for top distinctive keywords
      const orFiltersTrans = distinctiveWords.slice(0, 3).map((w) => `title.ilike.%${w}%,lyrics.ilike.%${w}%`).join(",");
      const { data: wordTrans } = await supabase
        .from("kalam_translations")
        .select("kalam_id, title, language, lyrics, kalams(primary_title_roman, primary_title_urdu, slug, authors(name_roman, name_urdu))")
        .or(orFiltersTrans)
        .limit(60);

      if (wordTrans) {
        for (const item of wordTrans) {
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

    // Sort all results by relevance score descending
    const sorted = Array.from(resultMap.values()).sort((a, b) => (b.score || 0) - (a.score || 0));
    return sorted.slice(0, limit);
  } catch (err) {
    console.error("Multi-stage search execution error:", err);
    return Array.from(resultMap.values()).slice(0, limit);
  }
}
