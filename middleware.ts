import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CONTACT_PREFILL_COOKIE } from "@/utils/contactPrefill";
import { isJunkKalamPathname } from "@/utils/kalam";
import { contentRedirect } from "@/utils/contentRedirect";
import { listingPageExceedsCap, listingRedirectTarget } from "@/utils/listingPaths";

/** Redirects stay fresh for two minutes, then the Worker decides again. */
const SHORT_REDIRECT = "public, max-age=0, s-maxage=120";
/** A gone URL can be cached briefly. A newly added kalam replaces it within three minutes. */
const SHORT_GONE = "public, max-age=0, s-maxage=180";
const NEVER_CACHE = "private, no-store";
const LISTING_MISS = "private, no-cache, no-store, max-age=0, must-revalidate";
const LISTING_NOT_FOUND_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, follow"><title>Page Not Found | Kalam Library</title></head><body><main><h1>Page Not Found</h1><p>That listings page does not exist.</p><a href="/kalams">All Kalams</a></main></body></html>`;

const CANONICAL_HOST = "www.kalamlibrary.me";

const GONE_410 = {
  status: 410,
  headers: { "Cache-Control": SHORT_GONE },
} as const;

function redirectTo(url: URL, status: 301 | 308, cacheControl = SHORT_REDIRECT) {
  return NextResponse.redirect(url, { status, headers: { "Cache-Control": cacheControl } });
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // These two files must be 200 on the apex and on www. Every other path,
  // including /sitemap.xml, still redirects the apex host below.
  if (pathname === "/ads.txt" || pathname === "/robots.txt") {
    return NextResponse.next();
  }

  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  if (host === "kalamlibrary.me") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return redirectTo(url, 301);
  }

  if (pathname === "/$" || pathname === "/&" || pathname === "/%24" || pathname === "/%26") {
    return new NextResponse(null, GONE_410);
  }

  if (isJunkKalamPathname(pathname)) {
    return new NextResponse(null, GONE_410);
  }

  const content = contentRedirect(pathname, request.nextUrl.search);
  if (content) {
    const url = request.nextUrl.clone();
    url.pathname = content.pathname;
    url.search = "";
    return redirectTo(url, content.status);
  }

  if (pathname === "/poets" || pathname === "/poets/") {
    const url = request.nextUrl.clone();
    url.pathname = "/authors";
    return redirectTo(url, 308);
  }

  const oldPoet = pathname.match(/^\/poet\/(.+)$/);
  if (oldPoet) {
    const url = request.nextUrl.clone();
    url.pathname = `/author/${oldPoet[1]}`;
    url.search = "";
    return redirectTo(url, 308);
  }

  // Listing canonicalization only. The matcher stays broad because the apex, 410,
  // kalam-slug, poet, and contact rules above and below still have to run.
  // This branch is a prefix check plus, on a match, a query parse. No database.
  if (
    pathname === "/kalams" ||
    pathname.startsWith("/kalams/") ||
    pathname === "/lyrics" ||
    pathname.startsWith("/lyrics/")
  ) {
    const target = listingRedirectTarget(pathname, request.nextUrl.searchParams);
    if (target) {
      const url = request.nextUrl.clone();
      url.pathname = target;
      url.search = "";
      return redirectTo(url, 301);
    }
    if (listingPageExceedsCap(pathname)) {
      return new NextResponse(LISTING_NOT_FOUND_HTML, {
        status: 404,
        headers: {
          "Cache-Control": LISTING_MISS,
          "Content-Type": "text/html; charset=utf-8",
          "X-Robots-Tag": "noindex, follow",
        },
      });
    }
  }

  if (pathname === "/contact" && request.nextUrl.searchParams.has("subject")) {
    const subject = request.nextUrl.searchParams.get("subject")?.trim();
    const url = request.nextUrl.clone();
    url.searchParams.delete("subject");
    const response = redirectTo(url, 301, NEVER_CACHE);
    if (subject) {
      response.cookies.set(CONTACT_PREFILL_COOKIE, encodeURIComponent(subject.slice(0, 500)), {
        maxAge: 120,
        path: "/contact",
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
      });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Skip static assets. ads.txt and robots.txt are named so both hosts
     * return 200 with no redirect. sitemap.xml still runs, so the apex
     * host redirects to www.
     */
    "/((?!_next/static|_next/image|favicon.ico|ads\\.txt|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)",
  ],
};
