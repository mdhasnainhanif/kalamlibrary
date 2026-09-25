"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type KalamLangTabLinkProps = ComponentProps<typeof Link>;

const SCROLL_FLAG = "kalam-lang-tab-switch";

export default function KalamLangTabLink({ onClick, ...props }: KalamLangTabLinkProps) {
  return (
    <Link
      scroll={false}
      {...props}
      onClick={(e) => {
        try {
          sessionStorage.setItem(SCROLL_FLAG, "1");
        } catch {
          /* ignore */
        }
        onClick?.(e);
      }}
    />
  );
}
