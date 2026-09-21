import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";
import { FEATURED_KALAM_SLUGS, SEARCH_SUGGESTIONS, filterIndexableKalams, kalamHref } from "@/utils/kalam";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Trending Naats & Popular Kalam Lyrics",
  description:
    "Popular and trending Naat, Hamd, and Manqabat lyrics on Kalam Library. Read full lyrics in Urdu, Roman English, Hindi, and Bangla.",
  alternates: {
    canonical: buildCanonicalUrl("/trending"),
  },
  openGraph: {
    title: "Trending Naats | Kalam Library",
    description:
      "Discover the most read Naat and Kalam lyrics — Mustafa Jaan-e-Rehmat, Tajdar-e-Haram, and more.",
    url: buildCanonicalUrl("/trending"),
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.defaultOgImage, width: 1200, height: 630, alt: "Trending Naats" }],
  },
};

export default async function TrendingPage() {
  const slugs = [...new Set([...FEATURED_KALAM_SLUGS, ...SEARCH_SUGGESTIONS.map((s) => s.slug)])];

  const { data: rawKalams } = await supabase
    .from("kalams")
    .select("id, slug, primary_title_roman, primary_title_urdu, authors(name_roman)")
    .in("slug", slugs);

  const bySlug = new Map(
    filterIndexableKalams(rawKalams || []).map((k) => [k.slug, k])
  );

  const ordered = slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as NonNullable<
    typeof rawKalams
  >[number][];

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Trending Naats", url: "/trending" },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Trending Naats & Kalam Lyrics",
    url: buildCanonicalUrl("/trending"),
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

      <main id="main-content" className="container py-8 md:py-12 flex-1">
        <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center justify-center gap-2">
          <Link href="/" className="hover:text-gold-500 transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-400 font-medium">Trending</span>
        </nav>

        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gold-500 mb-3">Trending Naats</h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Popular Hamd, Naat, and Manqabat that readers open most often. Tap any title for full lyrics in multiple scripts.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ordered.map((kalam) => {
            const author = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;
            return (
              <li key={kalam.id}>
                <Link
                  href={kalamHref(kalam.slug)}
                  className="kalam-list-card block p-4 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all h-full text-left group"
                >
                  <h2 className="kalam-list-title font-semibold text-gray-100 group-hover:text-gold-500 text-sm">
                    {kalam.primary_title_roman}
                  </h2>
                  {kalam.primary_title_urdu && (
                    <p lang="ur" className="kalam-list-urdu text-sm text-emerald-400/80 font-urdu mt-1" dir="rtl">
                      {kalam.primary_title_urdu}
                    </p>
                  )}
                  {author?.name_roman && (
                    <p className="text-[11px] text-gray-400 mt-2 truncate">{author.name_roman}</p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="text-center mt-10">
          <Link href="/kalams" className="text-sm font-semibold text-gold-500 hover:underline">
            Browse all kalams in the directory →
          </Link>
        </p>
      </main>
    </>
  );
}
