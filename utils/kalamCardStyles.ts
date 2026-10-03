/** Outer bento / section panels (home, etc.) */
export const bentoPanelClass =
  "kalam-card-surface glass-panel premium-card flex flex-col rounded-2xl border border-emerald-200/60 bg-white/80 p-5 md:p-6 dark:border-emerald-500/10 dark:bg-emerald-900/10";

/** Compact rows inside bento panels (poets, language tiles) */
export const bentoInnerCardClass =
  "kalam-card-surface rounded-xl border border-emerald-200/60 bg-white/70 transition-all duration-300 hover:bg-emerald-50/80 hover-gold-glow dark:border-emerald-500/10 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30";

/** Shared list-card surface for kalam grids */
export const kalamGridCardClass =
  "kalam-list-card kalam-card-surface glass-panel premium-card group flex h-full flex-col gap-2 rounded-xl border border-emerald-200/70 bg-white/85 p-4 pb-3.5 text-left transition-all duration-300 hover:bg-emerald-50/90 hover-gold-glow dark:border-emerald-500/10 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20";

export const kalamGridCardFooterClass =
  "mt-auto shrink-0 border-t border-emerald-200/70 pt-2.5 dark:border-emerald-500/10";

export const faqItemSurfaceClass =
  "kalam-card-surface glass-panel premium-card overflow-hidden rounded-xl border border-emerald-200/70 bg-white/90 transition-all duration-300 dark:border-emerald-500/10 dark:bg-emerald-900/10";

/** Footer CTAs inside bento panels */
export const bentoCtaClass =
  "inline-flex items-center justify-center gap-1 rounded-xl border border-emerald-200/80 bg-white/90 py-2.5 text-xs font-semibold text-amber-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 dark:border-emerald-500/15 dark:bg-emerald-900/35 dark:text-gold-500 dark:hover:bg-emerald-900/50 dark:hover:text-white";

export const bentoCtaBlockClass = `${bentoCtaClass} w-full gap-2 py-3`;

/** Poet avatar chip */
export const poetAvatarClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200/80 bg-emerald-50 text-sm font-semibold text-amber-800 transition-colors group-hover:border-amber-400/60 dark:border-gold-500/10 dark:bg-emerald-900/60 dark:text-gold-500 dark:group-hover:border-gold-500/30";
