/** Shared kalam listing, slug, and SEO helpers. */

export type KalamTranslationLanguage = "roman_english" | "urdu" | "hindi" | "bangla";

export const FEATURED_KALAM_SLUGS = [
  "mustafa-jaan-e-rehmat-pe-lakhon-salaam",
  "sair-e-gulshan-kaun-dekhe-dasht-e-taiba-chhor-kar",
  "noor-wala-aaya-hai-hoor-le-kar-aaya-hai",
  "jidhar-dekhun-madinay-ka-haram-ho",
  "bulalo-phir-mujhe-ae-shah-e-bahr-o-bar-madine-mein",
  "ae-shahanshah-e-madina-assalatu-wassalam",
  "lam-yati-naziruka-fi-nazar",
  "tajdar-e-haram-ae-shehanshah-e-deen-tum-pe-har-dam-karoron-durood-o-salam",
] as const;

/** Popular naats shown when the search box is focused with no query. */
export const SEARCH_SUGGESTIONS: ReadonlyArray<{
  title: string;
  slug: string;
  poet?: string;
}> = [
  {
    title: "Mustafa Jaan-e-Rehmat Pe Lakhon Salaam",
    slug: "mustafa-jaan-e-rehmat-pe-lakhon-salaam",
    poet: "Ala Hazrat Imam Ahmad Raza Khan",
  },
  {
    title: "Sair-e-Gulshan Kaun Dekhe Dasht-e-Taiba Chhor Kar",
    slug: "sair-e-gulshan-kaun-dekhe-dasht-e-taiba-chhor-kar",
    poet: "Ala Hazrat Imam Ahmad Raza Khan",
  },
  {
    title: "Noor Wala Aaya Hai Hoor Le Kar Aaya Hai",
    slug: "noor-wala-aaya-hai-hoor-le-kar-aaya-hai",
    poet: "Maulana Ilyas Attar Qadri",
  },
  {
    title: "Jidhar Dekhun Madinay Ka Haram Ho",
    slug: "jidhar-dekhun-madinay-ka-haram-ho",
    poet: "Muhammad Ilyas Attar Qadri",
  },
  {
    title: "Bulalo Phir Mujhe Ae Shah-e-Bahr-o-Bar Madine Mein",
    slug: "bulalo-phir-mujhe-ae-shah-e-bahr-o-bar-madine-mein",
    poet: "Muhammad Ilyas Attar Qadri",
  },
  {
    title: "Ae Shahanshah-e-Madina Assalatu Wassalam",
    slug: "ae-shahanshah-e-madina-assalatu-wassalam",
    poet: "Ala Hazrat Imam Ahmad Raza Khan",
  },
  {
    title: "Lam Yati Naziruka Fi Nazar",
    slug: "lam-yati-naziruka-fi-nazar",
    poet: "Ala Hazrat Imam Ahmad Raza Khan",
  },
  {
    title: "Tajdar-e-Haram Ae Shehanshah-e-Deen",
    slug: "tajdar-e-haram-ae-shehanshah-e-deen-tum-pe-har-dam-karoron-durood-o-salam",
    poet: "Ala Hazrat Imam Ahmad Raza Khan",
  },
  {
    title: "Peer-o-Murshid Mere Janab-e-Raza",
    slug: "peer-o-murshid-mere-janab-e-raza",
    poet: "Ala Hazrat Imam Ahmad Raza Khan",
  },
  {
    title: "Momin o Waqt-e-Adab Hai Aamad-e-Mehboob-e-Rab Hai",
    slug: "momin-o-waqt-e-adab-hai-aamad-e-mehboob-e-rab-hai",
    poet: "Ala Hazrat Imam Ahmad Raza Khan",
  },
];

const EXACT_JUNK_TITLES = new Set([
  "ayzan",
  "deegar",
  "digar",
  "qata",
  "qatah",
  "qitah",
  "rubai",
  "rubaiyat",
  "hadaiq-e-bakhshish hissa dom",
  "hadaiq e bakhshish hissa dom",
  "test title xyz",
]);

const JUNK_TITLE_PREFIXES = [
  "radeef ",
  "radeef-",
  "radeef-ul",
  "radeef-us",
  "radeef-ush",
  "radeef-ad",
  "radeef-al",
  "radeef-ar",
  "radeef-az",
  "tareekh-e-tab",
  "tareekh e tab",
];

const JUNK_SLUG_PREFIXES = [
  "deegar",
  "digar",
  "ayzan",
  "aizan",
  "radeef-",
  "test-title",
  "hadaiq-e-bakhshish-hissa",
  "tareekh-e-tab-",
  "ghazal-qata",
  "qata-e-band",
];

/** Robots.txt / early reject — OCR headings, misc pages, not real naat URLs. */
export const ROBOTS_DISALLOW_KALAM_PREFIXES = [
  "/kalam/deegar",
  "/kalam/digar",
  "/kalam/ayzan",
  "/kalam/aizan",
  "/kalam/radeef-",
  "/kalam/tareekh-e-tab-",
  "/kalam/test-title",
  "/kalam/hadaiq-e-bakhshish-hissa",
] as const;

export type KalamLike = {
  slug?: string | null;
  primary_title_roman?: string | null;
  primary_title_urdu?: string | null;
};

/** OCR/junk slugs — used for middleware 410 and routing guards. */
export function isJunkKalamSlug(slug: string): boolean {
  const cleaned = (slug || "").toLowerCase().trim();
  if (!cleaned) return true;
  const pseudoTitle = cleaned.replace(/-/g, " ");
  return !isIndexableKalam({ slug: cleaned, primary_title_roman: pseudoTitle });
}

export function isJunkKalamPathname(pathname: string): boolean {
  const match = pathname.match(/^\/kalam\/([^/]+)(?:\/(?:roman-english|urdu|hindi|bangla))?\/?$/);
  if (!match) return false;
  try {
    return isJunkKalamSlug(decodeURIComponent(match[1]));
  } catch {
    return isJunkKalamSlug(match[1]);
  }
}

export function isIndexableKalam(kalam: KalamLike): boolean {
  const title = (kalam.primary_title_roman || "").toLowerCase().trim();
  const slug = (kalam.slug || "").toLowerCase();

  if (!title || !slug) return false;
  if (EXACT_JUNK_TITLES.has(title)) return false;
  if (title.includes("test title")) return false;
  if (JUNK_TITLE_PREFIXES.some((prefix) => title.startsWith(prefix))) return false;
  if (JUNK_SLUG_PREFIXES.some((prefix) => slug === prefix || slug.startsWith(prefix))) return false;
  if (/^deegar-\d+/.test(slug) || /^digar-\d+/.test(slug)) return false;
  return true;
}

export function filterIndexableKalams<T extends KalamLike>(kalams: T[] | null | undefined): T[] {
  return (kalams || []).filter(isIndexableKalam);
}

function isUrduScript(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

/** Roman card + Urdu Nastaliq line (primary title, optional translation title, or lookup map). */
export function resolveKalamUrduTitle(
  kalam: { id?: string; primary_title_urdu?: string | null },
  options?: {
    translationTitle?: string | null;
    urduTitleByKalamId?: Map<string, string>;
  }
): string {
  const primary = (kalam.primary_title_urdu || "").trim();
  if (primary && isUrduScript(primary)) return primary;

  const fromTrans = (options?.translationTitle || "").trim();
  if (fromTrans && isUrduScript(fromTrans)) return fromTrans;

  if (kalam.id && options?.urduTitleByKalamId) {
    const fromMap = (options.urduTitleByKalamId.get(kalam.id) || "").trim();
    if (fromMap && isUrduScript(fromMap)) return fromMap;
  }

  return "";
}

/** Strip honorifics and unsafe characters; cap extreme OCR slugs. */
export function cleanKalamSlug(rawSlug: string): string {
  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    slug = rawSlug;
  }

  slug = slug
    .replace(/[\uFDFA\uFDFB\uFDFDﷺ]/g, "")
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

export function kalamHref(slug: string, lang?: string): string {
  const cleaned = cleanKalamSlug(slug);
  return lang ? `/kalam/${cleaned}/${lang}` : `/kalam/${cleaned}`;
}

/** Search/API language codes (e.g. roman_english) → crawlable kalam path (no /roman-english segment). */
export function kalamHrefFromDbLanguage(slug: string, dbLanguage: string): string {
  const langPath = dbLanguage.replace("_", "-");
  if (langPath === "roman-english") {
    return kalamHref(slug);
  }
  if (langPath in LYRIC_LANGUAGES) {
    return kalamHref(slug, langPath);
  }
  return kalamHref(slug);
}

export function truncateAtWord(text: string, max = 155): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const slice = normalized.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const clipped = (lastSpace > Math.floor(max * 0.6) ? slice.slice(0, lastSpace) : slice).replace(/[,\s;:.]+$/, "");
  return `${clipped}…`;
}

export function firstCouplet(lyrics: string | null | undefined): string {
  if (!lyrics) return "";
  return lyrics
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" / ");
}

export function displayAuthorName(name: string): string {
  if (/imam ahmad raza/i.test(name) && !/ala hazrat/i.test(name)) {
    return `Ala Hazrat ${name}`;
  }
  return name;
}

/** Subtitle under the main H1 — Roman tab shows no Urdu line; other tabs use that language's title. */
export function kalamHeaderSubtitle(
  languageCode: KalamTranslationLanguage,
  options: {
    primaryTitleUrdu?: string | null;
    translationTitle?: string | null;
  }
): { text: string; dir: "ltr" | "rtl"; langAttr: string; fontClass: string } | null {
  if (languageCode === "roman_english") {
    return null;
  }
  if (languageCode === "urdu") {
    const text = (options.primaryTitleUrdu || options.translationTitle || "").trim();
    if (!text) return null;
    return { text, dir: "rtl", langAttr: "ur", fontClass: "font-urdu" };
  }
  const text = (options.translationTitle || "").trim();
  if (!text) return null;
  if (languageCode === "hindi") {
    return { text, dir: "ltr", langAttr: "hi", fontClass: "font-devanagari" };
  }
  return { text, dir: "ltr", langAttr: "bn", fontClass: "font-bengali" };
}

export function inferredSourceCollection(authorName?: string | null): string | null {
  if (!authorName) return null;
  const name = authorName.toLowerCase();
  if (name.includes("ahmad raza")) return "Hadaiq-e-Bakhshish";
  if (name.includes("hasan raza")) return "Zauq-e-Naat / classical naat collections";
  if (name.includes("mustafa raza")) return "Saman-e-Bakhshish";
  if (name.includes("ilyas") || name.includes("attar")) return "Wasail-e-Bakhshish";
  if (name.includes("ahmad yar")) return "classical naat collections";
  return null;
}

export const LYRIC_LANGUAGES = {
  "roman-english": {
    code: "roman_english",
    label: "Roman English",
    dir: "ltr" as const,
    locale: "ur-Latn",
    htmlLang: "ur-Latn",
    path: "roman-english",
  },
  urdu: {
    code: "urdu",
    label: "Urdu (Nastaliq)",
    dir: "rtl" as const,
    locale: "ur-PK",
    htmlLang: "ur",
    path: "urdu",
  },
  hindi: {
    code: "hindi",
    label: "Hindi (Devanagari)",
    dir: "ltr" as const,
    locale: "hi-IN",
    htmlLang: "hi",
    path: "hindi",
  },
  bangla: {
    code: "bangla",
    label: "Bangla (Bengali)",
    dir: "ltr" as const,
    locale: "bn-BD",
    htmlLang: "bn",
    path: "bangla",
  },
} as const;

export type LyricLangKey = keyof typeof LYRIC_LANGUAGES;
