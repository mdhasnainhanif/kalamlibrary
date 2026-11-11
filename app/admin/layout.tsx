import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: "#060d0b",
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className={styles.adminRoot}>{children}</div>;
}
