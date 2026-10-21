"use client";

import dynamic from "next/dynamic";

const UrduFontLoader = dynamic(() => import("@/components/UrduFontLoader"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/CookieConsent"), { ssr: false });
const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"), { ssr: false });
const AppToaster = dynamic(() => import("@/components/AppToaster"), { ssr: false });
const AdSenseScript = dynamic(() => import("@/components/AdSenseScript"), { ssr: false });

/** Non-critical UI: separate chunks, not in the first hydration bundle. */
export default function DeferredClientWidgets() {
  return (
    <>
      <UrduFontLoader />
      <AdSenseScript />
      <ThemeToggle />
      <AppToaster />
      <CookieConsent />
    </>
  );
}
