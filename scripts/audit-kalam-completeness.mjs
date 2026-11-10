/**
 * Compare merged extract JSON vs Supabase stanza counts.
 *
 *   node scripts/audit-kalam-completeness.mjs
 *   node scripts/audit-kalam-completeness.mjs --json   # machine-readable summary
 */

import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mergeBlocksFromFile, stanzaCount } from "./merge-extract-blocks.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const asJson = process.argv.includes("--json");

function loadEnv() {
  for (const f of [".env", ".env.local"]) {
    const p = join(__dirname, "..", f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

/** Likely wrong split: new kalam flag but title is first sher line */
function findSuspiciousSplits(jsonPath) {
  const blocks = JSON.parse(readFileSync(jsonPath, "utf8"));
  if (!Array.isArray(blocks) || !blocks.some((b) => "belongs_to_new_kalam" in b)) return [];

  const out = [];
  for (let i = 1; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.belongs_to_new_kalam === false) continue;
    const title = (b.title_roman_english || "").trim().toLowerCase();
    const firstLine = (b.lyrics_roman_english || "").split("\n")[0]?.trim().toLowerCase() || "";
    if (title && firstLine && (firstLine.startsWith(title.slice(0, 20)) || title.startsWith(firstLine.slice(0, 20)))) {
      out.push({
        index: i,
        title: b.title_roman_english,
        prevTitle: blocks[i - 1]?.title_roman_english || "(continuation)",
      });
    }
  }
  return out;
}

loadEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const supabase = createClient(url, key);
const publicDir = join(__dirname, "..", "data", "extracted");
const files = readdirSync(publicDir).filter((f) => f.endsWith("_extracted.json"));

const { data: kalams } = await supabase.from("kalams").select("id, slug, primary_title_roman");
const slugToId = new Map((kalams || []).map((k) => [k.slug, k.id]));

const { data: romanRows } = await supabase
  .from("kalam_translations")
  .select("kalam_id, lyrics")
  .eq("language", "roman_english");

const dbStanzasBySlug = new Map();
for (const row of romanRows || []) {
  const slug = [...slugToId.entries()].find(([, id]) => id === row.kalam_id)?.[0];
  if (slug) dbStanzasBySlug.set(slug, stanzaCount(row.lyrics));
}

const report = { shortInDb: [], missingInDb: [], suspiciousSplits: [], ok: 0 };

for (const file of files) {
  const path = join(publicDir, file);
  const merged = mergeBlocksFromFile(path);
  report.suspiciousSplits.push(...findSuspiciousSplits(path).map((s) => ({ file, ...s })));

  for (const [slug, entry] of merged) {
    const expected = stanzaCount(entry.lyrics.roman_english);
    if (expected === 0) continue;
    const dbCount = dbStanzasBySlug.get(slug);
    if (dbCount === undefined) {
      report.missingInDb.push({ file, slug, title: entry.titleRoman, expectedStanzas: expected });
    } else if (dbCount < expected) {
      report.shortInDb.push({
        file,
        slug,
        title: entry.titleRoman,
        dbStanzas: dbCount,
        expectedStanzas: expected,
        missing: expected - dbCount,
      });
    } else {
      report.ok += 1;
    }
  }
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("\n=== Kalam completeness audit (extract merge vs DB) ===\n");
  console.log(`Matched OK (DB stanzas >= extract): ${report.ok}`);
  console.log(`Short in DB: ${report.shortInDb.length}`);
  console.log(`In extract but no DB slug: ${report.missingInDb.length}`);
  console.log(`Suspicious split blocks: ${report.suspiciousSplits.length}\n`);

  if (report.shortInDb.length) {
    console.log("--- Incomplete in DB (fix priority) ---");
    for (const r of report.shortInDb.sort((a, b) => b.missing - a.missing).slice(0, 40)) {
      console.log(`  ${r.slug}: DB ${r.dbStanzas} / extract ${r.expectedStanzas} (-${r.missing}) [${r.file}]`);
    }
    if (report.shortInDb.length > 40) console.log(`  ... and ${report.shortInDb.length - 40} more`);
  }

  if (report.suspiciousSplits.length) {
    console.log("\n--- Likely mis-split continuations in extract ---");
    for (const s of report.suspiciousSplits.slice(0, 25)) {
      console.log(`  [${s.file}] block ${s.index}: "${s.title}" (after ${s.prevTitle})`);
    }
  }
}

process.exitCode = report.shortInDb.length ? 1 : 0;
