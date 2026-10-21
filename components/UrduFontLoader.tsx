"use client";

import { useEffect } from "react";

/** Applies Nastaliq CSS variables after hero (Latin) has painted. */
export default function UrduFontLoader() {
  useEffect(() => {
    let cancelled = false;

    const timeout = window.setTimeout(() => {
      if (cancelled) return;
      void import("@/utils/urduFont").then(({ notoNastaliqUrdu }) => {
        if (!cancelled) {
          document.documentElement.classList.add(notoNastaliqUrdu.variable);
        }
      });
    }, 1500);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  return null;
}
