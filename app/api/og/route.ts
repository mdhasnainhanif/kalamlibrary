const OG_IMAGE = "https://www.kalamlibrary.me/og-kalam.jpg";

/** Legacy dynamic OG URLs: redirect to the static site image (no next/og). */
export function GET() {
  return new Response(null, {
    status: 308,
    headers: {
      Location: OG_IMAGE,
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
}
