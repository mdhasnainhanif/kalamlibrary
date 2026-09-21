/**
 * Compare Midhah title list (YOU provide) vs Kalam Library catalog.
 * Does NOT scrape Midhah — paste/export their titles into scripts/in/midhah-titles.json
 *
 * midhah-titles.json format:
 * [
 *   { "title": "Mustafa Jaan-e-Rehmat Pe Lakhon Salaam", "genre": "naat", "slug": "optional" },
 *   ...
 * ]
 *
 * Usage:
 *   node scripts/export-kalam-catalog.mjs
 *   node scripts/compare-midhah-gap.mjs
 *
 * Output: scripts/out/midhah-only-missing-in-library.json
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function normalizeTitle(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyTitle(s) {
  return normalizeTitle(s).replace(/\s+/g, "-").slice(0, 90);
}

const catalogPath = join(__dirname, "out", "kalam-library-catalog.json");
const midhahPath = join(__dirname, "in", "midhah-titles.json");

if (!existsSync(catalogPath)) {
  console.error("Run: node scripts/export-kalam-catalog.mjs first");
  process.exit(1);
}
if (!existsSync(midhahPath)) {
  console.error(
    "Create scripts/in/midhah-titles.json with Midhah entries (title required). See script header."
  );
  process.exit(1);
}

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const midhah = JSON.parse(readFileSync(midhahPath, "utf8"));

const ourTitles = new Set(catalog.kalams.map((k) => normalizeTitle(k.titleRoman)));
const ourSlugs = new Set(catalog.kalams.map((k) => k.slug.toLowerCase()));

const missing = [];
for (const item of midhah) {
  const titleNorm = normalizeTitle(item.title);
  const slugGuess = (item.slug || slugifyTitle(item.title)).toLowerCase();
  if (ourTitles.has(titleNorm) || ourSlugs.has(slugGuess)) continue;
  missing.push({
    title: item.title,
    genre: item.genre || "naat",
    suggestedSlug: slugGuess,
    note: "Add manually via Supabase/admin — do not copy lyrics from competitors without rights.",
  });
}

const outPath = join(__dirname, "out", "midhah-only-missing-in-library.json");
writeFileSync(
  outPath,
  JSON.stringify(
    {
      comparedAt: new Date().toISOString(),
      libraryKalams: catalog.totalKalams,
      midhahEntriesChecked: midhah.length,
      missingInLibrary: missing.length,
      items: missing,
    },
    null,
    2
  ),
  "utf8"
);

console.log(`Library: ${catalog.totalKalams} kalams`);
console.log(`Midhah list: ${midhah.length} entries`);
console.log(`Likely new (not in DB): ${missing.length}`);
console.log(`Report: ${outPath}`);
