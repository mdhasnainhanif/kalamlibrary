"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, ADSENSE_SLOT_FIRST } from "@/utils/adsConfig";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type AdSenseDisplayProps = {
  slot?: string;
  className?: string;
};

/**
 * Responsive display ad unit. Script is loaded once in root layout (lazyOnload).
 * Renders only in production so local dev does not hit AdSense.
 */
export default function AdSenseDisplay({
  slot = ADSENSE_SLOT_FIRST,
  className = "",
}: AdSenseDisplayProps) {
  const insRef = useRef<HTMLModElement>(null);
  const filled = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!ADSENSE_CLIENT || !slot || filled.current) return;

    const push = () => {
      if (filled.current || !insRef.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        filled.current = true;
      } catch {
        /* script not ready */
      }
    };

    push();
    if (!filled.current) {
      const t = window.setTimeout(push, 800);
      return () => window.clearTimeout(t);
    }
  }, [slot]);

  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 w-full flex justify-center overflow-hidden ${className}`}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight: 120, width: "100%", maxWidth: 728 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
