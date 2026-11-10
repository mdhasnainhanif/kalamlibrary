"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReaderPage } from "@/utils/khatmEQadriaPages";
import { amiriArabic } from "@/utils/arabicFont";

type PagedKalamReaderProps = {
  titleUrdu: string;
  /** Pages that follow the cover and instruction page. */
  pages: ReaderPage[];
  credit?: string;
};

const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

const INSTRUCTIONS = [
  "If you have a specific need, or a difficulty arises, or you are affected by evil spirits or black magic, then eleven people should gather and recite Khatme Qadīriya.",
  "Sweet dish should be prepared and Fātiḥah should be offered. The reward should be presented & Dua made to Allāh Ta'ala through the Wasīla of Sayyidunā Ghauth al-Āzam RadiAllahu Anh.",
  "Allāh willing the need will be fulfilled and the difficulties will be alleviated. Reciting it even during normal days (when there is no specific difficulty or need) is a means of great blessings.",
];

const ORNAMENT_BAND: React.CSSProperties = {
  backgroundColor: "#0b1238",
  backgroundImage:
    "radial-gradient(circle at 50% 50%, #f1d58a 0 2px, transparent 2.5px), radial-gradient(circle at 0 0, #5b82d6 0 3px, transparent 3.5px), radial-gradient(circle at 100% 100%, #5b82d6 0 3px, transparent 3.5px), linear-gradient(90deg, rgba(212,175,55,0.18), rgba(212,175,55,0.05))",
  backgroundSize: "20px 20px, 20px 20px, 20px 20px, 100% 100%",
};

function readHashPage(total: number): number {
  const m = /^#page-(\d+)$/.exec(window.location.hash);
  const n = m ? parseInt(m[1], 10) : 1;
  return Number.isFinite(n) ? Math.min(Math.max(n, 1), total) : 1;
}

function subscribeHash(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

function visiblePageNumbers(current: number, total: number): (number | "gap")[] {
  const set = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

export default function PagedKalamReader({ titleUrdu, pages, credit = "Compiled by @MaksudYusuf" }: PagedKalamReaderProps) {
  const total = pages.length + 2; // cover + instructions + numbered pages
  const current = useSyncExternalStore(
    subscribeHash,
    () => readHashPage(total),
    () => 1
  );
  const [show, setShow] = useState({ arabic: true, roman: true, english: true });
  const rootRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (n: number, scroll = true) => {
      const next = Math.min(Math.max(n, 1), total);
      window.history.replaceState(null, "", `#page-${next}`);
      window.dispatchEvent(new Event("hashchange"));
      if (scroll) rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    },
    [total]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.key === "ArrowLeft") goTo(readHashPage(total) - 1, false);
      if (e.key === "ArrowRight") goTo(readHashPage(total) + 1, false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, total]);

  const toggle = (key: "arabic" | "roman" | "english") =>
    setShow((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      return next.arabic || next.roman || next.english ? next : prev;
    });

  const navBtn =
    "inline-flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-500/25 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition-colors hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-35 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:text-gold-500 md:text-sm";

  const controls = (
    <nav aria-label="Page navigation" className="flex w-full flex-wrap items-center justify-center gap-2">
      <button type="button" className={navBtn} onClick={() => goTo(current - 1)} disabled={current <= 1}>
        <ChevronLeft aria-hidden className="h-4 w-4" /> Prev
      </button>
      <ol className="flex flex-wrap items-center justify-center gap-1">
        {visiblePageNumbers(current, total).map((n, i) =>
          n === "gap" ? (
            <li key={`gap-${i}`} aria-hidden className="px-1 text-gray-500">
              …
            </li>
          ) : (
            <li key={n}>
              <button
                type="button"
                onClick={() => goTo(n)}
                aria-label={`Go to page ${n}`}
                aria-current={n === current ? "page" : undefined}
                className={`h-8 min-w-8 cursor-pointer rounded-md border px-2 text-xs font-semibold transition-colors md:text-sm ${
                  n === current
                    ? "border-gold-500 bg-gold-500 text-black"
                    : "border-emerald-500/25 bg-white text-emerald-800 hover:text-amber-700 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:text-gold-500"
                }`}
              >
                {n}
              </button>
            </li>
          )
        )}
      </ol>
      <button type="button" className={navBtn} onClick={() => goTo(current + 1)} disabled={current >= total}>
        Next <ChevronRight aria-hidden className="h-4 w-4" />
      </button>
    </nav>
  );

  const chip = (key: "arabic" | "roman" | "english", text: string) => (
    <button
      type="button"
      onClick={() => toggle(key)}
      aria-pressed={show[key]}
      className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        show[key]
          ? "border-gold-500 bg-gold-500/90 text-black"
          : "border-emerald-500/30 bg-transparent text-gray-600 dark:text-gray-400"
      }`}
    >
      {text}
    </button>
  );

  return (
    <div ref={rootRef} id="lyrics-panel" className={`${amiriArabic.variable} w-full scroll-mt-24`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-white px-3 py-2 shadow-sm dark:bg-emerald-950/50">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Show or hide text layers">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Show:</span>
          {chip("arabic", "Arabic")}
          {chip("roman", "Transliteration")}
          {chip("english", "English")}
        </div>
        <p aria-live="polite" className="text-xs font-semibold text-amber-700 dark:text-gold-500">
          Page {current} of {total}
        </p>
      </div>

      <div className="mb-3">{controls}</div>

      <div className="space-y-4">
        {/* Cover */}
        <Slide index={1} current={current} total={total} bare>
          <div className="flex flex-1 flex-col items-center justify-center gap-[2cqw] px-4 text-center">
            <p lang="ur" dir="rtl" className="font-urdu text-[clamp(2.6rem,9cqw,5.5rem)] leading-[1.5] text-[#e9c46a]">
              {titleUrdu}
            </p>
            <h2 className="font-sans text-[clamp(1.2rem,4.2cqw,2.6rem)] font-extrabold uppercase tracking-wide text-white">
              Khatme Qadriah
            </h2>
            <p className="font-sans text-[clamp(0.8rem,2cqw,1.2rem)] font-semibold leading-snug text-[#e9c46a]">
              in Arabic with English
              <br />
              Transliteration &amp; translations
            </p>
            <p className="font-sans text-[clamp(0.65rem,1.5cqw,0.95rem)] font-semibold text-slate-300">{credit}</p>
          </div>
        </Slide>

        {/* Instructions */}
        <Slide index={2} current={current} total={total}>
          <div className="flex flex-1 flex-col items-center justify-center gap-[1.6cqw] px-[6cqw] pb-[2cqw] text-center">
            {INSTRUCTIONS.map((p) => (
              <p key={p} lang="en" className="font-sans text-[clamp(0.8rem,1.9cqw,1.25rem)] font-semibold leading-relaxed text-slate-100">
                {p}
              </p>
            ))}
          </div>
        </Slide>

        {/* Numbered pages */}
        {pages.map((p, i) => {
          const index = i + 3;
          return (
            <Slide
              key={index}
              index={index}
              current={current}
              total={total}
              label={p.label}
              badge={p.badge}
            >
              <div className="flex flex-1 flex-col items-center justify-center gap-[2.2cqw] px-[4cqw] pb-[1.5cqw] text-center">
                {show.arabic && (
                  <div
                    lang="ar"
                    dir="rtl"
                    className={
                      p.flow
                        ? "font-arabic-reader w-full text-justify text-[clamp(0.95rem,2.35cqw,1.6rem)] leading-[2.15] text-white [text-align-last:center]"
                        : p.columns
                          ? "font-arabic-reader grid w-full grid-cols-1 gap-x-[4cqw] gap-y-[1cqw] text-[clamp(1.2rem,3.6cqw,2.4rem)] leading-[1.7] text-white sm:grid-cols-2"
                          : "font-arabic-reader w-full text-[clamp(1.35rem,4.6cqw,3.1rem)] leading-[1.75] text-white"
                    }
                  >
                    {p.flow ? (
                      <p>{p.arabic.join(" ")}</p>
                    ) : (
                      p.arabic.map((line, j) => <p key={j}>{line}</p>)
                    )}
                  </div>
                )}

                {show.roman && p.roman.length > 0 && (
                  <div lang="en" className="font-sans text-[clamp(0.85rem,2.5cqw,1.7rem)] font-bold leading-snug text-white">
                    {p.roman.map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                    {p.note?.map((line, j) => (
                      <p key={`n${j}`} className="mt-[0.8cqw] text-[0.82em] font-semibold text-slate-200">
                        {line}
                      </p>
                    ))}
                  </div>
                )}

                {show.english && p.english.length > 0 && (
                  <div lang="en" className="font-sans text-[clamp(0.8rem,2.1cqw,1.4rem)] italic leading-snug text-slate-200">
                    {p.english.map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </Slide>
          );
        })}
      </div>

      <div className="mt-4">{controls}</div>
      <p className="mt-3 text-center text-[11px] text-gray-500">Tip: use the ← and → arrow keys to turn pages.</p>
    </div>
  );
}

function Slide({
  index,
  current,
  total,
  label,
  badge,
  bare,
  children,
}: {
  index: number;
  current: number;
  total: number;
  label?: string;
  badge?: number;
  bare?: boolean;
  children: React.ReactNode;
}) {
  const active = index === current;
  return (
    <section
      hidden={!active}
      aria-label={`Page ${index} of ${total}`}
      style={{ containerType: "inline-size" }}
    >
      <div
        className="relative flex aspect-[1276/909] min-h-[18rem] w-full flex-col overflow-hidden rounded-xl border border-[#d4af37]/40 shadow-lg"
        style={{ background: "radial-gradient(ellipse at 50% 55%, #121a52 0%, #070b2c 55%, #03051a 100%)" }}
      >
        <div aria-hidden className="h-[4.2cqw] min-h-5 w-full border-b border-[#d4af37]/60" style={ORNAMENT_BAND} />

        {!bare && (
        <header className="grid grid-cols-3 items-center gap-2 px-[3.5cqw] pt-[1.6cqw]">
          <p className="font-sans text-[clamp(0.6rem,1.45cqw,0.95rem)] font-semibold text-slate-300">{label ?? ""}</p>
          <p lang="ar" dir="rtl" className="font-arabic-reader text-center text-[clamp(0.9rem,2.1cqw,1.4rem)] text-white/90">
            {BISMILLAH}
          </p>
          <div className="flex justify-end">
            {badge !== undefined && (
              <span
                aria-hidden
                className="flex h-[5.4cqw] min-h-9 w-[5.4cqw] min-w-9 flex-col items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#0b1238] text-center font-sans font-extrabold leading-none text-white"
              >
                <span className="text-[clamp(0.5rem,1.15cqw,0.75rem)]">Page</span>
                <span className="text-[clamp(0.7rem,1.75cqw,1.15rem)]">{badge}</span>
              </span>
            )}
          </div>
        </header>
        )}

        {children}

        {!bare && (
          <p className="pb-[0.6cqw] text-center font-sans text-[clamp(0.45rem,0.9cqw,0.65rem)] text-slate-400">
            compiled by @MaksudYusuf
          </p>
        )}
        <div aria-hidden className="h-[4.2cqw] min-h-5 w-full border-t border-[#d4af37]/60" style={ORNAMENT_BAND} />
      </div>
    </section>
  );
}
