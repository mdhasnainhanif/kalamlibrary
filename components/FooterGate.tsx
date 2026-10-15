"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useMainContentBusy } from "@/components/useMainContentBusy";

type FooterGateProps = {
  children: ReactNode;
};

function isKalamInnerPage(pathname: string): boolean {
  return /^\/kalam\/[^/]+(\/[^/]+)?$/.test(pathname);
}

/** Hide footer on kalam pages while lyrics are still loading. */
export default function FooterGate({ children }: FooterGateProps) {
  const pathname = usePathname();
  const busy = useMainContentBusy();

  if (isKalamInnerPage(pathname) && busy) {
    return null;
  }

  return children;
}
