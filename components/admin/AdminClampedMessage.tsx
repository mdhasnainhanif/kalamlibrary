"use client";

import { useId, useState } from "react";
import styles from "@/app/admin/admin.module.css";

type Props = { text: string; lines?: number };

export default function AdminClampedMessage({ text, lines = 4 }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const long = text.length > 220 || text.split("\n").length > lines;

  return (
  <div>
    <p
      id={id}
      className={open ? "mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-text)]" : "mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-text)]"}
      style={!open && lines !== 4 ? { WebkitLineClamp: lines } : undefined}
    >
      {text}
    </p>
    {long ? (
      <button type="button" className={`${styles.btnGhost} ${styles.btnSm} mt-2`} aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        {open ? "Show less" : "Show more"}
      </button>
    ) : null}
  </div>
  );
}
