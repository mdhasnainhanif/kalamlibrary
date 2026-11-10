import { NextResponse } from "next/server";

/** The only ads.txt source. Served by this route for both hosts. */
const ADS_TXT = "google.com, pub-4716378596479015, DIRECT, f08c47fec0942fa0\n";

export function GET() {
  return new NextResponse(ADS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
