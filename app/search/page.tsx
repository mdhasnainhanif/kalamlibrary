import Link from "next/link";
import { Metadata } from "next";
import { supabase } from "@/utils/supabase";
import SearchBar from "@/components/SearchBar";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
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
    alternates: {
      canonical: `https://kalamlibrary.com/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    },
  };
}

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  let results: any[] = [];
  let errorMsg = "";

  if (query.length >= 2) {
    try {
      const { data, error } = await supabase
        .from("kalam_translations")
        .select("kalam_id, title, language, kalams(primary_title_roman, slug, authors(name_roman))")
        .or(`title.ilike.%${query}%,lyrics.ilike.%${query}%`)
        .limit(300);

      if (error) throw error;

      // Deduplicate results by kalam_id
      const seen = new Set();
      if (data) {
        for (const item of data) {
          const kalam = item.kalams as any;
          const authorData = kalam?.authors;
          const authorName = Array.isArray(authorData)
            ? authorData[0]?.name_roman
            : authorData?.name_roman;

          if (
            kalam &&
            !seen.has(item.kalam_id) &&
            kalam.primary_title_roman.toLowerCase().trim() !== "deegar" &&
            item.title?.toLowerCase().trim() !== "deegar" &&
            item.title?.trim() !== "دیگر" &&
            !kalam.slug.startsWith("deegar") &&
            !kalam.slug.startsWith("digar")
          ) {
            seen.add(item.kalam_id);
            results.push({
              kalam_id: item.kalam_id,
              title: kalam.primary_title_roman,
              matched_title: item.title,
              language: item.language,
              slug: kalam.slug,
              author_name: authorName || "Unknown Poet",
              author_slug: authorName ? slugify(authorName) : "",
            });
          }
        }
      }
      results = results.slice(0, 40);
    } catch (err) {
      console.error("Search query database error:", err);
      errorMsg = "Something went wrong while querying the database.";
    }
  }

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16 flex-grow">
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
          <div className="text-center py-12 text-gray-500">
            Please enter a search query above to browse the library.
          </div>
        ) : query.length < 2 ? (
          <div className="text-center py-12 text-gray-500">
            Search term must be at least 2 characters long.
          </div>
        ) : errorMsg ? (
          <div className="text-center py-12 text-red-400">
            {errorMsg}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg font-medium mb-2">No results found</p>
            <p className="text-sm text-gray-500">
              We couldn't find any odes matching "{query}". Try checking the spelling or using different keywords.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">
              Found {results.length} matching Kalam{results.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((result) => {
                const langPath = result.language.replace("_", "-");
                return (
                  <Link
                    key={result.kalam_id}
                    href={`/kalam/${result.slug}/${langPath}`}
                    className="p-5 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex flex-col justify-between h-36"
                  >
                    <div>
                      <h3 className="font-bold text-gray-100 group-hover:text-gold-500 transition-colors line-clamp-1">
                        {result.matched_title}
                      </h3>
                      {result.title !== result.matched_title && (
                        <p className="text-xs text-gray-400 mt-1">
                          Original: {result.title}
                        </p>
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
          </div>
        )}
      </div>
    </main>
  );
}
