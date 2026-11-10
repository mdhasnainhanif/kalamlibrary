export type HtmlLangAttrs = { lang: string; dir: "ltr" | "rtl" };

/**
 * `<html lang dir>` for a pathname.
 *
 * - /kalam/{slug}           → ur-Latn (Roman Urdu text; the base page shows the Roman translation)
 * - /kalam/{slug}/urdu      → ur + rtl
 * - /kalam/{slug}/hindi     → hi
 * - /kalam/{slug}/bangla    → bn
 * - everything else         → en
 *
 * IMPORTANT: this function is serialised with `.toString()` into an inline <head> script
 * (see HTML_LANG_INIT_SCRIPT), so it must stay self-contained: no imports, no outer variables.
 */
export function resolveHtmlLang(pathname: string): HtmlLangAttrs {
  const path = (pathname || "/").replace(/\/+$/, "") || "/";
  const m = /^\/kalam\/[^/]+(?:\/(roman-english|urdu|hindi|bangla))?$/.exec(path);
  if (!m) return { lang: "en", dir: "ltr" };
  if (m[1] === "urdu") return { lang: "ur", dir: "rtl" };
  if (m[1] === "hindi") return { lang: "hi", dir: "ltr" };
  if (m[1] === "bangla") return { lang: "bn", dir: "ltr" };
  return { lang: "ur-Latn", dir: "ltr" };
}

/** `lang` attribute for a locale: keeps the script subtag for ur-Latn, otherwise the bare language ("hi-IN" → "hi"). */
export function langAttrFromLocale(locale: string): string {
  return /-Latn$/i.test(locale) ? locale : locale.split("-")[0];
}

/** Runs before first paint so <html> is correct for the initial page; HtmlLangSync handles client-side navigations. */
export const HTML_LANG_INIT_SCRIPT = `(function(){try{var f=${resolveHtmlLang.toString()};var r=f(location.pathname);var e=document.documentElement;e.setAttribute("lang",r.lang);e.setAttribute("dir",r.dir);}catch(e){}})();`;
