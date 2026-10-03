"use client";

import { useId } from "react";

type IslamicGoldenSeamlessPatternProps = {
  className?: string;
  /** Full viewport — even tile, soft vertical fade so text stays readable */
  fullPage?: boolean;
};

/**
 * Light-mode seamless golden arabesque (original SVG — inspired by classic Islamic lattice).
 */
export default function IslamicGoldenSeamlessPattern({
  className = "",
  fullPage = false,
}: IslamicGoldenSeamlessPatternProps) {
  const rawId = useId().replace(/:/g, "");
  const tileId = `gold-tile-${rawId}`;
  const gradId = `gold-grad-${rawId}`;

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
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8c872" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#c9a227" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#a67c00" stopOpacity="0.5" />
        </linearGradient>
        <pattern id={tileId} width="128" height="128" patternUnits="userSpaceOnUse">
          {/* Corner arabesque arcs — tessellate at tile edges */}
          <path
            d="M0 64 C32 32 32 32 64 0 M64 0 C96 32 96 32 128 64 M128 64 C96 96 96 96 64 128 M64 128 C32 96 32 96 0 64"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="0.55"
          />
          <path
            d="M16 64 C40 40 40 40 64 16 M64 16 C88 40 88 40 112 64 M112 64 C88 88 88 88 64 112 M64 112 C40 88 40 88 16 64"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="0.4"
          />
          {/* Eight-point star rosette */}
          <path
            d="M64 14 L74 50 L110 60 L74 70 L64 106 L54 70 L18 60 L54 50 Z"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="0.5"
          />
          <path
            d="M64 34 L64 90 M34 64 L94 64 M42 42 L86 86 M42 86 L86 42"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="0.35"
          />
          <circle cx="64" cy="64" r="8" fill="none" stroke={`url(#${gradId})`} strokeWidth="0.45" />
          <path
            d="M64 48 L70 64 L64 80 L58 64 Z"
            fill={`url(#${gradId})`}
            fillOpacity="0.12"
            stroke={`url(#${gradId})`}
            strokeWidth="0.3"
          />
          {/* Mid-edge linking motifs */}
          <circle cx="64" cy="0" r="2.5" fill={`url(#${gradId})`} fillOpacity="0.35" />
          <circle cx="128" cy="64" r="2.5" fill={`url(#${gradId})`} fillOpacity="0.35" />
          <circle cx="64" cy="128" r="2.5" fill={`url(#${gradId})`} fillOpacity="0.35" />
          <circle cx="0" cy="64" r="2.5" fill={`url(#${gradId})`} fillOpacity="0.35" />
          <path
            d="M0 0 L24 0 Q0 0 0 24 M128 0 L104 0 Q128 0 128 24 M128 128 L104 128 Q128 128 128 104 M0 128 L24 128 Q0 128 0 104"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="0.32"
          />
        </pattern>
        {fullPage ? (
          <>
            <linearGradient id={`${tileId}-fade-y`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.92" />
              <stop offset="35%" stopColor="white" stopOpacity="0.55" />
              <stop offset="100%" stopColor="white" stopOpacity="0.88" />
            </linearGradient>
            <mask id={`${tileId}-mask`}>
              <rect width="100%" height="100%" fill={`url(#${tileId}-fade-y)`} />
            </mask>
          </>
        ) : (
          <>
            <radialGradient id={`${tileId}-fade`} cx="50%" cy="45%" r="75%">
              <stop offset="0%" stopColor="white" stopOpacity="0.85" />
              <stop offset="100%" stopColor="white" stopOpacity="0.2" />
            </radialGradient>
            <mask id={`${tileId}-mask`}>
              <rect width="100%" height="100%" fill={`url(#${tileId}-fade)`} />
            </mask>
          </>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${tileId})`} mask={`url(#${tileId}-mask)`} />
    </svg>
  );
}
