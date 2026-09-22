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
  format?: "auto" | "vertical";
  /** inline = under lyrics; sidebar = desktop left/right gutter */
  layout?: "inline" | "sidebar";
  className?: string;
};

function requestAdFill(ins: HTMLModElement, pushed: { current: boolean }) {
  if (pushed.current || ins.dataset.adsenseRequested === "1") return;
  if (typeof window.adsbygoogle === "undefined") return;
  try {
    ins.dataset.adsenseRequested = "1";
    (window.adsbygoogle = window.adsbygoogle || []).push({});
    pushed.current = true;
  } catch {
    ins.dataset.adsenseRequested = "0";
  }
}

export default function AdSenseDisplay({
  slot = ADSENSE_SLOT_FIRST,
  format = "auto",
  layout = "inline",
  className = "",
}: AdSenseDisplayProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!ADSENSE_CLIENT || !slot) return;

    const ins = insRef.current;
    if (!ins) return;

    const onStatus = () => {
      const status = ins.getAttribute("data-ad-status");
      if (status === "unfilled") setCollapsed(true);
      if (status === "filled") setCollapsed(false);
    };

    const observer = new MutationObserver(onStatus);
    observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
    onStatus();

    const attempt = () => requestAdFill(ins, pushed);
    attempt();
    window.addEventListener("adsense-script-loaded", attempt);
    const interval = window.setInterval(attempt, 400);
    const stop = window.setTimeout(() => window.clearInterval(interval), 25_000);

    return () => {
      observer.disconnect();
      window.removeEventListener("adsense-script-loaded", attempt);
      window.clearInterval(interval);
      window.clearTimeout(stop);
    };
  }, [slot]);

  if (process.env.NODE_ENV !== "production" || collapsed) {
    return null;
  }

  const isSidebar = layout === "sidebar";
  const isVertical = format === "vertical";

  return (
    <div
      className={`flex justify-center items-start overflow-hidden bg-transparent ${
        isSidebar ? "w-full my-0 min-h-0" : "my-6 w-full min-h-0"
      } ${className}`}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{
          display: "block",
          background: "transparent",
          ...(isSidebar
            ? { width: 300, maxWidth: "100%" }
            : isVertical
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
