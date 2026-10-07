import { NextResponse } from "next/server";

/** Mirrors public/ads.txt so crawlers always get plain text from the app router if assets are misconfigured. */
const ADS_TXT = "google.com, pub-7173654343893692, DIRECT, f08c47fec0942fa0\n";

export function GET() {
  return new NextResponse(ADS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
