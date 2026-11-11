"use client";

import { useRouter } from "next/navigation";
import { useRef, type FormEvent } from "react";
import styles from "@/app/admin/admin.module.css";
import { IconSearch } from "@/components/admin/AdminIcons";

type Props = {
  status: string;
  defaultQuery: string;
};

export default function AdminReviewsSearch({ status, defaultQuery }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams({ status, page: "1" });
    if (q) params.set("q", q);
    router.push(`/admin/reviews?${params.toString()}`);
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    router.push(`/admin/reviews?status=${status}`);
  }

  return (
    <form className={styles.searchRow} onSubmit={onSubmit}>
      <div className={styles.searchField}>
        <span className={styles.inputIcon}>
          <IconSearch />
        </span>
        <input
          ref={inputRef}
          name="q"
          defaultValue={defaultQuery}
          placeholder="Search by name, city or message"
          className={styles.input}
          autoComplete="off"
        />
        {defaultQuery ? (
          <button type="button" className={styles.searchClear} onClick={clear}>
            Clear
          </button>
        ) : null}
      </div>
      <button type="submit" className={styles.btnSecondary}>
        Search
      </button>
    </form>
  );
}
