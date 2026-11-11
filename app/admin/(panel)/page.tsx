import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { IconInbox, IconReviews } from "@/components/admin/AdminIcons";
import { getReviewStatusCounts, listAdminReviews } from "@/utils/reviewsData";
import { escapeReviewText } from "@/utils/reviewsContent";
import { isSupabaseAdminConfigured } from "@/utils/supabaseAdmin";
import styles from "@/app/admin/admin.module.css";

export const dynamic = "force-dynamic";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default async function AdminDashboardPage() {
  if (!isSupabaseAdminConfigured()) {
    return (
      <p className={styles.alertError} role="alert">
        Supabase service role is not configured.
      </p>
    );
  }

  const counts = await getReviewStatusCounts();
  const recent =
    counts.pending > 0
      ? (await listAdminReviews({ status: "pending", page: 1, pageSize: 5 })).rows
      : [];

  const stats = [
    {
      key: "pending",
      label: "Awaiting moderation",
      value: counts.pending,
      helper: "Submissions need your decision",
      href: "/admin/reviews?status=pending",
      link: "Review now",
      iconClass: styles.statIconWarn,
    },
    {
      key: "approved",
      label: "Published testimonials",
      value: counts.approved,
      helper: "Live on the public site",
      href: "/admin/reviews?status=approved",
      link: "Manage approved",
      iconClass: styles.statIconOk,
    },
    {
      key: "rejected",
      label: "Rejected",
      value: counts.rejected,
      helper: "Not shown publicly",
      href: "/admin/reviews?status=rejected",
      link: "View rejected",
      iconClass: styles.statIconMuted,
    },
  ] as const;

  const allZero = counts.pending === 0 && counts.approved === 0 && counts.rejected === 0;

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Review moderation overview and quick actions" />

      <ul className={styles.statGrid}>
        {stats.map((s) => (
          <li key={s.key} className={`${styles.card} ${styles.statCard}`}>
            <span className={`${styles.statIcon} ${s.iconClass}`} aria-hidden>
              <IconReviews className="h-5 w-5" />
            </span>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statValue}>{s.value}</p>
            <p className="text-xs text-[var(--admin-muted)]">{s.helper}</p>
            <Link href={s.href} className={`${styles.btnSecondary} ${styles.btnSm} mt-auto w-fit`}>
              {s.link}
            </Link>
          </li>
        ))}
      </ul>

      {counts.pending > 0 ? (
        <p className={styles.banner} role="status">
          <span className="text-sm text-[var(--admin-text)]">
            You have <strong>{counts.pending}</strong> review{counts.pending === 1 ? "" : "s"} waiting for approval.
          </span>
          <Link href="/admin/reviews?status=pending" className={styles.btnPrimary}>
            Review pending
          </Link>
        </p>
      ) : null}

      <section className={`${styles.card} ${styles.cardPad} mt-6`} aria-labelledby="recent-pending">
        <h2 id="recent-pending" className="text-sm font-semibold uppercase tracking-wide text-[var(--admin-muted)]">
          Recent submissions
        </h2>
        {recent.length === 0 ? (
          <div className={styles.empty}>
            <IconInbox className={styles.emptyIcon} />
            <p>{allZero ? "No reviews yet. Submissions from the public form will appear here." : "No pending reviews in the queue."}</p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--admin-border)]">
            {recent.map((row) => (
              <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium text-[var(--admin-text)]">
                    {escapeReviewText(row.name)} · {row.rating}★
                  </p>
                  <p className="line-clamp-2 text-sm text-[var(--admin-muted)]">{escapeReviewText(row.message)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-[var(--admin-muted)]">
                  <span>{timeAgo(row.created_at)}</span>
                  <Link href="/admin/reviews?status=pending" className={styles.linkMuted}>
                    Open queue
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 flex flex-wrap gap-3" aria-label="Quick actions">
        <Link href="/admin/reviews?status=pending" className={styles.btnPrimary}>
          Moderate reviews
        </Link>
        <Link href="/admin/reviews" className={styles.btnSecondary}>
          Add manual testimonial
        </Link>
        <a href="/reviews" target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>
          View public reviews
        </a>
      </section>
    </div>
  );
}
