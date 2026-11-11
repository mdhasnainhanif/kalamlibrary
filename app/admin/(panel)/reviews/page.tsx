import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminAddReviewModal from "@/components/admin/AdminAddReviewModal";
import AdminReviewTableRow from "@/components/admin/AdminReviewTableRow";
import AdminReviewsSearch from "@/components/admin/AdminReviewsSearch";
import { IconInbox } from "@/components/admin/AdminIcons";
import { adminCreateManualReview } from "@/app/admin/actions";
import { getReviewStatusCounts, listAdminReviews } from "@/utils/reviewsData";
import styles from "@/app/admin/admin.module.css";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type Props = {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
};

function parseStatus(raw?: string): "pending" | "approved" | "rejected" {
  if (raw === "approved" || raw === "rejected") return raw;
  return "pending";
}

const EMPTY: Record<"pending" | "approved" | "rejected", string> = {
  pending: "No pending reviews. You're all caught up.",
  approved: "No approved reviews yet. Approve submissions or add a manual testimonial.",
  rejected: "No rejected reviews in this list.",
};

export default async function AdminReviewsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = parseStatus(sp.status);
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const search = sp.q?.trim();

  const [counts, { rows, total }] = await Promise.all([
    getReviewStatusCounts(),
    listAdminReviews({ status, page, pageSize: PAGE_SIZE, search }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, total);

  const tabs: { id: typeof status; label: string; count: number }[] = [
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "approved", label: "Approved", count: counts.approved },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ];

  const pageLink = (p: number) => {
    const q = new URLSearchParams({ status, page: String(p) });
    if (search) q.set("q", search);
    return `/admin/reviews?${q.toString()}`;
  };

  return (
    <div>
      <AdminPageHeader title="Reviews" description="Moderate reader submissions and manage testimonials" />

      <nav className={styles.tabs} aria-label="Review status tabs">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/admin/reviews?status=${t.id}`}
            className={status === t.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            aria-current={status === t.id ? "page" : undefined}
          >
            {t.label}
            <span className={styles.badge}>{t.count}</span>
          </Link>
        ))}
      </nav>

      <AdminReviewsSearch status={status} defaultQuery={search || ""} />

      <section className={`${styles.card} ${styles.tableSection} mt-6`} aria-label="Reviews table">
        <div className={styles.tableToolbar}>
          <h2 className={styles.tableHeading}>All submissions</h2>
          <AdminAddReviewModal createAction={adminCreateManualReview} />
        </div>

        {rows.length === 0 ? (
          <div className={styles.empty}>
            <IconInbox className={styles.emptyIcon} />
            <p>{search ? "No reviews match your search." : EMPTY[status]}</p>
          </div>
        ) : (
          <div className={styles.tableScroll}>
            <table className={styles.dataTable}>
              <colgroup>
                <col className={styles.colName} />
                <col className={styles.colEmail} />
                <col className={styles.colRating} />
                <col className={styles.colLocation} />
                <col className={styles.colMessage} />
                <col className={styles.colStatus} />
                <col className={styles.colDate} />
                <col className={styles.colActions} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Rating</th>
                  <th scope="col">Location</th>
                  <th scope="col">Message</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <AdminReviewTableRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {total > 0 ? (
        <nav className={styles.pagination} aria-label="Review list pagination">
          <p className={styles.paginationMeta}>
            Showing {from}–{to} of {total}
          </p>
          <div className={styles.paginationNav}>
            <Link
              href={pageLink(Math.max(1, safePage - 1))}
              className={safePage <= 1 ? styles.pageLinkDisabled : styles.pageLink}
              aria-disabled={safePage <= 1}
              tabIndex={safePage <= 1 ? -1 : undefined}
            >
              Previous
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={pageLink(p)}
                className={p === safePage ? styles.pageLinkActive : styles.pageLink}
                aria-current={p === safePage ? "page" : undefined}
              >
                {p}
              </Link>
            ))}
            <Link
              href={pageLink(Math.min(totalPages, safePage + 1))}
              className={safePage >= totalPages ? styles.pageLinkDisabled : styles.pageLink}
              aria-disabled={safePage >= totalPages}
              tabIndex={safePage >= totalPages ? -1 : undefined}
            >
              Next
            </Link>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
