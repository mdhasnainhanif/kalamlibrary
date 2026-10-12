import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";
import SearchBar from "@/components/SearchBar";
import { authorLabelFromRoman } from "@/utils/authorHelper";
import { LYRIC_LANGUAGES, kalamHref, resolveKalamUrduTitle, type LyricLangKey } from "@/utils/kalam";
import { kalamGridCardClass, kalamGridCardFooterClass } from "@/utils/kalamCardStyles";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string; letter?: string }>;
}

const LANG_KEYS = Object.keys(LYRIC_LANGUAGES) as LyricLangKey[];
const PAGE_SIZE = 48;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const revalidate = 604800;

export function generateStaticParams() {
  return LANG_KEYS.map((lang) => ({ lang }));
}

function lyricsPath(lang: string, page?: number, letter?: string | null) {
  const params = new URLSearchParams();
  if (page && page > 1) params.set("page", String(page));
  if (letter) params.set("letter", letter);
  const q = params.toString();
  return `/lyrics/${lang}${q ? `?${q}` : ""}`;
}

function indexableKalamQuery(activeLetter: string | null) {
  let query = supabase
    .from("kalams")
    .select("id, slug, primary_title_roman, primary_title_urdu, authors(name_roman)", { count: "exact" })
    .order("primary_title_roman", { ascending: true })
    .not("primary_title_roman", "in", "(Ayzan,Deegar,Qata,Rubai,Test Title XYZ,Hadaiq-e-Bakhshish Hissa Dom)")
    .not("primary_title_roman", "ilike", "Radeef%")
    .not("primary_title_roman", "ilike", "Tareekh-e-Tab%")
    .not("slug", "ilike", "deegar%")
    .not("slug", "ilike", "digar%")
    .not("slug", "ilike", "ayzan%")
    .not("slug", "ilike", "aizan%")
    .not("slug", "ilike", "radeef-%")
    .not("slug", "ilike", "tareekh-e-tab-%")
    .not("slug", "ilike", "test-title%")
    .not("slug", "ilike", "hadaiq-e-bakhshish-hissa%");

  if (activeLetter) {
    query = query.ilike("primary_title_roman", `${activeLetter}%`);
  }
  return query;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const { page, letter } = await searchParams;
  const config = LYRIC_LANGUAGES[lang as LyricLangKey];
  if (!config) return {};

  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const activeLetter = letter ? letter.toUpperCase() : undefined;
  const filterDesc = activeLetter ? ` starting with “${activeLetter}”` : "";

  const title = `Naat Lyrics in ${config.label}${currentPage > 1 ? ` (Page ${currentPage})` : ""}`;
  const description = `Browse Islamic Naat and Kalam lyrics in ${config.label}${filterDesc}. Open any poem to read the full text on Kalam Library.`;
  const queryParams: Record<string, string | number> = {};
  if (currentPage > 1) queryParams.page = currentPage;
  if (activeLetter) queryParams.letter = activeLetter;
  const canonicalUrl = buildCanonicalUrl(
    `/lyrics/${lang}`,
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );

  return {
    title,
    description,
    robots:
      activeLetter || currentPage > 1
        ? { index: false, follow: true, googleBot: { index: false, follow: true } }
        : undefined,
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

export default async function LyricsLanguagePage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const { page, letter } = await searchParams;
  const config = LYRIC_LANGUAGES[lang as LyricLangKey];
  if (!config) notFound();

  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const activeLetter = letter ? letter.toUpperCase() : null;
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: kalams, count, error } = await indexableKalamQuery(activeLetter).range(from, to);

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  const rows = kalams || [];

  const urduTitleByKalamId = new Map<string, string>();
  if (rows.length > 0) {
    const ids = rows.map((k) => k.id);
    const { data: urduTranslations } = await supabase
      .from("kalam_translations")
      .select("kalam_id, title")
      .eq("language", "urdu")
      .in("kalam_id", ids);
    for (const row of urduTranslations || []) {
      const title = (row.title || "").trim();
      if (title) urduTitleByKalamId.set(row.kalam_id, title);
    }
  }

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
            Browse poems with a {config.label} reading. Each card opens the full lyrics in this script.
          </p>
          <div className="mt-6 mb-2 max-w-xl mx-auto w-full px-1">
            <SearchBar />
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/15 text-xs text-emerald-300 font-medium">
            <span>
              {totalCount} poems
              {totalPages > 1 ? ` · Page ${currentPage} of ${totalPages}` : ""}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {LANG_KEYS.map((key) => (
              <Link
                key={key}
                href={lyricsPath(key, 1, activeLetter)}
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

        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center justify-start md:justify-center gap-1.5 min-w-max px-2">
            <Link
              href={lyricsPath(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !activeLetter
                  ? "bg-gold-500 text-black shadow-md"
                  : "bg-emerald-950/60 border border-emerald-500/10 text-gray-300 hover:text-white hover:bg-emerald-900/40"
              }`}
            >
              ALL
            </Link>
            {ALPHABET.map((char) => (
              <Link
                key={char}
                href={lyricsPath(lang, 1, char)}
                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  activeLetter === char
                    ? "bg-gold-500 text-black shadow-md scale-105"
                    : "bg-emerald-950/60 border border-emerald-500/10 text-gray-300 hover:text-white hover:bg-emerald-900/40"
                }`}
              >
                {char}
              </Link>
            ))}
          </div>
        </div>

        {error || rows.length === 0 ? (
          <div className="text-center py-16 bg-emerald-900/10 border border-dashed border-emerald-500/15 rounded-2xl">
            <p className="text-gray-400 text-sm">
              {activeLetter ? `No poems found starting with “${activeLetter}”.` : "No poems found."}
            </p>
            {activeLetter ? (
              <Link href={lyricsPath(lang)} className="mt-4 inline-block text-xs font-semibold text-gold-500 hover:underline">
                Clear filter →
              </Link>
            ) : null}
          </div>
        ) : (
          <section aria-label={`${config.label} naat list`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((kalam) => {
              const authorData = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;
              const authorName = authorLabelFromRoman(authorData?.name_roman);
              const urduTitle = resolveKalamUrduTitle(kalam, { urduTitleByKalamId });
              return (
                <Link
                  key={kalam.id}
                  href={kalamHref(kalam.slug, lang)}
                  className={kalamGridCardClass}
                  aria-label={
                    authorName
                      ? `Read ${kalam.primary_title_roman} lyrics by ${authorName}`
                      : `Read ${kalam.primary_title_roman} lyrics`
                  }
                >
                  <div className="kalam-list-card__body space-y-1.5">
                    <h2 className="kalam-list-title kalam-list-title--4 text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-gold-500 dark:text-gray-100">
                      {kalam.primary_title_roman}
                    </h2>
                    {urduTitle ? (
                      <p lang="ur" dir="rtl" className="kalam-list-urdu font-urdu text-base text-emerald-700 dark:text-emerald-400/90">
                        {urduTitle}
                      </p>
                    ) : null}
                  </div>
                  {authorName ? (
                    <div className={`${kalamGridCardFooterClass} text-[11px] text-slate-500 dark:text-gray-400`}>
                      <span className="kalam-card-author min-w-0 truncate">{authorName}</span>
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </section>
        )}

        {totalPages > 1 ? (
          <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-emerald-500/10 flex-wrap">
            {currentPage > 1 ? (
              <Link
                href={lyricsPath(lang, currentPage - 1, activeLetter)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-950/60 border border-emerald-500/10 text-gray-300 hover:text-white hover:bg-emerald-900/40 transition-all"
              >
                ← Previous
              </Link>
            ) : null}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;

                return (
                  <span key={p} className="flex items-center gap-2">
                    {showEllipsis ? <span className="text-gray-500 text-xs px-1">...</span> : null}
                    <Link
                      href={lyricsPath(lang, p, activeLetter)}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={`w-9 h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                        p === currentPage
                          ? "bg-gold-500 text-black font-bold shadow-md shadow-gold-500/10"
                          : "bg-emerald-950/60 border border-emerald-500/10 text-gray-300 hover:text-white hover:bg-emerald-900/40"
                      }`}
                    >
                      {p}
                    </Link>
                  </span>
                );
              })}

            {currentPage < totalPages ? (
              <Link
                href={lyricsPath(lang, currentPage + 1, activeLetter)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-950/60 border border-emerald-500/10 text-gray-300 hover:text-white hover:bg-emerald-900/40 transition-all"
              >
                Next →
              </Link>
            ) : null}
          </nav>
        ) : null}
      </main>
    </>
  );
}
