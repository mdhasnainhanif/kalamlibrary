import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { adminLogoutAction } from "@/app/admin/actions";
import { getAdminSessionUser, isAllowlistedAdmin } from "@/utils/adminAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminSignOutButton from "@/components/admin/AdminSignOutButton";
import AppToaster from "@/components/AppToaster";
import styles from "@/app/admin/admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const user = await getAdminSessionUser();
  if (!user) redirect("/admin/login");
  if (!isAllowlistedAdmin(user.email)) {
    return (
      <main className={styles.main}>
        <div className={`${styles.card} ${styles.cardPad} text-center`}>
          <h1 className={styles.pageTitle}>403 — Not authorized</h1>
          <p className={styles.pageDesc}>This account is not authorized for admin access.</p>
          <Link href="/admin/login" className={`${styles.btnSecondary} mt-4 inline-flex`}>
            Back to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className={styles.shell}>
      <AdminSidebar email={user.email ?? ""} />
      <div className={styles.contentColumn}>
        <AdminTopBar
          email={user.email ?? ""}
          signOutForm={<AdminSignOutButton logoutAction={adminLogoutAction} variant="menu" />}
        />
        <main id="main-content" className={styles.main}>
          {children}
        </main>
      </div>
      <AppToaster />
    </div>
  );
}
