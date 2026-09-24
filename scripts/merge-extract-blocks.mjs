/**
 * Stateful merge of PDF extract "blocks" (same logic as extract_naats.py).
 */

import { readFileSync } from "fs";

export function cleanKalamSlug(raw) {
  let slug = raw;
  try {
    slug = decodeURIComponent(raw);
  } catch {
    slug = raw;
  }
  slug = slug
    .replace(/[\uFDFA\uFDFB\uFDFD]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[-\s]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length > 90) {
    const trimmed = slug.slice(0, 90);
    const lastHyphen = trimmed.lastIndexOf("-");
    slug = lastHyphen > 40 ? trimmed.slice(0, lastHyphen) : trimmed;
  }
  return slug;
}

function slugifyTitle(roman, urdu) {
  let slug = cleanKalamSlug(roman || "");
  if (!slug || slug === "untitled") slug = cleanKalamSlug(urdu || "");
  return slug;
}

export function stripFooterLines(lyrics) {
  if (!lyrics) return "";
  const lines = lyrics.trim().split("\n");
  while (lines.length) {
    const last = lines[lines.length - 1].trim();
    if (/^(madina|madinah|مدینہ|مـدینہ)$/i.test(last)) {
      lines.pop();
      if (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
    } else break;
  }
  return lines.join("\n").trim();
}

function appendLyrics(existing, addition) {
  const a = stripFooterLines(addition);
  if (!a) return existing || "";
  const e = (existing || "").trim();
  if (!e) return a;
  if (e.includes(a)) return e;
  return `${e}\n\n${a}`;
}

/**
 * @returns {Map<string, { slug, titleRoman, titleUrdu, author, lyrics: Record<string,string> }>}
 */
export function mergeBlocksFromFile(jsonPath) {
  const blocks = JSON.parse(readFileSync(jsonPath, "utf8"));
  if (!Array.isArray(blocks) || !blocks.length) return new Map();

  const hasBlockMeta = blocks.some((b) => "belongs_to_new_kalam" in b);
  if (!hasBlockMeta) {
    const map = new Map();
    for (const item of blocks) {
      const titleRoman = (item.title_roman_english || "").trim();
      if (!titleRoman) continue;
      const slug = slugifyTitle(titleRoman, item.title_urdu);
      map.set(slug, {
        slug,
        titleRoman,
        titleUrdu: item.title_urdu || "",
        author: item.author_name || "",
        lyrics: {
          urdu: stripFooterLines(item.lyrics_urdu),
          roman_english: stripFooterLines(item.lyrics_roman_english),
          hindi: stripFooterLines(item.lyrics_hindi),
          bangla: stripFooterLines(item.lyrics_bangla),
        },
      });
    }
    return map;
  }

  const map = new Map();
  let activeSlug = null;

  for (const block of blocks) {
    const belongsNew = block.belongs_to_new_kalam !== false;
    let roman = (block.title_roman_english || "").trim();
    let urdu = (block.title_urdu || "").trim();

    if (belongsNew || !activeSlug) {
      if (!roman && !urdu) continue;
      activeSlug = slugifyTitle(roman, urdu);
      if (!map.has(activeSlug)) {
        map.set(activeSlug, {
          slug: activeSlug,
          titleRoman: roman || urdu,
          titleUrdu: urdu || roman,
          author: block.author_name || "",
          lyrics: { urdu: "", roman_english: "", hindi: "", bangla: "" },
        });
      }
    }

    const entry = map.get(activeSlug);
    if (!entry) continue;

    for (const lang of ["urdu", "roman_english", "hindi", "bangla"]) {
      const key = lang === "urdu" ? "lyrics_urdu" : lang === "roman_english" ? "lyrics_roman_english" : lang === "hindi" ? "lyrics_hindi" : "lyrics_bangla";
      entry.lyrics[lang] = appendLyrics(entry.lyrics[lang], block[key]);
    }
  }

  return map;
}

export function stanzaCount(lyrics) {
  if (!lyrics?.trim()) return 0;
  return lyrics.split(/\n\n+/).filter((s) => s.trim()).length;
}
