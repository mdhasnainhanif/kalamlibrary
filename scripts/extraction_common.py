"""Shared helpers for PDF → Kalam extraction scripts."""

from __future__ import annotations

import json
import os
import re
import sys
import time
from typing import Any

import fitz
from PIL import Image


def configure_utf8_stdio() -> None:
    if sys.stdout.encoding != "utf-8":
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
    if sys.stderr.encoding != "utf-8":
        try:
            sys.stderr.reconfigure(encoding="utf-8")
        except Exception:
            pass


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for name in (".env", ".env.local"):
        path = os.path.join(root, name)
        if not os.path.exists(path):
            continue
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    key, val = line.split("=", 1)
                    env[key.strip()] = val.strip().strip("'").strip('"')
    return env


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text


def clean_and_parse_json(text: str) -> Any:
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except Exception:
        pass
    for start_char, end_char in (("[", "]"), ("{", "}")):
        start = text.find(start_char)
        if start == -1:
            continue
        depth = 0
        for i in range(start, len(text)):
            if text[i] == start_char:
                depth += 1
            elif text[i] == end_char:
                depth -= 1
                if depth == 0:
                    return json.loads(text[start : i + 1])
    raise ValueError(f"Could not parse JSON from model output (length {len(text)})")


def repo_path(*parts: str) -> str:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(root, *parts)


def load_books_config() -> dict[str, Any]:
    path = repo_path("scripts", "new_books_config.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def book_output_dir(book_id: str) -> str:
    cfg = load_books_config()
    base = repo_path(cfg.get("output_dir", "public/new/extracted"))
    out = os.path.join(base, book_id)
    os.makedirs(out, exist_ok=True)
    return out


def pdf_page_count(pdf_path: str) -> int:
    doc = fitz.open(pdf_path)
    n = len(doc)
    doc.close()
    return n


def render_pdf_pages(pdf_path: str, start_pdf: int, end_pdf: int, dpi: int = 150) -> list[str]:
    """Render inclusive 1-based PDF page range to temp PNG paths."""
    doc = fitz.open(pdf_path)
    paths: list[str] = []
    for page_num in range(start_pdf, end_pdf + 1):
        if page_num < 1 or page_num > len(doc):
            continue
        page = doc.load_page(page_num - 1)
        pix = page.get_pixmap(dpi=dpi)
        img_path = os.path.join(
            os.path.dirname(pdf_path),
            f"_temp_extract_p{page_num}.png",
        )
        pix.save(img_path)
        paths.append(img_path)
    doc.close()
    return paths


def cleanup_temp_images(paths: list[str]) -> None:
    for path in paths:
        if os.path.exists(path):
            try:
                os.remove(path)
            except OSError:
                pass


def get_gemini_client():
    env = load_env()
    api_key = env.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY not set. Add it to .env.local or your environment "
            "(Google AI Studio: https://aistudio.google.com/)."
        )
    try:
        from google import genai
    except ImportError as exc:
        raise RuntimeError("Install google-genai: pip install google-genai") from exc
    return genai.Client(api_key=api_key)


def gemini_json(client, pil_images: list[Image.Image], prompt: str, model: str = "gemini-3.1-flash-lite") -> Any:
    max_attempts = 5
    for attempt in range(1, max_attempts + 1):
        try:
            response = client.models.generate_content(
                model=model,
                contents=pil_images + [prompt],
                config={"response_mime_type": "application/json"},
            )
            return clean_and_parse_json(response.text.strip())
        except Exception as err:
            if attempt >= max_attempts:
                raise
            if "RESOURCE_EXHAUSTED" in str(err):
                time.sleep(60)
            else:
                time.sleep(10 * attempt)


def printed_to_pdf_page(printed: int, calibration: dict[str, int] | None) -> int | None:
    if not calibration:
        return None
    sample_printed = int(calibration["printed_page"])
    sample_pdf = int(calibration["pdf_page"])
    return printed - sample_printed + sample_pdf


AUTHOR_ROMAN_ALIASES: dict[str, str] = {
    "muhammad ilyas attar qadri razavi": "Muhammad Ilyas Attar Qadri",
    "hazrat allama maulana muhammad ilyas attar qadri razavi": "Muhammad Ilyas Attar Qadri",
    "maulana muhammad ilyas attar qadri razavi": "Muhammad Ilyas Attar Qadri",
    "ilyas attar qadri razavi": "Muhammad Ilyas Attar Qadri",
    "ilyas attar qadri": "Muhammad Ilyas Attar Qadri",
}


def canonical_author_roman(name: str) -> str:
    key = normalize_title(name)
    return AUTHOR_ROMAN_ALIASES.get(key, name.strip())


def get_supabase_client():
    env = load_env()
    url = env.get("NEXT_PUBLIC_SUPABASE_URL")
    key = (
        env.get("SUPABASE_SERVICE_ROLE_KEY")
        or env.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
        or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    )
    if not url or not key:
        raise RuntimeError(
            "Supabase credentials missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
        )
    from supabase import create_client

    return create_client(url, key)


def clean_kalam_slug(raw_slug: str) -> str:
    slug = raw_slug.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[-\s]+", "-", slug)
    return slug.strip("-")


def normalize_title(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


_STOP_WORDS = frozenset(
    {
        "ya",
        "ye",
        "yeh",
        "hai",
        "hain",
        "ho",
        "ka",
        "ke",
        "ki",
        "ko",
        "se",
        "mein",
        "main",
        "tu",
        "the",
        "a",
        "o",
        "or",
        "aur",
        "haan",
        "de",
        "dede",
        "de-de",
    }
)


def title_word_overlap(a: str, b: str, min_token_len: int = 3) -> int:
    wa = {
        w
        for w in normalize_title(a).split()
        if len(w) >= min_token_len and w not in _STOP_WORDS
    }
    wb = {
        w
        for w in normalize_title(b).split()
        if len(w) >= min_token_len and w not in _STOP_WORDS
    }
    return len(wa & wb)


class KalamDuplicateChecker:
    """Detect kalams already stored in Supabase to avoid re-extraction."""

    def __init__(self) -> None:
        self._client = get_supabase_client()
        self._slug_index: dict[str, dict[str, Any]] = {}
        self._load_slug_index()

    def _load_slug_index(self) -> None:
        offset = 0
        page_size = 1000
        while True:
            res = (
                self._client.table("kalams")
                .select("slug,primary_title_roman,primary_title_urdu")
                .range(offset, offset + page_size - 1)
                .execute()
            )
            rows = res.data or []
            for row in rows:
                slug = row.get("slug") or ""
                self._slug_index[slug] = row
                cleaned = clean_kalam_slug(slug)
                if cleaned:
                    self._slug_index[cleaned] = row
            if len(rows) < page_size:
                break
            offset += page_size

    def _pick_match(
        self,
        rows: list[dict[str, Any]] | None,
        title_roman: str,
        title_urdu: str,
        min_overlap: int = 2,
    ) -> dict[str, Any] | None:
        if not rows:
            return None
        best: dict[str, Any] | None = None
        best_score = 0
        for row in rows:
            k = row
            if "kalams" in row and row.get("kalams"):
                k = row["kalams"]
                if isinstance(k, list):
                    k = k[0]
            score = title_word_overlap(title_roman, k.get("primary_title_roman", ""))
            if title_urdu and k.get("primary_title_urdu"):
                urdu_snip = title_urdu[:25]
                if urdu_snip and urdu_snip in (k.get("primary_title_urdu") or ""):
                    score = max(score, 3)
            if score > best_score:
                best_score = score
                best = k
        if best_score >= min_overlap:
            return best
        return None

    def find_existing(self, title_roman: str, title_urdu: str = "") -> dict[str, Any] | None:
        title_roman = (title_roman or "").strip()
        title_urdu = (title_urdu or "").strip()

        for slug in (slugify(title_roman), clean_kalam_slug(title_roman)):
            if slug and slug in self._slug_index:
                return self._slug_index[slug]

        if len(title_roman) >= 8:
            short = title_roman[:55].replace("%", "")
            hit = self._pick_match(
                self._client.table("kalams")
                .select("slug,primary_title_roman,primary_title_urdu")
                .ilike("primary_title_roman", f"%{short}%")
                .limit(5)
                .execute()
                .data,
                title_roman,
                title_urdu,
            )
            if hit:
                return hit

            words = normalize_title(title_roman).split()
            if len(words) >= 4:
                tail = " ".join(words[-4:])
                hit = self._pick_match(
                    self._client.table("kalams")
                    .select("slug,primary_title_roman,primary_title_urdu")
                    .ilike("primary_title_roman", f"%{tail}%")
                    .limit(5)
                    .execute()
                    .data,
                    title_roman,
                    title_urdu,
                )
                if hit:
                    return hit

                hit = self._pick_match(
                    self._client.table("kalam_translations")
                    .select("kalam_id, title, kalams(slug,primary_title_roman,primary_title_urdu)")
                    .eq("language", "roman_english")
                    .ilike("lyrics", f"%{tail}%")
                    .limit(5)
                    .execute()
                    .data,
                    title_roman,
                    title_urdu,
                )
                if hit:
                    return hit

            if len(words) >= 3:
                core = " ".join(words[:5])
                hit = self._pick_match(
                    self._client.table("kalam_translations")
                    .select("kalam_id, title, kalams(slug,primary_title_roman,primary_title_urdu)")
                    .eq("language", "roman_english")
                    .ilike("lyrics", f"%{core}%")
                    .limit(5)
                    .execute()
                    .data,
                    title_roman,
                    title_urdu,
                )
                if hit:
                    return hit

        norm = normalize_title(title_roman)
        if "maula" in norm or "mola" in norm:
            if "khairat" in norm or "khairaat" in norm:
                hit = self._pick_match(
                    self._client.table("kalams")
                    .select("slug,primary_title_roman,primary_title_urdu")
                    .ilike("slug", "%mere-mola%khairat%")
                    .limit(5)
                    .execute()
                    .data,
                    title_roman,
                    title_urdu,
                    min_overlap=2,
                )
                if hit:
                    return hit

        if len(title_urdu) >= 10:
            snippet = title_urdu[:40].replace("%", "")
            hit = self._pick_match(
                self._client.table("kalams")
                .select("slug,primary_title_roman,primary_title_urdu")
                .ilike("primary_title_urdu", f"%{snippet}%")
                .limit(5)
                .execute()
                .data,
                title_roman,
                title_urdu,
                min_overlap=2,
            )
            if hit:
                return hit

            hit = self._pick_match(
                self._client.table("kalam_translations")
                .select("kalam_id, title, kalams(slug,primary_title_roman,primary_title_urdu)")
                .eq("language", "urdu")
                .ilike("lyrics", f"%{snippet}%")
                .limit(5)
                .execute()
                .data,
                title_roman,
                title_urdu,
                min_overlap=2,
            )
            if hit:
                return hit

        return None


def merge_kalam_blocks(blocks: list[dict[str, Any]], author: str) -> dict[str, Any]:
    """Merge chunk blocks (continuation + new) into one kalam record."""
    if not blocks:
        raise ValueError("No blocks to merge")

    title_fields = ("title_urdu", "title_roman_english", "title_hindi", "title_bangla")
    lyric_fields = ("lyrics_urdu", "lyrics_roman_english", "lyrics_hindi", "lyrics_bangla")

    merged: dict[str, Any] = {"author_name": author}
    for tf in title_fields:
        for b in blocks:
            if b.get("belongs_to_new_kalam") and (b.get(tf) or "").strip():
                merged[tf] = b[tf].strip()
                break
        merged.setdefault(tf, "")

    for lf in lyric_fields:
        parts: list[str] = []
        for b in blocks:
            text = (b.get(lf) or "").strip()
            if text:
                parts.append(text)
        merged[lf] = "\n\n".join(parts)

    return merged
