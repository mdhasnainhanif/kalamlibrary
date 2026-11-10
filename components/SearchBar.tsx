"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SEARCH_SUGGESTIONS, kalamHref, kalamHrefFromDbLanguage } from "@/utils/kalam";

interface SearchResult {
  kalam_id: string;
  title: string;
  matched_title: string;
  language: string;
  slug: string;
  author_name: string;
  author_slug: string;
  snippet?: string;
}

interface PoetResult {
  name: string;
  slug: string;
  kalam_count: number;
}

function TrendingIcon() {
  return (
    <svg
      aria-hidden="true"
      className="w-4 h-4 text-gold-500 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [poets, setPoets] = useState<PoetResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const showSuggestions = isOpen && query.trim().length < 2;
  const showResults = isOpen && query.trim().length >= 2;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setAnnouncement("Searching...");
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data: { kalams?: SearchResult[]; poets?: PoetResult[] } = await res.json();
          const kalams = data.kalams ?? [];
          const poetHits = data.poets ?? [];
          setResults(kalams);
          setPoets(poetHits);
          setIsOpen(true);
          const total = kalams.length + poetHits.length;
          setAnnouncement(
            total === 0
              ? `No Naats found matching "${trimmedQuery}"`
              : `${total} search result${total === 1 ? "" : "s"} found`
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Search fetch error:", err);
        setAnnouncement("Search error occurred.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length < 2) {
      setResults([]);
      setPoets([]);
      setIsOpen(true);
      setAnnouncement("");
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (query.trim().length < 2) {
      setAnnouncement(`${SEARCH_SUGGESTIONS.length} popular Naats suggested`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative z-30 isolate w-full max-w-xl mx-auto ${className}`}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <form role="search" onSubmit={handleSearchSubmit} className="relative">
        <label htmlFor="site-search" className="sr-only">
          Search Kalam lyrics, poets, or titles
        </label>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Search Naat, poet, or opening line…"
          autoComplete="off"
          aria-expanded={isOpen}
          aria-controls="search-dropdown"
          aria-autocomplete="list"
          className="w-full border border-emerald-200/90 bg-white/95 text-gray-900 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] placeholder-gray-400 transition-colors hover:border-emerald-300/80 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/40 focus-visible:outline-none dark:border-emerald-500/20 dark:bg-emerald-950/80 dark:text-gray-100 dark:shadow-lg [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden px-5 py-4 pl-12 pr-12 rounded-2xl text-sm md:text-base"
        />
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute top-1/2 -translate-y-1/2 left-4 text-emerald-700 dark:text-gray-400 hover:text-gold-500 transition-colors cursor-pointer"
        >
          {loading ? (
            <svg aria-hidden="true" className="animate-spin text-gold-500 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
        {query && (
          <button
            type="button"
            aria-label="Clear search query"
            onClick={() => {
              setQuery("");
              setResults([]);
              setPoets([]);
              setIsOpen(true);
              setAnnouncement(`${SEARCH_SUGGESTIONS.length} popular Naats suggested`);
            }}
            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {showSuggestions && (
        <div
          id="search-dropdown"
          role="listbox"
          aria-label="Popular Naat suggestions"
          className="absolute left-0 right-0 top-full z-[120] mt-2 max-h-[min(20rem,55vh)] w-full overflow-hidden overflow-y-auto rounded-2xl border border-emerald-500/20 bg-white shadow-xl dark:bg-emerald-950 dark:shadow-2xl"
        >
          <p className="px-5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400/80">
            Popular Naats
          </p>
          <div className="py-1">
            {SEARCH_SUGGESTIONS.map((item) => (
              <Link
                key={item.slug}
                href={kalamHref(item.slug)}
                role="option"
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 px-5 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 border-b border-emerald-500/10 dark:border-emerald-500/5 last:border-0 group transition-colors"
                aria-label={`Read ${item.title}${item.poet ? ` by ${item.poet}` : ""}`}
              >
                <TrendingIcon />
                <div className="min-w-0 flex-1 text-left">
                  <span className="block text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-gold-500 transition-colors leading-snug">
                    {item.title}
                  </span>
                  {item.poet && (
                    <span className="block text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {item.poet}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showResults && (
        <div
          id="search-dropdown"
          className="absolute left-0 right-0 top-full z-[120] mt-2 max-h-[min(20rem,55vh)] w-full overflow-hidden overflow-y-auto rounded-2xl border border-emerald-500/20 bg-white shadow-xl dark:bg-emerald-950 dark:shadow-2xl"
        >
          {results.length === 0 && poets.length === 0 && !loading ? (
            <div className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              No Naats found matching &quot;{query}&quot;
            </div>
          ) : (
            <div className="py-2" role="list">
              {poets.map((poet) => (
                <Link
                  key={poet.slug}
                  href={`/author/${poet.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col px-5 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 border-b border-emerald-500/10 dark:border-emerald-500/5 group transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-gold-500">
                    {poet.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Poet · {poet.kalam_count} kalam{poet.kalam_count === 1 ? "" : "s"}
                  </span>
                </Link>
              ))}
              {results.map((result) => (
                <Link
                  key={result.kalam_id}
                  href={kalamHrefFromDbLanguage(result.slug, result.language)}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col px-5 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 border-b border-emerald-500/10 dark:border-emerald-500/5 last:border-0 group transition-colors"
                  aria-label={
                    result.author_name
                      ? `Read ${result.matched_title} by ${result.author_name} in ${result.language.replace("_", " ")}`
                      : `Read ${result.matched_title} in ${result.language.replace("_", " ")}`
                  }
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-gold-500 transition-colors">
                    {result.matched_title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {result.author_name ? (
                      <>
                        <span className="text-xs text-gray-500 dark:text-gray-400">by {result.author_name}</span>
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-emerald-500/30" />
                      </>
                    ) : null}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-semibold uppercase">
                      {result.language.replace("_", " ")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
