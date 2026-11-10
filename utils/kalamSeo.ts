import { truncateAtWord, type KalamTranslationLanguage } from "@/utils/kalam";

/** Wording used in <title>, H1 and meta descriptions (not the tab labels). */
export const SEO_LANGUAGE_LABEL: Record<KalamTranslationLanguage, string> = {
  roman_english: "Roman English",
  urdu: "Urdu",
  hindi: "Hindi",
  bangla: "Bangla",
};

const LANGUAGE_ORDER: KalamTranslationLanguage[] = ["roman_english", "urdu", "hindi", "bangla"];

/** ≈ the visible length Google shows for the part of the title we control (the " | Kalam Library" suffix is added by the root layout template). */
export const SEO_TITLE_BUDGET = 60;

/** Languages that exist for this kalam, in a stable display order. */
export function availableLanguages(translations: ReadonlyArray<{ language: string }>): KalamTranslationLanguage[] {
  return LANGUAGE_ORDER.filter((code) => translations.some((t) => t.language === code));
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** "{Title} Lyrics in {Language}" — used as the H1 and as the base of the <title>. */
export function buildKalamHeading(titleRoman: string, lang: KalamTranslationLanguage): string {
  return `${titleRoman.trim()} Lyrics in ${SEO_LANGUAGE_LABEL[lang]}`;
}

/** Heading, plus " – {Poet}" only when the result still fits in the title budget. */
export function buildKalamSeoTitle(
  titleRoman: string,
  lang: KalamTranslationLanguage,
  poet?: string | null,
  budget: number = SEO_TITLE_BUDGET
): string {
  const heading = buildKalamHeading(titleRoman, lang);
  const name = (poet || "").trim();
  if (!name) return heading;
  const withPoet = `${heading} – ${name}`;
  return withPoet.length <= budget ? withPoet : heading;
}

/**
 * Meta description built only from languages that really exist for this kalam.
 * - `lang`: the language of the content on this URL.
 * - `scriptTitle`: the title in the page's own script (Urdu / Devanagari / Bengali); omit for Roman pages.
 * - `mentionAllLanguages`: true on the main /kalam/{slug} page (lists every available language);
 *   false on /kalam/{slug}/{lang} (names this language, then "Also in …" for the rest).
 */
export function buildKalamDescription(options: {
  titleRoman: string;
  lang: KalamTranslationLanguage;
  available: KalamTranslationLanguage[];
  poet?: string | null;
  scriptTitle?: string | null;
  opening?: string | null;
  mentionAllLanguages?: boolean;
}): string {
  const { titleRoman, lang, available, poet, scriptTitle, opening, mentionAllLanguages } = options;
  const by = poet ? ` by ${poet}` : "";
  const title = titleRoman.trim();
  const script = (scriptTitle || "").trim();

  let lead: string;
  if (mentionAllLanguages) {
    const labels = available.map((code) => SEO_LANGUAGE_LABEL[code]);
    lead = `${title}${script ? ` (${script})` : ""} lyrics${by} in ${joinList(labels)}.`;
  } else {
    lead = `${title}${script ? ` (${script})` : ""} lyrics in ${SEO_LANGUAGE_LABEL[lang]}${by}.`;
    const others = available.filter((code) => code !== lang).map((code) => SEO_LANGUAGE_LABEL[code]);
    if (others.length > 0) lead += ` Also in ${joinList(others)}.`;
  }

  const couplet = (opening || "").trim();
  return truncateAtWord(couplet ? `${lead} ${couplet}` : lead);
}
