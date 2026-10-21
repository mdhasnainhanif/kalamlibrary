"use client";

import dynamic from "next/dynamic";

const SearchBar = dynamic(() => import("@/components/SearchBar"), {
  loading: () => (
    <div
      className="mx-auto h-14 max-w-xl animate-pulse rounded-2xl border border-emerald-200/80 bg-white/90 dark:border-emerald-500/10 dark:bg-emerald-950/40"
      role="status"
      aria-label="Loading search"
    />
  ),
});

export default function HomeSearchBar() {
  return <SearchBar />;
}
