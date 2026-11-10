/**
 * Replace DB lyrics with merged extract when stanza count is behind (any gap size).
 *
 *   node scripts/sync-short-from-extract.mjs --file qabala-e-bakhshish_extracted.json
 *   node scripts/sync-short-from-extract.mjs --file qabala-e-bakhshish_extracted.json --apply
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mergeBlocksFromFile, stanzaCount, stripFooterLines } from "./merge-extract-blocks.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apply = process.argv.includes("--apply");
const fileArg = process.argv.find((a, i) => process.argv[i - 1] === "--file");

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

async function updateTranslations(supabase, kalamId, lyrics, titleRoman, titleUrdu) {
  const langs = [
    ["urdu", titleUrdu || titleRoman, lyrics.urdu],
    ["roman_english", titleRoman, lyrics.roman_english],
    ["hindi", titleRoman, lyrics.hindi],
    ["bangla", titleRoman, lyrics.bangla],
  ];

  for (const [language, title, text] of langs) {
    if (!text?.trim()) continue;
    const payload = {
      kalam_id: kalamId,
      language,
      title: (title || titleRoman).trim(),
      lyrics: stripFooterLines(text),
    };
    const { data: existing } = await supabase
      .from("kalam_translations")
      .select("id")
      .eq("kalam_id", kalamId)
      .eq("language", language)
      .maybeSingle();

    if (existing?.id) {
      const { data, error } = await supabase.from("kalam_translations").update(payload).eq("id", existing.id).select("id");
      if (error) throw error;
      if (!data?.length) throw new Error(`Update blocked for ${language} (0 rows)`);
    } else {
      const { error } = await supabase.from("kalam_translations").insert(payload);
      if (error) throw error;
    }
  }
}

loadEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const publicDir = join(__dirname, "..", "data", "extracted");
let files = readdirSync(publicDir).filter((f) => f.endsWith("_extracted.json"));
if (fileArg) {
  if (!files.includes(fileArg)) {
    console.error("Unknown extract file:", fileArg);
    process.exit(1);
  }
  files = [fileArg];
}

const supabase = createClient(url, key);
const { data: allKalams } = await supabase.from("kalams").select("id, slug");
const slugToId = new Map((allKalams || []).map((k) => [k.slug, k.id]));
const { data: allRoman } = await supabase
  .from("kalam_translations")
  .select("kalam_id, lyrics")
  .eq("language", "roman_english");
const dbStanzasById = new Map((allRoman || []).map((r) => [r.kalam_id, stanzaCount(r.lyrics)]));

const toSync = [];
for (const file of files) {
  const merged = mergeBlocksFromFile(join(publicDir, file));
  for (const [slug, entry] of merged) {
    const expected = stanzaCount(entry.lyrics.roman_english);
    if (!expected) continue;
    const kalamId = slugToId.get(slug);
    if (!kalamId) continue;
    const db = dbStanzasById.get(kalamId) ?? 0;
    if (db < expected) {
      toSync.push({ file, slug, kalamId, db, expected, entry });
    }
  }
}

toSync.sort((a, b) => b.expected - b.db - (a.expected - a.db));

console.log(`Mode: ${apply ? "APPLY" : "dry-run"}`);
console.log(`Files: ${files.join(", ")}`);
console.log(`Kalams to sync (DB behind extract): ${toSync.length}\n`);

for (const r of toSync) {
  console.log(`  ${r.slug}: ${r.db} -> ${r.expected} (+${r.expected - r.db})`);
}

if (!apply) {
  console.log("\nRe-run with --apply to update Supabase.");
  process.exit(toSync.length ? 0 : 0);
}

let ok = 0;
for (const r of toSync) {
  await updateTranslations(supabase, r.kalamId, r.entry.lyrics, r.entry.titleRoman, r.entry.titleUrdu);
  console.log(`Synced: ${r.slug}`);
  ok += 1;
}

console.log(`\nDone. Updated ${ok} kalam(s).`);
