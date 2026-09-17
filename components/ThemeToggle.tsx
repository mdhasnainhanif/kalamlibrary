"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full opacity-0 pointer-events-none"
      />
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-white/95 dark:bg-emerald-950/90 text-amber-500 dark:text-gold-400 border border-emerald-500/30 dark:border-emerald-500/20 hover:border-gold-500/50 shadow-xl shadow-black/15 dark:shadow-black/40 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-500/50 cursor-pointer group"
    >
      {isDark ? (
        <Moon className="w-5 h-5 text-gold-400 group-hover:-rotate-12 transition-transform duration-300" />
      ) : (
        <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
      )}
    </button>
  );
}
