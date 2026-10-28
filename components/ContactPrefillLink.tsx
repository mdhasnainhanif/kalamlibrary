"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { CONTACT_PREFILL_STORAGE_KEY } from "@/utils/contactPrefill";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  subject: string;
};

export default function ContactPrefillLink({ subject, onClick, ...rest }: Props) {
  return (
    <Link
      href="/contact"
      rel="nofollow"
      onClick={(e) => {
        try {
          sessionStorage.setItem(CONTACT_PREFILL_STORAGE_KEY, subject);
        } catch {
          /* private mode / quota */
        }
        onClick?.(e);
      }}
      {...rest}
    />
  );
}
