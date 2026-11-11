"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "@/app/admin/admin.module.css";
import { IconExternal } from "@/components/admin/AdminIcons";

type Props = {
  email: string;
  signOutForm: ReactNode;
};

function initialFromEmail(email: string) {
  const ch = email.trim().charAt(0).toUpperCase();
  return ch || "?";
}

export default function AdminTopBar({ email, signOutForm }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={styles.topBar}>
      <p className={styles.topBarTitle}>Admin panel</p>

      <div className={styles.profileWrap} ref={wrapRef}>
        <button
          type="button"
          className={styles.profileTrigger}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={`Profile menu for ${email}`}
          title={email}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.profileAvatar} aria-hidden>
            {initialFromEmail(email)}
          </span>
        </button>

        {open ? (
          <div className={styles.profileMenu} role="menu">
            <p className={styles.profileMenuEmail}>{email}</p>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.profileMenuItem}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <IconExternal />
              View public site
            </a>
            <Link href="/admin" className={styles.profileMenuItem} role="menuitem" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            <div className={styles.profileMenuDivider} role="separator" />
            <div className={styles.profileMenuSignOut} role="none">
              {signOutForm}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
