"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function isKalamInnerPage(pathname: string): boolean {
  return /^\/kalam\/[^/]+(\/[^/]+)?$/.test(pathname);
}

/** True while #main-content has aria-busy (kalam loading) or kalam route is mid-navigation. */
export function useMainContentBusy(): boolean {
  const pathname = usePathname();
  const [busy, setBusy] = useState(() => isKalamInnerPage(pathname));

  useEffect(() => {
    const read = () => {
      const onKalam = isKalamInnerPage(pathname);
      const main = document.getElementById("main-content");
      if (!main) {
        setBusy(onKalam);
        return;
      }
      setBusy(main.getAttribute("aria-busy") === "true");
    };

    setBusy(isKalamInnerPage(pathname));
    read();

    const obs = new MutationObserver(read);
    const main = document.getElementById("main-content");
    if (main) {
      obs.observe(main, { attributes: true, attributeFilter: ["aria-busy"] });
    }

    const raf = requestAnimationFrame(read);

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [pathname]);

  return busy;
}
