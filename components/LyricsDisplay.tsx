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
  const baseSizePx = lang === "urdu" ? 24 : 17;
  const currentFontSizePx = Math.round(baseSizePx * fontScale);
  const percentage = Math.round(fontScale * 100);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Control Bar for Font Size Adjustment (A- / Reset / A+) */}
      <div className="w-full flex items-center justify-between gap-4 mb-4 px-3 py-2 rounded-xl bg-emerald-950/50 border border-emerald-500/15 backdrop-blur-md shadow-sm">
        <div className="text-xs text-gray-300 font-sans flex items-center gap-1.5 pl-1">
          <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <span className="hidden sm:inline font-medium">Font Size:</span>
          <span className="text-gold-500 font-bold">{percentage}%</span>
        </div>

        {/* Font Control Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-emerald-900/60 p-1 rounded-lg border border-emerald-500/20 shadow-inner">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={fontScale <= 0.75}
              title="Decrease font size (A-)"
              className="px-3 py-1 text-xs md:text-sm font-extrabold text-emerald-300 hover:text-gold-500 hover:bg-emerald-800/60 rounded transition-all disabled:opacity-30 disabled:hover:text-emerald-300 cursor-pointer flex items-center gap-0.5"
            >
              <span>A</span>
              <span className="text-xs font-black">-</span>
            </button>

            {fontScale !== 1 && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset font size"
                className="px-2 py-1 text-[11px] font-semibold text-gray-400 hover:text-gold-400 hover:bg-emerald-800/60 rounded transition-all cursor-pointer"
              >
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={fontScale >= 2.0}
              title="Increase font size (A+)"
              className="px-3 py-1 text-xs md:text-sm font-extrabold text-emerald-300 hover:text-gold-500 hover:bg-emerald-800/60 rounded transition-all disabled:opacity-30 disabled:hover:text-emerald-300 cursor-pointer flex items-center gap-0.5"
            >
              <span className="text-base font-black">A</span>
              <span className="text-xs font-black">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lyrics Display Container */}
      <div
        className={`w-full bg-emerald-900/10 backdrop-blur-md border border-emerald-500/10 rounded-2xl p-6 md:p-12 shadow-inner text-center whitespace-pre-line select-text transition-all duration-150 ${
          lang === "urdu"
            ? "kalam-urdu-lyrics text-emerald-100/90"
            : "font-sans text-gray-200 tracking-wide leading-relaxed md:leading-loose"
        }`}
        style={{
          fontSize: `${currentFontSizePx}px`,
          lineHeight: lang === "urdu" ? (fontScale > 1.3 ? 2.5 : 2.2) : 1.8,
        }}
        dir={dir}
      >
        {lyrics}
      </div>

      {/* Copy and Share Buttons */}
      <CopyShareButtons lyrics={lyrics} title={title} author={author} />
    </div>
  );
}
