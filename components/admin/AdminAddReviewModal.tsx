"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "@/app/admin/admin.module.css";

type Props = {
  createAction: (formData: FormData) => void | Promise<void>;
};

export default function AdminAddReviewModal({ createAction }: Props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("input, textarea, select, button")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" className={styles.btnPrimary} onClick={() => setOpen(true)}>
        Add testimonial
      </button>

      {open ? (
        <div className={styles.modalRoot} role="presentation">
          <button type="button" className={styles.modalBackdrop} aria-label="Close dialog" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            className={styles.modalPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <header className={styles.modalHeader}>
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-[var(--admin-text)]">
                  Add testimonial
                </h2>
                <p className={styles.pageDesc}>Saved as approved (WhatsApp, phone, etc.).</p>
              </div>
              <button type="button" className={`${styles.menuBtn} ${styles.modalClose}`} onClick={() => setOpen(false)}>
                <span aria-hidden>×</span>
                <span className="sr-only">Close</span>
              </button>
            </header>

            <form action={createAction} className={styles.modalForm}>
              <div className={styles.modalFormGrid}>
                <label className={styles.label} htmlFor="add-name">
                  Name
                </label>
                <input
                  id="add-name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={60}
                  placeholder="Reader name"
                  autoComplete="name"
                  className={`${styles.input} ${styles.inputNoIcon}`}
                />

                <label className={styles.label} htmlFor="add-location">
                  City / country
                </label>
                <input
                  id="add-location"
                  name="city_or_country"
                  maxLength={80}
                  placeholder="Karachi, Pakistan"
                  className={`${styles.input} ${styles.inputNoIcon}`}
                />

                <label className={styles.label} htmlFor="add-rating">
                  Rating
                </label>
                <select id="add-rating" name="rating" defaultValue="5" className={`${styles.input} ${styles.inputNoIcon}`}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>

                <label className={styles.label} htmlFor="add-source">
                  Source
                </label>
                <input
                  id="add-source"
                  name="source"
                  defaultValue="whatsapp"
                  placeholder="whatsapp"
                  className={`${styles.input} ${styles.inputNoIcon}`}
                />

                <label className={`${styles.label} ${styles.modalFullRow}`} htmlFor="add-message">
                  Message (10–600 characters)
                </label>
                <textarea
                  id="add-message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={600}
                  rows={5}
                  placeholder="What they said about the library…"
                  className={`${styles.input} ${styles.inputNoIcon} ${styles.modalFullRow}`}
                />
              </div>

              <footer className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save as approved
                </button>
              </footer>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
