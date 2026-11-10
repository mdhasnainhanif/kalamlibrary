"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import KalamShareHint from "@/components/KalamShareHint";
import KalamShareToolbar from "@/components/KalamShareToolbar";

interface KalamLyricsReaderProps {
  title: string;
  author: string;
  lang: string;
  dir: "ltr" | "rtl";
  /** Server-rendered `.kalam-stanza` buttons carrying `data-stanza-index`. */
  children: ReactNode;
}

const LANG_ISO: Record<string, string> = {
  urdu: "ur",
  hindi: "hi",
  bangla: "bn",
  "roman-english": "ur-Latn", // Roman text is Urdu written in Latin letters
};

function readStanzas(panel: HTMLElement | null): string[][] {
  if (!panel) return [];
  return Array.from(panel.querySelectorAll<HTMLElement>("[data-stanza-index]")).map((stanza) =>
    Array.from(stanza.querySelectorAll<HTMLElement>(":scope > p")).map(
      (line) => line.textContent ?? ""
    )
  );
}

export default function KalamLyricsReader({ title, author, lang, dir, children }: KalamLyricsReaderProps) {
  const panelRef = useRef<HTMLElement>(null);
  const [fontScale, setFontScale] = useState(1);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(() => new Set());
  // Verse text is read from the server-rendered DOM on first interaction, not shipped as a prop.
  const [stanzas, setStanzas] = useState<string[][]>([]);

  const ensureStanzas = useCallback(() => {
    if (stanzas.length > 0) return stanzas;
    const read = readStanzas(panelRef.current);
    setStanzas(read);
    return read;
  }, [stanzas]);

  useEffect(() => {
    const buttons = panelRef.current?.querySelectorAll<HTMLElement>("[data-stanza-index]");
    buttons?.forEach((button) => {
      const index = Number(button.dataset.stanzaIndex);
      const selected = selectedIndices.has(index);
      button.dataset.selected = String(selected);
      button.setAttribute("aria-pressed", String(selected));
      button.setAttribute(
        "aria-label",
        `Verse ${index + 1}${selected ? ", selected for sharing" : ", tap to select for sharing"}`
      );
    });
  }, [selectedIndices]);

  const handlePanelClick = (event: MouseEvent<HTMLElement>) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>("[data-stanza-index]");
    if (!button) return;
    ensureStanzas();
    const index = Number(button.dataset.stanzaIndex);
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectAll = useCallback(() => {
    setSelectedIndices(new Set(ensureStanzas().map((_, i) => i)));
  }, [ensureStanzas]);

  const clearSelection = useCallback(() => {
    setSelectedIndices(new Set());
  }, []);

  const getFullLyrics = useCallback(
    () => ensureStanzas().map((lines) => lines.join("\n")).join("\n\n"),
    [ensureStanzas]
  );

  const baseSizePx = lang === "urdu" ? 22 : 16;
  const currentFontSizePx = Math.round(baseSizePx * fontScale);
  const percentage = Math.round(fontScale * 100);

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
              onClick={() => setFontScale((prev) => Math.max(0.5, +(prev - 0.15).toFixed(2)))}
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
                onClick={() => setFontScale(1)}
                aria-label="Reset font size to default"
                title="Reset font size"
                className="px-2 py-1 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-gold-400 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/60 rounded transition-all cursor-pointer"
              >
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={() => setFontScale((prev) => Math.min(2.0, +(prev + 0.15).toFixed(2)))}
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
        ref={panelRef}
        id="lyrics-panel"
        aria-label="Lyrics text"
        lang={LANG_ISO[lang] || "ur-Latn"}
        dir={dir}
        onClick={handlePanelClick}
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
        {children}
      </article>

      <KalamShareToolbar
        getFullLyrics={getFullLyrics}
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
