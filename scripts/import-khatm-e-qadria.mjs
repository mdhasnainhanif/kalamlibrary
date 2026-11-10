/**
 * Add / update "Khatm-e-Qadria" in Supabase.
 *
 * Usage (from repo root):
 *   node scripts/import-khatm-e-qadria.mjs            # dry run: validates the text, touches nothing
 *   node scripts/import-khatm-e-qadria.mjs --import   # insert if the slug does not exist yet
 *   node scripts/import-khatm-e-qadria.mjs --update   # overwrite titles/lyrics of the existing slug
 *
 * Credentials are read from .env.local / .env (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
 * or from the process environment, exactly like the Python import scripts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { buildRecord, SLUG } from "./data/khatm-e-qadria.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const env = {};
  for (const name of [".env", ".env.local"]) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#") || !line.includes("=")) continue;
      const i = line.indexOf("=");
      env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
    }
  }
  return env;
}

const args = new Set(process.argv.slice(2));
const record = buildRecord();

/** Mirror of utils/parseKalamCouplets.ts so we can report how many tiles the site will render. */
function countStanzas(lyrics) {
  const blocks = lyrics
    .split(/\n\n+/)
    .map((b) => b.split("\n").map((l) => l.trim()).filter(Boolean))
    .filter((l) => l.length);
  let n = 0;
  for (const lines of blocks) n += Math.ceil(lines.length / 2);
  return n;
}

console.log(`Kalam:   ${record.title_roman_english} / ${record.title_urdu}  (slug: ${record.slug})`);
for (const [label, key] of [
  ["Arabic/Urdu tab", "lyrics_urdu"],
  ["Roman tab     ", "lyrics_roman_english"],
]) {
  const text = record[key];
  const oneLineBlocks = text.split(/\n\n+/).filter((b) => !b.includes("\n")).length;
  console.log(
    `${label}: ${text.length} chars, ${text.split(/\n\n+/).length} sections, ~${countStanzas(text)} tiles` +
      (oneLineBlocks ? `  [WARNING: ${oneLineBlocks} one-line block(s)]` : "")
  );
}

if (!args.has("--import") && !args.has("--update")) {
  console.log("\nDry run only. Re-run with --import (new) or --update (existing) to write to Supabase.");
  process.exit(0);
}

const env = { ...loadEnv(), ...process.env };
const url = (env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (.env.local / .env / environment).");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function must(promise, what) {
  const { data, error } = await promise;
  if (error) {
    console.error(`${what} failed:`, error.message);
    process.exit(1);
  }
  return data;
}

const existing = await must(supabase.from("kalams").select("id,slug").eq("slug", SLUG).maybeSingle(), "Lookup");

let kalamId = existing?.id;
if (existing && !args.has("--update")) {
  console.log(`\nSlug "${SLUG}" already exists (id ${existing.id}). Use --update to overwrite its text.`);
  process.exit(0);
}

if (!existing) {
  let author = await must(
    supabase.from("authors").select("id").eq("name_roman", record.author_name).limit(1).maybeSingle(),
    "Author lookup"
  );
  if (!author) {
    author = await must(
      supabase
        .from("authors")
        .insert({
          name_roman: record.author_name,
          name_urdu: record.author_name,
          bio: "Poet of Kalam, including writings from classic collections.",
        })
        .select("id")
        .single(),
      "Author insert"
    );
  }
  const kalam = await must(
    supabase
      .from("kalams")
      .insert({
        author_id: author.id,
        primary_title_roman: record.title_roman_english,
        primary_title_urdu: record.title_urdu,
        slug: record.slug,
      })
      .select("id")
      .single(),
    "Kalam insert"
  );
  kalamId = kalam.id;
  console.log(`\nInserted kalam ${record.slug} (id ${kalamId}).`);
} else {
  await must(
    supabase
      .from("kalams")
      .update({ primary_title_roman: record.title_roman_english, primary_title_urdu: record.title_urdu })
      .eq("id", kalamId),
    "Kalam update"
  );
}

const translations = [
  { language: "urdu", title: record.title_urdu, lyrics: record.lyrics_urdu },
  { language: "roman_english", title: record.title_roman_english, lyrics: record.lyrics_roman_english },
];
for (const t of translations) {
  await must(
    supabase.from("kalam_translations").upsert({ kalam_id: kalamId, ...t }, { onConflict: "kalam_id,language" }),
    `Translation upsert (${t.language})`
  );
  console.log(`Saved ${t.language} translation (${t.lyrics.length} chars).`);
}
console.log("Done. Pages revalidate on their 7-day ISR schedule; POST /api/revalidate to refresh immediately.");
