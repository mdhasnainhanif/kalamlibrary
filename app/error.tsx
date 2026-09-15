"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log client error safely
    console.error("Application error encountered:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Warning Icon Container */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-inner">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 font-serif">
          Something Went Wrong
        </h1>

        <p className="text-sm sm:text-base text-emerald-200/70 mb-8 leading-relaxed">
          An unexpected error occurred while loading this page. You can try refreshing the view or return to our homepage.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 hover:text-white font-medium text-sm transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
