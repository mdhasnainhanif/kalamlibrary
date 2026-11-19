const base = (process.argv[2] || "http://127.0.0.1:8787").replace(/\/$/, "");
const label = process.argv[3] || "run";

const paths = [
  "/",
  "/kalams",
  "/authors",
  "/author/imam-ahmad-raza-khan-qadri",
  "/kalam/salam",
  "/kalam/salam/urdu",
  "/kalam/salam/hindi",
  "/kalam/salam/bangla",
  "/aurad-o-wazaif",
];

function extract(html) {
  const head = html.match(/<head[^>]*>[\s\S]*?<\/head>/i)?.[0] ?? "";
  const main = html.match(/<main[^>]*>[\s\S]*?<\/main>/i)?.[0] ?? "";
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
  const canonical =
    html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] ||
    html.match(/<link[^>]+href=["'][^"']+["'][^>]+rel=["']canonical["']/i)?.[0] ||
    "";
  const hreflangCount = (html.match(/rel=["']alternate["'][^>]+hreflang=/gi) || []).length;
  const hasLyrics =
    /kalam-stanza|LyricsDisplay|class="[^"]*stanza/i.test(html) ||
    (main.length > 800 && !/Page Not Found|404|not-found/i.test(main));
  const coupletPreview = main
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(200, 350);
  return { head, main, h1, canonical, hreflangCount, hasLyrics, coupletPreview };
}

const rows = [];
for (const path of paths) {
  const url = `${base}${path}`;
  let status = 0;
  let cc = "";
  let cl = "";
  let html = "";
  try {
    const res = await fetch(url, { redirect: "manual", headers: { Accept: "text/html" } });
    status = res.status;
    cc = res.headers.get("cache-control") || "";
    cl = res.headers.get("content-length") || "";
    if (status >= 200 && status < 400) html = await res.text();
  } catch (e) {
    html = `FETCH_ERROR: ${e.message}`;
  }
  const meta = extract(html);
  rows.push({
    path,
    status,
    cacheControl: cc,
    contentLength: cl || String(html.length),
    bodyBytes: html.length,
    h1: meta.h1,
    hasLyrics: meta.hasLyrics,
    hreflangCount: meta.hreflangCount,
    canonicalSnippet: meta.canonical.slice(0, 220),
    coupletPreview: meta.coupletPreview,
    mainLen: meta.main.length,
    head: meta.head,
    main: meta.main,
  });
}

console.log(`\n=== VERIFY ${label} @ ${base} ===\n`);
for (const r of rows) {
  console.log(`${r.path}`);
  console.log(`  status=${r.status} cache-control=${r.cacheControl}`);
  console.log(`  content-length=${r.contentLength} bodyBytes=${r.bodyBytes} mainLen=${r.mainLen}`);
  console.log(`  h1="${r.h1.slice(0, 100)}" hasLyrics=${r.hasLyrics} hreflang=${r.hreflangCount}`);
  console.log(`  canonical=${r.canonicalSnippet || "(none)"}`);
  if (r.path.includes("/kalam/")) console.log(`  lyricsSnippet="${r.coupletPreview}"`);
  console.log("");
}

const fs = await import("node:fs");
fs.writeFileSync(`.local/verify-${label}.json`, JSON.stringify({ label, base, rows }, null, 2));
