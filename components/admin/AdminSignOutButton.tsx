"use client";

import styles from "@/app/admin/admin.module.css";

type Props = {
  logoutAction: (formData: FormData) => void | Promise<void>;
  variant?: "sidebar" | "menu";
};

export default function AdminSignOutButton({ logoutAction, variant = "sidebar" }: Props) {
  if (variant === "menu") {
    return (
      <form action={logoutAction} className={styles.profileSignOutForm}>
        <button type="submit" className={`${styles.profileMenuItem} ${styles.profileMenuItemDanger}`} role="menuitem">
          Sign out
        </button>
      </form>
    );
  }

  return (
    <form action={logoutAction} className={styles.sidebarSignOut}>
      <button type="submit" className={`${styles.btnSecondary} ${styles.btnSm} ${styles.btnBlock}`}>
        Sign out
      </button>
    </form>
  );
}
