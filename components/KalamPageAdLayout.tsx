"use client";

import type { ReactNode } from "react";
import AdSenseDisplay from "@/components/AdSenseDisplay";
import {
  ADSENSE_SLOT_FIRST,
  ADSENSE_SLOT_VERTICAL_LEFT,
  ADSENSE_SLOT_VERTICAL_RIGHT,
} from "@/utils/adsConfig";

type KalamPageAdLayoutProps = {
  lyrics: ReactNode;
  children?: ReactNode;
};

/**
 * Desktop (xl+): left/right ads (300px gutters — AdSense auto needs ~250px+ width).
 * Mobile: one responsive unit under lyrics; sidebars not mounted.
 */
export default function KalamPageAdLayout({ lyrics, children }: KalamPageAdLayoutProps) {
  return (
    <div className="w-full flex justify-center items-start gap-4 xl:gap-6 relative">
      <aside
        aria-label="Advertisement left"
        className="hidden xl:block w-[300px] shrink-0 sticky top-24 self-start min-h-0"
      >
        <AdSenseDisplay
          slot={ADSENSE_SLOT_VERTICAL_LEFT}
          format="auto"
          layout="sidebar"
          className="w-full"
        />
      </aside>

      <div className="w-full max-w-2xl lg:max-w-3xl flex-1 flex flex-col items-center min-w-0">
        {lyrics}
        <div className="w-full xl:hidden">
          <AdSenseDisplay slot={ADSENSE_SLOT_FIRST} format="auto" layout="inline" />
        </div>
        {children}
      </div>

      <aside
        aria-label="Advertisement right"
        className="hidden xl:block w-[300px] shrink-0 sticky top-24 self-start min-h-0"
      >
        <AdSenseDisplay
          slot={ADSENSE_SLOT_VERTICAL_RIGHT}
          format="auto"
          layout="sidebar"
          className="w-full"
        />
      </aside>
    </div>
  );
}
