"""
Check / import Qasida al-Burda into Supabase.

Usage:
  python scripts/import_qasida_burda.py --check
  python scripts/import_qasida_burda.py --import
  python scripts/build_qasida_burda_import.py   # refresh JSON first
"""

from __future__ import annotations

import argparse
import json
import os
import sys

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if _SCRIPT_DIR not in sys.path:
    sys.path.insert(0, _SCRIPT_DIR)

from extraction_common import KalamDuplicateChecker, get_supabase_client, repo_path
from import_extracted_kalams import load_manifest, sync_kalam


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Search DB for existing Burda")
    parser.add_argument("--import", dest="do_import", action="store_true", help="Insert if missing")
    parser.add_argument("--update", action="store_true", help="Replace lyrics on existing slug from manifest")
    args = parser.parse_args()

    manifest_path = repo_path("data", "imports", "qasida-burda-imam-busiri.json")
    if not os.path.exists(manifest_path):
        print(f"Missing {manifest_path}. Run: python scripts/build_qasida_burda_import.py")
        sys.exit(1)

    records = load_manifest(manifest_path)
    if not records:
        print("Empty manifest.")
        sys.exit(1)
    record = records[0]

    supabase = get_supabase_client()
    checker = KalamDuplicateChecker()

    slug = record.get("slug", "qasida-al-burda-imam-busiri")
    slug_hit = supabase.table("kalams").select("id,slug,primary_title_roman").eq("slug", slug).execute()
    snippet = (record.get("lyrics_urdu") or "")[:80].replace("%", "")
    lyric_hit = (
        supabase.table("kalam_translations")
        .select("kalam_id,title,language,kalams(slug,primary_title_roman)")
        .eq("language", "urdu")
        .ilike("lyrics", f"%{snippet[:40]}%")
        .limit(3)
        .execute()
        .data
        if snippet
        else []
    )

    dup = checker.find_existing(
        record.get("title_roman_english", ""),
        record.get("title_urdu", ""),
    )

    print("=== Qasida al-Burda status ===")
    if slug_hit.data:
        print(f"  slug exists: {slug_hit.data[0]['slug']} ({slug_hit.data[0]['primary_title_roman']})")
    else:
        print("  slug: not found (OK to import)")
    if dup:
        print(f"  duplicate match: {dup.get('slug')}")
    elif lyric_hit:
        print(f"  similar lyrics: {lyric_hit[0].get('kalams', {}).get('slug', lyric_hit[0])}")
    else:
        print("  duplicate: none detected")
    print(f"  manifest: {manifest_path}")

    if args.update:
        if not slug_hit.data:
            print("Update skipped — slug not in database. Run --import first.")
            sys.exit(1)
        kalam_id = slug_hit.data[0]["id"]
        langs = {
            "urdu": (record.get("title_urdu"), record.get("lyrics_urdu")),
            "roman_english": (record.get("title_roman_english"), record.get("lyrics_roman_english")),
            "hindi": (record.get("title_hindi"), record.get("lyrics_hindi")),
            "bangla": (record.get("title_bangla"), record.get("lyrics_bangla")),
        }
        for lang, (title, lyrics) in langs.items():
            if not title or not lyrics:
                continue
            supabase.table("kalam_translations").upsert(
                {
                    "kalam_id": kalam_id,
                    "language": lang,
                    "title": str(title).strip(),
                    "lyrics": str(lyrics).strip(),
                },
                on_conflict="kalam_id,language",
            ).execute()
        print(f"Updated translations for {slug} (kalam_id={kalam_id})")
    elif args.do_import:
        if slug_hit.data:
            print("Import skipped — slug already in database. Use --update to refresh lyrics.")
            sys.exit(0)
        if dup:
            print("Import skipped — duplicate checker matched existing kalam.")
            sys.exit(0)
        result = sync_kalam(supabase, checker, record)
        print(f"Import result: {result}")
    elif not args.check and not args.do_import and not args.update:
        parser.print_help()


if __name__ == "__main__":
    main()
