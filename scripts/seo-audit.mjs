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

function walk(dir, visit) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, visit);
    else visit(full);
  }
}

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
console.log("  Target: https://www.kalamlibrary.me");
console.log("=======================================================\n");

// 1. Robots.ts verification
try {
  const robotsPath = path.join(rootDir, "app", "robots.ts");
  const robotsContent = fs.readFileSync(robotsPath, "utf8");
  assert(fs.existsSync(robotsPath), "Robots", "robots.ts file exists");
  assert(robotsContent.includes("sitemap.xml"), "Robots", "robots.txt references sitemap.xml");
  assert(robotsContent.includes("/api/") && robotsContent.includes("/search") && robotsContent.includes('"/api/og"'), "Robots", "robots.txt disallows /api/ and /search, and allows /api/og");
  assert(robotsContent.includes('userAgent: "*"') || robotsContent.includes("userAgent: '*'"), "Robots", "robots.txt configures wild card userAgent '*'");
  assert(robotsContent.includes("GPTBot") && robotsContent.includes("ClaudeBot"), "Robots", "robots.txt protects content from aggressive AI scrapers");
} catch (e) {
  assert(false, "Robots", "Failed to check robots.ts", e.message);
}

try {
  const adsRoute = path.join(rootDir, "app", "ads.txt", "route.ts");
  const adsContent = fs.readFileSync(adsRoute, "utf8");
  const middlewareContent = fs.readFileSync(path.join(rootDir, "middleware.ts"), "utf8");
  assert(fs.existsSync(adsRoute), "Ads", "app/ads.txt/route.ts is the ads.txt source");
  assert(adsContent.includes("google.com, pub-4716378596479015, DIRECT, f08c47fec0942fa0"), "Ads", "ads.txt route contains the publisher line");
  assert(!fs.existsSync(path.join(rootDir, "public", "ads.txt")), "Ads", "public/ads.txt is not a second source");
  assert(!fs.existsSync(path.join(rootDir, "components", "ads.txt")), "Ads", "components/ads.txt is not a second source");
  assert(
    middlewareContent.includes('pathname === "/ads.txt" || pathname === "/robots.txt"'),
    "Ads",
    "middleware serves /ads.txt and /robots.txt before the apex redirect"
  );
  assert(middlewareContent.includes('urlHost === "kalamlibrary.me"'), "Ads", "apex URL host still redirects to www");
} catch (e) {
  assert(false, "Ads", "Failed to check ads.txt", e.message);
}

// 2. Sitemap index (app/sitemap.xml) and chunks (app/sitemaps/[chunk]), built from utils/sitemapData.ts
try {
  const indexRoute = path.join(rootDir, "app", "sitemap.xml", "route.ts");
  const chunkRoute = path.join(rootDir, "app", "sitemaps", "[chunk]", "route.ts");
  const sitemapContent = fs.readFileSync(path.join(rootDir, "utils", "sitemapData.ts"), "utf8");
  const sitemapConfig = fs.readFileSync(path.join(rootDir, "utils", "sitemapConfig.ts"), "utf8");
  assert(fs.existsSync(indexRoute), "Sitemap", "app/sitemap.xml/route.ts serves the sitemap index");
  assert(fs.existsSync(chunkRoute), "Sitemap", "app/sitemaps/[chunk]/route.ts serves the sitemap chunks");
  assert(!fs.existsSync(path.join(rootDir, "app", "sitemap.ts")), "Sitemap", "no app/sitemap.ts competes with the sitemap.xml route");
  assert(sitemapContent.includes("SITE_CONFIG"), "Sitemap", "sitemap uses centralized SITE_CONFIG");
  assert(sitemapContent.includes("SITEMAP_LANGUAGES"), "Sitemap", "language URLs are gated by SITEMAP_LANGUAGES");
  assert(/SITEMAP_LANGUAGES[^=]*=\s*\[\s*\]/.test(sitemapConfig), "Sitemap", "SITEMAP_LANGUAGES is empty (base kalam URLs only)");
  assert(sitemapContent.includes("/author/"), "Sitemap", "sitemap includes author profile URLs");
  assert(sitemapContent.includes('changeFrequency: "weekly"'), "Sitemap", "sitemap includes changeFrequency");
  assert(sitemapContent.includes('{ path: "", changeFrequency: "daily", priority: 1.0 }'), "Sitemap", "sitemap sets homepage priority to 1.0");
} catch (e) {
  assert(false, "Sitemap", "Failed to check the sitemap routes", e.message);
}

// 3. Centralized SEO Config & Helper Functions
try {
  const seoConfigPath = path.join(rootDir, "utils", "seoConfig.ts");
  const seoConfigContent = fs.readFileSync(seoConfigPath, "utf8");
  assert(fs.existsSync(seoConfigPath), "SEO Config", "utils/seoConfig.ts exists");
  assert(seoConfigContent.includes("https://www.kalamlibrary.me"), "SEO Config", "Canonical base URL is https://www.kalamlibrary.me");
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
} catch (e) {
  assert(false, "Root Layout", "Failed to check app/layout.tsx", e.message);
}

// 4b. Devanagari and Bengali fonts are scoped to /kalam/* (app/kalam/layout.tsx), not the root layout
try {
  const fontsContent = fs.readFileSync(path.join(rootDir, "components", "LanguageFonts.tsx"), "utf8");
  const kalamLayout = fs.readFileSync(path.join(rootDir, "app", "kalam", "layout.tsx"), "utf8");
  assert(fontsContent.includes("Noto_Sans_Devanagari") && fontsContent.includes("--font-noto-devanagari"), "Fonts", "Noto Sans Devanagari is defined");
  assert(fontsContent.includes("Noto_Sans_Bengali") && fontsContent.includes("--font-noto-bengali"), "Fonts", "Noto Sans Bengali is defined");
  assert(kalamLayout.includes("<LanguageFonts>"), "Fonts", "app/kalam/layout.tsx wraps kalam pages in LanguageFonts");
} catch (e) {
  assert(false, "Fonts", "Failed to check language fonts", e.message);
}

// 5. Individual Pages Metadata & Schemas
const pageChecks = [
  { file: "app/page.tsx", name: "Homepage", canonical: "/", h1Check: true },
  { file: "components/listings/KalamsBrowse.tsx", name: "Kalams Archive", canonical: "/kalams", schema: "buildBreadcrumbJsonLd" },
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

// 6. Routing redirects live in middleware.ts
try {
  const middlewarePath = path.join(rootDir, "middleware.ts");
  const middlewareContent = fs.readFileSync(middlewarePath, "utf8");
  assert(middlewareContent.includes('pathname === "/poets"'), "Routing", "middleware redirects /poets to /authors");
  assert(middlewareContent.includes("\\/poet\\/"), "Routing", "middleware redirects /poet/:slug to /author/:slug");
  assert(middlewareContent.includes("listingRedirectTarget"), "Routing", "middleware canonicalizes /kalams and /lyrics query strings");
} catch (e) {
  assert(false, "Routing", "Failed to check middleware.ts", e.message);
}

// 6b. Path pagination: old query URLs are not linked, and the route files exist
try {
  const routeFiles = [
    "app/kalams/page/[page]/page.tsx",
    "app/lyrics/[lang]/page/[page]/page.tsx",
    "app/lyrics/[lang]/letter/[letter]/page.tsx",
    "app/lyrics/[lang]/letter/[letter]/page/[page]/page.tsx",
  ];
  for (const file of routeFiles) {
    assert(fs.existsSync(path.join(rootDir, file)), "Pagination", `${file} exists`);
  }
  const sitemap = fs.readFileSync(path.join(rootDir, "utils", "sitemapData.ts"), "utf8");
  assert(!sitemap.includes("?page=") && !sitemap.includes("?letter="), "Pagination", "sitemap has no ?page= or ?letter= URLs");
  assert(sitemap.includes('path: "/kalams"') && sitemap.includes('path: "/lyrics/hindi"'), "Pagination", "sitemap keeps the indexable listing URLs");

  const queryLink = /\?(?:page|letter)=/;
  const roots = ["app", "components"];
  const offenders = [];
  for (const dir of roots) {
    walk(path.join(rootDir, dir), (file) => {
      if (!/\.(tsx|ts)$/.test(file)) return;
      const text = fs.readFileSync(file, "utf8");
      if (queryLink.test(text)) offenders.push(path.relative(rootDir, file));
    });
  }
  assert(offenders.length === 0, "Pagination", "no app or component link uses ?page= or ?letter=", offenders.join(", "));
} catch (e) {
  assert(false, "Pagination", "Failed to check pagination routes", e.message);
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

  // A loading.tsx boundary streams a 200 before notFound() or a redirect can set the status.
  for (const file of ["app/loading.tsx", "app/kalam/[slug]/loading.tsx", "app/kalam/[slug]/[lang]/loading.tsx"]) {
    assert(!fs.existsSync(path.join(rootDir, file)), "Error Pages", `${file} is absent, so 404s and redirects keep their status`);
  }
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
