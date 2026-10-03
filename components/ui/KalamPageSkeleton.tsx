function Sk({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton-block ${className}`} />;
}

const STANZAS: { h: string; w1: string; w2: string }[] = [
  { h: "h-[4.75rem]", w1: "w-[88%]", w2: "w-[72%]" },
  { h: "h-[5.25rem]", w1: "w-[92%]", w2: "w-[65%]" },
  { h: "h-[4.5rem]", w1: "w-[80%]", w2: "w-[78%]" },
  { h: "h-[5rem]", w1: "w-[94%]", w2: "w-[70%]" },
  { h: "h-[4.75rem]", w1: "w-[85%]", w2: "w-[60%]" },
  { h: "h-[5.5rem]", w1: "w-[90%]", w2: "w-[74%]" },
];

export default function KalamPageSkeleton() {
  return (
    <main
      id="main-content"
      className="kalam-skeleton-root mx-auto flex w-full max-w-7xl min-w-0 flex-1 flex-col px-3 py-6 sm:px-6 md:py-10"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading naat lyrics"
    >
      {/* Breadcrumb — mirrors real nav */}
      <nav
        aria-hidden
        className="mx-auto mb-6 flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 text-xs md:text-sm"
      >
        <Sk className="h-3.5 w-11 rounded-md" />
        <span className="text-gray-400/80 dark:text-gray-600">/</span>
        <Sk className="h-3.5 w-12 rounded-md" />
        <span className="text-gray-400/80 dark:text-gray-600">/</span>
        <Sk className="h-3.5 w-28 rounded-md" />
        <span className="text-gray-400/80 dark:text-gray-600">/</span>
        <Sk className="h-3.5 w-36 max-w-[42vw] rounded-md" />
      </nav>

      {/* Header */}
      <header className="mx-auto mb-8 w-full max-w-3xl border-b border-emerald-500/15 pb-6 text-center dark:border-emerald-500/10">
        <Sk className="mx-auto h-9 w-[min(100%,28rem)] rounded-xl md:h-10" />
        <Sk className="mx-auto mt-3 h-8 w-[min(100%,22rem)] rounded-xl md:h-9" />
        <Sk className="mx-auto mt-4 h-4 w-48 max-w-[80%] rounded-md" />
        <Sk className="mx-auto mt-2 h-3 w-40 max-w-[70%] rounded-md opacity-80" />
      </header>

      {/* Language tabs — same shell as live tablist */}
      <div className="kalam-lang-tabs mx-auto mb-8 w-full max-w-3xl border-b border-emerald-500/15 dark:border-emerald-500/10">
        <div className="flex justify-start overflow-x-auto py-2 md:justify-center">
          <div className="flex shrink-0 gap-1 rounded-xl border border-emerald-500/15 bg-white/90 p-1.5 dark:border-emerald-500/10 dark:bg-emerald-950/60">
            <Sk className="h-9 w-[7.5rem] rounded-lg" />
            <Sk className="h-9 w-24 rounded-lg" />
            <Sk className="h-9 w-[5.5rem] rounded-lg opacity-90" />
            <Sk className="h-9 w-20 rounded-lg opacity-75" />
          </div>
        </div>
      </div>

      {/* Center column — KalamPageAdLayout width */}
      <div className="relative flex w-full justify-center">
        <div className="flex w-full max-w-2xl flex-col lg:max-w-3xl">
          {/* Font toolbar */}
          <div className="mb-3 flex w-full items-center justify-between gap-3 rounded-xl border border-emerald-500/15 bg-white/90 px-3 py-2 dark:border-emerald-500/15 dark:bg-emerald-950/50">
            <Sk className="h-4 w-28 rounded-md" />
            <Sk className="h-9 w-[7.25rem] rounded-lg" />
          </div>

          {/* Lyrics panel shell */}
          <article
            aria-hidden
            className="kalam-lyrics-stack w-full rounded-2xl border border-emerald-500/15 bg-white/40 p-3 shadow-sm dark:border-emerald-500/10 dark:bg-emerald-950/25 md:rounded-3xl md:p-4"
          >
            <div className="flex flex-col gap-2.5">
              {STANZAS.map((s, i) => (
                <div
                  key={i}
                  className={`skeleton-stanza kalam-card-surface relative flex ${s.h} flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl px-4 py-3`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <Sk className={`h-3.5 ${s.w1} max-w-full rounded-md`} />
                  <Sk className={`h-3.5 ${s.w2} max-w-full rounded-md opacity-90`} />
                </div>
              ))}
            </div>
          </article>

          {/* Copy / share row */}
          <div className="mt-4 flex justify-center gap-3">
            <Sk className="h-10 w-28 rounded-xl" />
            <Sk className="h-10 w-28 rounded-xl" />
          </div>

          <Sk className="mx-auto mt-10 h-4 w-32 rounded-md opacity-70" />
        </div>
      </div>
    </main>
  );
}
