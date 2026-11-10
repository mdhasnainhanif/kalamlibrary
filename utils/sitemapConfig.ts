import type { LanguagePath } from "@/utils/kalamRouting";

/**
 * Language URLs (/kalam/{slug}/{lang}) listed in the sitemap.
 * Empty = base URLs only. Roll out one at a time: "hindi", then "bangla", then "urdu".
 * Each kalam's primary URL is always listed (base URL, or the language URL its base redirects to).
 */
export const SITEMAP_LANGUAGES: readonly LanguagePath[] = [];
