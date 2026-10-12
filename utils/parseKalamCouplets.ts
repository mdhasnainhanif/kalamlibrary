/**
 * Split kalam lyrics into couplets (she'r): normally 2 lines (misra) per band.
 * Handles OCR/DB quirks where blank lines fall between lines of the same couplet.
 */

function normalizeNewlines(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function splitRawBlocks(lyrics: string): string[][] {
  return lyrics
    .split(/\n\n+/)
    .map((block) => block.split("\n").map((l) => l.trim()).filter(Boolean))
    .filter((lines) => lines.length > 0);
}

/** Pair lines inside a block; merge lone first lines with the next block when needed. */
function pairCoupletBlocks(blocks: string[][]): string[][] {
  const out: string[][] = [];
  let i = 0;

  while (i < blocks.length) {
    const lines = blocks[i];

    if (lines.length >= 2) {
      for (let j = 0; j < lines.length; j += 2) {
        out.push(lines.slice(j, j + 2));
      }
      i += 1;
      continue;
    }

    if (lines.length === 1) {
      const next = blocks[i + 1];
      if (next?.length) {
        out.push([lines[0], next[0]]);
        const remainder = next.slice(1);
        if (remainder.length) {
          blocks[i + 1] = remainder;
        } else {
          i += 1;
        }
        i += 1;
        continue;
      }
      out.push(lines);
      i += 1;
      continue;
    }

    i += 1;
  }

  return out;
}

export function parseKalamCouplets(lyrics: string): string[][] {
  const normalized = normalizeNewlines(lyrics);
  if (!normalized) return [];

  const raw = splitRawBlocks(normalized);
  if (!raw.length) return [];

  let couplets = pairCoupletBlocks(raw.map((b) => [...b]));

  const singles = couplets.filter((c) => c.length === 1).length;
  if (couplets.length > 0 && singles / couplets.length > 0.55) {
    const flat = couplets.flat();
    couplets = [];
    for (let i = 0; i < flat.length; i += 2) {
      couplets.push(i + 1 < flat.length ? [flat[i], flat[i + 1]] : [flat[i]]);
    }
  }

  return couplets;
}
