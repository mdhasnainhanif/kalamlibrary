import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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

// Helper to slugify author names in code for routing
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

// Language definition structure
interface LanguageConfig {
  code: string;
  label: string;
  dir: "ltr" | "rtl";
  locale: string;
}

const LANGUAGES_MAP: Record<string, LanguageConfig> = {
  "roman-english": { code: "roman_english", label: "Roman English", dir: "ltr", locale: "en-US" },
  "urdu": { code: "urdu", label: "اردو (Urdu)", dir: "rtl", locale: "ur-PK" },
  "hindi": { code: "hindi", label: "हिन्दी (Hindi)", dir: "ltr", locale: "hi-IN" },
  "bangla": { code: "bangla", label: "বাংলা (Bangla)", dir: "ltr", locale: "bn-BD" }
};

interface PageProps {
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

export const revalidate = 604800;

async function getKalamData(rawSlug: string) {
  return getKalamPageData(rawSlug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const langConfig = LANGUAGES_MAP[lang];
  if (!langConfig) return {};

  const data = await getKalamData(slug);
  if (!data) return {};

  const { kalam, author, translations, shouldNoindex, cleanSlug } = data;
  const currentTranslation = translations.find((t) => t.language === langConfig.code);
  const titleText = currentTranslation ? currentTranslation.title : kalam.primary_title_roman;
  const authorName = author ? displayAuthorName(author.name_roman) : "Unknown Poet";
  const opening = firstCouplet(currentTranslation?.lyrics);
  const seoTitle = `${titleText} – Naat Lyrics in ${langConfig.label}`;
  const seoDesc = truncateAtWord(
    opening
      ? `${opening}. ${titleText} by ${authorName} in ${langConfig.label}.`
      : `Naat lyrics of ${titleText} by ${authorName} in ${langConfig.label}.`
  );
  const canonicalUrl = buildCanonicalUrl(kalamHref(cleanSlug, lang));

  const alternates: Record<string, string> = {};
  Object.keys(LANGUAGES_MAP).forEach((key) => {
    alternates[LANGUAGES_MAP[key].locale] = buildCanonicalUrl(kalamHref(cleanSlug, key));
  });

  const ogImageUrl = buildOgImageUrl({
    title: titleText,
    poet: authorName,
    sub: `Lyrics in ${langConfig.label} Script`,
  });

  return {
    title: seoTitle,
    description: seoDesc,
    robots: shouldNoindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title: `${seoTitle} | ${SITE_CONFIG.name}`,
      description: seoDesc,
      url: canonicalUrl,
      type: "article",
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${titleText} Lyrics in ${langConfig.label} - Kalam Library`,
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

export default async function KalamPage({ params }: PageProps) {
  const { slug, lang } = await params;
  const langConfig = LANGUAGES_MAP[lang];

  if (!langConfig) {
    notFound();
  }

  const data = await getKalamData(slug);
  if (!data) {
    notFound();
  }

  const { kalam, author, translations, relatedKalams, shouldNoindex, cleanSlug } = data;
  if (shouldNoindex) {
    notFound();
  }
  if (cleanKalamSlug(slug) !== slug && cleanSlug === cleanKalamSlug(slug)) {
    redirect(kalamHref(cleanSlug, lang));
  }

  const activeTranslation = translations.find((t) => t.language === langConfig.code);
  if (!activeTranslation) {
    notFound();
  }

  const authorName = author ? displayAuthorName(author.name_roman) : "Unknown Poet";
  const authorSlug = author ? slugify(author.name_roman) : "";
  const sourceCollection = inferredSourceCollection(author?.name_roman);
  const pageUrl = buildCanonicalUrl(kalamHref(cleanSlug, lang));
  const headerSubtitle = kalamHeaderSubtitle(langConfig.code, {
    primaryTitleUrdu: kalam.primary_title_urdu,
    translationTitle: activeTranslation.title,
  });

  const kalamSchema = buildKalamJsonLd({
    title: activeTranslation.title || kalam.primary_title_roman,
    url: pageUrl,
    lyrics: activeTranslation.lyrics,
    authorName: authorName,
    authorUrl: authorSlug ? buildCanonicalUrl(`/author/${authorSlug}`) : undefined,
    language: activeTranslation.language,
    inLanguageLocale: langConfig.locale.split("-")[0],
    dateCreated: kalam.created_at || undefined,
  });

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Poets", url: "/authors" },
    ...(authorSlug ? [{ name: authorName, url: `/author/${authorSlug}` }] : []),
    { name: `${kalam.primary_title_roman} (${langConfig.label})`, url: `/kalam/${slug}/${lang}` },
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
        {/* Navigation Breadcrumbs */}
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

        {/* Kalam Heading Panel */}
        <header className="text-center mb-8 border-b border-emerald-500/15 dark:border-emerald-500/10 pb-6 max-w-3xl mx-auto w-full">
          <h1 className="kalam-page-title text-2xl md:text-4xl font-bold text-amber-700 dark:text-gold-500 mb-3 tracking-wide leading-relaxed font-sans">
            {kalam.primary_title_roman} – Naat Lyrics in {langConfig.label}
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

        {/* Translation Switcher Tabs with visual scroll indicator gradient */}
        <div id="kalam-lang-tabs" className="kalam-lang-tabs relative w-full max-w-3xl mx-auto border-b border-emerald-500/15 dark:border-emerald-500/10 mb-8">
          {/* Visual gradient overlays indicating scrollability on mobile */}
          <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#f6f9f7] dark:from-[#020806] to-transparent pointer-events-none md:hidden z-10"></div>
          <div aria-hidden="true" className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#f6f9f7] dark:from-[#020806] to-transparent pointer-events-none md:hidden z-10"></div>

          <div className="flex justify-start md:justify-center overflow-x-auto py-2 px-6 scrollbar-none w-full max-w-full">
            <div role="tablist" aria-label="Kalam language translation options" className="flex bg-white/90 dark:bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-500/20 dark:border-emerald-500/10 shadow-sm dark:shadow-none gap-1 shrink-0">
              {Object.entries(LANGUAGES_MAP).map(([key, config]) => {
                const isSelected = key === lang;
                const hasLanguageTranslation = translations.some((t) => t.language === config.code);

                if (!hasLanguageTranslation) return null;

                return (
                  <KalamLangTabLink
                    key={key}
                    id={`tab-${key}`}
                    href={kalamHref(cleanSlug, key)}
                    role="tab"
                    lang={config.locale.split("-")[0]}
                    dir={config.dir}
                    aria-selected={isSelected}
                    aria-controls="lyrics-panel"
                    className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      key === "urdu" ? "font-urdu" : key === "hindi" ? "font-devanagari" : key === "bangla" ? "font-bengali" : "font-sans"
                    } ${
                      isSelected
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

        <KalamPageAdLayout
          lyrics={
            <LyricsDisplay 
              lyrics={activeTranslation.lyrics} 
              title={activeTranslation.title} 
              author={authorName} 
              lang={lang} 
              dir={langConfig.dir} 
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
