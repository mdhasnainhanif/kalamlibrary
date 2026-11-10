import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import ListingPagination from "@/components/listings/ListingPagination";
import { authorLabelFromRoman } from "@/utils/authorHelper";
import { LYRIC_LANGUAGES, kalamHref, resolveKalamUrduTitle, type LyricLangKey } from "@/utils/kalam";
import { kalamGridCardClass, kalamGridCardFooterClass } from "@/utils/kalamCardStyles";
import { isRangeNotSatisfiable, throwIfFailed } from "@/utils/kalamData";
import { canonicalLetter, canonicalPageSegment, lyricsHref, MAX_LISTING_PAGE } from "@/utils/listingPaths";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";
import { supabase } from "@/utils/supabase";

const LANG_KEYS = Object.keys(LYRIC_LANGUAGES) as LyricLangKey[];
const PAGE_SIZE = 48;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type LyricsRow = {
  id: string;
  slug: string;
  primary_title_roman: string;
  primary_title_urdu: string | null;
  authors: { name_roman?: string } | { name_roman?: string }[] | null;
};

type LyricsPageData = {
  rows: LyricsRow[];
  totalCount: number;
  totalPages: number;
  error: { message: string } | null;
};

export const loadLyricsPage = cache(async (
  lang: string,
  currentPage: number,
  letter: string | null
): Promise<LyricsPageData> => {
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

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

  if (letter) query = query.ilike("primary_title_roman", `${letter}%`);

  const { data, count, error } = await query.range(from, to);
  const rows = (data || []) as LyricsRow[];
  const totalCount = count || 0;

  return {
    rows,
    totalCount,
    totalPages: Math.ceil(totalCount / PAGE_SIZE) || 1,
    error,
  };
});

type OnMissing = () => never;

function missingPage(onMissing?: OnMissing): never {
  if (onMissing) onMissing();
  notFound();
}

export function resolveLyricsRoute(
  parts: { lang: string; page?: string; letter?: string },
  onMissing?: OnMissing
): {
  lang: LyricLangKey;
  currentPage: number;
  letter: string | null;
} {
  if (!(parts.lang in LYRIC_LANGUAGES)) missingPage(onMissing);
  let letter: string | null = null;
  if (parts.letter !== undefined) {
    letter = canonicalLetter(parts.letter);
    if (letter === null) missingPage(onMissing);
  }
  let currentPage = 1;
  if (parts.page !== undefined) {
    const parsed = canonicalPageSegment(parts.page);
    if (parsed === null) missingPage(onMissing);
    currentPage = parsed;
  }
  return { lang: parts.lang as LyricLangKey, currentPage, letter };
}

async function pageDataOrNotFound(
  lang: string,
  currentPage: number,
  letter: string | null,
  onMissing?: OnMissing
): Promise<LyricsPageData> {
  if (currentPage > MAX_LISTING_PAGE) missingPage(onMissing);
  const data = await loadLyricsPage(lang, currentPage, letter);
  // A range past the end (PostgREST 416) is a 404. Any other failure must not render an empty 200.
  const rangeMiss = isRangeNotSatisfiable(data.error) && currentPage > 1;
  if (!rangeMiss) throwIfFailed(data.error, "lyrics list");
  if (currentPage > data.totalPages || (currentPage > 1 && (rangeMiss || data.rows.length === 0))) {
    missingPage(onMissing);
  }
  return data;
}

export async function lyricsMetadata(
  lang: string,
  currentPage: number,
  letter: string | null,
  onMissing?: OnMissing
): Promise<Metadata> {
  const config = LYRIC_LANGUAGES[lang as LyricLangKey];
  if (!config) missingPage(onMissing);
  if (letter || currentPage > 1) await pageDataOrNotFound(lang, currentPage, letter, onMissing);

  const filterDesc = letter ? ` starting with “${letter.toUpperCase()}”` : "";
  const title = `Naat Lyrics in ${config.label}${currentPage > 1 ? ` (Page ${currentPage})` : ""}`;
  const description = `Browse Islamic Naat and Kalam lyrics in ${config.label}${filterDesc}. Open any poem to read the full text on Kalam Library.`;
  const canonicalUrl = buildCanonicalUrl(lyricsHref(lang, currentPage, letter));

  return {
    title,
    description,
    robots:
      letter || currentPage > 1
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

export default async function LyricsBrowse({
  lang,
  currentPage,
  letter,
  onMissing,
}: {
  lang: LyricLangKey;
  currentPage: number;
  letter: string | null;
  onMissing?: () => never;
}) {
  const config = LYRIC_LANGUAGES[lang];
  const { rows, totalCount, totalPages, error } = await pageDataOrNotFound(lang, currentPage, letter, onMissing);

  const urduTitleByKalamId = new Map<string, string>();
  if (rows.length > 0) {
    const ids = rows.map((k) => k.id);
    const { data: urduTranslations, error: urduError } = await supabase
      .from("kalam_translations")
      .select("kalam_id, title")
      .eq("language", "urdu")
      .in("kalam_id", ids);
    throwIfFailed(urduError, "lyrics urdu titles");
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

  const hrefFor = (page: number) => lyricsHref(lang, page, letter);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main id="main-content" className="container flex-1 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-400/80 md:text-sm">
          <Link href="/" className="transition-colors hover:text-gold-500">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/kalams" className="transition-colors hover:text-gold-500">All Kalams</Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-gray-400">{config.label}</span>
        </nav>

        <header className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gold-500 md:text-5xl">
            Naat Lyrics in {config.label}
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
            Browse poems with a {config.label} reading. Each card opens the full lyrics in this script.
          </p>
          <div className="mx-auto mb-2 mt-6 w-full max-w-xl px-1">
            <SearchBar />
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-950/80 px-4 py-1.5 text-xs font-medium text-emerald-300">
            <span>
              {totalCount} poems
              {totalPages > 1 ? ` · Page ${currentPage} of ${totalPages}` : ""}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {LANG_KEYS.map((key) => (
              <Link
                key={key}
                href={lyricsHref(key, 1, letter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  key === lang
                    ? "bg-gold-500 text-black"
                    : "border border-emerald-500/10 bg-emerald-950/60 text-gray-300 hover:text-white"
                }`}
              >
                {LYRIC_LANGUAGES[key].label}
              </Link>
            ))}
          </div>
        </header>

        <div className="scrollbar-none mb-8 overflow-x-auto pb-2">
          <div className="flex min-w-max items-center justify-start gap-1.5 px-2 md:justify-center">
            <Link
              href={lyricsHref(lang)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                !letter
                  ? "bg-gold-500 text-black shadow-md"
                  : "border border-emerald-500/10 bg-emerald-950/60 text-gray-300 hover:bg-emerald-900/40 hover:text-white"
              }`}
            >
              ALL
            </Link>
            {ALPHABET.map((char) => (
              <Link
                key={char}
                href={lyricsHref(lang, 1, char.toLowerCase())}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  letter === char.toLowerCase()
                    ? "scale-105 bg-gold-500 text-black shadow-md"
                    : "border border-emerald-500/10 bg-emerald-950/60 text-gray-300 hover:bg-emerald-900/40 hover:text-white"
                }`}
              >
                {char}
              </Link>
            ))}
          </div>
        </div>

        {error || rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-500/15 bg-emerald-900/10 py-16 text-center">
            <p className="text-sm text-gray-400">
              {letter ? `No poems found starting with “${letter.toUpperCase()}”.` : "No poems found."}
            </p>
            {letter ? (
              <Link href={lyricsHref(lang)} className="mt-4 inline-block text-xs font-semibold text-gold-500 hover:underline">
                Clear filter →
              </Link>
            ) : null}
          </div>
        ) : (
          <section aria-label={`${config.label} naat list`} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <ListingPagination currentPage={currentPage} totalPages={totalPages} hrefFor={hrefFor} />
      </main>
    </>
  );
}
