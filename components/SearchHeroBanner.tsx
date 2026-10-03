"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

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

  if (!isKalamInnerPage(pathname)) {
    return null;
  }

  return (
    <section
      aria-label="Search Kalam Library"
      className="search-hero-banner w-full relative z-[90] isolate overflow-visible border-b border-slate-200/80 bg-white dark:border-emerald-500/10 dark:bg-gradient-to-b dark:from-emerald-950/90 dark:via-emerald-950/50 dark:to-transparent"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden dark:block">
        <div className="absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-24 w-24 rounded-full bg-gold-500/5 blur-2xl" />
      </div>

      <div className="container relative py-8 md:py-10 text-center">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 mb-3">
          700+ Naats · Urdu · Roman · Hindi · Bangla
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

        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
          Find any Naat, Hamd, or Manqabat by title, poet name, or opening line.
          Start typing to see instant suggestions, or pick a popular Naat from the list.
        </p>

        <SearchBar />
      </div>
    </section>
  );
}
