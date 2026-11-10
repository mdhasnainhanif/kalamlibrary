"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { resolveHtmlLang } from "@/utils/htmlLang";

/**
 * Keeps <html lang dir> in step with the current page during client-side navigation.
 * (A single root layout can't read nested route params, so the initial value comes from the
 * inline script in app/layout.tsx and later changes come from here.)
 */
export default function HtmlLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    const { lang, dir } = resolveHtmlLang(pathname);
    const el = document.documentElement;
    if (el.getAttribute("lang") !== lang) el.setAttribute("lang", lang);
    if (el.getAttribute("dir") !== dir) el.setAttribute("dir", dir);
  }, [pathname]);

  return null;
}
