import AdminPageHeader from "@/components/admin/AdminPageHeader";
import styles from "@/app/admin/admin.module.css";

export default function AdminReviewsLoading() {
  return (
    <div>
      <AdminPageHeader title="Reviews" description="Loading submissions…" />
      <div className={`${styles.card} ${styles.tableSection} mt-6`} aria-busy="true" aria-label="Loading reviews">
        <div className={styles.skeleton} style={{ minHeight: "12rem" }} />
      </div>
    </div>
  );
}
