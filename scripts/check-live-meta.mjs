const urls = [
  "https://kalamlibrary.me/",
  "https://kalamlibrary.me/kalam/salam",
  "https://kalamlibrary.me/kalams",
  "https://kalamlibrary.me/authors",
  "https://kalamlibrary.me/trending",
  "https://kalamlibrary.me/search?q=naat",
];

for (const url of urls) {
  const h = await (await fetch(url)).text();
  const title = h.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
  const desc = h.match(/name="description" content="([^"]*)"/i)?.[1];
  const canonical = h.match(/rel="canonical" href="([^"]*)"/i)?.[1];
  const robots = h.match(/name="robots" content="([^"]*)"/i)?.[1];
  const jsonLd = (h.match(/application\/ld\+json/g) || []).length;
  console.log("\n" + url);
  console.log("  title:", title?.slice(0, 75));
  console.log("  desc:", desc?.slice(0, 90));
  console.log("  canonical:", canonical);
  if (robots) console.log("  robots:", robots);
  console.log("  json-ld blocks:", jsonLd);
}

const sm = await (await fetch("https://kalamlibrary.me/sitemap.xml")).text();
console.log("\nsitemap urls:", (sm.match(/<loc>/g) || []).length, "has /kalam/", sm.includes("/kalam/"));

const kalamHtml = await (await fetch("https://kalamlibrary.me/kalam/salam")).text();
const hreflang = [...kalamHtml.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)];
console.log("\n/kalam/salam hreflang:", hreflang.length);
hreflang.forEach((m) => console.log(" ", m[1], m[2]));
