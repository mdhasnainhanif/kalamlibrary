import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import LyricsDisplay from "@/components/LyricsDisplay";
import {
  SITE_CONFIG,
  buildCanonicalUrl,
  buildOgImageUrl,
  buildKalamJsonLd,
  buildBreadcrumbJsonLd,
} from "@/utils/seoConfig";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 3600; // Cache for 1 hour

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

const LANGUAGES_MAP: Record<string, { code: string; label: string; dir: "ltr" | "rtl"; locale: string }> = {
  "roman-english": { code: "roman_english", label: "Roman English", dir: "ltr", locale: "en-US" },
  "urdu": { code: "urdu", label: "اردو (Urdu)", dir: "rtl", locale: "ur-PK" },
  "hindi": { code: "hindi", label: "हिन्दी (Hindi)", dir: "ltr", locale: "hi-IN" },
  "bangla": { code: "bangla", label: "বাংলা (Bangla)", dir: "ltr", locale: "bn-BD" },
};

async function getKalamData(slug: string) {
  const { data: kalam, error: kalamError } = await supabase
    .from("kalams")
    .select("*, authors(*)")
    .eq("slug", slug)
    .single();

  if (kalamError || !kalam) {
    return null;
  }

  const { data: translations, error: transError } = await supabase
    .from("kalam_translations")
    .select("*")
    .eq("kalam_id", kalam.id);

  if (transError || !translations || translations.length === 0) {
    return null;
  }

  // Fetch sibling kalams by this author for dense internal linking
  let relatedKalams: Array<{ id: string; slug: string; primary_title_roman: string; primary_title_urdu: string | null }> = [];
  if (kalam.author_id) {
    const { data: siblings } = await supabase
      .from("kalams")
      .select("id, slug, primary_title_roman, primary_title_urdu")
      .eq("author_id", kalam.author_id)
      .neq("id", kalam.id)
      .limit(6);
    if (siblings) {
      relatedKalams = siblings.filter(
        (k) =>
          k.primary_title_roman.toLowerCase().trim() !== "deegar" &&
          k.primary_title_urdu?.trim() !== "دیگر" &&
          !k.slug.startsWith("deegar") &&
          !k.slug.startsWith("digar")
      );
    }
  }

  const authorData = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;

  // Pick primary translation (prefer Roman English or Urdu, fallback to first available)
  const primaryTranslation =
    translations.find((t) => t.language === "roman_english") ||
    translations.find((t) => t.language === "urdu") ||
    translations[0];

  return {
    kalam,
    author: authorData,
    translations,
    primaryTranslation,
    relatedKalams,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getKalamData(slug);
  if (!data) return {};

  const { kalam, author, primaryTranslation, translations } = data;
  const titleText = primaryTranslation?.title || kalam.primary_title_roman;
  const authorName = author ? author.name_roman : "Unknown Poet";

  const pageTitle = `${titleText} Lyrics | ${authorName}`;
  const pageDescription = `Read authentic lyrics and multi-language translations of '${titleText}' composed by ${authorName} in Urdu Nastaliq, Hindi, Bangla, and Roman English on Kalam Library.`.slice(0, 155);
  const canonicalUrl = buildCanonicalUrl(`/kalam/${slug}`);

  const alternates: Record<string, string> = {};
  translations.forEach((t) => {
    const langKey = Object.keys(LANGUAGES_MAP).find((k) => LANGUAGES_MAP[k].code === t.language);
    if (langKey) {
      alternates[LANGUAGES_MAP[langKey].locale] = buildCanonicalUrl(`/kalam/${slug}/${langKey}`);
    }
  });

  const ogImageUrl = buildOgImageUrl({
    title: titleText,
    poet: authorName,
    sub: "Islamic Devotional Poetry & Naat Lyrics",
  });

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title: `${pageTitle} | ${SITE_CONFIG.name}`,
      description: pageDescription,
      url: canonicalUrl,
      type: "article",
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${titleText} Lyrics - Kalam Library`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | ${SITE_CONFIG.name}`,
      description: pageDescription,
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  try {
    const { data: kalams } = await supabase
      .from("kalams")
      .select("slug")
      .order("created_at", { ascending: false })
      .limit(60);
    if (!kalams) return [];
    return kalams.map((k) => ({ slug: k.slug }));
  } catch {
    return [];
  }
}

export default async function KalamSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getKalamData(slug);

  if (!data) {
    notFound();
  }

  const { kalam, author, translations, primaryTranslation, relatedKalams } = data;
  const authorName = author ? author.name_roman : "Unknown Poet";
  const authorSlug = author ? slugify(author.name_roman) : "";

  const isUrduPrimary = primaryTranslation.language === "urdu";
  const currentLang = isUrduPrimary ? "urdu" : "roman-english";
  const currentDir = isUrduPrimary ? "rtl" : "ltr";
  const kalamUrl = buildCanonicalUrl(`/kalam/${slug}`);

  const kalamSchema = buildKalamJsonLd({
    title: primaryTranslation?.title || kalam.primary_title_roman,
    url: kalamUrl,
    lyrics: primaryTranslation.lyrics,
    authorName: authorName,
    authorUrl: authorSlug ? buildCanonicalUrl(`/author/${authorSlug}`) : undefined,
    language: primaryTranslation.language,
    inLanguageLocale: isUrduPrimary ? "ur" : "en",
    dateCreated: kalam.created_at || undefined,
  });

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Poets", url: "/authors" },
    ...(authorSlug ? [{ name: authorName, url: `/author/${authorSlug}` }] : []),
    { name: kalam.primary_title_roman, url: `/kalam/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kalamSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex-1 flex flex-col">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/authors" className="hover:text-gold-500 transition-colors">Poets</Link>
          <span aria-hidden="true">/</span>
          {author && (
            <>
              <Link href={`/author/${authorSlug}`} className="hover:text-gold-500 transition-colors">{authorName}</Link>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span className="text-gray-400 font-medium truncate max-w-[200px] md:max-w-[400px]">{kalam.primary_title_roman}</span>
        </nav>

        {/* Header section */}
        <header className="text-center mb-8 border-b border-emerald-500/10 pb-6">
          <h1
            lang={isUrduPrimary ? "ur" : "en"}
            className={`text-2xl md:text-4xl font-bold text-gold-500 mb-3 tracking-wide leading-relaxed ${
              isUrduPrimary ? "font-urdu" : "font-sans"
            }`}
            dir={currentDir}
          >
            {primaryTranslation.title}
          </h1>
          {author && (
            <p className="text-sm md:text-base text-gray-400">
              Written by{" "}
              <Link
                href={`/author/${authorSlug}`}
                className="text-emerald-400 hover:text-gold-500 hover:underline transition-all font-semibold"
              >
                {authorName}
              </Link>
            </p>
          )}
        </header>

        {/* Translation Switcher Tabs */}
        {translations.length > 1 && (
          <div className="relative w-full border-b border-emerald-500/10 mb-8">
            <div className="flex justify-start md:justify-center overflow-x-auto py-2 px-6 scrollbar-none w-full max-w-full">
              <div role="tablist" aria-label="Available language translations" className="flex bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-500/10 gap-1 shrink-0">
                {Object.entries(LANGUAGES_MAP).map(([key, config]) => {
                  const hasTranslation = translations.some((t) => t.language === config.code);
                  if (!hasTranslation) return null;

                  const isDefaultActive = primaryTranslation.language === config.code;

                    return (
                      <Link
                        key={key}
                        href={isDefaultActive ? `/kalam/${slug}` : `/kalam/${slug}/${key}`}
                        role="tab"
                        lang={config.locale.split("-")[0]}
                        dir={config.dir}
                        aria-selected={isDefaultActive}
                        className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                          key === "urdu" ? "font-urdu" : key === "hindi" ? "font-devanagari" : key === "bangla" ? "font-bengali" : "font-sans"
                        } ${
                          isDefaultActive
                            ? "bg-gold-500 text-black shadow-md font-semibold scale-[1.02]"
                            : "text-gray-400 hover:text-white hover:bg-emerald-900/40"
                        }`}
                      >
                        {config.label}
                      </Link>
                    );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Lyrics Content Display Panel with Font Controls (A+ / A-) & Utility Buttons */}
        <LyricsDisplay
          lyrics={primaryTranslation.lyrics}
          title={primaryTranslation.title}
          author={authorName}
          lang={currentLang}
          dir={currentDir}
        />

        {/* More Kalam by Poet Cross-Linking Section */}
        {relatedKalams && relatedKalams.length > 0 && author && (
          <section aria-label="More Kalam by Poet" className="mt-12 pt-8 border-t border-emerald-500/10 w-full text-left">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-200 flex items-center gap-2">
                <span>More Kalam by {authorName}</span>
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
              </h2>
              <Link
                href={`/author/${authorSlug}`}
                className="text-xs text-emerald-400 hover:text-gold-500 transition-colors font-medium flex items-center gap-1"
              >
                <span>View all</span>
                <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {relatedKalams.map((sibling) => (
                <Link
                  key={sibling.id}
                  href={`/kalam/${sibling.slug}`}
                  className="p-4 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex flex-col justify-between group"
                >
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-gold-500 transition-colors line-clamp-1">
                    {sibling.primary_title_roman}
                  </span>
                  {sibling.primary_title_urdu && (
                    <span lang="ur" className="text-xs text-emerald-400/80 font-urdu mt-1 truncate" dir="rtl">
                      {sibling.primary_title_urdu}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
