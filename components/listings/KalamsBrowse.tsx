import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import ListingPagination from "@/components/listings/ListingPagination";
import { authorLabelFromRoman } from "@/utils/authorHelper";
import { cleanKalamSlug, kalamHref } from "@/utils/kalam";
import { kalamGridCardClass, kalamGridCardFooterClass } from "@/utils/kalamCardStyles";
import { isRangeNotSatisfiable, throwIfFailed } from "@/utils/kalamData";
import { canonicalPageSegment, kalamsHref, MAX_LISTING_PAGE } from "@/utils/listingPaths";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";
import { supabase } from "@/utils/supabase";

const PAGE_SIZE = 48;

type KalamsPageData = {
  kalams: Array<Record<string, unknown>>;
  totalCount: number;
  totalPages: number;
  error: { message: string } | null;
  from: number;
};

export const loadKalamsPage = cache(async (currentPage: number): Promise<KalamsPageData> => {
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, count, error } = await supabase
    .from("kalams")
    .select("*, authors(*)", { count: "exact" })
    .order("primary_title_roman", { ascending: true })
    .not("primary_title_roman", "in", "(Ayzan,Deegar,Qata,Rubai,Test Title XYZ,Hadaiq-e-Bakhshish Hissa Dom)")
    .not("primary_title_roman", "ilike", "Radeef%")
    .not("primary_title_roman", "ilike", "Tareekh-e-Tab%")
    .not("slug", "ilike", "deegar%")
    .range(from, to);

  const totalCount = count || 0;
  return {
    kalams: data || [],
    totalCount,
    totalPages: Math.ceil(totalCount / PAGE_SIZE) || 1,
    error,
    from,
  };
});

type OnMissing = () => never;

function missingPage(onMissing?: OnMissing): never {
  if (onMissing) onMissing();
  notFound();
}

export function resolveKalamsPage(pageParam?: string, onMissing?: OnMissing): number {
  if (pageParam === undefined) return 1;
  const currentPage = canonicalPageSegment(pageParam);
  if (currentPage === null) missingPage(onMissing);
  return currentPage;
}

async function pageDataOrNotFound(currentPage: number, onMissing?: OnMissing): Promise<KalamsPageData> {
  if (currentPage > MAX_LISTING_PAGE) missingPage(onMissing);
  const data = await loadKalamsPage(currentPage);
  // A range past the end (PostgREST 416) is a 404. Any other failure must not render an empty 200.
  const rangeMiss = isRangeNotSatisfiable(data.error) && currentPage > 1;
  if (!rangeMiss) throwIfFailed(data.error, "kalams list");
  if (currentPage > data.totalPages || (currentPage > 1 && (rangeMiss || data.kalams.length === 0))) {
    missingPage(onMissing);
  }
  return data;
}

export async function kalamsMetadata(currentPage: number, onMissing?: OnMissing): Promise<Metadata> {
  if (currentPage > 1) await pageDataOrNotFound(currentPage, onMissing);

  const title = `Naat & Kalam Lyrics Directory${currentPage > 1 ? ` (Page ${currentPage})` : ""}`;
  const description =
    "Alphabetical directory of Islamic Naat, Hamd, and Sufi Kalam lyrics. Read each poem in Roman English, Urdu Nastaliq, Hindi, and Bangla.";
  const canonicalUrl = buildCanonicalUrl(kalamsHref(currentPage));

  return {
    title,
    description,
    robots:
      currentPage > 1
        ? { index: false, follow: true, googleBot: { index: false, follow: true } }
        : undefined,
    alternates: { canonical: canonicalUrl },
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

export default async function KalamsBrowse({
  currentPage,
  onMissing,
}: {
  currentPage: number;
  onMissing?: OnMissing;
}) {
  const { kalams, totalCount, totalPages, error, from } = await pageDataOrNotFound(currentPage, onMissing);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kalam Library - All Naat Lyrics Directory",
    description: "Complete alphabetical directory of digitized Islamic Naats, Hamd, and devotional Sufi poetry.",
    url: buildCanonicalUrl(kalamsHref(currentPage)),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: kalams.length,
      itemListElement: kalams.map((k, index) => ({
        "@type": "ListItem",
        position: from + index + 1,
        name: k.primary_title_roman,
        url: `${SITE_CONFIG.url}${kalamHref(cleanKalamSlug(String(k.slug)))}`,
      })),
    },
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "All Kalams", url: "/kalams" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main id="main-content" className="container flex-1 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-2 text-xs text-emerald-400/80 md:text-sm">
          <Link href="/" className="transition-colors hover:text-gold-500">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-gray-400">All Kalam Library</span>
        </nav>

        <header className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gold-500 md:text-5xl">
            Kalam Lyrics Directory
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
            Browse through our complete digital archive of devotional Naats, Manqabats, and Hamd. Select a poem to read full lyrics in multiple scripts.
          </p>
          <div className="mx-auto mb-2 mt-6 w-full max-w-xl px-1">
            <SearchBar />
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-950/80 px-4 py-1.5 text-xs font-medium text-emerald-300">
            <span>
              {totalCount} Naats &amp; Kalams
              {totalPages > 1 ? ` · Page ${currentPage} of ${totalPages} ` : ""}
            </span>
          </div>
        </header>

        {error || kalams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-500/15 bg-emerald-900/10 py-16 text-center">
            <p className="text-sm text-gray-400">No Kalams found.</p>
          </div>
        ) : (
          <section aria-label="Kalam List" className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kalams.map((kalam) => {
              const authorData = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;
              const authorName = authorLabelFromRoman(
                (authorData as { name_roman?: string } | null)?.name_roman
              );
              const title = String(kalam.primary_title_roman);
              const urduTitle = kalam.primary_title_urdu ? String(kalam.primary_title_urdu) : "";

              return (
                <Link
                  key={String(kalam.id)}
                  href={kalamHref(String(kalam.slug))}
                  aria-label={authorName ? `Read ${title} lyrics by ${authorName}` : `Read ${title} lyrics`}
                  className={kalamGridCardClass}
                >
                  <div className="kalam-list-card__body space-y-1.5">
                    <h2 className="kalam-list-title kalam-list-title--4 text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-gold-500 dark:text-gray-100">
                      {title}
                    </h2>
                    {urduTitle ? (
                      <p lang="ur" dir="rtl" className="kalam-list-urdu font-urdu text-base text-emerald-700 dark:text-emerald-400/90">
                        {urduTitle}
                      </p>
                    ) : null}
                  </div>
                  <div className={`${kalamGridCardFooterClass} flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-gray-400`}>
                    {authorName ? <span className="kalam-card-author min-w-0 flex-1">{authorName}</span> : <span className="flex-1" />}
                    <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-emerald-400 transition-all group-hover:translate-x-0.5 group-hover:text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </section>
        )}

        <ListingPagination currentPage={currentPage} totalPages={totalPages} hrefFor={kalamsHref} />
      </main>
    </>
  );
}
