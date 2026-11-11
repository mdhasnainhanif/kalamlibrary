/**
 * Canonical paths for /kalams and /lyrics/*. No I/O.
 * The middleware uses this to 301 old query URLs and stray query strings.
 * Keep LISTING_LANGS in step with the keys of LYRIC_LANGUAGES in utils/kalam.ts.
 */

export const LISTING_LANGS = ["roman-english", "urdu", "hindi", "bangla"] as const;

/** 1000 pages is 48,000 poems. Above this the middleware 404s without a database query. */
export const MAX_LISTING_PAGE = 1000;

export type ListingLang = (typeof LISTING_LANGS)[number];

const LANG_SET = new Set<string>(LISTING_LANGS);

export function kalamsHref(page: number): string {
  return page > 1 ? `/kalams/page/${page}` : "/kalams";
}

export function lyricsHref(lang: string, page = 1, letter?: string | null): string {
  const letterPath = letter ? `/letter/${letter}` : "";
  const pagePath = page > 1 ? `/page/${page}` : "";
  return `/lyrics/${lang}${letterPath}${pagePath}`;
}

/** A /page/[page] segment: an integer greater than 1, with no leading zero. */
export function canonicalPageSegment(raw: string): number | null {
  if (!/^[1-9]\d{0,5}$/.test(raw)) return null;
  const page = Number(raw);
  return page >= 2 ? page : null;
}

/** A /letter/[letter] segment: one lowercase a-z character. */
export function canonicalLetter(raw: string): string | null {
  return /^[a-z]$/.test(raw) ? raw : null;
}

const HIGH_PAGE = new RegExp(
  `^/(?:kalams/page/|lyrics/(?:${LISTING_LANGS.join("|")})(?:/letter/[a-z])?/page/)(\\d{1,6})$`
);

/** True when a listing page number is above MAX_LISTING_PAGE. No I/O. */
export function listingPageExceedsCap(pathname: string): boolean {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const match = HIGH_PAGE.exec(path);
  return match !== null && Number(match[1]) > MAX_LISTING_PAGE;
}

/**
 * Path to 301 to, or null when the request is already canonical.
 * Recognized page and letter query params are folded into the path.
 * Every other query param is dropped. The path wins when it already has that segment.
 */
export function listingRedirectTarget(pathname: string, searchParams: URLSearchParams): string | null {
  if (!isListingPath(pathname)) return null;
  const target = canonicalListingPath(stripSlash(pathname), searchParams);
  if (target !== pathname || hasQuery(searchParams)) return target;
  return null;
}

function isListingPath(pathname: string): boolean {
  return (
    pathname === "/kalams" ||
    pathname.startsWith("/kalams/") ||
    pathname === "/lyrics" ||
    pathname.startsWith("/lyrics/")
  );
}

function stripSlash(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function hasQuery(searchParams: URLSearchParams): boolean {
  return searchParams.keys().next().done === false;
}

function canonicalLang(raw: string): string | null {
  const lower = raw.toLowerCase();
  return LANG_SET.has(lower) ? lower : null;
}

function parsePageToken(value: string): number | null {
  if (!/^\d{1,6}$/.test(value)) return null;
  const page = Number(value);
  if (!Number.isSafeInteger(page) || page < 1) return null;
  return page;
}

function canonicalListingPath(path: string, searchParams: URLSearchParams): string {
  if (path === "/kalams") return kalamsTarget(null, searchParams);
  const kalamsPage = /^\/kalams\/page\/([^/]+)$/.exec(path);
  if (kalamsPage) return kalamsTarget(kalamsPage[1], searchParams);
  if (path.startsWith("/kalams/")) return path;

  if (path === "/lyrics") return path;
  const parts = path.split("/").filter(Boolean);
  if (parts[0] !== "lyrics" || parts.length < 2) return path;

  const lang = canonicalLang(parts[1]);
  if (!lang) return path;

  if (parts.length === 2) return lyricsTarget(lang, null, null, searchParams);
  if (parts.length === 4 && parts[2] === "page") return lyricsTarget(lang, null, parts[3], searchParams);
  if (parts.length === 4 && parts[2] === "letter") return lyricsTarget(lang, parts[3], null, searchParams);
  if (parts.length === 6 && parts[2] === "letter" && parts[4] === "page") {
    return lyricsTarget(lang, parts[3], parts[5], searchParams);
  }

  if (lang === parts[1]) return path;
  const rest = parts.slice(2);
  return `/lyrics/${lang}${rest.length ? `/${rest.join("/")}` : ""}`;
}

function kalamsTarget(pageSegment: string | null, searchParams: URLSearchParams): string {
  const page = resolvePage(pageSegment, searchParams);
  if (typeof page === "string") return `/kalams/page/${page}`;
  return kalamsHref(page);
}

function lyricsTarget(
  lang: string,
  letterSegment: string | null,
  pageSegment: string | null,
  searchParams: URLSearchParams
): string {
  const letter = resolveLetter(letterSegment, searchParams);
  const page = resolvePage(pageSegment, searchParams);
  const letterPath = letter === null ? "" : `/letter/${letter}`;
  const pagePath = typeof page === "string" ? `/page/${page}` : page > 1 ? `/page/${page}` : "";
  return `/lyrics/${lang}${letterPath}${pagePath}`;
}

/** A number, or the original segment when it is not a page number and must 404 as written. */
function resolvePage(segment: string | null, searchParams: URLSearchParams): number | string {
  if (segment !== null) {
    const parsed = parsePageToken(segment);
    return parsed === null ? segment : parsed;
  }
  const raw = searchParams.get("page");
  if (raw === null) return 1;
  return parsePageToken(raw) ?? 1;
}

/** Lowercase a-z, the original segment when it cannot be a letter, or null when there is no letter. */
function resolveLetter(segment: string | null, searchParams: URLSearchParams): string | null {
  if (segment !== null) {
    if (/^[a-zA-Z]$/.test(segment)) return segment.toLowerCase();
    return segment;
  }
  const raw = searchParams.get("letter");
  if (raw && /^[a-zA-Z]$/.test(raw)) return raw.toLowerCase();
  return null;
}
