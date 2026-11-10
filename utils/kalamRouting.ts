import { kalamHref, type KalamTranslationLanguage } from "@/utils/kalam";
import { KHATM_E_QADRIA_SLUG } from "@/utils/khatmEQadriaSlug";
import { buildCanonicalUrl } from "@/utils/seoConfig";

export type LanguagePath = "urdu" | "hindi" | "bangla";

const HREFLANG: Record<KalamTranslationLanguage, string> = {
  roman_english: "ur-Latn",
  urdu: "ur-PK",
  hindi: "hi-IN",
  bangla: "bn-BD",
};

const PATH_BY_CODE: Record<KalamTranslationLanguage, LanguagePath | null> = {
  roman_english: null,
  urdu: "urdu",
  hindi: "hindi",
  bangla: "bangla",
};

/**
 * Readers that are rendered on a language URL, so /kalam/{slug} redirects there.
 * This is data for the rule below. Sitemap, hreflang and the page all read it.
 * Khatm-e-Qadria is a row because its paged reader is mounted on /urdu.
 */
export const BASE_REDIRECTS_TO_LANGUAGE: Readonly<Record<string, LanguagePath>> = {
  [KHATM_E_QADRIA_SLUG]: "urdu",
};

export type KalamRoutePlan = {
  /** /kalam/{slug} */
  basePath: string;
  /** Set when the base URL permanently redirects to a language URL. */
  baseRedirectPath: string | null;
  baseRedirectLang: LanguagePath | null;
  /** Set for an Urdu-only kalam whose base URL does not redirect away. */
  urduRedirectsToBase: boolean;
  /** Paths to list in the sitemap. The same hreflang map goes on each of them. */
  indexPaths: string[];
  alternates: Record<string, string>;
};

function hasLyrics(row: { lyrics?: string | null }): boolean {
  // Sitemap rows are already limited to translations with lyrics, so they omit the field.
  if (row.lyrics === undefined) return true;
  return typeof row.lyrics === "string" && row.lyrics.trim().length > 0;
}

function presentLanguages(
  translations: ReadonlyArray<{ language: string; lyrics?: string | null }>
): KalamTranslationLanguage[] {
  const found = new Set<string>();
  for (const row of translations) {
    if (!hasLyrics(row)) continue;
    if (row.language in HREFLANG) found.add(row.language);
  }
  return (Object.keys(HREFLANG) as KalamTranslationLanguage[]).filter((code) => found.has(code));
}

/**
 * One routing decision per kalam.
 * 1. If the base URL redirects to a language URL, that language URL is the only indexed URL.
 * 2. Otherwise an Urdu-only kalam keeps the base URL and /urdu redirects to it.
 * 3. Otherwise the base URL plus each real language URL are indexed.
 */
export function planKalamRoutes(
  cleanSlug: string,
  translations: ReadonlyArray<{ language: string; lyrics?: string | null }>
): KalamRoutePlan {
  const basePath = kalamHref(cleanSlug);
  const baseUrl = buildCanonicalUrl(basePath);
  const baseRedirectLang = BASE_REDIRECTS_TO_LANGUAGE[cleanSlug] ?? null;

  if (baseRedirectLang) {
    const baseRedirectPath = kalamHref(cleanSlug, baseRedirectLang);
    const target = buildCanonicalUrl(baseRedirectPath);
    return {
      basePath,
      baseRedirectPath,
      baseRedirectLang,
      urduRedirectsToBase: false,
      indexPaths: [baseRedirectPath],
      alternates: {
        [HREFLANG[baseRedirectLang]]: target,
        "x-default": target,
      },
    };
  }

  const languages = presentLanguages(translations);
  if (languages.length > 0 && languages.every((code) => code === "urdu")) {
    return {
      basePath,
      baseRedirectPath: null,
      baseRedirectLang: null,
      urduRedirectsToBase: true,
      indexPaths: [basePath],
      alternates: {
        [HREFLANG.urdu]: baseUrl,
        "x-default": baseUrl,
      },
    };
  }

  const alternates: Record<string, string> = { "x-default": baseUrl };
  const indexPaths = [basePath];
  for (const code of languages) {
    const langPath = PATH_BY_CODE[code];
    if (langPath === null) {
      alternates[HREFLANG[code]] = baseUrl;
      continue;
    }
    const path = kalamHref(cleanSlug, langPath);
    alternates[HREFLANG[code]] = buildCanonicalUrl(path);
    indexPaths.push(path);
  }

  return {
    basePath,
    baseRedirectPath: null,
    baseRedirectLang: null,
    urduRedirectsToBase: false,
    indexPaths,
    alternates,
  };
}
