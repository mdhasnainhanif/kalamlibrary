import { SITE_CONFIG } from "@/utils/seoConfig";
import { MAX_URLS_PER_SITEMAP, type SitemapEntry } from "@/utils/sitemapData";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function lastmod(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

export function renderUrlset(entries: SitemapEntry[]): string {
  const body = entries
    .map((e) => {
      const links = e.alternates
        ? Object.entries(e.alternates)
            .map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${esc(lang)}" href="${esc(href)}"/>`)
            .join("")
        : "";
      return (
        `<url><loc>${esc(e.url)}</loc>` +
        links +
        `<lastmod>${esc(lastmod(e.lastModified))}</lastmod>` +
        (e.changeFrequency ? `<changefreq>${e.changeFrequency}</changefreq>` : "") +
        (e.priority !== undefined ? `<priority>${e.priority}</priority>` : "") +
        `</url>`
      );
    })
    .join("\n");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    body +
    `\n</urlset>\n`
  );
}

export function renderSitemapIndex(chunks: SitemapEntry[][]): string {
  const body = chunks
    .map((chunk, i) => {
      let newest = "";
      for (const e of chunk) {
        const v = lastmod(e.lastModified);
        if (v > newest) newest = v;
      }
      return (
        `<sitemap><loc>${esc(`${SITE_CONFIG.url}/sitemaps/${i + 1}.xml`)}</loc>` +
        (newest ? `<lastmod>${esc(newest)}</lastmod>` : "") +
        `</sitemap>`
      );
    })
    .join("\n");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    body +
    `\n</sitemapindex>\n`
  );
}

export function chunkEntries(entries: SitemapEntry[]): SitemapEntry[][] {
  const chunks: SitemapEntry[][] = [];
  for (let i = 0; i < entries.length; i += MAX_URLS_PER_SITEMAP) {
    chunks.push(entries.slice(i, i + MAX_URLS_PER_SITEMAP));
  }
  return chunks;
}

export const SITEMAP_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=600, s-maxage=3600",
} as const;
