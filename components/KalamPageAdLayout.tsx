import type { ReactNode } from "react";
import AdSenseDisplay from "@/components/AdSenseDisplay";
import {
  ADSENSE_SLOT_FIRST,
  ADSENSE_SLOT_VERTICAL_LEFT,
  ADSENSE_SLOT_VERTICAL_RIGHT,
} from "@/utils/adsConfig";

type KalamPageAdLayoutProps = {
  /** Lyrics panel (center column, top) */
  lyrics: ReactNode;
  /** Report link, related kalams, etc. — below mobile ad */
  children?: ReactNode;
};

/**
 * Desktop (xl+): sticky vertical ads left & right of kalam.
 * Mobile/tablet: responsive ad directly under lyrics (sidebars hidden).
 */
export default function KalamPageAdLayout({ lyrics, children }: KalamPageAdLayoutProps) {
  return (
    <div className="w-full flex justify-center items-start gap-4 xl:gap-6 2xl:gap-8 relative">
      <aside
        aria-label="Advertisement left"
        className="hidden xl:flex flex-col items-center w-[160px] 2xl:w-[200px] shrink-0 sticky top-24 self-start"
      >
        <AdSenseDisplay slot={ADSENSE_SLOT_VERTICAL_LEFT} format="auto" className="w-full" />
      </aside>

      <div className="w-full max-w-2xl lg:max-w-3xl flex-1 flex flex-col items-center min-w-0">
        {lyrics}
        <div className="w-full xl:hidden">
          <AdSenseDisplay slot={ADSENSE_SLOT_FIRST} format="auto" />
        </div>
        {children}
      </div>

      <aside
        aria-label="Advertisement right"
        className="hidden xl:flex flex-col items-center w-[160px] 2xl:w-[200px] shrink-0 sticky top-24 self-start"
      >
        <AdSenseDisplay slot={ADSENSE_SLOT_VERTICAL_RIGHT} format="auto" className="w-full" />
      </aside>
    </div>
  );
}
