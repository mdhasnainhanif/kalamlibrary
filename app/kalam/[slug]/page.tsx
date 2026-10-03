import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { supabase } from "@/utils/supabase";
import LyricsDisplay from "@/components/LyricsDisplay";
import KalamPageAdLayout from "@/components/KalamPageAdLayout";
import KalamLangScrollAnchor from "@/components/KalamLangScrollAnchor";
import KalamLangTabLink from "@/components/KalamLangTabLink";
import ReportErrorLink from "@/components/ReportErrorLink";
import { getKalamPageData } from "@/utils/kalamData";
import {
  cleanKalamSlug,
  displayAuthorName,
  firstCouplet,
  inferredSourceCollection,
  isIndexableKalam,
  kalamHeaderSubtitle,
  kalamHref,
  truncateAtWord,
} from "@/utils/kalam";
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

export const revalidate = 604800;

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

async function getKalamData(rawSlug: string) {
  const data = await getKalamPageData(rawSlug);
  if (!data) return null;

  const primaryTranslation =
    data.translations.find((t) => t.language === "urdu") ||
    data.translations.find((t) => t.language === "roman_english") ||
    data.translations[0];

  return { ...data, primaryTranslation };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getKalamData(slug);
  if (!data) return {};

  const { kalam, author, primaryTranslation, translations, shouldNoindex, cleanSlug } = data;
  const titleText = primaryTranslation?.title || kalam.primary_title_roman;
  const authorName = author ? displayAuthorName(author.name_roman) : "Unknown Poet";
  const opening = firstCouplet(primaryTranslation?.lyrics);
  const pageTitle = `${titleText} – Naat Lyrics`;
  const pageDescription = truncateAtWord(
    opening
      ? `${opening}. Naat lyrics by ${authorName} in Urdu, Hindi, Bangla, and Roman English.`
      : `Naat lyrics of ${titleText} by ${authorName}, available in Urdu Nastaliq, Hindi, Bangla, and Roman English.`
  );
  const canonicalUrl = buildCanonicalUrl(kalamHref(cleanSlug));

  const alternates: Record<string, string> = {};
  translations.forEach((t) => {
    const langKey = Object.keys(LANGUAGES_MAP).find((k) => LANGUAGES_MAP[k].code === t.language);
    if (langKey) {
      alternates[LANGUAGES_MAP[langKey].locale] = buildCanonicalUrl(kalamHref(cleanSlug, langKey));
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
    robots: shouldNoindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
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
    return kalams
      .filter((k) => isIndexableKalam(k))
      .map((k) => ({ slug: cleanKalamSlug(k.slug) }));
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

  const { kalam, author, translations, primaryTranslation, relatedKalams, shouldNoindex, cleanSlug } = data;
  if (shouldNoindex) {
    notFound();
  }
  if (cleanKalamSlug(slug) !== slug && cleanSlug === cleanKalamSlug(slug)) {
    redirect(kalamHref(cleanSlug));
  }

  const authorName = author ? displayAuthorName(author.name_roman) : "Unknown Poet";
  const authorSlug = author ? slugify(author.name_roman) : "";
  const sourceCollection = inferredSourceCollection(author?.name_roman);
  const urduTranslation = translations.find((t) => t.language === "urdu");

  const isUrduPrimary = primaryTranslation.language === "urdu";
  const headerSubtitle = kalamHeaderSubtitle(
    primaryTranslation.language as "roman_english" | "urdu" | "hindi" | "bangla",
    {
      primaryTitleUrdu: kalam.primary_title_urdu,
      translationTitle: primaryTranslation.title,
    }
  );
  const currentLang = isUrduPrimary ? "urdu" : "roman-english";
  const currentDir = isUrduPrimary ? "rtl" : "ltr";
  const kalamUrl = buildCanonicalUrl(kalamHref(cleanSlug));

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

      <main id="main-content" className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 md:py-10 flex-1 flex flex-col min-w-0">
        <KalamLangScrollAnchor />
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-700 dark:text-emerald-400/80 mb-6 flex items-center justify-center flex-wrap gap-2 max-w-3xl mx-auto w-full">
          <Link href="/" className="hover:text-amber-700 dark:hover:text-gold-500 transition-colors">Home</Link>
          <span aria-hidden="true" className="text-gray-400 dark:text-gray-600">/</span>
          <Link href="/authors" className="hover:text-amber-700 dark:hover:text-gold-500 transition-colors">Poets</Link>
          <span aria-hidden="true" className="text-gray-400 dark:text-gray-600">/</span>
          {author && (
            <>
              <Link href={`/author/${authorSlug}`} className="hover:text-amber-700 dark:hover:text-gold-500 transition-colors">{authorName}</Link>
              <span aria-hidden="true" className="text-gray-400 dark:text-gray-600">/</span>
            </>
          )}
          <span className="text-gray-600 dark:text-gray-400 font-medium truncate max-w-[200px] md:max-w-[400px]">{kalam.primary_title_roman}</span>
        </nav>

        {/* Header section */}
        <header className="text-center mb-8 border-b border-emerald-500/15 dark:border-emerald-500/10 pb-6 max-w-3xl mx-auto w-full">
          <h1 className="kalam-page-title text-2xl md:text-4xl font-bold text-amber-700 dark:text-gold-500 mb-3 tracking-wide leading-relaxed font-sans">
            {kalam.primary_title_roman} – Naat Lyrics
          </h1>
          {headerSubtitle && (
            <p
              lang={headerSubtitle.langAttr}
              dir={headerSubtitle.dir}
              className={`kalam-page-title ${headerSubtitle.fontClass} text-xl md:text-2xl text-emerald-800 dark:text-emerald-300 mb-3`}
            >
              {headerSubtitle.text}
            </p>
          )}
          {author && (
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Written by{" "}
              <Link
                href={`/author/${authorSlug}`}
                className="text-emerald-700 dark:text-emerald-400 hover:text-amber-700 dark:hover:text-gold-500 hover:underline transition-all font-semibold"
              >
                {authorName}
              </Link>
            </p>
          )}
          {sourceCollection && (
            <p className="text-xs text-gray-500 mt-2">
              Source collection: <span className="text-gray-700 dark:text-gray-300">{sourceCollection}</span>
            </p>
          )}
        </header>

        {/* Translation Switcher Tabs */}
        {translations.length > 1 && (
          <div id="kalam-lang-tabs" className="kalam-lang-tabs relative w-full max-w-3xl mx-auto border-b border-emerald-500/15 dark:border-emerald-500/10 mb-8">
            <div className="flex justify-start md:justify-center overflow-x-auto py-2 px-6 scrollbar-none w-full max-w-full">
              <div role="tablist" aria-label="Available language translations" className="flex bg-white/90 dark:bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-500/20 dark:border-emerald-500/10 shadow-sm dark:shadow-none gap-1 shrink-0">
                {Object.entries(LANGUAGES_MAP).map(([key, config]) => {
                  const hasTranslation = translations.some((t) => t.language === config.code);
                  if (!hasTranslation) return null;

                  const isDefaultActive = primaryTranslation.language === config.code;

                    return (
                      <KalamLangTabLink
                        key={key}
                        href={isDefaultActive ? kalamHref(cleanSlug) : kalamHref(cleanSlug, key)}
                        role="tab"
                        lang={config.locale.split("-")[0]}
                        dir={config.dir}
                        aria-selected={isDefaultActive}
                        className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                          key === "urdu" ? "font-urdu" : key === "hindi" ? "font-devanagari" : key === "bangla" ? "font-bengali" : "font-sans"
                        } ${
                          isDefaultActive
                            ? "bg-gold-500 text-black shadow-md font-semibold scale-[1.02]"
                            : "text-gray-600 dark:text-gray-400 hover:text-emerald-950 dark:hover:text-white hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40"
                        }`}
                      >
                        {config.label}
                      </KalamLangTabLink>
                    );
                })}
              </div>
            </div>
          </div>
        )}

        <KalamPageAdLayout
          lyrics={
            <LyricsDisplay
              lyrics={primaryTranslation.lyrics}
              title={primaryTranslation.title}
              author={authorName}
              lang={currentLang}
              dir={currentDir}
            />
          }
        >
          <ReportErrorLink title={kalam.primary_title_roman} />

          {relatedKalams && relatedKalams.length > 0 && author && (
            <section aria-label="More Kalam by Poet" className="mt-12 pt-8 border-t border-emerald-500/15 dark:border-emerald-500/10 w-full text-left">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200 flex items-center gap-2">
                  <span>More Kalam by {authorName}</span>
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                </h2>
                <Link
                  href={`/author/${authorSlug}`}
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-amber-700 dark:hover:text-gold-500 transition-colors font-medium flex items-center gap-1"
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
                    href={kalamHref(sibling.slug)}
                    className="kalam-list-card p-4 rounded-xl bg-white dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-500/20 dark:border-emerald-500/10 shadow-sm dark:shadow-none hover-gold-glow transition-all flex flex-col justify-between group"
                  >
                    <span className="kalam-list-title kalam-list-title--1 text-sm font-semibold text-gray-900 dark:text-gray-200 group-hover:text-amber-700 dark:group-hover:text-gold-500 transition-colors">
                      {sibling.primary_title_roman}
                    </span>
                    {sibling.primary_title_urdu && (
                      <span lang="ur" className="kalam-list-urdu text-xs text-emerald-700 dark:text-emerald-400/80 font-urdu mt-1" dir="rtl">
                        {sibling.primary_title_urdu}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </KalamPageAdLayout>
      </main>
    </>
  );
}
