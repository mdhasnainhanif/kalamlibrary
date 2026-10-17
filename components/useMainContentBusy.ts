"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MAIN_SLOT_ID = "app-main-slot";

function readMainBusy(): boolean {
  const main = document.getElementById("main-content");
  return main?.getAttribute("aria-busy") === "true";
}

/** True only while #main-content has aria-busy (kalam route loading UI). */
export function useMainContentBusy(): boolean {
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sync = () => setBusy(readMainBusy());

    sync();

    const slot = document.getElementById(MAIN_SLOT_ID);
    const obs = new MutationObserver(sync);
    if (slot) {
      obs.observe(slot, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["aria-busy"],
      });
    }

    // Catch Next.js swapping loading.tsx → page (new #main-content node).
    const timers = [0, 50, 150, 350, 700].map((ms) => window.setTimeout(sync, ms));

    return () => {
      obs.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return busy;
}
