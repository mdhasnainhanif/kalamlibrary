import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CONTACT_PREFILL_COOKIE } from "@/utils/contactPrefill";
import { cleanKalamSlug, isJunkKalamPathname } from "@/utils/kalam";

const CANONICAL_HOST = "www.kalamlibrary.me";

const GONE_410 = {
  status: 410,
  headers: { "Cache-Control": "public, max-age=86400" },
} as const;

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  if (host === "kalamlibrary.me") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
  }

  const pathname = request.nextUrl.pathname;

  if (pathname === "/$" || pathname === "/&" || pathname === "/%24" || pathname === "/%26") {
    return new NextResponse(null, GONE_410);
  }

  if (isJunkKalamPathname(pathname)) {
    return new NextResponse(null, GONE_410);
  }

  const romanEnglishKalam = pathname.match(/^\/kalam\/([^/]+)\/roman-english\/?$/i);
  if (romanEnglishKalam) {
    const url = request.nextUrl.clone();
    url.pathname = `/kalam/${cleanKalamSlug(romanEnglishKalam[1])}`;
    return NextResponse.redirect(url, 301);
  }

  if (pathname === "/kalams" && request.nextUrl.searchParams.has("letter")) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("letter");
    return NextResponse.redirect(url, 301);
  }

  if (pathname === "/kalams") {
    const page = request.nextUrl.searchParams.get("page");
    if (page === "1" || page === "01") {
      const url = request.nextUrl.clone();
      url.searchParams.delete("page");
      return NextResponse.redirect(url, 301);
    }
  }

  if (pathname === "/contact" && request.nextUrl.searchParams.has("subject")) {
    const subject = request.nextUrl.searchParams.get("subject")?.trim();
    const url = request.nextUrl.clone();
    url.searchParams.delete("subject");
    const response = NextResponse.redirect(url, 301);
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
     * Skip static assets and well-known crawler files.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)",
  ],
};
