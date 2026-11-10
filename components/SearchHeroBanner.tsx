"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useMainContentBusy } from "@/components/useMainContentBusy";

const SearchBar = dynamic(() => import("./SearchBar"), {
  loading: () => (
    <div
      className="mx-auto h-14 max-w-xl animate-pulse rounded-2xl border border-emerald-500/10 bg-emerald-900/10 dark:border-emerald-500/10 dark:bg-emerald-950/30"
      role="status"
      aria-label="Loading search"
    />
  ),
});

function isKalamInnerPage(pathname: string): boolean {
  // /kalam/{slug} or /kalam/{slug}/{lang} — not /kalams directory
  return /^\/kalam\/[^/]+(\/[^/]+)?$/.test(pathname);
}

export default function SearchHeroBanner() {
  const pathname = usePathname();
  const kalamLoading = useMainContentBusy();

  if (!isKalamInnerPage(pathname) || kalamLoading) {
    return null;
  }

  return (
    <section
      aria-label="Search Kalam Library"
      className="search-hero-banner relative isolate z-[90] w-full overflow-visible"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="search-hero-banner__tint" />
        <div className="search-hero-banner__glow absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/2 h-44 w-80 -translate-x-1/2 rounded-full bg-emerald-500/12 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-28 w-28 rounded-full bg-gold-500/8 blur-2xl" />
        </div>
      </div>

      <div className="container relative z-[2] overflow-visible py-5 text-center sm:py-7 md:py-9">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 mb-3">
          750+ Naats · Urdu · Roman · Hindi · Bangla
        </p>

        <h2 className="text-2xl md:text-4xl font-extrabold text-amber-700 dark:text-gold-500 tracking-tight mb-1">
          Search Your Kalam
        </h2>

        <p
          lang="ur"
          className="font-urdu text-lg md:text-xl text-emerald-800 dark:text-emerald-400/90 mb-4"
          dir="rtl"
        >
          اپنا کلام تلاش کریں
        </p>

        <p className="mb-5 max-w-2xl mx-auto text-sm leading-relaxed text-gray-600 dark:text-gray-300 md:mb-6 md:text-base">
          Find any Naat, Hamd, or Manqabat by title, poet name, or opening line.
          <span className="hidden sm:inline">
            {" "}
            Start typing to see instant suggestions, or pick a popular Naat from the list.
          </span>
        </p>

        <div className="relative z-[30] mx-auto w-full max-w-xl pb-1">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
