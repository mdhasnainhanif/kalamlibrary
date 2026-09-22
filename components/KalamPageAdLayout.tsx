"use client";

import { useCallback, useState, type ReactNode } from "react";
import AdSenseDisplay, { type AdSenseResolveStatus } from "@/components/AdSenseDisplay";
import {
  ADSENSE_SLOT_FIRST,
  ADSENSE_SLOT_VERTICAL_LEFT,
  ADSENSE_SLOT_VERTICAL_RIGHT,
} from "@/utils/adsConfig";

type KalamPageAdLayoutProps = {
  lyrics: ReactNode;
  children?: ReactNode;
};

function SidebarGutter({
  side,
  slot,
}: {
  side: "left" | "right";
  slot: string;
}) {
  const [status, setStatus] = useState<AdSenseResolveStatus>("pending");
  const onResolve = useCallback((s: AdSenseResolveStatus) => setStatus(s), []);

  if (status === "unfilled") {
    return null;
  }

  const showGutter = status === "filled";

  return (
    <aside
      aria-label={`Advertisement ${side}`}
      aria-hidden={!showGutter}
      className={`hidden xl:block shrink-0 sticky top-24 self-start min-h-0 ${
        showGutter ? "w-[300px]" : "w-0 overflow-hidden"
      }`}
    >
      <div className="w-[300px]">
        <AdSenseDisplay
          slot={slot}
          format="rectangle"
          layout="sidebar"
          onResolve={onResolve}
        />
      </div>
    </aside>
  );
}

export default function KalamPageAdLayout({ lyrics, children }: KalamPageAdLayoutProps) {
  return (
    <div className="w-full flex justify-center items-start gap-0 xl:gap-4 relative">
      <SidebarGutter side="left" slot={ADSENSE_SLOT_VERTICAL_LEFT} />

      <div className="w-full max-w-2xl lg:max-w-3xl flex-1 flex flex-col items-center min-w-0">
        {lyrics}
        <div className="w-full xl:hidden">
          <AdSenseDisplay slot={ADSENSE_SLOT_FIRST} format="auto" layout="inline" />
        </div>
        {children}
      </div>

      <SidebarGutter side="right" slot={ADSENSE_SLOT_VERTICAL_RIGHT} />
    </div>
  );
}
