import Link from "next/link";
import { adminLoginAction } from "@/app/admin/actions";
import KalamLibraryWordmark from "@/components/KalamLibraryWordmark";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import styles from "@/app/admin/admin.module.css";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const showError = Boolean(error);

  return (
    <main id="main-content" className={styles.loginPage}>
      <div className={`${styles.loginCard} ${styles.card} ${styles.cardPad}`}>
        <div className={styles.loginLogo}>
          <KalamLibraryWordmark className="text-2xl md:text-3xl" />
        </div>
        <h1 className={`${styles.pageTitle} text-center`}>Admin sign in</h1>
        <p className={`${styles.pageDesc} text-center`}>Authorized administrators only. Use your allowlisted account.</p>

        {showError ? (
          <p className={`${styles.alertError} mt-4`} role="alert">
            Sign-in failed. Check your email and password, or contact the site owner.
          </p>
        ) : null}

        <div className="mt-6">
          <AdminLoginForm action={adminLoginAction} />
        </div>

        <p className={styles.footerNote}>Authorized administrators only.</p>
        <p className="text-center text-xs text-[var(--admin-muted)]">
          <Link href="/" className={styles.linkMuted}>
            Back to public site
          </Link>
        </p>
      </div>
    </main>
  );
}
