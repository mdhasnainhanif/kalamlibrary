"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Circle } from "lucide-react";
import KalamShareHint from "@/components/KalamShareHint";
import KalamShareToolbar from "@/components/KalamShareToolbar";
import { parseKalamCouplets } from "@/utils/parseKalamCouplets";

interface LyricsDisplayProps {
  lyrics: string;
  title: string;
  author: string;
  lang: string;
  dir: "ltr" | "rtl";
}

export default function LyricsDisplay({
  lyrics,
  title,
  author,
  lang,
  dir,
}: LyricsDisplayProps) {
  const [fontScale, setFontScale] = useState(1);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(() => new Set());

  const handleZoomIn = () => {
    setFontScale((prev) => Math.min(2.0, +(prev + 0.15).toFixed(2)));
  };

  const handleZoomOut = () => {
    setFontScale((prev) => Math.max(0.5, +(prev - 0.15).toFixed(2)));
  };

  const handleReset = () => {
    setFontScale(1);
  };

  const baseSizePx = lang === "urdu" ? 22 : 16;
  const currentFontSizePx = Math.round(baseSizePx * fontScale);
  const percentage = Math.round(fontScale * 100);

  const langIsoMap: Record<string, string> = {
    urdu: "ur",
    hindi: "hi",
    bangla: "bn",
    "roman-english": "en",
  };
  const htmlLang = langIsoMap[lang] || "en";

  const stanzas = useMemo(() => parseKalamCouplets(lyrics), [lyrics]);

  const toggleStanza = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIndices(new Set(stanzas.map((_, i) => i)));
  }, [stanzas]);

  const clearSelection = useCallback(() => {
    setSelectedIndices(new Set());
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center pb-20 md:pb-0">
      <div
        role="toolbar"
        aria-label="Font size adjustment controls"
        className="w-full flex items-center justify-between gap-3 mb-3 px-3 py-1.5 rounded-xl bg-white dark:bg-emerald-950/50 border border-emerald-500/20 dark:border-emerald-500/15 shadow-sm"
      >
        <div className="text-xs text-gray-700 dark:text-gray-300 font-sans flex items-center gap-1.5 pl-1">
          <svg aria-hidden="true" className="w-4 h-4 text-amber-600 dark:text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <span className="hidden sm:inline font-medium">Font Size:</span>
          <span className="text-amber-700 dark:text-gold-500 font-bold" aria-live="polite">
            {percentage}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/60 p-1 rounded-lg border border-emerald-500/25 dark:border-emerald-500/20 shadow-inner">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={fontScale <= 0.5}
              aria-label="Decrease font size"
              title="Decrease font size (A-)"
              className="px-3 py-1 text-xs md:text-sm font-black text-emerald-800 dark:text-emerald-300 hover:text-amber-700 dark:hover:text-gold-500 hover:bg-emerald-200/60 dark:hover:bg-emerald-800/60 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-0.5"
            >
              <span>A</span>
              <span className="text-xs font-black">-</span>
            </button>

            {fontScale !== 1 && (
              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset font size to default"
                title="Reset font size"
                className="px-2 py-1 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-gold-400 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/60 rounded transition-all cursor-pointer"
              >
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={fontScale >= 2.0}
              aria-label="Increase font size"
              title="Increase font size (A+)"
              className="px-3 py-1 text-xs md:text-sm font-black text-emerald-800 dark:text-emerald-300 hover:text-amber-700 dark:hover:text-gold-500 hover:bg-emerald-200/60 dark:hover:bg-emerald-800/60 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-0.5"
            >
              <span className="text-base font-black">A</span>
              <span className="text-xs font-black">+</span>
            </button>
          </div>
        </div>
      </div>

      <KalamShareHint />

      <article
        id="lyrics-panel"
        aria-label="Lyrics text"
        lang={htmlLang}
        dir={dir}
        className={`w-full kalam-lyrics-stack border border-emerald-500/20 dark:border-emerald-500/10 rounded-2xl md:rounded-3xl shadow-sm dark:shadow-inner text-center transition-all duration-150 ${
          lang === "urdu"
            ? "kalam-urdu-lyrics text-emerald-950 dark:text-emerald-100/95 font-bold md:font-semibold"
            : "font-sans text-gray-900 dark:text-gray-200 tracking-wide leading-relaxed md:leading-loose font-medium"
        }`}
        style={{
          fontSize: `${currentFontSizePx}px`,
          lineHeight: lang === "urdu" ? (fontScale > 1.3 ? 2.5 : 2.2) : 1.8,
        }}
      >
        {stanzas.map((lines, i) => {
          const selected = selectedIndices.has(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggleStanza(i)}
              aria-pressed={selected}
              aria-label={`Verse ${i + 1}${selected ? ", selected for sharing" : ", tap to select for sharing"}`}
              className={`kalam-stanza group/stanza relative w-full cursor-pointer border-0 bg-transparent p-0 text-center transition-all select-text ${
                selected
                  ? "rounded-xl ring-2 ring-gold-500/90 ring-offset-2 ring-offset-white dark:ring-offset-emerald-950 bg-gold-500/5"
                  : "hover:bg-emerald-500/5 rounded-xl"
              }`}
            >
              <span
                className={`absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full shadow-sm md:left-3 ${
                  selected
                    ? "bg-gold-500 text-black"
                    : "border border-amber-500/40 bg-emerald-950/40 text-amber-500/70 opacity-80 group-hover/stanza:opacity-100"
                }`}
                aria-hidden
              >
                {selected ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : (
                  <Circle className="h-3 w-3" strokeWidth={2} />
                )}
              </span>
              {lines.map((line, j) => (
                <p key={j} className="kalam-stanza-line pointer-events-none">
                  {line}
                </p>
              ))}
            </button>
          );
        })}
      </article>

      <KalamShareToolbar
        lyrics={lyrics}
        title={title}
        author={author}
        lang={lang}
        dir={dir}
        stanzas={stanzas}
        selectedIndices={selectedIndices}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
      />
    </div>
  );
}
