/**
 * Import kalams from data/extracted/*_extracted.json that are not yet in Supabase.
 *
 * Usage (repo root):
 *   node scripts/import-missing-from-extract.mjs          # dry-run
 *   node scripts/import-missing-from-extract.mjs --apply    # insert rows
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apply = process.argv.includes("--apply");

function loadEnv() {
  for (const f of [".env", ".env.local"]) {
    const p = join(__dirname, "..", f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) {
        process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  }
}

function norm(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Match utils/kalam.ts cleanKalamSlug */
function cleanKalamSlug(raw) {
  let slug = raw;
  try {
    slug = decodeURIComponent(raw);
  } catch {
    slug = raw;
  }
  slug = slug
    .replace(/[\uFDFA\uFDFB\uFDFD]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[-\s]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length > 90) {
    const trimmed = slug.slice(0, 90);
    const lastHyphen = trimmed.lastIndexOf("-");
    slug = lastHyphen > 40 ? trimmed.slice(0, lastHyphen) : trimmed;
  }
  return slug;
}

function isInCatalog(item, titles, slugs) {
  const title = (item.title_roman_english || "").trim();
  const n = norm(title);
  const slug = cleanKalamSlug(title);
  if (titles.has(n) || slugs.has(slug)) return true;
  const pref = n.slice(0, 25);
  if (pref.length >= 15) {
    for (const t of titles) {
      if (t.startsWith(pref) || n.startsWith(t.slice(0, 25))) return true;
    }
  }
  return false;
}

function collectCandidates(publicDir, titles, slugs) {
  const files = readdirSync(publicDir).filter((f) => f.endsWith("_extracted.json"));
  const bySlug = new Map();
  for (const file of files) {
    const arr = JSON.parse(readFileSync(join(publicDir, file), "utf8"));
    for (const item of arr) {
      const title = (item.title_roman_english || "").trim();
      if (!title || !(item.lyrics_urdu || "").trim()) continue;
      if (isInCatalog(item, titles, slugs)) continue;
      const slug = cleanKalamSlug(title);
      if (!slug) continue;
      if (!bySlug.has(slug)) {
        bySlug.set(slug, { ...item, sourceFile: file, slug });
      }
    }
  }
  return [...bySlug.values()];
}

async function resolveAuthorId(supabase, nameRoman) {
  const name = (nameRoman || "Unknown").trim();
  const { data: existing } = await supabase
    .from("authors")
    .select("id")
    .ilike("name_roman", name)
    .maybeSingle();
  if (existing?.id) return existing.id;

  const { data: inserted, error } = await supabase
    .from("authors")
    .insert({ name_roman: name })
    .select("id")
    .single();
  if (error) throw error;
  return inserted.id;
}

async function uniqueSlug(supabase, base) {
  let slug = base;
  let n = 2;
  while (true) {
    const { data } = await supabase.from("kalams").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

async function insertKalam(supabase, item) {
  const titleRoman = item.title_roman_english.trim();
  const slug = await uniqueSlug(supabase, item.slug);
  const authorId = await resolveAuthorId(supabase, item.author_name);

  const { data: kalam, error: kErr } = await supabase
    .from("kalams")
    .insert({
      author_id: authorId,
      slug,
      primary_title_roman: titleRoman,
      primary_title_urdu: item.title_urdu || null,
    })
    .select("id, slug")
    .single();
  if (kErr) throw kErr;

  const langs = [
    ["urdu", item.title_urdu, item.lyrics_urdu],
    ["roman_english", item.title_roman_english, item.lyrics_roman_english],
    ["hindi", item.title_hindi, item.lyrics_hindi],
    ["bangla", item.title_bangla, item.lyrics_bangla],
  ];

  const rows = langs
    .filter(([, t, lyrics]) => (t || "").trim() && (lyrics || "").trim())
    .map(([language, title, lyrics]) => ({
      kalam_id: kalam.id,
      language,
      title: title.trim(),
      lyrics: lyrics.trim(),
    }));

  if (rows.length) {
    const { error: tErr } = await supabase.from("kalam_translations").insert(rows);
    if (tErr) throw tErr;
  }

  return kalam;
}

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const { data: kalams, error } = await supabase.from("kalams").select("slug, primary_title_roman");
  if (error) {
    console.error(error);
    process.exit(1);
  }

  const titles = new Set((kalams || []).map((k) => norm(k.primary_title_roman)));
  const slugs = new Set((kalams || []).map((k) => k.slug.toLowerCase()));
  const publicDir = join(__dirname, "..", "data", "extracted");
  const candidates = collectCandidates(publicDir, titles, slugs);

  console.log(`Mode: ${apply ? "APPLY (insert)" : "dry-run"}`);
  console.log(`Kalams in DB: ${kalams?.length ?? 0}`);
  console.log(`Missing from extract files: ${candidates.length}`);
  for (const c of candidates) {
    console.log(`  - ${c.title_roman_english} (${c.slug}) [${c.sourceFile}]`);
  }

  if (!apply || candidates.length === 0) return;

  let ok = 0;
  for (const item of candidates) {
    try {
      const row = await insertKalam(supabase, item);
      console.log(`Inserted: /kalam/${row.slug}`);
      ok += 1;
    } catch (e) {
      console.error(`Failed: ${item.title_roman_english}`, e.message || e);
    }
  }
  console.log(`Done. Inserted ${ok}/${candidates.length}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
