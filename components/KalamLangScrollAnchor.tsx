"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SCROLL_FLAG = "kalam-lang-tab-switch";

/** After language tab navigation, scroll to the tab bar (not page top). */
export default function KalamLangScrollAnchor() {
  const pathname = usePathname();

  useEffect(() => {
    let shouldScroll = false;
    try {
      shouldScroll = sessionStorage.getItem(SCROLL_FLAG) === "1";
      if (shouldScroll) {
        sessionStorage.removeItem(SCROLL_FLAG);
      }
    } catch {
      /* ignore */
    }
    if (!shouldScroll) return;

    const scrollToTabs = () => {
      document.getElementById("kalam-lang-tabs")?.scrollIntoView({ block: "start", behavior: "auto" });
    };

    // scroll={false} keeps reading position; only nudge when navigation still landed at top
    requestAnimationFrame(() => {
      if (window.scrollY < 80) {
        scrollToTabs();
      }
    });
  }, [pathname]);

  return null;
}
