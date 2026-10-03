"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme !== "light";

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle color theme"
        title="Toggle color theme"
        className="theme-toggle fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-emerald-950/90 text-gold-400 border border-emerald-500/20 shadow-xl shadow-black/40 cursor-pointer"
        tabIndex={-1}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-emerald-950/90 text-gold-400 border border-emerald-500/20 hover:border-gold-500/50 shadow-xl shadow-black/40 transition-colors hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-500/50 cursor-pointer"
    >
      {isDark ? (
        <svg aria-hidden="true" className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      ) : (
        <svg aria-hidden="true" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}
