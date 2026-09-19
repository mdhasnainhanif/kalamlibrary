"use client";

import { useState } from "react";
import CopyShareButtons from "./CopyShareButtons";

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
  // Font size multiplier (default = 1, min = 0.75, max = 2.0, step = 0.15)
  const [fontScale, setFontScale] = useState(1);

  const handleZoomIn = () => {
    setFontScale((prev) => Math.min(2.0, +(prev + 0.15).toFixed(2)));
  };

  const handleZoomOut = () => {
    setFontScale((prev) => Math.max(0.75, +(prev - 0.15).toFixed(2)));
  };

  const handleReset = () => {
    setFontScale(1);
  };

  // Base font size in px based on language
  const baseSizePx = lang === "urdu" ? 22 : 16;
  const currentFontSizePx = Math.round(baseSizePx * fontScale);
  const percentage = Math.round(fontScale * 100);

  // Map language to ISO code for HTML lang attribute
  const langIsoMap: Record<string, string> = {
    urdu: "ur",
    hindi: "hi",
    bangla: "bn",
    "roman-english": "en",
  };
  const htmlLang = langIsoMap[lang] || "en";

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Control Bar for Font Size Adjustment (A- / Reset / A+) */}
      <div
        role="toolbar"
        aria-label="Font size adjustment controls"
        className="w-full flex items-center justify-between gap-3 mb-3 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/15 shadow-sm"
      >
        <div className="text-xs text-gray-300 font-sans flex items-center gap-1.5 pl-1">
          <svg aria-hidden="true" className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <span className="hidden sm:inline font-medium">Font Size:</span>
          <span className="text-gold-500 font-bold" aria-live="polite">
            {percentage}%
          </span>
        </div>

        {/* Font Control Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-emerald-100/70 dark:bg-emerald-900/60 p-1 rounded-lg border border-emerald-500/30 dark:border-emerald-500/20 shadow-inner">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={fontScale <= 0.75}
              aria-label="Decrease font size"
              title="Decrease font size (A-)"
              className="px-3 py-1 text-xs md:text-sm font-black text-emerald-800 dark:text-emerald-300 hover:text-gold-600 dark:hover:text-gold-500 hover:bg-emerald-200/60 dark:hover:bg-emerald-800/60 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-0.5"
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
                className="px-2 py-1 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/60 rounded transition-all cursor-pointer"
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
              className="px-3 py-1 text-xs md:text-sm font-black text-emerald-800 dark:text-emerald-300 hover:text-gold-600 dark:hover:text-gold-500 hover:bg-emerald-200/60 dark:hover:bg-emerald-800/60 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-0.5"
            >
              <span className="text-base font-black">A</span>
              <span className="text-xs font-black">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lyrics Display Container */}
      <article
        id="lyrics-panel"
        aria-label="Lyrics text"
        lang={htmlLang}
        dir={dir}
        className={`w-full bg-emerald-900/10 border border-emerald-500/10 rounded-xl p-4 md:p-6 shadow-inner text-center whitespace-pre-line select-text transition-all duration-150 ${
          lang === "urdu"
            ? "kalam-urdu-lyrics text-emerald-100/90"
            : "font-sans text-gray-200 tracking-wide leading-relaxed md:leading-loose"
        }`}
        style={{
          fontSize: `${currentFontSizePx}px`,
          lineHeight: lang === "urdu" ? (fontScale > 1.3 ? 2.5 : 2.2) : 1.8,
        }}
      >
        {lyrics}
      </article>

      {/* Copy and Share Buttons */}
      <CopyShareButtons lyrics={lyrics} title={title} author={author} />
    </div>
  );
}
