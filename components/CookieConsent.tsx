"use client";

import Button from "@/components/ui/Button";

import Link from "next/link";
import { useEffect, useState } from "react";
import AnalyticsScripts from "@/components/AnalyticsScripts";

const STORAGE_KEY = "kl-cookie-consent";

type ConsentChoice = "accepted" | "essential";

function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  if (value === "accepted" || value === "essential") return value;
  return null;
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    if (stored !== null) return;

    const show = () => setShowBanner(true);
    let timeoutId = 0;

    const onReady = () => {
      timeoutId = window.setTimeout(show, 2000);
    };

    if (document.readyState === "complete") {
      onReady();
    } else {
      window.addEventListener("load", onReady, { once: true });
    }

    return () => {
      window.removeEventListener("load", onReady);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const save = (choice: ConsentChoice) => {
    localStorage.setItem(STORAGE_KEY, choice);
    setConsent(choice);
    setShowBanner(false);
  };

  return (
    <>
      {consent === "accepted" ? <AnalyticsScripts /> : null}

      {showBanner ? (
        <div
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
          className="fixed bottom-0 left-0 right-0 z-[120] border-t border-emerald-500/20 bg-emerald-950/95 p-4 shadow-2xl backdrop-blur-md md:p-5 dark:border-emerald-500/20"
        >
          <div className="container mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-left text-sm text-gray-300">
              <p id="cookie-consent-title" className="font-semibold text-gold-500">
                Cookies &amp; analytics
              </p>
              <p id="cookie-consent-desc" className="mt-1 leading-relaxed text-gray-400">
                We use essential storage for theme preference. Google AdSense loads from the page head to support the
                site. With your permission we also enable Google Analytics. See our{" "}
                <Link href="/privacy-policy" className="text-emerald-400 underline hover:text-gold-500">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => save("essential")}>
                Essential only
              </Button>
              <Button type="button" variant="filled" size="sm" onClick={() => save("accepted")}>
                Accept analytics
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
