"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; "expired-callback"?: () => void }) => string;
      remove: (id: string) => void;
    };
  }
}

const fieldClass =
  "w-full rounded-xl border border-emerald-500/25 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm placeholder:text-gray-400 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/25 dark:border-emerald-500/20 dark:bg-emerald-950/50 dark:text-gray-100 dark:placeholder:text-gray-500";

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 600;

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const messageRemaining = MESSAGE_MAX - message.length;

  const mountTurnstile = useCallback(() => {
    if (!siteKey || !turnstileRef.current || !window.turnstile) return;
    if (widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: siteKey,
      callback: (token: string) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(""),
    });
  }, [siteKey]);

  useEffect(() => {
    if (!siteKey) return;
    const existing = document.querySelector('script[data-turnstile="1"]');
    if (existing) {
      mountTurnstile();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = "1";
    script.onload = () => mountTurnstile();
    document.body.appendChild(script);
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [mountTurnstile, siteKey]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || undefined,
          city_or_country: city || undefined,
          message,
          rating,
          website,
          turnstileToken: turnstileToken || (siteKey ? undefined : "local-dev-skip"),
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        toast.error(data.error || "Could not submit review.");
        return;
      }
      setDone(true);
      toast.success("Thank you. Your review will appear after approval.");
      setName("");
      setEmail("");
      setCity("");
      setMessage("");
      setRating(5);
      setWebsite("");
    } catch {
      toast.error("Could not submit review.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div
        className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-50 to-white px-5 py-6 text-center shadow-sm dark:border-gold-500/20 dark:from-emerald-950/80 dark:to-emerald-900/40"
        role="status"
      >
        <p className="review-form-success-title font-display text-xl">Thank you</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Your review was received. It will appear here after a quick moderation check.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-4 cursor-pointer text-sm font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-300"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-emerald-500/20 bg-white/90 p-5 shadow-lg shadow-emerald-900/5 ring-1 ring-black/[0.03] dark:border-gold-500/15 dark:bg-emerald-950/50 dark:shadow-black/30 dark:ring-white/[0.04]"
    >
      <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        Fields marked <span className="text-red-500">*</span> are required. We read every submission before it goes live.
      </p>

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="review-website">Website</label>
        <input id="review-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div>
        <label htmlFor="review-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Your name <span className="text-gold-600 dark:text-gold-500">*</span>
        </label>
        <input
          id="review-name"
          required
          minLength={2}
          maxLength={60}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ayesha or Omar"
          className={fieldClass}
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Rating <span className="text-gold-600 dark:text-gold-500">*</span>
        </legend>
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">How would you rate your experience?</p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              className={`min-h-[44px] min-w-[52px] cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                rating === n
                  ? "border-gold-500 bg-gold-500/20 text-gold-800 shadow-sm shadow-gold-500/10 dark:text-gold-200"
                  : "border-emerald-500/20 text-gray-600 hover:border-gold-500/35 hover:bg-gold-500/5 dark:border-emerald-500/15 dark:text-gray-300"
              }`}
            >
              {n} ★
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="review-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Your message <span className="text-gold-600 dark:text-gold-500">*</span>
        </label>
        <textarea
          id="review-message"
          required
          minLength={MESSAGE_MIN}
          maxLength={MESSAGE_MAX}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What helped you on Kalam Library — search, translations, layout, or a favourite kalam?"
          className={`${fieldClass} resize-y`}
        />
        <div className="mt-1.5 flex justify-between gap-2 text-[11px] text-gray-500 dark:text-gray-400">
          <span>At least {MESSAGE_MIN} characters</span>
          <span aria-live="polite">{messageRemaining} left</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1">
        <div>
          <label htmlFor="review-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Email <span className="normal-case font-normal text-gray-400">(optional, never shown)</span>
          </label>
          <input
            id="review-email"
            type="email"
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="review-city" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            City or country <span className="normal-case font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id="review-city"
            maxLength={80}
            autoComplete="country-name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Lahore, Karachi, or UK"
            className={fieldClass}
          />
        </div>
      </div>

      {siteKey ? <div ref={turnstileRef} className="min-h-[65px]" /> : null}

      <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        Submissions are moderated before publishing. Optional email stays private. See our{" "}
        <a href="/privacy-policy#reader-reviews" className="font-medium text-emerald-700 underline underline-offset-2 dark:text-emerald-300">
          Privacy Policy
        </a>
        .
      </p>

      <Button type="submit" variant="filled" size="lg" fullWidth disabled={busy || message.trim().length < MESSAGE_MIN}>
        {busy ? "Sending…" : "Submit review"}
      </Button>
    </form>
  );
}
