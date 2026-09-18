"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SearchResult {
  kalam_id: string;
  title: string;
  matched_title: string;
  language: string;
  slug: string;
  author_name: string;
  author_slug: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on click outside or Escape key
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

  // Debounced API Search
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setAnnouncement("Searching...");
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`);
        if (res.ok) {
          const data: SearchResult[] = await res.json();
          setResults(data);
          setIsOpen(true);
          if (data.length === 0) {
            setAnnouncement(`No Naats found matching "${trimmedQuery}"`);
          } else {
            setAnnouncement(`${data.length} search result${data.length === 1 ? "" : "s"} found`);
          }
        }
      } catch (err) {
        console.error("Search fetch error:", err);
        setAnnouncement("Search error occurred.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle query input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setAnnouncement("");
    }
  };

  // Map database language code to path
  const getLanguagePath = (dbLang: string) => {
    return dbLang.replace("_", "-");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-30">
      {/* Dynamic Screen Reader Live Region */}
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
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Search Kalam, poet, or title..."
          className="w-full px-5 py-4 pl-12 pr-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/20 text-gray-100 placeholder-gray-400 focus:outline-none focus-visible:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/40 shadow-lg text-sm md:text-base hover:border-emerald-500/30 transition-colors [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        />
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-500 transition-colors cursor-pointer"
        >
          {loading ? (
            <svg aria-hidden="true" className="animate-spin h-5 w-5 text-gold-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              setIsOpen(false);
              setAnnouncement("Search cleared.");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute w-full mt-2 rounded-2xl bg-emerald-950 border border-emerald-500/20 shadow-2xl overflow-hidden backdrop-blur-lg z-40 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-5 py-4 text-sm text-gray-400 text-center">
              No Naats found matching &quot;{query}&quot;
            </div>
          ) : (
            <div className="py-2" role="list">
              {results.map((result) => (
                <Link
                  key={result.kalam_id}
                  href={`/kalam/${result.slug}/${getLanguagePath(result.language)}`}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col px-5 py-3 hover:bg-emerald-900/50 border-b border-emerald-500/5 last:border-0 group transition-colors"
                  aria-label={`Read ${result.matched_title} by ${result.author_name} in ${result.language.replace("_", " ")}`}
                >
                  <span className="font-medium text-gray-100 group-hover:text-gold-500 transition-colors">
                    {result.matched_title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      by {result.author_name}
                    </span>
                    <span aria-hidden="true" className="w-1 h-1 rounded-full bg-emerald-500/30"></span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-semibold uppercase">
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
