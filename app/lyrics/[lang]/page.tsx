import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";
import { LYRIC_LANGUAGES, filterIndexableKalams, kalamHref, type LyricLangKey } from "@/utils/kalam";

interface PageProps {
  params: Promise<{ lang: string }>;
}

const LANG_KEYS = Object.keys(LYRIC_LANGUAGES) as LyricLangKey[];

export const revalidate = 3600;

export function generateStaticParams() {
  return LANG_KEYS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const config = LYRIC_LANGUAGES[lang as LyricLangKey];
  if (!config) return {};

  const title = `Naat Lyrics in ${config.label}`;
  const description = `Browse Islamic Naat and Kalam lyrics in ${config.label}. Open any poem to read the full text in ${config.label} on Kalam Library.`;
  const canonicalUrl = buildCanonicalUrl(`/lyrics/${lang}`);

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [{ url: SITE_CONFIG.defaultOgImage, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function LyricsLanguagePage({ params }: PageProps) {
  const { lang } = await params;
  const config = LYRIC_LANGUAGES[lang as LyricLangKey];
  if (!config) notFound();

  const { data: rawKalams } = await supabase
    .from("kalams")
    .select("id, slug, primary_title_roman, primary_title_urdu, authors(name_roman)")
    .order("primary_title_roman", { ascending: true });

  const kalams = filterIndexableKalams(rawKalams);

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "All Kalams", url: "/kalams" },
    { name: config.label, url: `/lyrics/${lang}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="container py-8 md:py-12 flex-1">
        <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center justify-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/kalams" className="hover:text-gold-500 transition-colors">All Kalams</Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-400 font-medium">{config.label}</span>
        </nav>

        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gold-500 mb-4 tracking-tight">
            Naat Lyrics in {config.label}
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {kalams.length} poems with a {config.label} reading. Each card opens the full lyrics page for this script.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {LANG_KEYS.map((key) => (
              <Link
                key={key}
                href={`/lyrics/${key}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  key === lang
                    ? "bg-gold-500 text-black"
                    : "bg-emerald-950/60 border border-emerald-500/10 text-gray-300 hover:text-white"
                }`}
              >
                {LYRIC_LANGUAGES[key].label}
              </Link>
            ))}
          </div>
        </header>

        <section aria-label={`${config.label} naat list`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kalams.map((kalam) => {
            const authorData = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;
            const authorName = authorData ? authorData.name_roman : "Unknown Poet";
            return (
              <Link
                key={kalam.id}
                href={kalamHref(kalam.slug, lang)}
                className="kalam-list-card p-4 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex flex-col justify-between min-h-32 text-left group"
              >
                <h2 className="kalam-list-title kalam-list-card__body font-semibold text-gray-100 group-hover:text-gold-500 transition-colors text-sm">
                  {kalam.primary_title_roman}
                </h2>
                <span className="text-[11px] text-gray-400 truncate min-w-0">{authorName}</span>
              </Link>
            );
          })}
        </section>
      </main>
    </>
  );
}
