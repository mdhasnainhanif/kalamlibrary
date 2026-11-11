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
        <div className="search-hero-banner__pattern search-hero-banner__pattern--primary" />
        <div className="search-hero-banner__pattern search-hero-banner__pattern--weave" />
        <div className="search-hero-banner__vignette" />
        <div className="search-hero-banner__tint" />
        <div className="search-hero-banner__glow">
          <div className="search-hero-banner__glow-orb search-hero-banner__glow-orb--emerald" />
          <div className="search-hero-banner__glow-orb search-hero-banner__glow-orb--gold" />
        </div>
      </div>

      <div className="container relative z-[2] py-6 text-center sm:py-8 md:py-10">
        <div className="search-hero-banner__inner mx-auto max-w-3xl px-3 sm:px-5">
          <p className="search-hero-banner__eyebrow mb-3 text-[10px] font-bold uppercase tracking-[0.22em] md:text-xs">
            750+ Naats · Urdu · Roman · Hindi · Bangla
          </p>

          <h2 className="search-hero-banner__title mb-1 text-3xl font-semibold tracking-tight md:text-[2.35rem] md:leading-tight">
            Search Your Kalam
          </h2>

          <p
            lang="ur"
            className="search-hero-banner__urdu mb-4 font-urdu text-xl md:mb-5 md:text-2xl"
            dir="rtl"
          >
            اپنا کلام تلاش کریں
          </p>

          <p className="search-hero-banner__lede mx-auto mb-6 max-w-2xl text-sm leading-relaxed md:mb-7 md:text-[15px]">
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
      </div>
    </section>
  );
}
