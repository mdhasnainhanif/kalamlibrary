import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isRangeNotSatisfiable, throwIfFailed } from "@/utils/kalamData";
import { supabase } from "@/utils/supabase";
import { SITE_CONFIG, buildCanonicalUrl, buildBreadcrumbJsonLd } from "@/utils/seoConfig";
import SearchBar from "@/components/SearchBar";
import { cleanKalamSlug, kalamHref } from "@/utils/kalam";
import { authorLabelFromRoman } from "@/utils/authorHelper";
import { kalamGridCardClass, kalamGridCardFooterClass } from "@/utils/kalamCardStyles";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export const revalidate = 604800;

const PAGE_SIZE = 48;

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);

  const title = `Naat & Kalam Lyrics Directory${currentPage > 1 ? ` (Page ${currentPage})` : ""}`;
  const description =
    "Alphabetical directory of Islamic Naat, Hamd, and Sufi Kalam lyrics. Read each poem in Roman English, Urdu Nastaliq, Hindi, and Bangla.";

  const queryParams: Record<string, string | number> = {};
  if (currentPage > 1) queryParams.page = currentPage;

  const canonicalUrl = buildCanonicalUrl("/kalams", Object.keys(queryParams).length > 0 ? queryParams : undefined);

  return {
    title,
    description,
    robots:
      currentPage > 1
        ? { index: false, follow: true, googleBot: { index: false, follow: true } }
        : undefined,
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
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);

  let query = supabase
    .from("kalams")
    .select("*, authors(*)", { count: "exact" })
    .order("primary_title_roman", { ascending: true })
    .not("primary_title_roman", "in", "(Ayzan,Deegar,Qata,Rubai,Test Title XYZ,Hadaiq-e-Bakhshish Hissa Dom)")
    .not("primary_title_roman", "ilike", "Radeef%")
    .not("primary_title_roman", "ilike", "Tareekh-e-Tab%")
    .not("slug", "ilike", "deegar%");

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: rawKalams, count, error } = await query.range(from, to);
  // Past the last row is a 404. Any other failure must not render a cacheable empty page.
  if (isRangeNotSatisfiable(error)) notFound();
  throwIfFailed(error, "kalams list");
  const kalams = rawKalams || [];

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Kalam Library - All Naat Lyrics Directory",
    "description": "Complete alphabetical directory of digitized Islamic Naats, Hamd, and devotional Sufi poetry.",
    "url": buildCanonicalUrl("/kalams", { page: currentPage > 1 ? currentPage : undefined }),
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": kalams.length,
      "itemListElement": kalams.map((k, index) => ({
        "@type": "ListItem",
        "position": from + index + 1,
        "name": k.primary_title_roman,
        "url": `${SITE_CONFIG.url}${kalamHref(cleanKalamSlug(k.slug))}`,
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

      <main id="main-content" className="container py-8 md:py-12 flex-1">
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
          <div className="mt-6 mb-2 max-w-xl mx-auto w-full px-1">
            <SearchBar />
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/15 text-xs text-emerald-300 font-medium">
            <span>
              {totalCount} Naats &amp; Kalams
              {totalPages > 1 ? ` · Page ${currentPage} of ${totalPages} ` : ""}
            </span>
          </div>
        </header>

        {/* Kalam Grid */}
        {error || kalams.length === 0 ? (
          <div className="text-center py-16 bg-emerald-900/10 border border-dashed border-emerald-500/15 rounded-2xl">
            <p className="text-gray-400 text-sm">No Kalams found.</p>
          </div>
        ) : (
          <section aria-label="Kalam List" className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kalams.map((kalam) => {
              const authorData = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;
              const authorName = authorLabelFromRoman(authorData?.name_roman);

              return (
                <Link
                  key={kalam.id}
                  href={kalamHref(kalam.slug)}
                  aria-label={
                    authorName
                      ? `Read ${kalam.primary_title_roman} lyrics by ${authorName}`
                      : `Read ${kalam.primary_title_roman} lyrics`
                  }
                  className={kalamGridCardClass}
                >
                  <div className="kalam-list-card__body space-y-1.5">
                    <h2 className="kalam-list-title kalam-list-title--4 text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-gold-500 dark:text-gray-100">
                      {kalam.primary_title_roman}
                    </h2>
                    {kalam.primary_title_urdu && (
                      <p lang="ur" dir="rtl" className="kalam-list-urdu font-urdu text-base text-emerald-700 dark:text-emerald-400/90">
                        {kalam.primary_title_urdu}
                      </p>
                    )}
                  </div>
                  <div className={`${kalamGridCardFooterClass} flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-gray-400`}>
                    {authorName ? <span className="kalam-card-author min-w-0 flex-1">{authorName}</span> : <span className="flex-1" />}
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
                href={currentPage - 1 === 1 ? "/kalams" : `/kalams?page=${currentPage - 1}`}
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
                      href={p === 1 ? "/kalams" : `/kalams?page=${p}`}
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
                href={`/kalams?page=${currentPage + 1}`}
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
