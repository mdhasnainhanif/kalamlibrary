import KalamLibraryLogo from "@/components/KalamLibraryLogo";

type SiteLoaderProps = {
  compact?: boolean;
  label?: string;
};

function LoaderIndicator({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-5 w-5" : "h-9 w-9";
  const stroke = size === "sm" ? 2.5 : 2;

  return (
    <svg
      aria-hidden
      className={`${dim} site-loader-spin text-gold-500`}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="15" stroke="currentColor" strokeOpacity={0.12} strokeWidth={stroke} />
      <circle
        cx="18"
        cy="18"
        r="15"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray="24 70"
        className="text-gold-500 dark:text-gold-400"
      />
    </svg>
  );
}

export default function SiteLoader({ compact = false, label = "Loading" }: SiteLoaderProps) {
  if (compact) {
    return (
      <div className="flex w-full items-center justify-center py-4" role="status" aria-live="polite" aria-busy="true" aria-label={label}>
        <LoaderIndicator size="sm" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20 min-h-[52vh]"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <LoaderIndicator />

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-gray-500">
          {label}
        </p>
        <KalamLibraryLogo size="share" className="opacity-90" />
      </div>

      <div
        aria-hidden
        className="site-loader-indeterminate h-px w-full max-w-[200px] overflow-hidden rounded-full bg-emerald-500/10 dark:bg-emerald-500/15"
      >
        <span className="site-loader-indeterminate-bar block h-full w-1/3 rounded-full bg-gold-500/70 dark:bg-gold-500/80" />
      </div>
    </div>
  );
}
