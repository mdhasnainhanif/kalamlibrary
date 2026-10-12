"use client";

import { useEffect, useState } from "react";
import { MousePointerClick, X } from "lucide-react";

const STORAGE_KEY = "kalam-share-hint-dismissed";

export default function KalamShareHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
      setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div
      role="note"
      className="mb-3 flex w-full items-start gap-3 rounded-xl border border-amber-500/35 bg-gradient-to-r from-amber-500/10 to-emerald-500/5 px-3 py-3 sm:px-4"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-amber-700 dark:text-gold-400">
        <MousePointerClick className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 font-sans">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          Tap any band (شعر) to add it to your share post
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
          Selected bands show a gold ring. Then tap <strong className="font-semibold text-emerald-800 dark:text-emerald-300">Create share post</strong> for a ready-made image.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-lg p-1.5 text-gray-500 hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="Dismiss tip"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
