/** The arabesque tile is a static file in public/patterns, drawn by CSS (`.site-pattern` in globals.css). */
export default function SiteBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--bg-primary,#faf6ec)] dark:bg-transparent" />
      <div className="site-pattern absolute inset-0" />
      <div className="absolute inset-0 hidden bg-dot-grid opacity-[0.08] dark:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-b from-emerald-950/30 via-transparent to-emerald-950/80 dark:block" />
      <div className="absolute -top-40 left-1/2 hidden h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px] dark:block" />
      <div className="absolute bottom-0 right-0 hidden h-80 w-80 rounded-full bg-gold-500/5 blur-[100px] dark:block" />
    </div>
  );
}
