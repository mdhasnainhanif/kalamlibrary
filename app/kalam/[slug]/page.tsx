import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import CopyShareButtons from "@/components/CopyShareButtons";

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
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getKalamData(slug);
  if (!data) return {};

  const { kalam, author, primaryTranslation } = data;
  const titleText = primaryTranslation?.title || kalam.primary_title_roman;
  const authorName = author ? author.name_roman : "Unknown Poet";

  const seoTitle = `${titleText} Lyrics - ${authorName} | Kalam Library`;
  const seoDesc = `Read full lyrics of '${titleText}' written by ${authorName} on Kalam Library. Available in Roman English, Urdu, Hindi, and Bangla translations.`;
  const canonicalUrl = `https://kalamlibrary.me/kalam/${slug}`;

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: canonicalUrl,
      type: "music.song",
      siteName: "Kalam Library",
    },
  };
}

export default async function KalamSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getKalamData(slug);

  if (!data) {
    notFound();
  }

  const { kalam, author, translations, primaryTranslation } = data;
  const authorName = author ? author.name_roman : "Unknown Poet";
  const authorSlug = author ? slugify(author.name_roman) : "";

  return (
    <main id="main-content" className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex-1 flex flex-col">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
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
        <h1 className="text-2xl md:text-4xl font-bold text-gold-500 mb-3 tracking-wide leading-relaxed">
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

      {/* Translation Switcher Links */}
      {translations.length > 1 && (
        <div className="flex justify-center flex-wrap gap-2 mb-8" role="tablist" aria-label="Available language translations">
          {translations.map((t) => {
            const langPath = t.language.replace("_", "-");
            return (
              <Link
                key={t.id}
                href={`/kalam/${slug}/${langPath}`}
                className="px-4 py-2 text-xs md:text-sm font-medium rounded-lg bg-emerald-950/60 border border-emerald-500/10 text-emerald-300 hover:text-white hover:bg-emerald-900/40 transition-all"
              >
                {t.language.replace("_", " ").toUpperCase()}
              </Link>
            );
          })}
        </div>
      )}

      {/* Lyrics Content Display Panel - Server Rendered with whitespace-pre-wrap */}
      <article
        id="lyrics-panel"
        aria-label="Lyrics text"
        className="w-full bg-emerald-900/10 backdrop-blur-md border border-emerald-500/10 rounded-2xl p-6 md:p-12 shadow-inner text-center whitespace-pre-wrap select-text font-sans text-gray-200 tracking-wide leading-relaxed md:leading-loose text-base md:text-lg"
      >
        {primaryTranslation.lyrics}
      </article>

      {/* Copy and Share Utility Buttons */}
      <CopyShareButtons lyrics={primaryTranslation.lyrics} title={primaryTranslation.title} author={authorName} />
    </main>
  );
}
