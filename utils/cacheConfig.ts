/**
 * ISR intervals — keep high on Vercel Hobby to limit ISR Write Units.
 * After DB imports, call POST /api/revalidate with REVALIDATE_SECRET.
 *
 * Next.js requires a numeric literal in each page's `export const revalidate`.
 * Keep these constants in sync with those literals.
 */

/** Kalam, author, and listing pages (7 days). */
export const PAGE_REVALIDATE_SECONDS = 604800;

/** sitemap.xml (24 hours). */
export const SITEMAP_REVALIDATE_SECONDS = 86400;
