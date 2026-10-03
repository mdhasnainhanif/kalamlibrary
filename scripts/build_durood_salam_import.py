"""
Build public/imports/durood-o-salam-kalams.json and enrich 4 languages via Gemini.

Usage:
  python scripts/build_durood_salam_import.py
  python scripts/build_durood_salam_import.py --enrich
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import re
import sys
import time

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if _SCRIPT_DIR not in sys.path:
    sys.path.insert(0, _SCRIPT_DIR)

from extraction_common import repo_path

GEMINI_MODELS = ("gemini-3.1-flash-lite", "gemini-3.8-flash")


def _load_data_module():
    path = os.path.join(_SCRIPT_DIR, "in", "durood_salam_data.py")
    spec = importlib.util.spec_from_file_location("durood_salam_data", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _chunk_stanzas(lyrics: str, chunk_size: int = 18) -> list[str]:
    stanzas = [s for s in lyrics.split("\n\n") if s.strip()]
    return ["\n\n".join(stanzas[i : i + chunk_size]) for i in range(0, len(stanzas), chunk_size)]


def _gemini_text(prompt: str) -> str:
    from extraction_common import get_gemini_client

    client = get_gemini_client()
    for attempt in range(1, 9):
        model = GEMINI_MODELS[0 if attempt < 6 else 1]
        try:
            response = client.models.generate_content(model=model, contents=prompt)
            text = (response.text or "").strip()
            text = re.sub(r"^```[\w]*\n?", "", text)
            text = re.sub(r"\n?```$", "", text)
            if text:
                return text
        except Exception as err:
            wait = 45 if "503" in str(err) else 10 * attempt
            print(f"    Gemini retry {attempt} ({model}): {wait}s")
            time.sleep(wait)
    raise RuntimeError("Gemini failed after retries")


def enrich_field(source: str, target: str, field: str) -> str:
    if field == "roman_english":
        script = "Roman English (readable transliteration for recitation)"
    elif field == "urdu":
        script = "Urdu Nastaliq script"
    elif field == "hindi":
        script = "Devanagari (Hindi)"
    elif field == "arabic":
        script = "Arabic script (with full tashkeel where natural)"
    else:
        script = "Bengali script"

    parts: list[str] = []
    chunks = _chunk_stanzas(source)
    for i, chunk in enumerate(chunks, 1):
        prompt = f"""Convert this naat/durood lyrics into {script}.
Keep stanza breaks (blank line between stanzas) and line breaks within stanzas.
Phonetic transliteration only where appropriate — do not add commentary.
Return ONLY the lyrics.

{chunk}
"""
        parts.append(_gemini_text(prompt))
        print(f"    {target} {field} chunk {i}/{len(chunks)}")
        time.sleep(1.5)
    return "\n\n".join(parts)


def complete_record(record: dict, enrich: bool) -> dict:
    slug = record["slug"]
    primary = (record.get("lyrics_urdu") or "").strip() or (record.get("lyrics_roman_english") or "").strip()
    if not primary:
        raise ValueError(f"{slug}: no primary lyrics")

    out = dict(record)
    if not enrich:
        for lang in ("lyrics_roman_english", "lyrics_hindi", "lyrics_bangla"):
            if not out.get(lang):
                out[lang] = out.get("lyrics_roman_english") or primary
        if not out.get("lyrics_urdu"):
            out["lyrics_urdu"] = primary
        return out

    print(f"  Enrich {slug}…")
    if not out.get("lyrics_roman_english"):
        out["lyrics_roman_english"] = enrich_field(primary, slug, "roman_english")
    urdu = (out.get("lyrics_urdu") or "").strip()
    if not urdu or re.search(r"[a-zA-Z]", urdu):
        if slug == "tala-al-badru-alayna":
            out["lyrics_urdu"] = enrich_field(out["lyrics_roman_english"], slug, "arabic")
        elif not urdu:
            out["lyrics_urdu"] = enrich_field(out["lyrics_roman_english"], slug, "urdu")
    if not out.get("lyrics_hindi"):
        out["lyrics_hindi"] = enrich_field(out["lyrics_roman_english"], slug, "hindi")
    if not out.get("lyrics_bangla"):
        out["lyrics_bangla"] = enrich_field(out["lyrics_roman_english"], slug, "bangla")
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--enrich", action="store_true", help="Fill missing languages via Gemini")
    args = parser.parse_args()

    mod = _load_data_module()
    records = [complete_record(dict(r), args.enrich) for r in mod.KALAMS]

    out_path = repo_path("public", "imports", "durood-o-salam-kalams.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    updates = getattr(mod, "UPDATE_KALAMS", [])
    upd_path = repo_path("public", "imports", "durood-o-salam-updates.json")
    with open(upd_path, "w", encoding="utf-8") as f:
        json.dump([complete_record(dict(r), args.enrich) for r in updates], f, ensure_ascii=False, indent=2)

    print(f"Wrote {out_path} ({len(records)} new)")
    print(f"Wrote {upd_path} ({len(updates)} updates)")


if __name__ == "__main__":
    main()
