"use client";

import { useId } from "react";

type HeroIslamicPatternProps = {
  className?: string;
  /** Even tile coverage for full-viewport backgrounds (no radial vignette). */
  fullPage?: boolean;
};

/**
 * Seamless eight-point star / arabesque tile for hero backgrounds.
 * Uses currentColor — wrap with text-gold-500/40 (dark) or text-amber-700/25 (light).
 */
export default function HeroIslamicPattern({ className = "", fullPage = false }: HeroIslamicPatternProps) {
  const rawId = useId().replace(/:/g, "");
  const tileId = `hero-tile-${rawId}`;

  return (
    <svg
      aria-hidden
      className={`pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={tileId} width="120" height="120" patternUnits="userSpaceOnUse">
          {/* Primary octagram */}
          <path
            d="M60 8 L72 48 L112 60 L72 72 L60 112 L48 72 L8 60 L48 48 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.65"
          />
          <path
            d="M60 28 L60 92 M28 60 L92 60 M36 36 L84 84 M36 84 L84 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.45"
          />
          <circle cx="60" cy="60" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path
            d="M60 42 L66 60 L60 78 L54 60 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
          />
          {/* Interlocking quarter tiles at corners (tessellation) */}
          <path
            d="M0 0 L30 0 L0 30 Z M120 0 L90 0 L120 30 Z M0 120 L30 120 L0 90 Z M120 120 L90 120 L120 90 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.35"
          />
          <path
            d="M0 60 Q30 30 60 0 M60 0 Q90 30 120 60 M120 60 Q90 90 60 120 M60 120 Q30 90 0 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
          />
        </pattern>
        {!fullPage ? (
          <>
            <radialGradient id={`${tileId}-fade`} cx="50%" cy="45%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0.15" />
            </radialGradient>
            <mask id={`${tileId}-mask`}>
              <rect width="100%" height="100%" fill={`url(#${tileId}-fade)`} />
            </mask>
          </>
        ) : (
          <>
            <linearGradient id={`${tileId}-fade-y`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="70%" stopColor="white" stopOpacity="0.95" />
              <stop offset="100%" stopColor="white" stopOpacity="0.55" />
            </linearGradient>
            <mask id={`${tileId}-mask`}>
              <rect width="100%" height="100%" fill={`url(#${tileId}-fade-y)`} />
            </mask>
          </>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${tileId})`} mask={`url(#${tileId}-mask)`} />
    </svg>
  );
}
