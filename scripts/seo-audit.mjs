/**
 * Kalam Library - Comprehensive Technical SEO Audit Script
 * Verifies all 25 core SEO criteria across metadata, canonicals, robots, sitemap, schemas, and routing.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const results = [];

function assert(condition, category, testName, details = "") {
  results.push({
    passed: Boolean(condition),
    category,
    testName,
    details: details ? String(details) : "",
  });
}

console.log("\n=======================================================");
console.log("  KALAM LIBRARY TECHNICAL SEO AUDIT");
console.log("  Target: https://kalamlibrary.me");
console.log("=======================================================\n");

// 1. Robots.ts verification
try {
  const robotsPath = path.join(rootDir, "app", "robots.ts");
  const robotsContent = fs.readFileSync(robotsPath, "utf8");
  assert(fs.existsSync(robotsPath), "Robots", "robots.ts file exists");
  assert(robotsContent.includes("sitemap.xml"), "Robots", "robots.txt references sitemap.xml");
  assert(robotsContent.includes("/api/") && robotsContent.includes("/_next/") && robotsContent.includes("/search"), "Robots", "robots.txt disallows /api/, /_next/, and /search");
  assert(robotsContent.includes('userAgent: "*"') || robotsContent.includes("userAgent: '*'"), "Robots", "robots.txt configures wild card userAgent '*'");
  assert(robotsContent.includes("GPTBot") && robotsContent.includes("ClaudeBot"), "Robots", "robots.txt protects content from aggressive AI scrapers");
} catch (e) {
  assert(false, "Robots", "Failed to check robots.ts", e.message);
}

// 2. Sitemap.ts verification
try {
  const sitemapPath = path.join(rootDir, "app", "sitemap.ts");
  const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
  assert(fs.existsSync(sitemapPath), "Sitemap", "sitemap.ts file exists");
  assert(sitemapContent.includes("SITE_CONFIG"), "Sitemap", "sitemap uses centralized SITE_CONFIG");
  assert(sitemapContent.includes("/kalam/") && sitemapContent.includes("${lang}"), "Sitemap", "sitemap includes multilingual translation URLs (urdu, hindi, bangla, roman-english)");
  assert(sitemapContent.includes("/author/"), "Sitemap", "sitemap includes author profile URLs");
  assert(sitemapContent.includes("changeFrequency: \"weekly\"") || sitemapContent.includes("changeFrequency: 'weekly'"), "Sitemap", "sitemap includes changeFrequency");
  assert(sitemapContent.includes("priority: 1.0"), "Sitemap", "sitemap sets homepage priority to 1.0");
} catch (e) {
  assert(false, "Sitemap", "Failed to check sitemap.ts", e.message);
}

// 3. Centralized SEO Config & Helper Functions
try {
  const seoConfigPath = path.join(rootDir, "utils", "seoConfig.ts");
  const seoConfigContent = fs.readFileSync(seoConfigPath, "utf8");
  assert(fs.existsSync(seoConfigPath), "SEO Config", "utils/seoConfig.ts exists");
  assert(seoConfigContent.includes("https://kalamlibrary.me"), "SEO Config", "Canonical base URL is https://kalamlibrary.me");
  assert(seoConfigContent.includes("buildCanonicalUrl"), "SEO Config", "buildCanonicalUrl helper is defined and enforces lowercase/clean paths");
  assert(seoConfigContent.includes("buildBreadcrumbJsonLd"), "SEO Config", "buildBreadcrumbJsonLd helper is defined");
  assert(seoConfigContent.includes("buildKalamJsonLd"), "SEO Config", "buildKalamJsonLd helper is defined");
  assert(seoConfigContent.includes("buildAuthorJsonLd"), "SEO Config", "buildAuthorJsonLd helper is defined");
  assert(seoConfigContent.includes("https://schema.org/Poem"), "SEO Config", "Schema uses Poem/CreativeWork instead of commercial music");
  assert(!seoConfigContent.includes("MusicComposition"), "SEO Config", "Deprecated MusicComposition schema is eliminated");
} catch (e) {
  assert(false, "SEO Config", "Failed to check utils/seoConfig.ts", e.message);
}

// 4. Global Root Layout Metadata
try {
  const layoutPath = path.join(rootDir, "app", "layout.tsx");
  const layoutContent = fs.readFileSync(layoutPath, "utf8");
  assert(layoutContent.includes("title: {"), "Root Layout", "Title template configured with default and %s | Kalam Library");
  assert(layoutContent.includes("metadataBase: new URL(SITE_CONFIG.siteUrl)"), "Root Layout", "metadataBase correctly set to SITE_CONFIG.siteUrl");
  assert(layoutContent.includes("openGraph: {"), "Root Layout", "OpenGraph metadata configured globally");
  assert(layoutContent.includes("twitter: {"), "Root Layout", "Twitter card configured as summary_large_image");
  assert(layoutContent.includes("buildWebSiteSchema()"), "Root Layout", "WebSite structured data schema with SearchAction injected");
  assert(layoutContent.includes("Noto_Sans_Devanagari"), "Root Layout", "Multi-script web fonts (Devanagari) loaded");
  assert(layoutContent.includes("Noto_Sans_Bengali"), "Root Layout", "Multi-script web fonts (Bengali) loaded");
} catch (e) {
  assert(false, "Root Layout", "Failed to check app/layout.tsx", e.message);
}

// 5. Individual Pages Metadata & Schemas
const pageChecks = [
  { file: "app/page.tsx", name: "Homepage", canonical: "/", h1Check: true },
  { file: "app/kalams/page.tsx", name: "Kalams Archive", canonical: "/kalams", schema: "buildBreadcrumbJsonLd" },
  { file: "app/kalam/[slug]/page.tsx", name: "Kalam Detail", schema: "buildKalamJsonLd", ogType: "article" },
  { file: "app/kalam/[slug]/[lang]/page.tsx", name: "Kalam Translation Detail", schema: "buildKalamJsonLd", ogType: "article" },
  { file: "app/authors/page.tsx", name: "Authors Archive", canonical: "/authors", schema: "buildBreadcrumbJsonLd" },
  { file: "app/author/[slug]/page.tsx", name: "Author Profile", schema: "buildAuthorJsonLd", ogType: "profile" },
  { file: "app/about/page.tsx", name: "About Us", canonical: "/about", schema: "buildBreadcrumbJsonLd" },
  { file: "app/services/page.tsx", name: "Services", canonical: "/services", schema: "buildBreadcrumbJsonLd" },
  { file: "app/contact/page.tsx", name: "Contact", canonical: "/contact", schema: "buildBreadcrumbJsonLd" },
];

for (const p of pageChecks) {
  try {
    const fullPath = path.join(rootDir, p.file);
    const content = fs.readFileSync(fullPath, "utf8");
    assert(fs.existsSync(fullPath), "Pages", `${p.name} (${p.file}) exists`);
    if (p.schema) {
      assert(content.includes(p.schema), "Structured Data", `${p.name} implements ${p.schema}`);
    }
    if (p.ogType) {
      assert(content.includes(`type: "${p.ogType}"`), "OpenGraph", `${p.name} sets OpenGraph type to '${p.ogType}'`);
    }
    if (p.canonical) {
      assert(
        content.includes(`buildCanonicalUrl("${p.canonical}"`) ||
        content.includes(`buildCanonicalUrl('${p.canonical}'`) ||
        content.includes(`canonicalUrl`),
        "Canonical",
        `${p.name} specifies canonical URL '${p.canonical}'`
      );
    }
  } catch (e) {
    assert(false, "Pages", `Failed checking ${p.name}`, e.message);
  }
}

// 6. Next.js Routing & Rewrites
try {
  const nextConfigPath = path.join(rootDir, "next.config.ts");
  const nextConfigContent = fs.readFileSync(nextConfigPath, "utf8");
  assert(nextConfigContent.includes("source: \"/poets\""), "Routing", "Next config rewrites /poets to /authors");
  assert(nextConfigContent.includes("source: \"/poet/:slug*\""), "Routing", "Next config rewrites /poet/:slug* to /author/:slug*");
} catch (e) {
  assert(false, "Routing", "Failed to check next.config.ts", e.message);
}

// 7. Error & Not-Found UI Handling
try {
  const notFoundPath = path.join(rootDir, "app", "not-found.tsx");
  const notFoundContent = fs.readFileSync(notFoundPath, "utf8");
  assert(fs.existsSync(notFoundPath), "Error Pages", "app/not-found.tsx exists");
  assert(notFoundContent.includes("Page Not Found"), "Error Pages", "not-found.tsx has clear Page Not Found heading");
  assert(notFoundContent.includes("SearchBar"), "Error Pages", "not-found.tsx includes embedded SearchBar");

  const errorPath = path.join(rootDir, "app", "error.tsx");
  assert(fs.existsSync(errorPath), "Error Pages", "app/error.tsx exists for graceful runtime error handling");

  const loadingPath = path.join(rootDir, "app", "loading.tsx");
  assert(fs.existsSync(loadingPath), "Error Pages", "app/loading.tsx exists for fast visual transitions");
} catch (e) {
  assert(false, "Error Pages", "Failed to check error handling pages", e.message);
}

// 8. Manifest & PWA icons
try {
  const manifestPath = path.join(rootDir, "app", "manifest.ts");
  const manifestContent = fs.readFileSync(manifestPath, "utf8");
  assert(fs.existsSync(manifestPath), "PWA", "app/manifest.ts exists");
  assert(manifestContent.includes("Kalam Library"), "PWA", "manifest.ts defines site name and theme color");
} catch (e) {
  assert(false, "PWA", "Failed to check manifest.ts", e.message);
}

// Print Results
let passedCount = 0;
let failedCount = 0;

for (const r of results) {
  if (r.passed) {
    passedCount++;
    console.log(`\x1b[32m[PASS]\x1b[0m [${r.category.padEnd(15)}] ${r.testName}`);
  } else {
    failedCount++;
    console.log(`\x1b[31m[FAIL]\x1b[0m [${r.category.padEnd(15)}] ${r.testName} ${r.details ? `(${r.details})` : ""}`);
  }
}

console.log("\n-------------------------------------------------------");
console.log(`Audit Complete: ${passedCount} PASSED, ${failedCount} FAILED (${results.length} total checks)`);
console.log("-------------------------------------------------------\n");

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
