"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import KalamLibraryWordmark from "@/components/KalamLibraryWordmark";
import styles from "@/app/admin/admin.module.css";
import { IconDashboard, IconExternal, IconMenu, IconReviews } from "@/components/admin/AdminIcons";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: IconDashboard, exact: true },
  { href: "/admin/reviews", label: "Reviews", icon: IconReviews, exact: false },
] as const;

type Props = {
  email: string;
};

export default function AdminSidebar({ email }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href) ?? false;
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const toggleMobile = () => setMobileOpen((v) => !v);

  const nav = (
    <nav className={styles.sideNav} aria-label="Admin">
      {NAV.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            aria-current={active ? "page" : undefined}
            title={item.label}
            onClick={() => setMobileOpen(false)}
          >
            <Icon />
            <span className={styles.navLinkText}>{item.label}</span>
          </Link>
        );
      })}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.navLink}
        title="View site"
        onClick={() => setMobileOpen(false)}
      >
        <IconExternal />
        <span className={styles.navLinkText}>View site</span>
      </a>
    </nav>
  );

  const sidebarClass = [
    styles.sidebar,
    mobileOpen ? styles.sidebarOpen : "",
    desktopCollapsed ? styles.sidebarCollapsed : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={styles.mobileBar}>
        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={mobileOpen}
          aria-controls="admin-sidebar"
          onClick={toggleMobile}
        >
          <IconMenu />
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
        </button>
        <Link href="/admin" className={styles.brand} onClick={() => setMobileOpen(false)}>
          <KalamLibraryWordmark className="text-lg" />
          <span className={styles.brandLabel}>Admin</span>
        </Link>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          className={styles.sidebarBackdrop}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside id="admin-sidebar" className={sidebarClass} aria-label="Admin sidebar">
        <div className={styles.sidebarBrand}>
          <Link
            href="/admin"
            className={`${styles.brand} ${styles.brandStack} ${styles.sidebarBrandLink}`}
            onClick={() => setMobileOpen(false)}
          >
            <KalamLibraryWordmark className="text-xl" />
            <span className={styles.brandLabel}>Admin</span>
          </Link>
          <button
            type="button"
            className={`${styles.menuBtn} ${styles.sidebarToggle}`}
            aria-expanded={!desktopCollapsed}
            aria-controls="admin-sidebar"
            onClick={() => {
              if (isDesktop) {
                setDesktopCollapsed((v) => !v);
              } else {
                toggleMobile();
              }
            }}
          >
            <IconMenu />
            <span className="sr-only">
              {isDesktop ? (desktopCollapsed ? "Open sidebar" : "Close sidebar") : mobileOpen ? "Close menu" : "Open menu"}
            </span>
          </button>
        </div>

        {nav}

        <div className={styles.sidebarFooter}>
          <span className={styles.userChipSidebar} title={email}>
            {email}
          </span>
        </div>
      </aside>
    </>
  );
}
