import { buildSitemapEntries, MAX_URLS_PER_SITEMAP } from "@/utils/sitemapData";
import { chunkEntries, renderSitemapIndex, renderUrlset, SITEMAP_HEADERS } from "@/utils/sitemapXml";

/** Cached sitemap; refreshes from Supabase daily (not on every crawl). */
export const revalidate = 3600;

/**
 * /sitemap.xml
 * - up to 45,000 URLs: a single <urlset>
 * - more: a <sitemapindex> pointing at /sitemaps/{n}.xml
 */
export async function GET() {
  const entries = await buildSitemapEntries();
  const xml =
    entries.length <= MAX_URLS_PER_SITEMAP
      ? renderUrlset(entries)
      : renderSitemapIndex(chunkEntries(entries));
  return new Response(xml, { headers: SITEMAP_HEADERS });
}
