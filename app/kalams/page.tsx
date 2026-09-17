import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { SITE_CONFIG, buildCanonicalUrl, buildBreadcrumbJsonLd } from "@/utils/seoConfig";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    letter?: string;
  }>;
}

export const revalidate = 3600; // Cache for 1 hour

const PAGE_SIZE = 48;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page, letter } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const activeLetter = letter ? letter.toUpperCase() : undefined;
  const filterDesc = activeLetter ? ` starting with letter '${activeLetter}'` : "";

  const title = `All Kalam & Naat Lyrics Directory${currentPage > 1 ? ` (Page ${currentPage})` : ""}${filterDesc} - Kalam Library`;
  const description = `Explore the complete alphabetical index of over 700+ authentic Islamic Naats, Hamd, and Sufi Kalam lyrics${filterDesc}. Read in Roman English, Urdu Nastaliq, Hindi, and Bangla.`;

  const queryParams: Record<string, string | number> = {};
  if (currentPage > 1) queryParams.page = currentPage;
  if (activeLetter) queryParams.letter = activeLetter;

  const canonicalUrl = buildCanonicalUrl("/kalams", Object.keys(queryParams).length > 0 ? queryParams : undefined);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.defaultOgImage,
          width: 1200,
          height: 630,
          alt: "All Kalam & Naat Lyrics Directory - Kalam Library",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_CONFIG.defaultOgImage],
    },
  };
}

export default async function KalamsBrowsePage({ searchParams }: PageProps) {
  const { page, letter } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const activeLetter = letter ? letter.toUpperCase() : null;

  // Build query
  let query = supabase
    .from("kalams")
    .select("*, authors(*)", { count: "exact" })
    .order("primary_title_roman", { ascending: true });

  if (activeLetter) {
    query = query.ilike("primary_title_roman", `${activeLetter}%`);
  }

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: rawKalams, count, error } = await query.range(from, to);

  const kalams = (rawKalams || []).filter(
    (k) =>
      k.primary_title_roman.toLowerCase().trim() !== "deegar" &&
      k.primary_title_urdu?.trim() !== "دیگر" &&
      !k.slug.startsWith("deegar") &&
      !k.slug.startsWith("digar")
  );

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Kalam Library - All Naat Lyrics Directory",
    "description": "Complete alphabetical directory of digitized Islamic Naats, Hamd, and devotional Sufi poetry.",
    "url": buildCanonicalUrl("/kalams", { page: currentPage > 1 ? currentPage : undefined, letter: activeLetter || undefined }),
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": kalams.length,
      "itemListElement": kalams.map((k, index) => ({
        "@type": "ListItem",
        "position": from + index + 1,
        "name": k.primary_title_roman,
        "url": `${SITE_CONFIG.url}/kalam/${k.slug}`,
      })),
    },
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "All Kalams", url: "/kalams" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 flex-1">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center justify-center gap-2">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-400 font-medium">All Kalam Library</span>
        </nav>

        {/* Header section */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gold-500 mb-4 tracking-tight">
            Kalam Lyrics Directory
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Browse through our complete digital archive of devotional Naats, Manqabats, and Hamd. Select a poem to read full lyrics in multiple scripts.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/15 text-xs text-emerald-300 font-medium">
            <span>{totalCount} Total Kalams Archived</span>
          </div>
        </header>

        {/* Alphabet Filter Quick Jump */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center justify-start md:justify-center gap-1.5 min-w-max px-2">
            <Link
              href="/kalams"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !activeLetter
                  ? "bg-gold-500 text-black shadow-md"
                  : "bg-emerald-950/60 border border-emerald-500/10 text-gray-300 hover:text-white hover:bg-emerald-900/40"
              }`}
            >
              ALL
            </Link>
            {ALPHABET.map((char) => (
              <Link
                key={char}
                href={`/kalams?letter=${char}`}
                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  activeLetter === char
                    ? "bg-gold-500 text-black shadow-md scale-105"
                    : "bg-emerald-950/60 border border-emerald-500/10 text-gray-300 hover:text-white hover:bg-emerald-900/40"
                }`}
              >
                {char}
              </Link>
            ))}
          </div>
        </div>

        {/* Kalam Grid */}
        {error || kalams.length === 0 ? (
          <div className="text-center py-16 bg-emerald-900/10 border border-dashed border-emerald-500/15 rounded-2xl">
            <p className="text-gray-400 text-sm">
              {activeLetter
                ? `No Kalams found starting with '${activeLetter}'.`
                : "No Kalams found."}
            </p>
            {activeLetter && (
              <Link
                href="/kalams"
                className="mt-4 inline-block text-xs font-semibold text-gold-500 hover:underline"
              >
                Clear filter &rarr;
              </Link>
            )}
          </div>
        ) : (
          <section aria-label="Kalam List" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {kalams.map((kalam) => {
              const authorData = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;
              const authorName = authorData ? authorData.name_roman : "Unknown Poet";

              return (
                <Link
                  key={kalam.id}
                  href={`/kalam/${kalam.slug}`}
                  aria-label={`Read ${kalam.primary_title_roman} lyrics by ${authorName}`}
                  className="p-4 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex flex-col justify-between h-32 text-left group"
                >
                  <div>
                    <h2 className="font-semibold text-gray-100 group-hover:text-gold-500 transition-colors text-sm line-clamp-2">
                      {kalam.primary_title_roman}
                    </h2>
                    {kalam.primary_title_urdu && (
                      <span lang="ur" className="text-sm text-emerald-400/80 font-urdu mt-1 block truncate" dir="rtl">
                        {kalam.primary_title_urdu}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-500/5 text-[11px] text-gray-400">
                    <span className="truncate max-w-[80%]">{authorName}</span>
                    <svg aria-hidden="true" className="w-3.5 h-3.5 text-emerald-400 group-hover:text-gold-500 transform group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </section>
        )}

        {/* Crawlable Pagination Controls */}
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-emerald-500/10 flex-wrap">
            {currentPage > 1 && (
              <Link
                href={`/kalams?page=${currentPage - 1}${activeLetter ? `&letter=${activeLetter}` : ""}`}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-950/60 border border-emerald-500/10 text-gray-300 hover:text-white hover:bg-emerald-900/40 transition-all"
              >
                &larr; Previous
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;

                return (
                  <span key={p} className="flex items-center gap-2">
                    {showEllipsis && <span className="text-gray-500 text-xs px-1">...</span>}
                    <Link
                      href={`/kalams?page=${p}${activeLetter ? `&letter=${activeLetter}` : ""}`}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={`w-9 h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                        p === currentPage
                          ? "bg-gold-500 text-black font-bold shadow-md shadow-gold-500/10"
                          : "bg-emerald-950/60 border border-emerald-500/10 text-gray-300 hover:text-white hover:bg-emerald-900/40"
                      }`}
                    >
                      {p}
                    </Link>
                  </span>
                );
              })}

            {currentPage < totalPages && (
              <Link
                href={`/kalams?page=${currentPage + 1}${activeLetter ? `&letter=${activeLetter}` : ""}`}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-950/60 border border-emerald-500/10 text-gray-300 hover:text-white hover:bg-emerald-900/40 transition-all"
              >
                Next &rarr;
              </Link>
            )}
          </nav>
        )}
      </main>
    </>
  );
}
