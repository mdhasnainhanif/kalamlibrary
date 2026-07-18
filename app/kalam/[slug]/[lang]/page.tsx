import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import CopyShareButtons from "@/components/CopyShareButtons";

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

  if (transError || !translations) {
    return null;
  }

  // Handle Supabase relation typing
  const authorData = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;

  return {
    kalam,
    author: authorData,
    translations,
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

  const seoTitle = `${titleText} Lyrics in ${langConfig.label} - ${authorName}`;
  const seoDesc = `Read full lyrics of '${titleText}' written by ${authorName} in ${langConfig.label} script on Kalam Library. Available translations in Roman English, Urdu Nastaliq, Hindi, and Bangla.`;

  const alternates: Record<string, string> = {};
  Object.keys(LANGUAGES_MAP).forEach((key) => {
    alternates[LANGUAGES_MAP[key].locale] = `https://kalamlibrary.com/kalam/${slug}/${key}`;
  });

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: `https://kalamlibrary.com/kalam/${slug}/${lang}`,
      languages: alternates,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `https://kalamlibrary.com/kalam/${slug}/${lang}`,
      type: "music.song",
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

  const { kalam, author, translations } = data;
  
  const activeTranslation = translations.find((t) => t.language === langConfig.code);
  if (!activeTranslation) {
    notFound();
  }

  const authorName = author ? author.name_roman : "Unknown Poet";
  const authorSlug = author ? slugify(author.name_roman) : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    "name": kalam.primary_title_roman,
    "lyrics": {
      "@type": "Lyrics",
      "text": activeTranslation.lyrics
    },
    "lyricist": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kalam Library"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex-1 flex flex-col">
        {/* Navigation Breadcrumbs */}
        <div className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span>/</span>
          {author && (
            <>
              <Link href={`/author/${authorSlug}`} className="hover:text-gold-500 transition-colors">{authorName}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-400 font-medium truncate max-w-[200px] md:max-w-[400px]">{kalam.primary_title_roman}</span>
        </div>

        {/* Kalam Heading Panel */}
        <div className="text-center mb-8 border-b border-emerald-500/10 pb-6">
          <h1 
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
        </div>

        {/* Translation Switcher Tabs with visual scroll indicator gradient */}
        <div className="relative w-full border-b border-emerald-500/10 mb-8">
          {/* Visual gradient overlays indicating scrollability on mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#020806] to-transparent pointer-events-none md:hidden z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#020806] to-transparent pointer-events-none md:hidden z-10"></div>

          <div className="flex justify-start md:justify-center overflow-x-auto py-2 px-6 scrollbar-none w-full max-w-full">
            <div className="flex bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-500/10 gap-1 shrink-0">
              {Object.entries(LANGUAGES_MAP).map(([key, config]) => {
                const isSelected = key === lang;
                const hasLanguageTranslation = translations.some((t) => t.language === config.code);

                if (!hasLanguageTranslation) return null;

                return (
                  <Link
                    key={key}
                    href={`/kalam/${slug}/${key}`}
                    className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
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

        {/* Lyrics Content Display Panel */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <div 
            className={`w-full bg-emerald-900/10 backdrop-blur-md border border-emerald-500/10 rounded-2xl p-6 md:p-12 shadow-inner text-center whitespace-pre-line select-text ${
              lang === "urdu" 
                ? "kalam-urdu-lyrics text-lg md:text-2xl text-emerald-100/90" 
                : "font-sans text-sm md:text-lg text-gray-200 tracking-wide leading-relaxed md:leading-loose"
            }`}
            dir={langConfig.dir}
          >
            {activeTranslation.lyrics}
          </div>

          {/* Copy and Share Buttons (Client-side interactive) */}
          <CopyShareButtons 
            lyrics={activeTranslation.lyrics} 
            title={activeTranslation.title} 
            author={authorName} 
          />
        </div>
      </div>
    </>
  );
}
