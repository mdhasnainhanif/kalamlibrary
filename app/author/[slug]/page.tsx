import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { getAuthorBio, getAuthorUrduName } from "@/utils/authorHelper";
import { displayAuthorName, filterIndexableKalams, kalamHref, truncateAtWord } from "@/utils/kalam";
import {
  SITE_CONFIG,
  buildCanonicalUrl,
  buildOgImageUrl,
  buildAuthorJsonLd,
  buildBreadcrumbJsonLd,
} from "@/utils/seoConfig";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 604800;

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

async function getAuthorData(slug: string) {
  // Fetch all authors (since authors table has no slug, we check them in-memory)
  const { data: authors, error: authorsError } = await supabase
    .from("authors")
    .select("*");

  if (authorsError || !authors) {
    return null;
  }

  const author = authors.find((a) => slugify(a.name_roman) === slug);
  if (!author) {
    return null;
  }

  // Fetch all kalams for this author
  const { data: rawKalams, error: kalamsError } = await supabase
    .from("kalams")
    .select("*")
    .eq("author_id", author.id)
    .order("primary_title_roman", { ascending: true });

  if (kalamsError) {
    return null;
  }

  const kalams = filterIndexableKalams(rawKalams);

  return {
    author,
    kalams,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAuthorData(slug);
  if (!data) return {};

  const { author } = data;
  const displayName = displayAuthorName(author.name_roman);
  const seoTitle = `${displayName} – Naat Lyrics`;
  const seoDesc = truncateAtWord(
    `Read Naat, Hamd, and Kalam lyrics by ${displayName} in Urdu Nastaliq, Hindi, Bangla, and Roman English.`
  );
  const canonicalUrl = buildCanonicalUrl(`/author/${slug}`);

  const ogImageUrl = buildOgImageUrl({
    title: author.name_roman,
    sub: "Poet & Scholar Profile – All Kalam & Naats",
  });

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${seoTitle} | ${SITE_CONFIG.name}`,
      description: seoDesc,
      url: canonicalUrl,
      type: "profile",
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${author.name_roman} - Kalam Library`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seoTitle} | ${SITE_CONFIG.name}`,
      description: seoDesc,
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  try {
    const { data: authors } = await supabase.from("authors").select("name_roman");
    if (!authors) return [];
    return authors.map((author) => ({
      slug: slugify(author.name_roman),
    }));
  } catch {
    return [];
  }
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getAuthorData(slug);

  if (!data) {
    notFound();
  }

  const { author, kalams } = data;
  const urduName = getAuthorUrduName(author);
  const authorUrl = buildCanonicalUrl(`/author/${slug}`);

  const authorSchema = buildAuthorJsonLd({
    name: author.name_roman,
    url: authorUrl,
    bio: getAuthorBio(author),
    kalamCount: kalams.length,
    featuredWorks: kalams.slice(0, 10).map((k) => ({
      title: k.primary_title_roman,
      url: buildCanonicalUrl(kalamHref(k.slug)),
    })),
  });

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Poets", url: "/authors" },
    { name: author.name_roman, url: `/author/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="container py-8 md:py-12 flex-1 min-w-0 overflow-x-clip">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center justify-center flex-wrap gap-2">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/authors" className="hover:text-gold-500 transition-colors">Poets</Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-400 font-medium">{author.name_roman}</span>
        </nav>

      {/* Poet Profile Header */}
      <header className="bg-emerald-900/10 border border-emerald-500/10 rounded-2xl p-6 md:p-8 mb-8 shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Placeholder */}
          <div aria-hidden="true" className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-950 flex items-center justify-center border border-gold-500/20 text-gold-500 text-3xl font-bold shadow-inner shrink-0">
            {author.name_roman.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-3 justify-center md:justify-start">
              <h1 className="text-2xl md:text-3xl font-bold text-gold-500 mb-1">{displayAuthorName(author.name_roman)}</h1>
              {urduName && (
                <span lang="ur" className="text-lg md:text-xl text-emerald-300/85 font-urdu" dir="rtl">
                  ({urduName})
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mb-4 mt-2">
              {getAuthorBio(author)}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/10 text-xs font-semibold text-emerald-300">
              <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{kalams.length} Kalam{kalams.length !== 1 ? "s" : ""} Available</span>
            </div>
          </div>
        </div>
      </header>

      {/* Naats / Kalam Collection */}
      <section aria-label="Kalam Collection">
        <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
          <span>Kalam Collection</span>
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
        </h2>

        {kalams.length === 0 ? (
          <div className="text-center py-12 bg-emerald-900/5 border border-dashed border-emerald-500/10 rounded-xl">
            <p className="text-gray-400">No Naats uploaded yet for this author.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            {kalams.map((kalam) => (
              <Link
                key={kalam.id}
                href={kalamHref(kalam.slug)}
                aria-label={`Read ${kalam.primary_title_roman} lyrics by ${author.name_roman}`}
                className="kalam-list-card group p-5 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex justify-between items-center gap-3"
              >
                <div className="kalam-list-card__body">
                  <h3 className="kalam-list-title font-semibold text-gray-100 group-hover:text-gold-500 transition-colors">
                    {kalam.primary_title_roman}
                  </h3>
                  {kalam.primary_title_urdu && (
                    <span lang="ur" className="kalam-list-urdu text-base text-emerald-400/70 font-urdu mt-1 py-0.5" dir="rtl">
                      {kalam.primary_title_urdu}
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:text-gold-500 group-hover:border-gold-500/30 transition-all shrink-0">
                  <svg aria-hidden="true" className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
    </>
  );
}
