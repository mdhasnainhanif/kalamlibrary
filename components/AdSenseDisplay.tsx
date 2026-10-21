"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, ADSENSE_SLOT_FIRST } from "@/utils/adsConfig";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export type AdSenseResolveStatus = "pending" | "filled" | "unfilled";

type AdSenseDisplayProps = {
  slot?: string;
  format?: "auto" | "rectangle";
  layout?: "inline" | "sidebar";
  className?: string;
  /** Keeps layout stable while the ad slot resolves (homepage CLS). */
  reserveSpace?: boolean;
  onResolve?: (status: AdSenseResolveStatus) => void;
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

function readAdStatus(ins: HTMLModElement): AdSenseResolveStatus {
  const raw = ins.getAttribute("data-ad-status");
  if (raw === "filled") return "filled";
  if (raw === "unfilled") return "unfilled";
  return "pending";
}

export default function AdSenseDisplay({
  slot = ADSENSE_SLOT_FIRST,
  format = "auto",
  layout = "inline",
  className = "",
  reserveSpace = false,
  onResolve,
}: AdSenseDisplayProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const lastReported = useRef<AdSenseResolveStatus | null>(null);
  const onResolveRef = useRef(onResolve);
  onResolveRef.current = onResolve;

  const report = (status: AdSenseResolveStatus) => {
    if (lastReported.current === status) return;
    lastReported.current = status;
    onResolveRef.current?.(status);
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!ADSENSE_CLIENT || !slot) return;

    const ins = insRef.current;
    if (!ins) return;

    lastReported.current = null;
    report("pending");

    const syncStatus = () => report(readAdStatus(ins));

    const observer = new MutationObserver(syncStatus);
    observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
    syncStatus();

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

  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const isSidebar = layout === "sidebar";
  const isRectangle = format === "rectangle";
  const reserveInline = reserveSpace && !isSidebar && !isRectangle;

  return (
    <div
      className={`flex justify-center items-start overflow-hidden bg-transparent ${
        reserveInline ? "min-h-[100px] sm:min-h-[120px]" : "min-h-0"
      } ${isSidebar ? "w-full my-0" : "my-6 w-full"} ${className}`}
    >
      <ins
        ref={insRef}
        className="adsbygoogle ad-slot-host"
        style={{
          display: "block",
          background: "transparent",
          ...(isRectangle
            ? { width: 300, height: 250 }
            : isSidebar
              ? { width: 300, maxWidth: "100%" }
              : { width: "100%", maxWidth: 728 }),
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={isRectangle ? "rectangle" : "auto"}
        data-full-width-responsive={isRectangle ? "false" : "true"}
      />
    </div>
  );
}
