import { escapeReviewText } from "@/utils/reviewsContent";
import type { AdminReviewRow } from "@/utils/reviewsData";
import AdminReviewActions from "@/components/admin/AdminReviewActions";
import styles from "@/app/admin/admin.module.css";

function starString(rating: number) {
  const n = Math.max(1, Math.min(5, Math.round(rating)));
  return `${"★".repeat(n)}${"☆".repeat(5 - n)}`;
}

function statusClass(status: AdminReviewRow["status"]) {
  if (status === "pending") return styles.pillPending;
  if (status === "approved") return styles.pillApproved;
  return styles.pillRejected;
}

function statusLabel(status: AdminReviewRow["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function AdminReviewTableRow({ row }: { row: AdminReviewRow }) {
  const name = escapeReviewText(row.name);
  const message = escapeReviewText(row.message);
  const location = row.city_or_country ? escapeReviewText(row.city_or_country) : "—";

  return (
    <tr>
      <th scope="row" className={`${styles.tdName} ${styles.cellEllipsis}`} title={name}>
        {name}
      </th>
      <td className={`${styles.tdEmail} ${styles.cellEllipsis}`} title={row.email ?? undefined}>
        {row.email ? escapeReviewText(row.email) : "—"}
      </td>
      <td className={styles.tdStars}>
        <span className={styles.stars} aria-label={`${row.rating} out of 5`}>
          {starString(row.rating)}
        </span>
      </td>
      <td className={`${styles.tdLocation} ${styles.cellEllipsis}`} title={location !== "—" ? location : undefined}>
        {location}
      </td>
      <td className={styles.tdMessage}>
        <p className={styles.tdMessageClamp} title={message}>
          {message}
        </p>
        {row.admin_note ? (
          <p className={styles.tdNote} title={escapeReviewText(row.admin_note)}>
            {escapeReviewText(row.admin_note)}
          </p>
        ) : null}
      </td>
      <td
        className={styles.tdStatus}
        title={[
          row.source ? `Source: ${escapeReviewText(row.source)}` : "",
          row.is_featured ? "Featured" : "",
          row.is_sample ? "Sample" : "",
          row.admin_note ? "Edited" : "",
        ]
          .filter(Boolean)
          .join(" · ")}
      >
        <div className={styles.badgeRowTable}>
          <span className={`${statusClass(row.status)} ${styles.statusPill}`}>{statusLabel(row.status)}</span>
        </div>
      </td>
      <td className={styles.tdDate}>
        <time dateTime={row.created_at}>
          {new Date(row.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
        </time>
      </td>
      <td className={styles.tdActions}>
        <AdminReviewActions review={row} compact />
      </td>
    </tr>
  );
}
