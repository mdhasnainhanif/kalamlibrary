"""
Import / update Durood o Salam kalams from public/imports/durood-o-salam-*.json

Usage:
  python scripts/import_durood_salam.py --import
  python scripts/import_durood_salam.py --update
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


def upsert_translations(supabase, kalam_id: str, record: dict) -> None:
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


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--import", dest="do_import", action="store_true")
    parser.add_argument("--update", action="store_true", help="Refresh lyrics for slugs in updates manifest")
    args = parser.parse_args()

    new_path = repo_path("public", "imports", "durood-o-salam-kalams.json")
    upd_path = repo_path("public", "imports", "durood-o-salam-updates.json")

    supabase = get_supabase_client()
    checker = KalamDuplicateChecker()

    if args.do_import:
        if not os.path.exists(new_path):
            print(f"Missing {new_path}. Run build_durood_salam_import.py --enrich")
            sys.exit(1)
        for record in load_manifest(new_path):
            slug = record.get("slug", "?")
            try:
                result = sync_kalam(supabase, checker, record)
                print(f"{slug}: {result}")
            except Exception as err:
                print(f"{slug}: FAIL {err}")

    if args.update:
        if not os.path.exists(upd_path):
            print(f"Missing {upd_path}")
            sys.exit(1)
        for record in load_manifest(upd_path):
            slug = record["slug"]
            hit = supabase.table("kalams").select("id").eq("slug", slug).execute()
            if not hit.data:
                print(f"{slug}: skip (not in DB)")
                continue
            kalam_id = hit.data[0]["id"]
            upsert_translations(supabase, kalam_id, record)
            print(f"{slug}: updated translations")

    if not args.do_import and not args.update:
        parser.print_help()


if __name__ == "__main__":
    main()
