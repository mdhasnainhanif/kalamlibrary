import { planKalamRoutes } from "@/utils/kalamRouting";

/**
 * hreflang map for one kalam. The same map is emitted on every URL of the group.
 * Roman text is `ur-Latn` (Urdu in Latin letters). There is no `en` code.
 * `x-default` points at the URL that does not redirect.
 */
export function buildKalamLanguageAlternates(
  cleanSlug: string,
  translations: ReadonlyArray<{ language: string; lyrics?: string | null }>
): Record<string, string> {
  return planKalamRoutes(cleanSlug, translations).alternates;
}
