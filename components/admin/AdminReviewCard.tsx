import { escapeReviewText } from "@/utils/reviewsContent";
import type { AdminReviewRow } from "@/utils/reviewsData";
import AdminReviewActions from "@/components/admin/AdminReviewActions";
import AdminClampedMessage from "@/components/admin/AdminClampedMessage";
import styles from "@/app/admin/admin.module.css";

function starString(rating: number) {
  const n = Math.max(1, Math.min(5, Math.round(rating)));
  return `${"★".repeat(n)}${"☆".repeat(5 - n)}`;
}

export default function AdminReviewCard({ row }: { row: AdminReviewRow }) {
  const name = escapeReviewText(row.name);
  const message = escapeReviewText(row.message);
  const statusClass =
    row.status === "pending" ? styles.pillPending : row.status === "approved" ? styles.pillApproved : styles.pillRejected;

  return (
    <article className={`${styles.card} ${styles.reviewCard}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-[var(--admin-text)]">{name}</h2>
            <span className={styles.stars} aria-label={`${row.rating} out of 5 stars`}>
              {starString(row.rating)}
            </span>
            <span className="text-xs text-[var(--admin-muted)]">({row.rating})</span>
          </div>
          {row.city_or_country ? (
            <p className="mt-0.5 text-xs text-[var(--admin-muted)]">{escapeReviewText(row.city_or_country)}</p>
          ) : null}
          <div className={styles.badgeRow}>
            <span className={statusClass}>{row.status}</span>
            {row.is_featured ? <span className={styles.pill}>Featured</span> : null}
            {row.is_sample ? <span className={styles.pill}>Sample</span> : null}
            {row.source ? <span className={styles.pill}>Source: {escapeReviewText(row.source)}</span> : null}
            {row.admin_note ? <span className={styles.pill}>Edited</span> : null}
          </div>
          {row.email ? (
            <p className="mt-2 text-xs text-[var(--admin-muted)]">
              Email: <span className="text-[var(--admin-text)]">{escapeReviewText(row.email)}</span>
            </p>
          ) : null}
        </div>
        <time className="shrink-0 text-xs text-[var(--admin-muted)]" dateTime={row.created_at}>
          {new Date(row.created_at).toLocaleString()}
        </time>
      </div>
      <AdminClampedMessage text={message} />
      {row.admin_note ? (
        <p className="mt-2 text-xs text-[var(--admin-warning)]">Note: {escapeReviewText(row.admin_note)}</p>
      ) : null}
      <AdminReviewActions review={row} />
    </article>
  );
}
