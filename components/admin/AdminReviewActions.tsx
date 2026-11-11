"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import {
  adminApproveReview,
  adminDeleteReview,
  adminEditReviewMessage,
  adminRejectReview,
  adminToggleFeatured,
} from "@/app/admin/actions";
import type { AdminReviewRow } from "@/utils/reviewsData";
import styles from "@/app/admin/admin.module.css";

const MESSAGE_MAX = 600;

type Props = {
  review: AdminReviewRow;
  compact?: boolean;
};

export default function AdminReviewActions({ review, compact = false }: Props) {
  const [message, setMessage] = useState(review.message);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const [floatPos, setFloatPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const updateFloatPos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const menuWidth = 176;
    setFloatPos({
      top: r.bottom + 6,
      left: Math.max(8, Math.min(r.right - menuWidth, window.innerWidth - menuWidth - 8)),
      width: Math.max(r.width, menuWidth),
    });
  }, []);

  async function run(label: string, fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
      toast.success(label);
      setConfirmDelete(false);
      setMenuOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t)) return;
      const menu = document.getElementById(menuId);
      if (menu?.contains(t)) return;
      const edit = document.querySelector(`[data-edit-review="${review.id}"]`);
      if (edit?.contains(t)) return;
      setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    if (!menuOpen && !expanded) {
      setFloatPos(null);
      return;
    }
    updateFloatPos();
  }, [menuOpen, expanded, updateFloatPos]);

  useEffect(() => {
    if (!menuOpen && !expanded) return;
    window.addEventListener("resize", updateFloatPos);
    window.addEventListener("scroll", updateFloatPos, true);
    return () => {
      window.removeEventListener("resize", updateFloatPos);
      window.removeEventListener("scroll", updateFloatPos, true);
    };
  }, [menuOpen, expanded, updateFloatPos]);

  if (compact) {
    return (
      <div className={styles.actionMenuWrap} ref={wrapRef}>
        <button
          ref={triggerRef}
          type="button"
          className={`${styles.btnSecondary} ${styles.btnSm} ${styles.actionMenuTrigger}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          disabled={busy}
          onClick={() => setMenuOpen((v) => !v)}
        >
          Actions
          <span className={styles.actionMenuCaret} aria-hidden>
            ▾
          </span>
        </button>

        {menuOpen && floatPos && typeof document !== "undefined"
          ? createPortal(
              <ActionMenu
                id={menuId}
                review={review}
                busy={busy}
                confirmDelete={confirmDelete}
                setConfirmDelete={setConfirmDelete}
                setMenuOpen={setMenuOpen}
                setExpanded={setExpanded}
                run={run}
                floatStyle={{
                  position: "fixed",
                  top: floatPos.top,
                  left: floatPos.left,
                  minWidth: floatPos.width,
                  zIndex: 10000,
                }}
              />,
              document.body,
            )
          : null}

        {expanded && floatPos && typeof document !== "undefined"
          ? createPortal(
              <EditPanel
                reviewId={review.id}
                message={message}
                setMessage={setMessage}
                note={note}
                setNote={setNote}
                busy={busy}
                run={run}
                onClose={() => setExpanded(false)}
                floatStyle={{
                  position: "fixed",
                  top: floatPos.top,
                  left: Math.max(8, floatPos.left - 40),
                  width: Math.min(288, window.innerWidth - 16),
                  zIndex: 10001,
                }}
              />,
              document.body,
            )
          : null}
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-[var(--admin-border)] pt-4">
      <div className="flex flex-wrap gap-2">
        {review.status === "pending" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => run("Review approved", () => adminApproveReview(review.id))}
            className={`${styles.btnSuccess} ${styles.btnSm}`}
          >
            Approve
          </button>
        ) : null}
        {review.status !== "rejected" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => run("Review rejected", () => adminRejectReview(review.id))}
            className={`${styles.btnSecondary} ${styles.btnSm}`}
          >
            Reject
          </button>
        ) : null}
        {!confirmDelete ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirmDelete(true)}
            className={`${styles.btnDanger} ${styles.btnSm}`}
          >
            Delete
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => run("Review deleted", () => adminDeleteReview(review.id))}
              className={`${styles.btnDanger} ${styles.btnSm}`}
            >
              Confirm delete
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirmDelete(false)}
              className={`${styles.btnGhost} ${styles.btnSm}`}
            >
              Cancel
            </button>
          </>
        )}
        {review.status === "approved" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              run(review.is_featured ? "Unfeatured" : "Marked featured", () =>
                adminToggleFeatured(review.id, !review.is_featured),
              )
            }
            className={`${styles.btnSecondary} ${styles.btnSm}`}
          >
            {review.is_featured ? "Unfeature" : "Mark featured"}
          </button>
        ) : null}
      </div>

      <button
        type="button"
        className={`${styles.btnGhost} ${styles.btnSm} mt-3`}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? "Hide edit" : "Edit"}
      </button>

      {expanded ? (
        <EditPanel
          reviewId={review.id}
          message={message}
          setMessage={setMessage}
          note={note}
          setNote={setNote}
          busy={busy}
          run={run}
          onClose={() => setExpanded(false)}
        />
      ) : null}
    </div>
  );
}

function ActionMenu({
  id,
  review,
  busy,
  confirmDelete,
  setConfirmDelete,
  setMenuOpen,
  setExpanded,
  run,
  floatStyle,
}: {
  id: string;
  review: AdminReviewRow;
  busy: boolean;
  confirmDelete: boolean;
  setConfirmDelete: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  setExpanded: (v: boolean) => void;
  run: (label: string, fn: () => Promise<void>) => Promise<void>;
  floatStyle?: CSSProperties;
}) {
  return (
    <div id={id} className={`${styles.adminPortal} ${styles.actionMenuPanel}`} role="menu" style={floatStyle}>
      {confirmDelete ? (
        <>
          <p className={styles.actionMenuHint} role="presentation">
            Delete this review permanently?
          </p>
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            className={`${styles.actionMenuItem} ${styles.actionMenuItemDanger}`}
            onClick={() => run("Review deleted", () => adminDeleteReview(review.id))}
          >
            Confirm delete
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            className={styles.actionMenuItem}
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          {review.status === "pending" ? (
            <button
              type="button"
              role="menuitem"
              disabled={busy}
              className={`${styles.actionMenuItem} ${styles.actionMenuItemSuccess}`}
              onClick={() => run("Review approved", () => adminApproveReview(review.id))}
            >
              Approve
            </button>
          ) : null}
          {review.status !== "rejected" ? (
            <button
              type="button"
              role="menuitem"
              disabled={busy}
              className={styles.actionMenuItem}
              onClick={() => run("Review rejected", () => adminRejectReview(review.id))}
            >
              Reject
            </button>
          ) : null}
          {review.status === "approved" ? (
            <button
              type="button"
              role="menuitem"
              disabled={busy}
              className={styles.actionMenuItem}
              onClick={() =>
                run(review.is_featured ? "Unfeatured" : "Marked featured", () =>
                  adminToggleFeatured(review.id, !review.is_featured),
                )
              }
            >
              {review.is_featured ? "Unfeature" : "Mark featured"}
            </button>
          ) : null}
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            className={styles.actionMenuItem}
            onClick={() => {
              setMenuOpen(false);
              setExpanded(true);
            }}
          >
            Edit message
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            className={`${styles.actionMenuItem} ${styles.actionMenuItemDanger}`}
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}

function EditPanel({
  reviewId,
  message,
  setMessage,
  note,
  setNote,
  busy,
  run,
  onClose,
  floatStyle,
}: {
  reviewId: string;
  message: string;
  setMessage: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  busy: boolean;
  run: (label: string, fn: () => Promise<void>) => Promise<void>;
  onClose: () => void;
  floatStyle?: CSSProperties;
}) {
  return (
    <div
      className={`${styles.adminPortal} ${styles.actionEditPanel}`}
      style={floatStyle}
      data-edit-review={reviewId}
    >
      <div className={styles.actionEditHead}>
        <span className={styles.label}>Edit message</span>
        <button type="button" className={`${styles.btnGhost} ${styles.btnSm}`} onClick={onClose}>
          Close
        </button>
      </div>
      <label className="sr-only" htmlFor={`msg-${reviewId}`}>
        Message
      </label>
      <textarea
        id={`msg-${reviewId}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        maxLength={MESSAGE_MAX}
        className={`${styles.input} ${styles.inputNoIcon}`}
      />
      <p className={styles.actionEditCount}>
        {message.length}/{MESSAGE_MAX}
      </p>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional admin note"
        className={`${styles.input} ${styles.inputNoIcon}`}
      />
      <button
        type="button"
        disabled={busy || message.trim().length < 10}
        onClick={() => run("Message saved", () => adminEditReviewMessage(reviewId, message, note))}
        className={`${styles.btnPrimary} ${styles.btnSm} ${styles.btnBlock}`}
      >
        Save changes
      </button>
    </div>
  );
}
