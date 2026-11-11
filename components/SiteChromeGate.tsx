"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type Props = {
  children: ReactNode;
};

/** Hides public site chrome (navbar, ads, footer widgets) on /admin. */
export default function SiteChromeGate({ children }: Props) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return children;
}
