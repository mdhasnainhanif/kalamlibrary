/**
 * Listing URL canonicalization. No database.
 *
 *   node scripts/check-listing-redirects.mjs
 *
 * Against a local server only (never production):
 *
 *   $env:CHECK_ORIGIN = "http://127.0.0.1:3456"
 *   node scripts/check-listing-redirects.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import http from "node:http";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const warningFlag = "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON";
if (!process.execArgv.includes(warningFlag)) {
  const result = spawnSync(
    process.execPath,
    [warningFlag, ...process.execArgv, fileURLToPath(import.meta.url), ...process.argv.slice(2)],
    { stdio: "inherit", env: process.env }
  );
  process.exit(result.status ?? 1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("@/")) return nextResolve(specifier, context);
    const base = path.join(root, specifier.slice(2));
    const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.mjs`];
    const hit = candidates.find((file) => existsSync(file) && statSync(file).isFile());
    if (!hit) throw new Error(`Cannot resolve ${specifier}`);
    return nextResolve(pathToFileURL(hit).href, context);
  },
});

const { listingRedirectTarget, listingPageExceedsCap, LISTING_LANGS } = await import("../utils/listingPaths.ts");
const { LYRIC_LANGUAGES } = await import("../utils/kalam.ts");
const { contentRedirect } = await import("../utils/contentRedirect.ts");

let failed = 0;

function check(name, actual, expected) {
  const ok = actual === expected;
  console.log(`${ok ? "ok" : "FAIL"} ${name}${ok ? "" : ` (got ${actual})`}`);
  if (!ok) failed += 1;
}

function target(pathname, search = "") {
  return listingRedirectTarget(pathname, new URLSearchParams(search));
}

const cases = [
  ["/kalams?page=2", target("/kalams", "page=2"), "/kalams/page/2"],
  ["/kalams?page=1", target("/kalams", "page=1"), "/kalams"],
  ["/kalams?page=01", target("/kalams", "page=01"), "/kalams"],
  ["/kalams?page=0", target("/kalams", "page=0"), "/kalams"],
  ["/kalams?page=abc", target("/kalams", "page=abc"), "/kalams"],
  ["/kalams?letter=a", target("/kalams", "letter=a"), "/kalams"],
  ["/kalams?page=2&utm_source=x", target("/kalams", "page=2&utm_source=x"), "/kalams/page/2"],
  ["/kalams?utm_source=x", target("/kalams", "utm_source=x"), "/kalams"],
  ["/kalams/page/1", target("/kalams/page/1"), "/kalams"],
  ["/kalams/page/01", target("/kalams/page/01"), "/kalams"],
  ["/kalams/page/02", target("/kalams/page/02"), "/kalams/page/2"],
  ["/kalams/page/2", target("/kalams/page/2"), null],
  ["/kalams/page/2?x=1", target("/kalams/page/2", "x=1"), "/kalams/page/2"],
  ["/kalams/page/2?page=9", target("/kalams/page/2", "page=9"), "/kalams/page/2"],
  ["/kalams/page/foo?x=1", target("/kalams/page/foo", "x=1"), "/kalams/page/foo"],
  ["/kalams/", target("/kalams/"), "/kalams"],
  ["/lyrics/hindi?page=2", target("/lyrics/hindi", "page=2"), "/lyrics/hindi/page/2"],
  ["/lyrics/hindi?letter=A", target("/lyrics/hindi", "letter=A"), "/lyrics/hindi/letter/a"],
  ["/lyrics/hindi?letter=A&page=2", target("/lyrics/hindi", "letter=A&page=2"), "/lyrics/hindi/letter/a/page/2"],
  ["/lyrics/hindi?letter=A&page=1", target("/lyrics/hindi", "letter=A&page=1"), "/lyrics/hindi/letter/a"],
  ["/lyrics/hindi?letter=ab", target("/lyrics/hindi", "letter=ab"), "/lyrics/hindi"],
  ["/lyrics/hindi?foo=1", target("/lyrics/hindi", "foo=1"), "/lyrics/hindi"],
  ["/lyrics/hindi/letter/A", target("/lyrics/hindi/letter/A"), "/lyrics/hindi/letter/a"],
  ["/lyrics/hindi/letter/a/page/1", target("/lyrics/hindi/letter/a/page/1"), "/lyrics/hindi/letter/a"],
  ["/lyrics/hindi/letter/a", target("/lyrics/hindi/letter/a"), null],
  ["/lyrics/hindi/letter/a/page/2", target("/lyrics/hindi/letter/a/page/2"), null],
  ["/lyrics/Hindi/page/02", target("/lyrics/Hindi/page/02"), "/lyrics/hindi/page/2"],
  ["/lyrics/hindi/page/2?letter=b", target("/lyrics/hindi/page/2", "letter=b"), "/lyrics/hindi/letter/b/page/2"],
  ["/lyrics/nope?x=1", target("/lyrics/nope", "x=1"), "/lyrics/nope"],
  ["/about?x=1", target("/about", "x=1"), null],
  ["/kalam/salam?x=1", target("/kalam/salam", "x=1"), null],
];

for (const [name, actual, expected] of cases) check(name, actual, expected);

const contentCases = [
  ["/kalam/salam?x=1", contentRedirect("/kalam/salam", "?x=1"), { pathname: "/kalam/salam", status: 301 }],
  ["/kalam/salam/hindi?x=1", contentRedirect("/kalam/salam/hindi", "?x=1"), { pathname: "/kalam/salam/hindi", status: 301 }],
  ["/author/someone?x=1", contentRedirect("/author/someone", "?x=1"), { pathname: "/author/someone", status: 301 }],
  ["/search?q=naat", contentRedirect("/search", "?q=naat"), null],
  ["/contact?subject=hi", contentRedirect("/contact", "?subject=hi"), null],
  ["/api/search?q=naat", contentRedirect("/api/search", "?q=naat"), null],
  ["/ads.txt?x=1", contentRedirect("/ads.txt", "?x=1"), null],
  ["/sitemap.xml?x=1", contentRedirect("/sitemap.xml", "?x=1"), null],
];

for (const [name, actual, expected] of contentCases) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "ok" : "FAIL"} ${name}${ok ? "" : ` (got ${JSON.stringify(actual)})`}`);
  if (!ok) failed += 1;
}

const langKeys = Object.keys(LYRIC_LANGUAGES).sort().join(",");
check("LISTING_LANGS matches LYRIC_LANGUAGES", [...LISTING_LANGS].sort().join(","), langKeys);
check("/kalams/page/9999 exceeds the cap", listingPageExceedsCap("/kalams/page/9999"), true);
check("/kalams/page/2 stays a real page", listingPageExceedsCap("/kalams/page/2"), false);
check("/lyrics/hindi/letter/a/page/1001 exceeds the cap", listingPageExceedsCap("/lyrics/hindi/letter/a/page/1001"), true);

const origin = process.env.CHECK_ORIGIN;
if (origin) {
  let host = "";
  try {
    host = new URL(origin).hostname;
  } catch {
    console.error(`CHECK_ORIGIN is not a URL: ${origin}`);
    process.exit(1);
  }
  if (host === "kalamlibrary.me" || host.endsWith(".kalamlibrary.me")) {
    console.error("Refusing to request production. Point CHECK_ORIGIN at a local server.");
    process.exit(1);
  }

  for (const [name, , expected] of cases) {
    if (expected === null || name.startsWith("/about") || name.startsWith("/kalam/")) continue;
    const url = new URL(name, origin);
    const response = await fetch(url, { redirect: "manual" });
    const location = response.headers.get("location");
    const dest = location ? new URL(location, origin).pathname : null;
    const search = location ? new URL(location, origin).search : "";
    // Next itself 308s a trailing slash before this app's middleware runs.
    const statusOk = response.status === 301 || (response.status === 308 && name.endsWith("/"));
    const ok = statusOk && dest === expected && search === "";
    console.log(`${ok ? "ok" : "FAIL"} HTTP ${name} → ${response.status} ${dest ?? "(no location)"}${search}`);
    if (!ok) failed += 1;
  }

  for (const untouched of ["/about?x=1", "/search?q=naat", "/api/search?q=naat"]) {
    const response = await fetch(new URL(untouched, origin), { redirect: "manual" });
    const ok = response.status !== 301 && response.status !== 302 && response.status !== 308;
    console.log(`${ok ? "ok" : "FAIL"} HTTP ${untouched} is not redirected (${response.status})`);
    if (!ok) failed += 1;
  }

  const contact = await fetch(new URL("/contact?subject=hi", origin), { redirect: "manual" });
  const contactLocation = contact.headers.get("location");
  const contactDest = contactLocation ? new URL(contactLocation, origin) : null;
  const contactOk = contact.status === 301 && contactDest?.pathname === "/contact" && contactDest.search === "";
  console.log(`${contactOk ? "ok" : "FAIL"} HTTP /contact?subject=hi keeps its own redirect → ${contact.status} ${contactDest?.pathname ?? ""}${contactDest?.search ?? ""}`);
  if (!contactOk) failed += 1;

  for (const [name, , expected] of contentCases) {
    if (!expected) continue;
    const response = await fetch(new URL(name, origin), { redirect: "manual" });
    const location = response.headers.get("location");
    const dest = location ? new URL(location, origin) : null;
    const ok =
      response.status === expected.status &&
      dest?.pathname === expected.pathname &&
      (dest?.search ?? "") === "";
    console.log(`${ok ? "ok" : "FAIL"} HTTP ${name} → ${response.status} ${dest?.pathname ?? "(no location)"}${dest?.search ?? ""}`);
    if (!ok) failed += 1;
  }

  for (const [filePath, host] of [
    ["/ads.txt", "kalamlibrary.me"],
    ["/ads.txt", "www.kalamlibrary.me"],
    ["/robots.txt", "kalamlibrary.me"],
    ["/robots.txt", "www.kalamlibrary.me"],
  ]) {
    const response = await requestWithHost(origin, filePath, host);
    const ok = response.status === 200 && !response.location;
    console.log(`${ok ? "ok" : "FAIL"} HTTP Host ${host} ${filePath} → ${response.status} ${response.location}`);
    if (!ok) failed += 1;
  }

  const apex = await requestWithHost(origin, "/kalams", "kalamlibrary.me");
  const apexOk = apex.status === 301 && apex.location.startsWith("https://www.kalamlibrary.me/kalams");
  console.log(`${apexOk ? "ok" : "FAIL"} HTTP Host kalamlibrary.me /kalams → ${apex.status} ${apex.location}`);
  if (!apexOk) failed += 1;

  const apexSitemap = await requestWithHost(origin, "/sitemap.xml", "kalamlibrary.me");
  const sitemapOk = apexSitemap.status === 301 && apexSitemap.location.startsWith("https://www.kalamlibrary.me/sitemap.xml");
  console.log(`${sitemapOk ? "ok" : "FAIL"} HTTP Host kalamlibrary.me /sitemap.xml → ${apexSitemap.status} ${apexSitemap.location}`);
  if (!sitemapOk) failed += 1;
}

function requestWithHost(origin, filePath, host) {
  const url = new URL(filePath, origin);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method: "GET",
        headers: { host },
      },
      (res) => {
        res.resume();
        const location = res.headers.location;
        resolve({ status: res.statusCode ?? 0, location: Array.isArray(location) ? location[0] : location ?? "" });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}

console.log(`\n${cases.length} redirect cases passed`);
