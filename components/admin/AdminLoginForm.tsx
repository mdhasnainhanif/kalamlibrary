"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import styles from "@/app/admin/admin.module.css";
import { IconEye, IconEyeOff, IconLock, IconMail } from "@/components/admin/AdminIcons";

type Props = { action: (formData: FormData) => void | Promise<void> };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${styles.btnPrimary} ${styles.btnBlock}`}>
      {pending ? (
        <>
          <span className={styles.spinner} aria-hidden />
          Signing in…
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

export default function AdminLoginForm({ action }: Props) {
  const [show, setShow] = useState(false);

  return (
    <form action={action}>
      <div className="space-y-4">
        <div>
          <label htmlFor="admin-email" className={styles.label}>
            Email
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <IconMail />
            </span>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoComplete="username"
              placeholder="you@example.com"
              className={styles.input}
            />
          </div>
        </div>
        <div>
          <label htmlFor="admin-password" className={styles.label}>
            Password
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <IconLock />
            </span>
            <input
              id="admin-password"
              name="password"
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className={styles.input}
              style={{ paddingRight: "2.75rem" }}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((v) => !v)}
            >
              {show ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>
        <SubmitButton />
      </div>
    </form>
  );
}
