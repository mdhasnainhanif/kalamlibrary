/**
 * Export your Supabase kalam catalog for comparison (titles + slugs only).
 *
 * Usage (from repo root, with real SUPABASE_SERVICE_ROLE_KEY in env):
 *   set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 *   set NEXT_PUBLIC_SUPABASE_URL=https://pbcmhgcailbocwugbrqn.supabase.co
 *   node scripts/export-kalam-catalog.mjs
 *
 * Output: scripts/out/kalam-library-catalog.json
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

const { data, error, count } = await supabase
  .from("kalams")
  .select("slug, primary_title_roman, primary_title_urdu, created_at, authors(name_roman)", {
    count: "exact",
  })
  .order("primary_title_roman");

if (error) {
  console.error(error);
  process.exit(1);
}

const outDir = join(__dirname, "out");
mkdirSync(outDir, { recursive: true });
const payload = {
  exportedAt: new Date().toISOString(),
  totalKalams: count ?? data?.length ?? 0,
  kalams: (data || []).map((row) => ({
    slug: row.slug,
    titleRoman: row.primary_title_roman,
    titleUrdu: row.primary_title_urdu,
    author: Array.isArray(row.authors) ? row.authors[0]?.name_roman : row.authors?.name_roman,
  })),
};

const outPath = join(outDir, "kalam-library-catalog.json");
writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
console.log(`Wrote ${payload.totalKalams} kalams to ${outPath}`);
