import Link from "next/link";
import { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import { searchKalams, type SearchResponse } from "@/utils/searchHelper";
import { kalamHrefFromDbLanguage } from "@/utils/kalam";
import { buildCanonicalUrl } from "@/utils/seoConfig";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const title = q ? `Search results for "${q}" | Kalam Library` : "Search Kalam Lyrics | Kalam Library";
  const description = q
    ? `Browse Naat lyrics search results for "${q}" on Kalam Library. Read in Roman English, Urdu, Hindi, and Bangla.`
    : "Search through our extensive collection of classic Islamic Sufi Naat, Hamd and Kalam lyrics.";
  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: buildCanonicalUrl("/search", q ? { q } : undefined),
    },
  };
}

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  let results: SearchResponse = { kalams: [], poets: [] };
  let errorMsg = "";

  if (query.length >= 2) {
    try {
      results = await searchKalams(query);
    } catch (err) {
      console.error("Search query database error:", err);
      errorMsg = "Something went wrong while querying the database.";
    }
  }

  return (
    <main id="main-content" className="container py-8 md:py-16 flex-grow">
      {/* Header section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gold-500 mb-4">
          {query ? `Search Results for "${query}"` : "Search Kalam Lyrics"}
        </h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
          Find lyrics in Roman English, Urdu (Nastaliq), Hindi (Devanagari), and Bangla.
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </div>

      {/* Results grid */}
      <div className="border-t border-emerald-500/10 pt-8 mt-8">
        {!query ? (
          <div className="text-center py-12 text-gray-400">
            Please enter a search query above to browse the library.
          </div>
        ) : query.length < 2 ? (
          <div className="text-center py-12 text-gray-400">
            Search term must be at least 2 characters long.
          </div>
        ) : errorMsg ? (
          <div className="text-center py-12 text-rose-400 font-medium" role="alert">
            {errorMsg}
          </div>
        ) : results.kalams.length === 0 && results.poets.length === 0 ? (
          <div className="text-center py-12" aria-live="polite">
            <p className="text-gray-300 text-lg font-medium mb-2">No results found</p>
            <p className="text-sm text-gray-400">
              We could not find any odes matching &quot;{query}&quot;. Try checking the spelling or using different keywords.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {results.kalams.length} kalam and {results.poets.length} poet results for &quot;{query}&quot;
            </div>
            {results.poets.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Poets</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.poets.map((poet) => (
                    <Link
                      key={poet.slug}
                      href={`/author/${poet.slug}`}
                      className="rounded-xl border border-emerald-500/10 bg-emerald-900/10 p-4 hover:bg-emerald-900/20"
                    >
                      <span className="block font-semibold text-gray-100">{poet.name}</span>
                      <span className="mt-1 block text-xs text-gray-400">
                        {poet.kalam_count} kalam{poet.kalam_count === 1 ? "" : "s"}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results.kalams.length > 0 && (
            <>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">
              Found {results.kalams.length} matching Kalam{results.kalams.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.kalams.map((result) => {
                return (
                  <Link
                    key={result.kalam_id}
                    href={kalamHrefFromDbLanguage(result.slug, result.language)}
                    aria-label={`Read ${result.matched_title} lyrics by ${result.author_name} in ${result.language.replace("_", " ")}`}
                    className="kalam-list-card p-5 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex flex-col justify-between min-h-36 group"
                  >
                    <div className="kalam-list-card__body">
                      <h2 className="kalam-list-title kalam-list-title--1 font-bold text-gray-100 group-hover:text-gold-500 transition-colors text-base">
                        {result.matched_title}
                      </h2>
                      {result.title !== result.matched_title && (
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          Original: {result.title}
                        </p>
                      )}
                      {result.snippet && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{result.snippet}</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-gray-400 font-medium">
                        By {result.author_name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/10 text-emerald-300 font-semibold uppercase">
                        {result.language.replace("_", " ")}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
