import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isJunkKalamPathname } from "@/utils/kalam";

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

  if (pathname === "/kalams" && request.nextUrl.searchParams.has("letter")) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("letter");
    return NextResponse.redirect(url, 301);
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
