import { kalamHref, LYRIC_LANGUAGES, type KalamTranslationLanguage } from "@/utils/kalam";
import { buildCanonicalUrl } from "@/utils/seoConfig";

const LOCALE_BY_CODE: Record<KalamTranslationLanguage, string> = {
  roman_english: LYRIC_LANGUAGES["roman-english"].locale,
  urdu: LYRIC_LANGUAGES.urdu.locale,
  hindi: LYRIC_LANGUAGES.hindi.locale,
  bangla: LYRIC_LANGUAGES.bangla.locale,
};

const PATH_BY_CODE: Record<KalamTranslationLanguage, string | null> = {
  roman_english: null,
  urdu: "urdu",
  hindi: "hindi",
  bangla: "bangla",
};

/** hreflang map: x-default + one URL per available translation (Roman uses base /kalam/slug). */
export function buildKalamLanguageAlternates(
  cleanSlug: string,
  translations: ReadonlyArray<{ language: string }>
): Record<string, string> {
  const base = buildCanonicalUrl(kalamHref(cleanSlug));
  const languages: Record<string, string> = {
    "x-default": base,
  };

  const seenLocales = new Set<string>();

  for (const row of translations) {
    const code = row.language as KalamTranslationLanguage;
    if (!(code in LOCALE_BY_CODE)) continue;

    const locale = LOCALE_BY_CODE[code];
    if (seenLocales.has(locale)) continue;
    seenLocales.add(locale);

    const langPath = PATH_BY_CODE[code];
    languages[locale] =
      langPath === null ? base : buildCanonicalUrl(kalamHref(cleanSlug, langPath));
  }

  return languages;
}
