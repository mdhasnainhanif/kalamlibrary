"use client";

import { useEffect, useRef, useState } from "react";
import { ADSENSE_CLIENT, ADSENSE_SLOT_FIRST } from "@/utils/adsConfig";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type AdSenseDisplayProps = {
  slot?: string;
  format?: "auto" | "vertical" | "horizontal";
  className?: string;
};

/**
 * Responsive Google AdSense display ad unit.
 * Supports vertical skyscraper format (desktop sidebars) and responsive mobile format.
 * Automatically collapses when unfilled to prevent white blank spaces.
 */
export default function AdSenseDisplay({
  slot = ADSENSE_SLOT_FIRST,
  format = "auto",
  className = "",
}: AdSenseDisplayProps) {
  const insRef = useRef<HTMLModElement>(null);
  const filled = useRef(false);
  const [isUnfilled, setIsUnfilled] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!ADSENSE_CLIENT || !slot || filled.current) return;

    const ins = insRef.current;
    if (!ins) return;

    // Monitor for Google's data-ad-status attribute to collapse unfilled ad slots
    const observer = new MutationObserver(() => {
      if (ins.getAttribute("data-ad-status") === "unfilled") {
        setIsUnfilled(true);
      }
    });

    observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });

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
    const timer = window.setTimeout(push, 800);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [slot]);

  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  if (isUnfilled) {
    return null;
  }

  const isVertical = format === "vertical";

  return (
    <aside
      aria-label="Advertisement"
      className={`flex justify-center items-center overflow-hidden bg-transparent ${
        isVertical ? "w-full my-0" : "my-6 w-full"
      } ${className}`}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{
          display: "block",
          backgroundColor: "transparent",
          ...(isVertical
            ? { width: "100%", minWidth: "160px", maxWidth: "300px", minHeight: "600px" }
            : { width: "100%", maxWidth: "728px" }),
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={isVertical ? "vertical" : "auto"}
        data-full-width-responsive={isVertical ? "false" : "true"}
      />
    </aside>
  );
}
