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
  format?: "auto" | "vertical";
  className?: string;
};

function pushAdOnce(filled: { current: boolean }) {
  if (filled.current) return true;
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
    filled.current = true;
    return true;
  } catch {
    return false;
  }
}

/**
 * Display ad unit. Script loads in layout (afterInteractive); push retries until ready.
 */
export default function AdSenseDisplay({
  slot = ADSENSE_SLOT_FIRST,
  format = "auto",
  className = "",
}: AdSenseDisplayProps) {
  const insRef = useRef<HTMLModElement>(null);
  const filled = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!ADSENSE_CLIENT || !slot) return;

    const attempt = () => {
      if (typeof window.adsbygoogle === "undefined") return;
      pushAdOnce(filled);
    };

    attempt();
    window.addEventListener("adsense-script-loaded", attempt);
    const interval = window.setInterval(attempt, 400);
    const stop = window.setTimeout(() => window.clearInterval(interval), 20_000);

    return () => {
      window.removeEventListener("adsense-script-loaded", attempt);
      window.clearInterval(interval);
      window.clearTimeout(stop);
    };
  }, [slot]);

  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const isVertical = format === "vertical";

  return (
    <div
      className={`flex justify-center items-start overflow-hidden bg-transparent ${
        isVertical ? "w-full my-0" : "my-6 w-full min-h-[90px]"
      } ${className}`}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{
          display: "block",
          backgroundColor: "transparent",
          ...(isVertical
            ? { width: "100%", minWidth: 160, maxWidth: 300, minHeight: 600 }
            : { width: "100%", maxWidth: 728 }),
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={isVertical ? "vertical" : "auto"}
        data-full-width-responsive={isVertical ? "false" : "true"}
      />
    </div>
  );
}
