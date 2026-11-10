"""
Build data/imports/qasida-burda-imam-busiri.json from Salawat-style Arabic + roman pairs.

Source: scripts/in/qasida-burda-salawat-source.txt (from salawat.com page export)
Optional Hindi/Bangla: set GEMINI_API_KEY and pass --enrich-indic

Usage:
  python scripts/build_qasida_burda_import.py
  python scripts/build_qasida_burda_import.py --enrich-indic
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if _SCRIPT_DIR not in sys.path:
    sys.path.insert(0, _SCRIPT_DIR)

from extraction_common import repo_path

ARABIC_RE = re.compile(r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]")
CHORUS_AR = "مَولَايَ صَلِّ وَسَلِّمْ دَائِمًا أَبَدًا ❁ عَلَى حَبِيبِكَ خَيْرِ الْخَلْقِ كُلِّهِمِ ❁"


def _is_arabic_line(line: str) -> bool:
    s = line.strip()
    if not s or s.startswith("#"):
        return False
    if s.startswith("Reply") or s.startswith("http"):
        return False
    letters = [c for c in s if c.isalpha() or ARABIC_RE.match(c)]
    if not letters:
        return False
    arabic_count = sum(1 for c in letters if ARABIC_RE.match(c))
    return arabic_count >= max(3, len(letters) // 3)


def _is_roman_line(line: str) -> bool:
    s = line.strip()
    if not s or s.startswith("#") or s.startswith("###"):
        return False
    if _is_arabic_line(s):
        return False
    if s[0].isdigit() and "." in s[:4]:
        return False
    if s.startswith("Praise ") or s.startswith("O my Lord") or s.startswith("On "):
        return False
    if "Reply" in s or "says:" in s:
        return False
    # Roman transliteration lines use Latin + diacritics
    latin = sum(1 for c in s if ("a" <= c.lower() <= "z") or c in "ʿʾḍḥṣṭẓ")
    return latin >= 8


def _clean_arabic_block(line: str) -> str:
    line = line.replace("❁", " ").strip()
    line = re.sub(r"\s+", " ", line)
    return line


def _split_arabic_couplet(line: str) -> tuple[str, str]:
    """Salawat lines often pack two hemistichs on one line separated by ❁."""
    parts = [p.strip() for p in line.replace("❁", "|").split("|") if p.strip()]
    if len(parts) >= 2:
        return parts[0], parts[1]
    return line.strip(), ""


def _stop_stanza(pair: tuple[str, str]) -> bool:
    for line in pair:
        if not line:
            continue
        if len(line) > 200:
            return True
        if "أولاً" in line or "قال الشيخ" in line or "18th June" in line:
            return True
        if line.strip().startswith("Reply") or "http" in line:
            return True
    return False


def _trim_stanzas(
    arabic: list[tuple[str, str]], roman: list[tuple[str, str]]
) -> tuple[list[tuple[str, str]], list[tuple[str, str]]]:
    n = min(len(arabic), len(roman))
    arabic, roman = arabic[:n], roman[:n]
    out_a: list[tuple[str, str]] = []
    out_r: list[tuple[str, str]] = []
    for a, r in zip(arabic, roman):
        if _stop_stanza(a) or _stop_stanza(r):
            break
        out_a.append(a)
        out_r.append(r)
    return out_a, out_r


def parse_salawat_burda(text: str) -> tuple[list[tuple[str, str]], list[tuple[str, str]]]:
    """Return (arabic_stanzas, roman_stanzas) as list of (line1, line2)."""
    arabic_pairs: list[tuple[str, str]] = []
    roman_pairs: list[tuple[str, str]] = []

    lines = text.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        i += 1
        if not _is_arabic_line(line):
            continue
        if "الْفَصْلُ" in line and "❁" not in line:
            continue
        a1, a2 = _split_arabic_couplet(_clean_arabic_block(line))
        if not a1:
            continue

        r1, r2 = "", ""
        while i < len(lines):
            nxt = lines[i].strip()
            if _is_roman_line(nxt):
                r1 = nxt
                i += 1
                if i < len(lines) and _is_roman_line(lines[i].strip()):
                    r2 = lines[i].strip()
                    i += 1
                elif " " in r1 and len(r1) > 40:
                    # two hemistichs on one roman line
                    mid = len(r1) // 2
                    sp = r1.rfind(" ", 0, mid + 20)
                    if sp > 10:
                        r2 = r1[sp + 1 :].strip()
                        r1 = r1[:sp].strip()
                break
            if _is_arabic_line(nxt):
                break
            i += 1

        arabic_pairs.append((a1, a2))
        roman_pairs.append((r1, r2))

    return _trim_stanzas(arabic_pairs, roman_pairs)


def stanzas_to_lyrics(stanzas: list[tuple[str, str]]) -> str:
    blocks: list[str] = []
    for a, b in stanzas:
        if b:
            blocks.append(f"{a}\n{b}")
        else:
            blocks.append(a)
    return "\n\n".join(blocks)


def _chunk_stanzas(lyrics: str, chunk_size: int = 22) -> list[str]:
    stanzas = [s for s in lyrics.split("\n\n") if s.strip()]
    chunks: list[str] = []
    for i in range(0, len(stanzas), chunk_size):
        chunks.append("\n\n".join(stanzas[i : i + chunk_size]))
    return chunks


GEMINI_INDIC_MODELS = ("gemini-3.1-flash-lite", "gemini-3.8-flash")


def enrich_indic_with_gemini(roman_lyrics: str, target: str) -> str:
    from extraction_common import get_gemini_client

    client = get_gemini_client()
    script = "Devanagari (Hindi)" if target == "hindi" else "Bengali script"
    label = target.capitalize()
    chunks = _chunk_stanzas(roman_lyrics)
    out_parts: list[str] = []

    for idx, chunk in enumerate(chunks, start=1):
        prompt = f"""Transliterate this Qasida al-Burda roman text into {script} for readers.
Keep the same stanza breaks (blank line between stanzas) and line breaks within each stanza.
Do not translate meaning — phonetic transliteration only, suitable for recitation.
Return ONLY the lyrics text, no commentary or markdown fences.

{chunk}
"""
        max_attempts = 8
        model_idx = 0
        for attempt in range(1, max_attempts + 1):
            model = GEMINI_INDIC_MODELS[model_idx]
            try:
                response = client.models.generate_content(model=model, contents=prompt)
                text = (response.text or "").strip()
                text = re.sub(r"^```[\w]*\n?", "", text)
                text = re.sub(r"\n?```$", "", text)
                if not text:
                    raise RuntimeError("empty response")
                out_parts.append(text)
                print(f"  {label} chunk {idx}/{len(chunks)} OK ({model})")
                time.sleep(2)
                break
            except Exception as err:
                err_s = str(err)
                if attempt >= max_attempts:
                    raise
                if "404" in err_s and model_idx + 1 < len(GEMINI_INDIC_MODELS):
                    model_idx += 1
                    print(f"  {label} chunk {idx}: switch model → {GEMINI_INDIC_MODELS[model_idx]}")
                    continue
                if "503" in err_s or "UNAVAILABLE" in err_s:
                    wait = 45 + 15 * attempt
                elif "RESOURCE_EXHAUSTED" in err_s:
                    wait = 90
                else:
                    wait = 10 * attempt
                print(f"  {label} chunk {idx} retry {attempt} ({model}): wait {wait}s…")
                time.sleep(wait)

    return "\n\n".join(out_parts)


def build_record(enrich_indic: bool) -> dict:
    source_path = repo_path("scripts", "in", "qasida-burda-salawat-source.txt")
    with open(source_path, "r", encoding="utf-8") as f:
        raw = f.read()

    arabic_stanzas, roman_stanzas = parse_salawat_burda(raw)
    if len(arabic_stanzas) < 50:
        raise RuntimeError(f"Parse yielded only {len(arabic_stanzas)} stanzas — check source file.")

    lyrics_urdu = stanzas_to_lyrics(arabic_stanzas)
    lyrics_roman = stanzas_to_lyrics(roman_stanzas)

    record = {
        "title_roman_english": "Mawla Ya Salli wa Sallim (Qasida al-Burda)",
        "title_urdu": "قصیدہ بُردَہ شریف",
        "title_hindi": "मौला या सल्ली (क़सीदा अल-बुर्दा)",
        "title_bangla": "মাওলা ইয়া সাল্লী (কাসিদা আল-বুর্দা)",
        "author_name": "Imam al-Busiri",
        "slug": "qasida-al-burda-imam-busiri",
        "lyrics_urdu": lyrics_urdu,
        "lyrics_roman_english": lyrics_roman,
        "lyrics_hindi": "",
        "lyrics_bangla": "",
    }

    if enrich_indic:
        print("Enriching Hindi via Gemini…")
        record["lyrics_hindi"] = enrich_indic_with_gemini(lyrics_roman, "hindi")
        print("Enriching Bangla via Gemini…")
        record["lyrics_bangla"] = enrich_indic_with_gemini(lyrics_roman, "bangla")
    else:
        # Fallback: roman in all recitation scripts until --enrich-indic is run
        record["lyrics_hindi"] = lyrics_roman
        record["lyrics_bangla"] = lyrics_roman
        print(
            "Note: Hindi/Bangla copied from roman. Run with --enrich-indic for Devanagari/Bengali transliteration."
        )

    return record


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--enrich-indic",
        action="store_true",
        help="Use Gemini to transliterate Hindi and Bangla (needs GEMINI_API_KEY)",
    )
    args = parser.parse_args()

    record = build_record(args.enrich_indic)
    out_dir = repo_path("data", "imports")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "qasida-burda-imam-busiri.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump([record], f, ensure_ascii=False, indent=2)

    print(f"Wrote {out_path}")
    print(f"  Stanzas: ~{record['lyrics_urdu'].count(chr(10)+chr(10)) + 1}")
    print("  Import: python scripts/import_qasida_burda.py --import")


if __name__ == "__main__":
    main()
