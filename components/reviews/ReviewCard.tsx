import ReviewStars from "@/components/reviews/ReviewStars";
import { escapeReviewText } from "@/utils/reviewsContent";
import type { PublicReview } from "@/utils/reviewsData";

function readerInitials(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase();
}

function formatReviewDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

type Props = {
  review: PublicReview;
  compact?: boolean;
  variant?: "default" | "slider";
};

export default function ReviewCard({ review, compact, variant = "default" }: Props) {
  const name = escapeReviewText(review.name);
  const message = escapeReviewText(review.message);
  const place = review.city_or_country ? escapeReviewText(review.city_or_country) : "";
  const isSlider = variant === "slider";
  const isRich = isSlider || (!compact && variant === "default");
  const initials = readerInitials(name);

  return (
    <article
      className={
        isRich
          ? `group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-white via-white to-emerald-50/55 p-5 text-left shadow-[0_8px_30px_rgba(6,40,28,0.08)] ring-1 ring-black/[0.03] transition-[border-color,box-shadow] duration-200 hover:border-gold-500/30 hover:shadow-[0_12px_36px_rgba(6,40,28,0.12)] dark:border-gold-500/15 dark:from-emerald-950/95 dark:via-emerald-950/75 dark:to-emerald-900/45 dark:shadow-black/35 dark:ring-white/[0.05] dark:hover:border-gold-500/35 ${
              isSlider ? "review-card-slider min-h-[248px]" : "min-h-[220px] h-full"
            }`
          : `kalam-card-surface flex h-full flex-col rounded-2xl border border-emerald-500/15 bg-white/80 text-left shadow-sm dark:border-emerald-500/10 dark:bg-emerald-950/30 p-3.5`
      }
    >
      <div
        className={`relative z-[1] mb-4 flex items-start gap-3 ${isRich ? "" : "mb-3 justify-between"}`}
      >
        {isRich ? (
          <div
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/35 bg-gradient-to-br from-gold-500/15 to-emerald-600/10 text-sm font-semibold text-gold-700 dark:text-gold-300"
          >
            {initials}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              <h3
                className={
                  isSlider
                    ? "review-card-name truncate text-base tracking-tight"
                    : isRich
                      ? "truncate font-display text-lg font-semibold tracking-tight text-emerald-900 dark:text-gold-400"
                      : "text-sm font-semibold text-emerald-900 dark:text-emerald-100"
                }
              >
                {name}
              </h3>
              {place ? (
                <p
                  className={
                    isSlider
                      ? "mt-0.5 text-xs text-gray-600 dark:text-gray-300"
                      : "mt-0.5 text-xs text-gray-500 dark:text-gray-400"
                  }
                >
                  {place}
                </p>
              ) : (
                <p className={`mt-0.5 text-xs ${isSlider ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                  Reader
                </p>
              )}
            </div>
            <div
              className={
                isRich
                  ? "shrink-0 rounded-lg border border-emerald-500/15 bg-white/60 px-2 py-1 dark:border-white/10 dark:bg-black/20"
                  : ""
              }
            >
              <ReviewStars rating={review.rating} />
            </div>
          </div>
        </div>
      </div>

      <p
        className={`relative z-[1] flex-1 whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-100/92 ${
          isSlider ? "line-clamp-5 text-[15px]" : compact ? "line-clamp-4 text-sm" : isRich ? "text-[15px]" : "text-sm"
        }`}
      >
        {message}
      </p>

      <footer
        className={`relative z-[1] mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-emerald-500/15 pt-3 text-[11px] text-gray-500 dark:border-white/10 dark:text-gray-400 ${
          isRich ? "mt-4" : "mt-3"
        }`}
      >
        <time dateTime={review.display_at}>{formatReviewDate(review.display_at)}</time>
        {review.is_featured ? (
          <span className="rounded-md border border-gold-500/35 bg-gold-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-800 dark:text-gold-200">
            Featured
          </span>
        ) : null}
      </footer>
    </article>
  );
}
