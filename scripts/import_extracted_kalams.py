"""
Import merged kalam JSON (from extract_new_book.py) into Supabase.

Usage:
  python scripts/import_extracted_kalams.py public/new/extracted/riaz-e-naeem/riaz-e-naeem_all_kalams.json
  python scripts/import_extracted_kalams.py --all-new-books
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import sys

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if _SCRIPT_DIR not in sys.path:
    sys.path.insert(0, _SCRIPT_DIR)

from extraction_common import (
    KalamDuplicateChecker,
    canonical_author_roman,
    get_supabase_client,
    slugify,
)


def load_manifest(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError(f"Expected JSON array in {path}")
    return data


def sync_kalam(supabase, checker: KalamDuplicateChecker, record: dict) -> str:
    roman_title = (record.get("title_roman_english") or "").strip()
    urdu_title = (record.get("title_urdu") or "").strip()
    author_name = canonical_author_roman((record.get("author_name") or "Unknown").strip())
    kalam_slug = (record.get("slug") or "").strip() or slugify(roman_title or urdu_title)

    if not roman_title and not urdu_title:
        return "skipped:missing-title"

    existing = checker.find_existing(roman_title, urdu_title)
    if existing:
        return f"skipped:exists:{existing.get('slug')}"

    slug_hit = supabase.table("kalams").select("id,slug").eq("slug", kalam_slug).execute()
    if slug_hit.data:
        return f"skipped:slug:{kalam_slug}"

    author_res = supabase.table("authors").select("id").eq("name_roman", author_name).execute()
    if author_res.data:
        author_id = author_res.data[0]["id"]
    else:
        new_author = (
            supabase.table("authors")
            .insert(
                {
                    "name_roman": author_name,
                    "name_urdu": author_name,
                    "bio": "Poet of Kalam, including writings from classic collections.",
                }
            )
            .execute()
        )
        author_id = new_author.data[0]["id"]

    new_kalam = (
        supabase.table("kalams")
        .insert(
            {
                "author_id": author_id,
                "primary_title_roman": roman_title,
                "primary_title_urdu": urdu_title or roman_title,
                "slug": kalam_slug,
            }
        )
        .execute()
    )
    kalam_id = new_kalam.data[0]["id"]

    languages = {
        "urdu": (record.get("title_urdu") or urdu_title or roman_title, record.get("lyrics_urdu")),
        "roman_english": (roman_title, record.get("lyrics_roman_english")),
        "hindi": (record.get("title_hindi") or roman_title, record.get("lyrics_hindi")),
        "bangla": (record.get("title_bangla") or roman_title, record.get("lyrics_bangla")),
    }

    for lang, (title_val, lyrics_val) in languages.items():
        if not title_val or not lyrics_val:
            continue
        supabase.table("kalam_translations").insert(
            {
                "kalam_id": kalam_id,
                "language": lang,
                "title": str(title_val).strip(),
                "lyrics": str(lyrics_val).strip(),
            }
        ).execute()

    return f"inserted:{kalam_slug}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Import extracted kalam manifests to Supabase")
    parser.add_argument("manifest", nargs="?", help="Path to *_all_kalams.json")
    parser.add_argument(
        "--all-new-books",
        action="store_true",
        help="Import all public/new/extracted/*/*_all_kalams.json",
    )
    args = parser.parse_args()

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    manifests: list[str] = []
    if args.all_new_books:
        pattern = os.path.join(root, "public", "new", "extracted", "*", "*_all_kalams.json")
        manifests = sorted(glob.glob(pattern))
    elif args.manifest:
        manifests = [args.manifest if os.path.isabs(args.manifest) else os.path.join(root, args.manifest)]
    else:
        parser.error("Provide manifest path or --all-new-books")

    supabase = get_supabase_client()
    checker = KalamDuplicateChecker()

    totals = {"inserted": 0, "skipped": 0, "failed": 0}

    for manifest_path in manifests:
        if not os.path.exists(manifest_path):
            print(f"Skip missing: {manifest_path}")
            continue
        book_id = os.path.basename(os.path.dirname(manifest_path))
        records = load_manifest(manifest_path)
        print(f"\n=== {book_id} ({len(records)} kalams) ===")
        for i, record in enumerate(records, 1):
            title = (record.get("title_roman_english") or record.get("title_urdu") or "?")[:50]
            try:
                result = sync_kalam(supabase, checker, record)
            except Exception as err:
                print(f"  [{i}] FAIL {title}: {err}")
                totals["failed"] += 1
                continue
            if result.startswith("inserted:"):
                totals["inserted"] += 1
                print(f"  [{i}] OK {title}")
            else:
                totals["skipped"] += 1
                print(f"  [{i}] SKIP {title} ({result})")

    print(
        f"\nDone. inserted={totals['inserted']} skipped={totals['skipped']} failed={totals['failed']}"
    )


if __name__ == "__main__":
    main()
