"use client";

import Script from "next/script";
import { ADSENSE_SCRIPT_SRC } from "@/utils/adsConfig";

export default function AdSenseScript() {
  return (
    <Script
      id="adsbygoogle-js"
      src={ADSENSE_SCRIPT_SRC}
      strategy="afterInteractive"
      crossOrigin="anonymous"
      onLoad={() => {
        window.dispatchEvent(new Event("adsense-script-loaded"));
      }}
    />
  );
}
