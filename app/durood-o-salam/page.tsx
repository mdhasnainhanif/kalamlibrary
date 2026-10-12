import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";
import { filterIndexableKalams, kalamHref } from "@/utils/kalam";
import { DUROOD_SALAM_PAGE, DUROOD_SALAM_SLUGS } from "@/utils/duroodSalamCollection";
import { authorLabelFromRoman } from "@/utils/authorHelper";
import SearchBar from "@/components/SearchBar";
import DuroodKalamList, { type DuroodKalamItem } from "@/components/DuroodKalamList";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: `${DUROOD_SALAM_PAGE.title} — Naat & Kalam Lyrics`,
  description: DUROOD_SALAM_PAGE.description,
  alternates: {
    canonical: buildCanonicalUrl("/durood-o-salam"),
  },
  openGraph: {
    title: `${DUROOD_SALAM_PAGE.title} | Kalam Library`,
    description: DUROOD_SALAM_PAGE.description,
    url: buildCanonicalUrl("/durood-o-salam"),
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.defaultOgImage, width: 1200, height: 630, alt: DUROOD_SALAM_PAGE.title }],
  },
};

export default async function DuroodOSalamPage() {
  const slugs = [...DUROOD_SALAM_SLUGS];

  const { data: rawKalams } = await supabase
    .from("kalams")
    .select("id, slug, primary_title_roman, primary_title_urdu, authors(name_roman)")
    .in("slug", slugs);

  const bySlug = new Map(filterIndexableKalams(rawKalams || []).map((k) => [k.slug, k]));

  const ordered = slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as NonNullable<
    typeof rawKalams
  >[number][];

  const listItems: DuroodKalamItem[] = ordered.map((kalam) => {
    const authorData = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;
    return {
      id: kalam.id,
      slug: kalam.slug,
      primary_title_roman: kalam.primary_title_roman,
      primary_title_urdu: kalam.primary_title_urdu,
      authorName: authorLabelFromRoman(authorData?.name_roman),
    };
  });

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: DUROOD_SALAM_PAGE.title, url: "/durood-o-salam" },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: DUROOD_SALAM_PAGE.title,
    description: DUROOD_SALAM_PAGE.description,
    url: buildCanonicalUrl("/durood-o-salam"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: ordered.length,
      itemListElement: ordered.map((k, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: k.primary_title_roman,
        url: `${SITE_CONFIG.url}${kalamHref(k.slug)}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <main id="main-content" className="container flex-1 py-8 md:py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center justify-center gap-2 text-xs text-emerald-400/80 md:text-sm"
        >
          <Link href="/" className="transition-colors hover:text-gold-500">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-gray-400">{DUROOD_SALAM_PAGE.title}</span>
        </nav>

        <header className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-extrabold text-gold-500 md:text-4xl">{DUROOD_SALAM_PAGE.title}</h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
            {DUROOD_SALAM_PAGE.description}
          </p>
          <p className="mt-4 text-xs text-emerald-300/90">
            {ordered.length} kalams · Urdu, Roman English, Hindi &amp; Bangla
          </p>
          <div className="mx-auto mt-6 max-w-xl px-1">
            <SearchBar />
          </div>
        </header>

        {ordered.length === 0 ? (
          <p className="text-center text-sm text-gray-400">Kalams for this collection are being added.</p>
        ) : (
          <DuroodKalamList kalams={listItems} />
        )}
      </main>
    </>
  );
}
