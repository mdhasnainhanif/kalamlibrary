"use client";

import Script from "next/script";
import { ADSENSE_SCRIPT_SRC } from "@/utils/adsConfig";

export default function AdSenseScript() {
  return (
    <Script
      id="adsense-js"
      src={ADSENSE_SCRIPT_SRC}
      strategy="lazyOnload"
      crossOrigin="anonymous"
      onLoad={() => {
        window.dispatchEvent(new Event("adsense-script-loaded"));
      }}
    />
  );
}
