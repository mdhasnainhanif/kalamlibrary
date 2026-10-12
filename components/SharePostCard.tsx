"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { normalizeSharePageUrl } from "@/utils/exportShareCard";
import { getShareContactDefaults } from "@/utils/shareKalamPost";
import {
  getSharePostSurface,
  resolveSharePostTheme,
  type SharePostTheme,
} from "@/utils/sharePostTheme";

export type SharePostCardProps = {
  title: string;
  author?: string;
  /** Each string is one couplet (lines joined with \n). */
  stanzas: string[];
  pageUrl: string;
  lang: string;
  dir: "ltr" | "rtl";
  exportId?: string;
  compact?: boolean;
};

export default function SharePostCard({
  title,
  author,
  stanzas,
  pageUrl,
  lang,
  dir,
  exportId = "kalam-share-card",
  compact = false,
}: SharePostCardProps) {
  const isUrdu = lang === "urdu";
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<SharePostTheme>(() => resolveSharePostTheme(null));

  useEffect(() => {
    setTheme(resolveSharePostTheme(resolvedTheme));
  }, [resolvedTheme]);

  const canonical = normalizeSharePageUrl(pageUrl);
  const displayUrl = canonical.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const contactPhone = getShareContactDefaults().whatsappDisplay;
  const surface = getSharePostSurface(theme);

  return (
    <div
      id={exportId}
      data-share-theme={theme}
      className={`relative overflow-hidden rounded-2xl border text-center shadow-lg ${surface.borderClass}`}
      style={surface.rootStyle}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-dot-grid ${surface.dotGridOpacity}`}
      />

      <div className="relative z-[1] px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${surface.brandDot}`} aria-hidden />
            <span
              className={`text-[9px] font-bold uppercase tracking-[0.18em] sm:text-[10px] ${surface.brandLabel}`}
            >
              Kalam Library
            </span>
          </div>
          <span className={`text-[9px] font-medium sm:text-[10px] ${surface.siteHost}`}>
            kalamlibrary.me
          </span>
        </div>

        <h3
          lang={isUrdu ? "ur" : undefined}
          dir={isUrdu ? "rtl" : "ltr"}
          className={
            isUrdu
              ? `font-urdu text-lg font-semibold leading-relaxed sm:text-xl ${surface.titleUrdu}`
              : `font-sans text-sm font-bold leading-snug sm:text-base ${surface.titleLatin}`
          }
        >
          {title}
        </h3>
        {author ? (
          <p className={`mt-1 font-sans text-[10px] sm:text-[11px] ${surface.author}`}>{author}</p>
        ) : null}

        <div className={`mx-auto my-3 h-px w-10 ${surface.divider}`} aria-hidden />

        {stanzas.length > 0 ? (
          <div
            lang={isUrdu ? "ur" : undefined}
            dir={dir}
            className={`share-post-lyrics mx-auto max-w-md space-y-2.5 ${
              isUrdu ? "font-urdu" : "font-sans"
            } ${surface.lyrics} ${
              compact ? "text-[13px] leading-[1.75]" : "text-[13px] leading-[1.78] sm:text-sm sm:leading-[1.85]"
            }`}
          >
            {stanzas.map((block, i) => (
              <div
                key={i}
                className={`whitespace-pre-wrap break-words rounded-xl border px-3 py-2.5 sm:px-3.5 sm:py-3 ${surface.stanzaBox}`}
              >
                {block.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-1.5" : ""}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className={`py-4 font-sans text-xs ${surface.emptyHint}`}>
            Tap couplets above to add them to this post
          </p>
        )}

        <div className="mt-4 space-y-1 font-sans text-[9px] leading-relaxed sm:text-[10px]">
          <p className={surface.footerLead}>Read full naat on Kalam Library</p>
          <p className={`break-all ${surface.footerUrl}`}>{displayUrl}</p>
          <p className={`pt-1 ${surface.footerContact}`}>
            Contact me: <span className={surface.footerPhone}>{contactPhone}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
