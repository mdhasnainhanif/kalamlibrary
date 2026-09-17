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

export const revalidate = 3600; // Cache for 1 hour

async function getKalamData(rawSlug: string) {
  let decodedSlug = rawSlug;
  try {
    decodedSlug = decodeURIComponent(rawSlug);
  } catch {
    decodedSlug = rawSlug;
  }

  // 1. Query with decoded slug
  let { data: kalam } = await supabase
    .from("kalams")
    .select("*, authors(*)")
    .eq("slug", decodedSlug)
    .maybeSingle();

  // 2. Fallback to raw slug if different
  if (!kalam && rawSlug !== decodedSlug) {
    const res = await supabase
      .from("kalams")
      .select("*, authors(*)")
      .eq("slug", rawSlug)
      .maybeSingle();
    kalam = res.data;
  }

  // 3. Fallback without trailing unicode symbols (e.g. ﷺ)
  if (!kalam) {
    const normalized = decodedSlug.replace(/[^\w\s-]/g, "").trim();
    if (normalized) {
      const res = await supabase
        .from("kalams")
        .select("*, authors(*)")
        .ilike("slug", `${normalized}%`)
        .limit(1)
        .maybeSingle();
      kalam = res.data;
    }
  }

  if (!kalam) {
    return null;
  }

  const { data: translations, error: transError } = await supabase
    .from("kalam_translations")
    .select("*")
    .eq("kalam_id", kalam.id);

  if (transError || !translations) {
    return null;
  }

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

  // Handle Supabase relation typing
  const authorData = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;

  return {
    kalam,
    author: authorData,
    translations,
    relatedKalams,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const langConfig = LANGUAGES_MAP[lang];
  if (!langConfig) return {};

  const data = await getKalamData(slug);
  if (!data) return {};

  const { kalam, author, translations } = data;
  const currentTranslation = translations.find((t) => t.language === langConfig.code);
  const titleText = currentTranslation ? currentTranslation.title : kalam.primary_title_roman;
  const authorName = author ? author.name_roman : "Unknown Poet";

  const seoTitle = `${titleText} Lyrics in ${langConfig.label} | ${authorName}`;
  const seoDesc = `Read authentic lyrics and translations of '${titleText}' composed by ${authorName} in ${langConfig.label} script on Kalam Library. Available in Roman English, Urdu, Hindi, and Bangla.`.slice(0, 155);
  const canonicalUrl = buildCanonicalUrl(`/kalam/${slug}/${lang}`);

  const alternates: Record<string, string> = {};
  Object.keys(LANGUAGES_MAP).forEach((key) => {
    alternates[LANGUAGES_MAP[key].locale] = buildCanonicalUrl(`/kalam/${slug}/${key}`);
  });

  const ogImageUrl = buildOgImageUrl({
    title: titleText,
    poet: authorName,
    sub: `Lyrics in ${langConfig.label} Script`,
  });

  return {
    title: seoTitle,
    description: seoDesc,
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

  const { kalam, author, translations, relatedKalams } = data;
  
  const activeTranslation = translations.find((t) => t.language === langConfig.code);
  if (!activeTranslation) {
    notFound();
  }

  const authorName = author ? author.name_roman : "Unknown Poet";
  const authorSlug = author ? slugify(author.name_roman) : "";
  const pageUrl = buildCanonicalUrl(`/kalam/${slug}/${lang}`);

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

      <main id="main-content" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1 flex flex-col">
        {/* Navigation Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center justify-center flex-wrap gap-2">
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

        {/* Kalam Heading Panel */}
        <header className="text-center mb-8 border-b border-emerald-500/10 pb-6">
          <h1 
            lang={lang === "urdu" ? "ur" : lang === "hindi" ? "hi" : lang === "bangla" ? "bn" : "en"}
            className={`text-2xl md:text-4xl font-bold text-gold-500 mb-3 tracking-wide leading-relaxed ${
              lang === "urdu" ? "font-urdu" : "font-sans"
            }`}
            dir={langConfig.dir}
          >
            {activeTranslation.title}
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

        {/* Translation Switcher Tabs with visual scroll indicator gradient */}
        <div className="relative w-full border-b border-emerald-500/10 mb-8">
          {/* Visual gradient overlays indicating scrollability on mobile */}
          <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#020806] to-transparent pointer-events-none md:hidden z-10"></div>
          <div aria-hidden="true" className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#020806] to-transparent pointer-events-none md:hidden z-10"></div>

          <div className="flex justify-start md:justify-center overflow-x-auto py-2 px-6 scrollbar-none w-full max-w-full">
            <div role="tablist" aria-label="Kalam language translation options" className="flex bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-500/10 gap-1 shrink-0">
              {Object.entries(LANGUAGES_MAP).map(([key, config]) => {
                const isSelected = key === lang;
                const hasLanguageTranslation = translations.some((t) => t.language === config.code);

                if (!hasLanguageTranslation) return null;

                return (
                  <Link
                    key={key}
                    id={`tab-${key}`}
                    href={`/kalam/${slug}/${key}`}
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

        {/* Lyrics Content Display Panel with Font Controls (A+ / A-) & Utility Buttons */}
        <LyricsDisplay 
          lyrics={activeTranslation.lyrics} 
          title={activeTranslation.title} 
          author={authorName} 
          lang={lang} 
          dir={langConfig.dir} 
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
