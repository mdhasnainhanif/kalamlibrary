const EXPECTED_ORIGIN = "https://www.kalamlibrary.me";
const urls = [
  `${EXPECTED_ORIGIN}/`,
  `${EXPECTED_ORIGIN}/kalam/salam`,
  `${EXPECTED_ORIGIN}/kalams`,
  `${EXPECTED_ORIGIN}/authors`,
  `${EXPECTED_ORIGIN}/trending`,
  `${EXPECTED_ORIGIN}/search?q=naat`,
];

const mismatches = [];

for (const url of urls) {
  const h = await (await fetch(url)).text();
  const title = h.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
  const desc = h.match(/name="description" content="([^"]*)"/i)?.[1];
  const canonical = h.match(/rel="canonical" href="([^"]*)"/i)?.[1];
  const ogUrl =
    h.match(/property="og:url" content="([^"]*)"/i)?.[1] ||
    h.match(/property='og:url' content='([^']*)'/i)?.[1];
  const robots = h.match(/name="robots" content="([^"]*)"/i)?.[1];
  const jsonLd = (h.match(/application\/ld\+json/g) || []).length;
  console.log("\n" + url);
  console.log("  title:", title?.slice(0, 75));
  console.log("  desc:", desc?.slice(0, 90));
  console.log("  canonical:", canonical);
  if (ogUrl) console.log("  og:url:", ogUrl);
  if (robots) console.log("  robots:", robots);
  console.log("  json-ld blocks:", jsonLd);

  if (canonical && !canonical.startsWith(EXPECTED_ORIGIN)) {
    mismatches.push({ url, field: "canonical", value: canonical });
  }
  if (ogUrl && !ogUrl.startsWith(EXPECTED_ORIGIN)) {
    mismatches.push({ url, field: "og:url", value: ogUrl });
  }
}

const sm = await (await fetch(`${EXPECTED_ORIGIN}/sitemap.xml`)).text();
const locCount = (sm.match(/<loc>/g) || []).length;
const wwwLocs = (sm.match(/https:\/\/www\.kalamlibrary\.me/g) || []).length;
const apexLocs = (sm.match(/https:\/\/kalamlibrary\.me/g) || []).length;
console.log("\nsitemap urls:", locCount, "has /kalam/", sm.includes("/kalam/"));
console.log("  loc host www:", wwwLocs, "apex:", apexLocs);
if (apexLocs > 0 && wwwLocs === 0) {
  mismatches.push({ url: "sitemap.xml", field: "loc", value: "all apex (no www)" });
}

if (mismatches.length) {
  console.log("\n❌ URL host mismatches (expected", EXPECTED_ORIGIN + "):");
  mismatches.forEach((m) => console.log(" ", m.url, m.field, "→", m.value));
  process.exitCode = 1;
} else {
  console.log("\n✅ Canonical, og:url, and sitemap locs use", EXPECTED_ORIGIN);
}

const kalamHtml = await (await fetch("https://www.kalamlibrary.me/kalam/salam")).text();
const hreflang = [...kalamHtml.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)];
console.log("\n/kalam/salam hreflang:", hreflang.length);
hreflang.forEach((m) => console.log(" ", m[1], m[2]));
