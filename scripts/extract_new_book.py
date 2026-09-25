"""
Index-driven extraction for PDFs in public/new/.

Workflow (one book at a time):
  1. extract-index   — read فہرست from configured PDF page(s)
  2. set page_calibration in scripts/new_books_config.json (printed page ↔ PDF page)
  3. build-ranges    — turn index into PDF page ranges per kalam
  4. extract-kalam   — transcribe one kalam (4 languages + SEO), save JSON
  5. sync (optional) — python scripts/sync_db.py public/new/extracted/<book>/<book>_all_kalams.json

Examples:
  python scripts/extract_new_book.py list
  python scripts/extract_new_book.py extract-index --book aarzoo-e-deedar-e-madina
  python scripts/extract_new_book.py build-ranges --book aarzoo-e-deedar-e-madina
  python scripts/extract_new_book.py extract-kalam --book aarzoo-e-deedar-e-madina --ordinal 1
  python scripts/extract_new_book.py extract-all --book aarzoo-e-deedar-e-madina --local-only
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from typing import Any

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if _SCRIPT_DIR not in sys.path:
    sys.path.insert(0, _SCRIPT_DIR)

from PIL import Image

from extraction_common import (
    KalamDuplicateChecker,
    book_output_dir,
    cleanup_temp_images,
    configure_utf8_stdio,
    gemini_json,
    get_gemini_client,
    load_books_config,
    merge_kalam_blocks,
    pdf_page_count,
    printed_to_pdf_page,
    render_pdf_pages,
    repo_path,
    slugify,
)


SCAN_KALAM_START_PROMPT = """
You analyze ONE page from an Urdu poetry book PDF.
Return JSON:
{
  "printed_page_number": <integer in page header/footer if visible, else null>,
  "starts_new_kalam": <true if this page begins a new kalam with a bold/prominent title heading for the poem>,
  "is_poetry_page": <true if the main content is poetry couplets, not prose/front-matter>,
  "title_urdu": "<kalam title in Urdu if starts_new_kalam, else empty>",
  "title_roman_english": "<Roman transliteration of title if starts_new_kalam, else empty>"
}
Ignore the repeating book-name header and decorative watermarks. Prose niyyat/preface pages: is_poetry_page false, starts_new_kalam false.
Only raw JSON.
"""

INDEX_PROMPT = """
You are reading the فہرست (index/table of contents) of an Urdu Naat/Kalam book.
The attached image(s) may be a dedicated index page OR the back/front cover listing kalam titles with page numbers.

Extract every kalam entry in order. For each row/entry capture:
- title_urdu: full title as printed (Urdu script)
- title_roman_english: readable Roman Urdu/English transliteration of the title
- start_printed_page: the page number printed in the index for that kalam (integer only)

Ignore publisher lines, decorative text, and section headers that are not kalam titles.

Return JSON:
{
  "entries": [
    {
      "ordinal": 1,
      "title_urdu": "...",
      "title_roman_english": "...",
      "start_printed_page": 1
    }
  ]
}
Only raw JSON.
"""


def kalam_extraction_prompt(
    book_title_roman: str,
    kalam_title_roman: str,
    kalam_title_urdu: str,
    author: str,
    pdf_start: int,
    pdf_end: int,
) -> str:
    return f"""
You are transcribing ONE complete kalam from a printed Urdu poetry book.

Book collection: {book_title_roman}
Kalam title (Urdu): {kalam_title_urdu}
Kalam title (Roman): {kalam_title_roman}
Author: {author}
Attached images are PDF pages {pdf_start}–{pdf_end} (inclusive) for this single kalam.

INCLUDE: every she'r/couplet of the kalam body in reading order.
EXCLUDE:
- Running headers (book name + page number)
- Footnotes (ا، ب، پ or superscript numbers) and their glosses at page bottom
- Diagonal watermark text such as "مدینہ"
- Publisher or contact blocks

If the kalam continues across pages, transcribe the full poem across all images as one unit.

Return JSON with a single object "kalam":
{{
  "kalam": {{
    "title_urdu": "...",
    "title_roman_english": "...",
    "title_hindi": "...",
    "title_bangla": "...",
    "lyrics_urdu": "stanza lines with double newlines between stanzas",
    "lyrics_roman_english": "...",
    "lyrics_hindi": "...",
    "lyrics_bangla": "...",
    "author_name": "{author}",
    "meta_title": "unique SEO title (~60 chars, include opening theme or first line)",
    "meta_description": "unique SEO description (~155 chars, mention author and theme)"
  }}
}}
Only raw JSON.
"""


CHUNK_CONTINUATION_PROMPT = """
You are continuing transcription of the SAME kalam from additional pages.
Do not repeat couplets already transcribed. Only new lines from these pages.
EXCLUDE headers, footnotes, watermarks, publisher text (same rules as before).

Return JSON:
{
  "blocks": [
    {
      "belongs_to_new_kalam": false,
      "title_urdu": "",
      "title_roman_english": "",
      "title_hindi": "",
      "title_bangla": "",
      "lyrics_urdu": "...",
      "lyrics_roman_english": "...",
      "lyrics_hindi": "...",
      "lyrics_bangla": "...",
      "author_name": "AUTHOR_PLACEHOLDER"
    }
  ]
}
Only raw JSON.
"""


def resolve_book(book_id: str) -> tuple[dict[str, Any], str]:
    cfg = load_books_config()
    books = cfg.get("books", {})
    if book_id not in books:
        raise SystemExit(f"Unknown book '{book_id}'. Known: {', '.join(sorted(books))}")
    book = books[book_id]
    pdf_path = repo_path(book["pdf"])
    if not os.path.exists(pdf_path):
        raise SystemExit(f"PDF not found: {pdf_path}")
    return book, pdf_path


def cmd_list(_: argparse.Namespace) -> None:
    cfg = load_books_config()
    for bid, book in cfg.get("books", {}).items():
        pdf_path = repo_path(book["pdf"])
        pages = pdf_page_count(pdf_path) if os.path.exists(pdf_path) else "?"
        print(f"{bid}: {pages} PDF pages — {book.get('author_roman', '')}")


def cmd_scan_kalam_starts(args: argparse.Namespace) -> None:
    book, pdf_path = resolve_book(args.book)
    book_output_dir(args.book)
    client = get_gemini_client()
    total = pdf_page_count(pdf_path)
    skip_end = int(book.get("skip_pdf_pages_from_end") or 0)
    start_pdf = args.start or int(book.get("content_pdf_start") or 2)
    end_pdf = args.end or (total - skip_end)
    entries: list[dict[str, Any]] = []
    print(f"Scanning PDF pages {start_pdf}–{end_pdf} for kalam start markers...")
    for page_num in range(start_pdf, end_pdf + 1):
        images = render_pdf_pages(pdf_path, page_num, page_num)
        try:
            pil = [Image.open(p) for p in images]
            data = gemini_json(client, pil, SCAN_KALAM_START_PROMPT)
        finally:
            cleanup_temp_images(images)
        if not data.get("is_poetry_page") or not data.get("starts_new_kalam"):
            continue
        printed = data.get("printed_page_number") or page_num
        entries.append(
            {
                "ordinal": len(entries) + 1,
                "title_urdu": data.get("title_urdu", ""),
                "title_roman_english": data.get("title_roman_english", ""),
                "start_printed_page": int(printed),
                "start_pdf_page": page_num,
            }
        )
        print(f"  p.{page_num}: {data.get('title_roman_english') or data.get('title_urdu')}")
        time.sleep(2)

    out_dir = book_output_dir(args.book)
    out_path = os.path.join(out_dir, f"{args.book}_index.json")
    payload = {
        "book_id": args.book,
        "collection_title_roman": book.get("collection_title_roman"),
        "source": "scan-kalam-starts",
        "entries": entries,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(entries)} scanned kalam starts to {out_path}")


def cmd_extract_index(args: argparse.Namespace) -> None:
    book, pdf_path = resolve_book(args.book)
    client = get_gemini_client()
    index_pages = book.get("index_pdf_pages") or [2]
    if not index_pages:
        raise SystemExit(
            "index_pdf_pages is empty for this book. Run scan-kalam-starts instead."
        )
    if len(index_pages) == 1:
        start = end = index_pages[0]
    else:
        start, end = min(index_pages), max(index_pages)

    images = render_pdf_pages(pdf_path, start, end)
    try:
        pil = [Image.open(p) for p in images]
        data = gemini_json(client, pil, INDEX_PROMPT)
    finally:
        cleanup_temp_images(images)

    if isinstance(data, list):
        entries = data
    else:
        entries = data.get("entries", [])
    out_dir = book_output_dir(args.book)
    out_path = os.path.join(out_dir, f"{args.book}_index.json")
    payload = {
        "book_id": args.book,
        "collection_title_roman": book.get("collection_title_roman"),
        "index_pdf_pages": index_pages,
        "entries": entries,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(entries)} index entries to {out_path}")
    if not book.get("page_calibration"):
        print(
            "Next: open the PDF, find any kalam page header number and its PDF page index, "
            "then set page_calibration in scripts/new_books_config.json, e.g.\n"
            '  "page_calibration": { "printed_page": 1, "pdf_page": 5 }'
        )


def load_index(book_id: str) -> dict[str, Any]:
    out_dir = book_output_dir(book_id)
    path = os.path.join(out_dir, f"{book_id}_index.json")
    if not os.path.exists(path):
        raise SystemExit(f"Missing index file. Run extract-index first: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def cmd_build_ranges(args: argparse.Namespace) -> None:
    book, pdf_path = resolve_book(args.book)
    calibration = book.get("page_calibration")

    index_data = load_index(args.book)
    entries = index_data.get("entries", [])
    if not entries:
        raise SystemExit("Index has no entries.")

    if not calibration and not all(e.get("start_pdf_page") for e in entries):
        raise SystemExit(
            "page_calibration is not set and index entries lack start_pdf_page."
        )

    min_printed = book.get("index_min_printed_page")
    if min_printed is not None:
        entries = [e for e in entries if int(e.get("start_printed_page", 0)) >= int(min_printed)]

    total_pdf = pdf_page_count(pdf_path)
    skip_end = int(book.get("skip_pdf_pages_from_end") or 0)
    last_content_pdf = total_pdf - skip_end

    ranges: list[dict[str, Any]] = []
    sorted_entries = sorted(
        entries,
        key=lambda e: int(e.get("start_pdf_page") or e.get("start_printed_page", 0)),
    )
    for i, entry in enumerate(sorted_entries):
        printed_start = int(entry.get("start_printed_page") or 0)
        if entry.get("start_pdf_page"):
            pdf_start = int(entry["start_pdf_page"])
        else:
            pdf_start = printed_to_pdf_page(printed_start, calibration)
            if pdf_start is None:
                raise SystemExit("page_calibration invalid.")
        if i + 1 < len(sorted_entries):
            nxt = sorted_entries[i + 1]
            if nxt.get("start_pdf_page"):
                pdf_end = int(nxt["start_pdf_page"]) - 1
            else:
                next_printed = int(nxt["start_printed_page"])
                pdf_end = printed_to_pdf_page(next_printed, calibration) - 1
        else:
            pdf_end = last_content_pdf
        pdf_end = max(pdf_start, min(pdf_end, last_content_pdf))
        ranges.append(
            {
                "ordinal": i + 1,
                "title_urdu": entry.get("title_urdu", ""),
                "title_roman_english": entry.get("title_roman_english", ""),
                "start_printed_page": printed_start,
                "pdf_start": pdf_start,
                "pdf_end": pdf_end,
            }
        )

    out_dir = book_output_dir(args.book)
    out_path = os.path.join(out_dir, f"{args.book}_ranges.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"book_id": args.book, "ranges": ranges}, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(ranges)} kalam ranges to {out_path}")


def load_ranges(book_id: str) -> list[dict[str, Any]]:
    out_dir = book_output_dir(book_id)
    path = os.path.join(out_dir, f"{book_id}_ranges.json")
    if not os.path.exists(path):
        raise SystemExit(f"Missing ranges file. Run build-ranges first: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)["ranges"]


def extract_kalam_record(
    book: dict[str, Any],
    pdf_path: str,
    range_entry: dict[str, Any],
    chunk_size: int,
) -> dict[str, Any]:
    client = get_gemini_client()
    author = book.get("author_roman", "")
    pdf_start = int(range_entry["pdf_start"])
    pdf_end = int(range_entry["pdf_end"])
    title_u = range_entry.get("title_urdu") or ""
    title_r = range_entry.get("title_roman_english") or ""

    all_blocks: list[dict[str, Any]] = []
    meta_title = ""
    meta_description = ""

    cursor = pdf_start
    first_chunk = True
    while cursor <= pdf_end:
        chunk_end = min(cursor + chunk_size - 1, pdf_end)
        images = render_pdf_pages(pdf_path, cursor, chunk_end)
        try:
            pil = [Image.open(p) for p in images]
            if first_chunk:
                prompt = kalam_extraction_prompt(
                    book.get("collection_title_roman", ""),
                    title_r,
                    title_u,
                    author,
                    cursor,
                    chunk_end,
                )
                data = gemini_json(client, pil, prompt)
                kalam = data.get("kalam", data)
                if kalam.get("meta_title"):
                    meta_title = kalam["meta_title"]
                if kalam.get("meta_description"):
                    meta_description = kalam["meta_description"]
                all_blocks.append(
                    {
                        "belongs_to_new_kalam": True,
                        **{k: kalam.get(k, "") for k in (
                            "title_urdu",
                            "title_roman_english",
                            "title_hindi",
                            "title_bangla",
                            "lyrics_urdu",
                            "lyrics_roman_english",
                            "lyrics_hindi",
                            "lyrics_bangla",
                            "author_name",
                        )},
                    }
                )
                first_chunk = False
            else:
                prompt = CHUNK_CONTINUATION_PROMPT.replace("AUTHOR_PLACEHOLDER", author)
                data = gemini_json(client, pil, prompt)
                blocks = data.get("blocks", [])
                all_blocks.extend(blocks)
        finally:
            cleanup_temp_images(images)
        cursor = chunk_end + 1

    merged = merge_kalam_blocks(all_blocks, author)
    merged["meta_title"] = meta_title
    merged["meta_description"] = meta_description
    merged["source"] = {
        "book_id": book.get("collection_title_roman"),
        "pdf_start": pdf_start,
        "pdf_end": pdf_end,
        "ordinal": range_entry.get("ordinal"),
    }
    merged["slug"] = slugify(merged.get("title_roman_english") or title_r or title_u)
    return merged


def should_skip_kalam(
    entry: dict[str, Any],
    checker: KalamDuplicateChecker | None,
    skip_db: bool,
    skip_local: bool,
    book_id: str,
    force: bool,
) -> tuple[bool, str]:
    if force:
        return False, ""
    ordinal = int(entry.get("ordinal", 0))
    out_dir = book_output_dir(book_id)
    local_path = os.path.join(out_dir, f"kalam_{ordinal:03d}.json")
    if skip_db and checker:
        hit = checker.find_existing(
            entry.get("title_roman_english", ""),
            entry.get("title_urdu", ""),
        )
        if hit:
            return True, f"already in Supabase as '{hit.get('primary_title_roman')}' ({hit.get('slug')})"
    if skip_local and os.path.exists(local_path):
        return True, f"local file exists ({local_path})"
    return False, ""


def write_skipped_marker(book_id: str, ordinal: int, reason: str) -> None:
    out_dir = book_output_dir(book_id)
    path = os.path.join(out_dir, f"kalam_{ordinal:03d}.skipped.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"ordinal": ordinal, "skipped": True, "reason": reason}, f, indent=2)


def save_kalam_json(book_id: str, ordinal: int, record: dict[str, Any]) -> str:
    out_dir = book_output_dir(book_id)
    path = os.path.join(out_dir, f"kalam_{ordinal:03d}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(record, f, indent=2, ensure_ascii=False)
    return path


def refresh_all_kalams_manifest(book_id: str) -> None:
    out_dir = book_output_dir(book_id)
    files = sorted(
        f for f in os.listdir(out_dir) if f.startswith("kalam_") and f.endswith(".json")
    )
    all_kalams: list[dict[str, Any]] = []
    for name in files:
        with open(os.path.join(out_dir, name), "r", encoding="utf-8") as f:
            all_kalams.append(json.load(f))
    manifest = os.path.join(out_dir, f"{book_id}_all_kalams.json")
    with open(manifest, "w", encoding="utf-8") as f:
        json.dump(all_kalams, f, indent=2, ensure_ascii=False)


def cmd_extract_kalam(args: argparse.Namespace) -> None:
    book, pdf_path = resolve_book(args.book)
    ranges = load_ranges(args.book)
    match = [r for r in ranges if int(r.get("ordinal", 0)) == args.ordinal]
    if not match:
        raise SystemExit(f"No range with ordinal {args.ordinal}.")
    entry = match[0]
    checker = KalamDuplicateChecker() if not getattr(args, "no_skip_db", False) else None
    skip, reason = should_skip_kalam(
        entry,
        checker,
        skip_db=not getattr(args, "no_skip_db", False),
        skip_local=getattr(args, "skip_existing", False),
        book_id=args.book,
        force=getattr(args, "force", False),
    )
    if skip:
        print(f"Skipping #{args.ordinal}: {reason}")
        write_skipped_marker(args.book, args.ordinal, reason)
        return
    print(
        f"Extracting kalam #{args.ordinal}: {entry.get('title_roman_english')} "
        f"(PDF {entry['pdf_start']}–{entry['pdf_end']})"
    )
    record = extract_kalam_record(book, pdf_path, entry, args.chunk)
    path = save_kalam_json(args.book, args.ordinal, record)
    refresh_all_kalams_manifest(args.book)
    print(f"Saved {path}")


def cmd_check_ranges(args: argparse.Namespace) -> None:
    ranges = load_ranges(args.book)
    checker = KalamDuplicateChecker()
    print(f"\n{'#':<4} {'Status':<10} {'PDF pages':<12} Title")
    print("-" * 80)
    for entry in ranges:
        ordinal = int(entry.get("ordinal", 0))
        skip, reason = should_skip_kalam(
            entry, checker, skip_db=True, skip_local=True, book_id=args.book, force=False
        )
        status = "SKIP" if skip else "EXTRACT"
        pages = f"{entry['pdf_start']}-{entry['pdf_end']}"
        title = (entry.get("title_roman_english") or "")[:45]
        print(f"{ordinal:<4} {status:<10} {pages:<12} {title}")
        if skip:
            print(f"     -> {reason}")


def cmd_extract_all(args: argparse.Namespace) -> None:
    book, pdf_path = resolve_book(args.book)
    ranges = load_ranges(args.book)
    checker = KalamDuplicateChecker() if not args.no_skip_db else None
    for entry in ranges:
        ordinal = int(entry.get("ordinal", 0))
        skip, reason = should_skip_kalam(
            entry,
            checker,
            skip_db=not args.no_skip_db,
            skip_local=args.skip_existing,
            book_id=args.book,
            force=args.force,
        )
        if skip:
            print(f"Skipping #{ordinal}: {reason}")
            write_skipped_marker(args.book, ordinal, reason)
            continue
        print(
            f"\n=== Kalam #{ordinal}: {entry.get('title_roman_english')} "
            f"(PDF {entry['pdf_start']}–{entry['pdf_end']}) ==="
        )
        record = extract_kalam_record(book, pdf_path, entry, args.chunk)
        save_kalam_json(args.book, ordinal, record)
    refresh_all_kalams_manifest(args.book)
    print(f"\nDone. Manifest: {book_output_dir(args.book)}/{args.book}_all_kalams.json")


def main() -> None:
    configure_utf8_stdio()
    parser = argparse.ArgumentParser(description="Index-driven kalam extraction for public/new PDFs")
    sub = parser.add_subparsers(dest="command", required=True)

    p_list = sub.add_parser("list", help="List configured books and page counts")
    p_list.set_defaults(func=cmd_list)

    p_scan = sub.add_parser(
        "scan-kalam-starts",
        help="Build index by detecting new kalam titles on each PDF page (no فہرست)",
    )
    p_scan.add_argument("--book", required=True)
    p_scan.add_argument("--start", type=int, help="First PDF page to scan (1-based)")
    p_scan.add_argument("--end", type=int, help="Last PDF page to scan (1-based)")
    p_scan.set_defaults(func=cmd_scan_kalam_starts)

    p_idx = sub.add_parser("extract-index", help="Extract فہرست from index PDF pages")
    p_idx.add_argument("--book", required=True)
    p_idx.set_defaults(func=cmd_extract_index)

    p_rng = sub.add_parser("build-ranges", help="Build PDF page ranges from index + calibration")
    p_rng.add_argument("--book", required=True)
    p_rng.set_defaults(func=cmd_build_ranges)

    p_one = sub.add_parser("extract-kalam", help="Extract a single kalam by ordinal")
    p_one.add_argument("--book", required=True)
    p_one.add_argument("--ordinal", type=int, required=True)
    p_one.add_argument("--chunk", type=int, default=4, help="Max PDF pages per API call")
    p_one.add_argument("--skip-existing", action="store_true", help="Skip if local kalam_XXX.json exists")
    p_one.add_argument("--no-skip-db", action="store_true", help="Do not check Supabase for duplicates")
    p_one.add_argument("--force", action="store_true", help="Extract even if duplicate exists")
    p_one.set_defaults(func=cmd_extract_kalam)

    p_chk = sub.add_parser("check-ranges", help="Show which kalams need extraction vs already in DB")
    p_chk.add_argument("--book", required=True)
    p_chk.set_defaults(func=cmd_check_ranges)

    p_all = sub.add_parser("extract-all", help="Extract every kalam in ranges file")
    p_all.add_argument("--book", required=True)
    p_all.add_argument("--chunk", type=int, default=4)
    p_all.add_argument("--skip-existing", action="store_true", help="Skip if local JSON already saved")
    p_all.add_argument("--no-skip-db", action="store_true", help="Do not check Supabase for duplicates")
    p_all.add_argument("--force", action="store_true", help="Extract even if duplicate exists")
    p_all.set_defaults(func=cmd_extract_all)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
