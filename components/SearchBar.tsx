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
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API Search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

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
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-50">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Search Kalam (e.g. 'Mustafa Jane Rehmat', 'مصطفیٰ جانِ رحمت', 'मुस्तफ़ा जाने रहमत')..."
          className="w-full px-5 py-4 pl-12 rounded-2xl bg-emerald-950/40 backdrop-blur-md border border-emerald-500/20 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 shadow-lg text-sm md:text-base hover:border-emerald-500/30 transition-all"
        />
        <button
          type="submit"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-500 transition-colors cursor-pointer"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-gold-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute w-full mt-2 rounded-2xl bg-emerald-950 border border-emerald-500/20 shadow-2xl overflow-hidden backdrop-blur-lg z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-5 py-4 text-sm text-gray-400 text-center">
              No Naats found matching "{query}"
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <Link
                  key={result.kalam_id}
                  href={`/kalam/${result.slug}/${getLanguagePath(result.language)}`}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col px-5 py-3 hover:bg-emerald-900/50 border-b border-emerald-500/5 last:border-0 group transition-colors"
                >
                  <span className="font-medium text-gray-100 group-hover:text-gold-500 transition-colors">
                    {result.matched_title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      by {result.author_name}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-emerald-500/30"></span>
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
