import { buildSitemapEntries, MAX_URLS_PER_SITEMAP } from "@/utils/sitemapData";
import { chunkEntries, renderUrlset, SITEMAP_HEADERS } from "@/utils/sitemapXml";

export const revalidate = 3600;

/** /sitemaps/1.xml, /sitemaps/2.xml … — only used when /sitemap.xml is a sitemap index (>45,000 URLs). */
export async function GET(_request: Request, { params }: { params: Promise<{ chunk: string }> }) {
  const { chunk } = await params;
  const match = /^(\d+)\.xml$/.exec(chunk);
  if (!match) return new Response("Not found", { status: 404 });

  const entries = await buildSitemapEntries();
  if (entries.length <= MAX_URLS_PER_SITEMAP) return new Response("Not found", { status: 404 });

  const chunks = chunkEntries(entries);
  const part = chunks[parseInt(match[1], 10) - 1];
  if (!part) return new Response("Not found", { status: 404 });

  return new Response(renderUrlset(part), { headers: SITEMAP_HEADERS });
}
