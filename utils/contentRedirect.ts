import { cleanKalamSlug } from "@/utils/kalam";
import { KHATM_E_QADRIA_SLUG } from "@/utils/khatmEQadriaSlug";

export type ContentRedirect = { pathname: string; status: 301 | 308 };

const KALAM_PATH = /^\/kalam\/([^/]+)(\/(?:urdu|hindi|bangla|roman-english))?\/?$/i;
const AUTHOR_PATH = /^\/author\/([^/]+)\/?$/;

/**
 * One redirect for a kalam or author URL.
 * A path change keeps its existing status. Dropping only the query string is a 301.
 * Returns null for every other path, including /search, /api, /contact, and crawler files.
 */
export function contentRedirect(pathname: string, search: string): ContentRedirect | null {
  const roman = pathname.match(/^\/kalam\/([^/]+)\/roman-english\/?$/i);
  if (roman) {
    const clean = cleanKalamSlug(roman[1]);
    if (!clean) return null;
    return { pathname: `/kalam/${clean}`, status: 301 };
  }

  const kalam = pathname.match(KALAM_PATH);
  if (kalam) {
    const clean = cleanKalamSlug(kalam[1]);
    if (!clean) return null;
    const langSuffix = (kalam[2] ?? "").toLowerCase();
    const target =
      !langSuffix && clean === KHATM_E_QADRIA_SLUG
        ? `/kalam/${KHATM_E_QADRIA_SLUG}/urdu`
        : `/kalam/${clean}${langSuffix}`;
    const pathChanged = target !== pathname.replace(/\/$/, "");
    if (!pathChanged && !search) return null;
    return { pathname: target, status: pathChanged ? 308 : 301 };
  }

  const author = pathname.match(AUTHOR_PATH);
  if (author && search) {
    return { pathname: `/author/${author[1]}`, status: 301 };
  }

  return null;
}
