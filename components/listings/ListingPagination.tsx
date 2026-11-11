import Link from "next/link";

export default function ListingPagination({
  currentPage,
  totalPages,
  hrefFor,
}: {
  currentPage: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  );

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-emerald-500/10 pt-8">
      {currentPage > 1 ? (
        <Link
          href={hrefFor(currentPage - 1)}
          className="rounded-xl border border-emerald-500/10 bg-emerald-950/60 px-4 py-2 text-xs font-semibold text-gray-300 transition-all hover:bg-emerald-900/40 hover:text-white"
        >
          ← Previous
        </Link>
      ) : null}

      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis ? <span className="px-1 text-xs text-gray-500">...</span> : null}
            <Link
              href={hrefFor(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                p === currentPage
                  ? "bg-gold-500 font-bold text-black shadow-md shadow-gold-500/10"
                  : "border border-emerald-500/10 bg-emerald-950/60 text-gray-300 hover:bg-emerald-900/40 hover:text-white"
              }`}
            >
              {p}
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages ? (
        <Link
          href={hrefFor(currentPage + 1)}
          className="rounded-xl border border-emerald-500/10 bg-emerald-950/60 px-4 py-2 text-xs font-semibold text-gray-300 transition-all hover:bg-emerald-900/40 hover:text-white"
        >
          Next →
        </Link>
      ) : null}
    </nav>
  );
}
