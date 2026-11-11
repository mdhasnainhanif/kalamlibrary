import { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import LyricsDisplay from "@/components/LyricsDisplay";
import PagedKalamReader from "@/components/PagedKalamReader";
import { KHATM_E_QADRIA_PAGES } from "@/utils/khatmEQadriaPages";
import { KHATM_E_QADRIA_SLUG } from "@/utils/khatmEQadriaSlug";
import KalamPageAdLayout from "@/components/KalamPageAdLayout";
import KalamLangScrollAnchor from "@/components/KalamLangScrollAnchor";
import KalamLangTabLink from "@/components/KalamLangTabLink";
import ReportErrorLink from "@/components/ReportErrorLink";
import KalamReaderIntro from "@/components/KalamReaderIntro";
import { isPlaceholderAuthorName } from "@/utils/authorHelper";
import { getKalamPageData } from "@/utils/kalamData";
import {
  cleanKalamSlug,
  displayAuthorName,
  firstCouplet,
  inferredSourceCollection,
  kalamHeaderSubtitle,
  kalamHref,
  type KalamTranslationLanguage,
} from "@/utils/kalam";
import {
  SITE_CONFIG,
  buildCanonicalUrl,
  buildKalamJsonLd,
  buildBreadcrumbJsonLd,
} from "@/utils/seoConfig";
import { buildKalamLanguageAlternates } from "@/utils/kalamAlternates";
import { buildKalamReaderIntro } from "@/utils/kalamReaderIntro";
import { planKalamRoutes } from "@/utils/kalamRouting";
import {
  availableLanguages,
  buildKalamDescription,
  buildKalamHeading,
  buildKalamSeoTitle,
} from "@/utils/kalamSeo";
import { langAttrFromLocale } from "@/utils/htmlLang";
import { KALAM_LANG_TABLIST_CLASS, kalamLangTabClassName } from "@/utils/kalamLangTabStyles";

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
  code: KalamTranslationLanguage;
  label: string;
  dir: "ltr" | "rtl";
  locale: string;
}

const LANGUAGES_MAP: Record<string, LanguageConfig> = {
  "roman-english": { code: "roman_english", label: "Roman English", dir: "ltr", locale: "ur-Latn" },
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

/** Empty list: nothing is prerendered at build, but each language URL is cached on its first visit (ISR). */
export async function generateStaticParams() {
  return [];
}

async function getKalamData(rawSlug: string) {
  return getKalamPageData(rawSlug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const langConfig = LANGUAGES_MAP[lang];
  if (!langConfig) {
    notFound();
  }

  const data = await getKalamData(slug);
  if (!data || data.shouldNoindex) {
    notFound();
  }

  const { kalam, author, translations, cleanSlug } = data;
  const routePlan = planKalamRoutes(cleanSlug, translations);
  if (lang === "urdu" && routePlan.urduRedirectsToBase) permanentRedirect(routePlan.basePath);
  if (lang === "roman-english") permanentRedirect(routePlan.baseRedirectPath ?? routePlan.basePath);
  const currentTranslation = translations.find((t) => t.language === langConfig.code);
  const titleText = currentTranslation ? currentTranslation.title : kalam.primary_title_roman;
  const authorName = author && !isPlaceholderAuthorName(author.name_roman) ? displayAuthorName(author.name_roman) : "";
  const opening = firstCouplet(currentTranslation?.lyrics);
  const seoTitle = buildKalamSeoTitle(kalam.primary_title_roman, langConfig.code, authorName);
  const seoDesc = buildKalamDescription({
    titleRoman: kalam.primary_title_roman,
    lang: langConfig.code,
    available: routePlan.baseRedirectLang ? [routePlan.baseRedirectLang] : availableLanguages(translations),
    poet: authorName,
    scriptTitle:
      langConfig.code === "urdu"
        ? kalam.primary_title_urdu || currentTranslation?.title
        : langConfig.code === "roman_english"
          ? null
          : currentTranslation?.title,
    opening,
  });
  const canonicalUrl = buildCanonicalUrl(kalamHref(cleanSlug, lang));

  const languageAlternates = buildKalamLanguageAlternates(cleanSlug, translations);

  const ogImageUrl = buildCanonicalUrl(SITE_CONFIG.pageOgImage);

  return {
    title: seoTitle,
    description: seoDesc,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
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

  const routePlan = planKalamRoutes(cleanSlug, translations);
  if (lang === "urdu" && routePlan.urduRedirectsToBase) {
    permanentRedirect(routePlan.basePath);
  }
  if (lang === "roman-english") {
    permanentRedirect(routePlan.baseRedirectPath ?? routePlan.basePath);
  }

  if (cleanKalamSlug(slug) !== slug && cleanSlug === cleanKalamSlug(slug)) {
    permanentRedirect(kalamHref(cleanSlug, lang));
  }

  const activeTranslation = translations.find((t) => t.language === langConfig.code);
  if (!activeTranslation) {
    notFound();
  }

  const authorName = author && !isPlaceholderAuthorName(author.name_roman) ? displayAuthorName(author.name_roman) : "";
  const authorSlug = author && authorName ? slugify(author.name_roman) : "";
  const sourceCollection = inferredSourceCollection(author?.name_roman);
  const pageUrl = buildCanonicalUrl(kalamHref(cleanSlug, lang));
  const headerSubtitle = kalamHeaderSubtitle(langConfig.code, {
    primaryTitleUrdu: kalam.primary_title_urdu,
    translationTitle: activeTranslation.title,
  });
  const readerIntro = buildKalamReaderIntro({
    titleRoman: kalam.primary_title_roman,
    authorName,
    sourceCollection,
    activeLanguageLabel: langConfig.label,
    translationCount: translations.length,
  });

  const kalamSchema = buildKalamJsonLd({
    title: activeTranslation.title || kalam.primary_title_roman,
    url: pageUrl,
    authorName: authorName,
    authorUrl: authorSlug ? buildCanonicalUrl(`/author/${authorSlug}`) : undefined,
    language: activeTranslation.language,
    inLanguageLocale: langAttrFromLocale(langConfig.locale),
    dateCreated: kalam.created_at || undefined,
  });

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Poets", url: "/authors" },
    ...(authorSlug ? [{ name: authorName, url: `/author/${authorSlug}` }] : []),
    { name: `${kalam.primary_title_roman} (${langConfig.label})`, url: kalamHref(cleanSlug, lang) },
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
          <h1 className="kalam-page-title text-2xl md:text-4xl font-bold text-amber-700 dark:text-gold-500 mb-3 tracking-wide leading-relaxed">
            {buildKalamHeading(kalam.primary_title_roman, langConfig.code)}
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
          {author && authorName ? (
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Written by{" "}
              <Link 
                href={`/author/${authorSlug}`} 
                className="text-emerald-700 dark:text-emerald-400 hover:text-amber-700 dark:hover:text-gold-500 hover:underline transition-all font-semibold"
              >
                {authorName}
              </Link>
            </p>
          ) : null}
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
            <div role="tablist" aria-label="Kalam language translation options" className={KALAM_LANG_TABLIST_CLASS}>
              {Object.entries(LANGUAGES_MAP).map(([key, config]) => {
                const isSelected = key === lang;
                const hasLanguageTranslation = translations.some((t) => t.language === config.code);

                if (!hasLanguageTranslation) return null;
                if (routePlan.baseRedirectLang && key !== routePlan.baseRedirectLang) return null;

                const tabHref = key === "roman-english" ? kalamHref(cleanSlug) : kalamHref(cleanSlug, key);

                return (
                  <KalamLangTabLink
                    key={key}
                    id={`tab-${key}`}
                    href={tabHref}
                    role="tab"
                    lang={langAttrFromLocale(config.locale)}
                    dir={config.dir}
                    aria-selected={isSelected}
                    aria-controls="lyrics-panel"
                    className={kalamLangTabClassName(key, isSelected)}
                  >
                    {config.label}
                  </KalamLangTabLink>
                );
              })}
            </div>
          </div>
        </div>

        <KalamReaderIntro text={readerIntro} />

        <KalamPageAdLayout
          lyrics={
            lang === "urdu" && cleanSlug === KHATM_E_QADRIA_SLUG ? (
              <PagedKalamReader titleUrdu={activeTranslation.title} pages={KHATM_E_QADRIA_PAGES} />
            ) : (
              <LyricsDisplay 
                lyrics={activeTranslation.lyrics} 
                title={activeTranslation.title} 
                author={authorName} 
                lang={lang} 
                dir={langConfig.dir} 
              />
            )
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
                  className="flex cursor-pointer items-center gap-1 text-xs font-medium text-emerald-700 transition-colors hover:text-amber-700 dark:text-emerald-400 dark:hover:text-gold-500"
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
