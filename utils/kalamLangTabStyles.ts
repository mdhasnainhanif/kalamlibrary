const FONT_BY_KEY: Record<string, string> = {
  urdu: "font-urdu leading-normal",
  hindi: "font-devanagari leading-none",
  bangla: "font-bengali leading-none",
  "roman-english": "font-sans leading-none",
};

export function kalamLangTabClassName(langKey: string, active: boolean): string {
  const font = FONT_BY_KEY[langKey] ?? "font-sans leading-none";

  return [
    "kalam-lang-tab inline-flex items-center justify-center min-h-9 px-3.5 py-1.5 text-xs md:min-h-10 md:px-4 md:py-2 md:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer",
    font,
    active
      ? "bg-gold-500 text-black shadow-md font-semibold"
      : "text-gray-600 dark:text-gray-400 hover:text-emerald-950 dark:hover:text-white hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40",
  ].join(" ");
}

export const KALAM_LANG_TABLIST_CLASS =
  "flex items-center gap-1 shrink-0 bg-white/90 dark:bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-500/20 dark:border-emerald-500/10 shadow-sm dark:shadow-none";
