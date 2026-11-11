"use client";

import { getShareContactDefaults } from "@/utils/shareKalamPost";
import { normalizeSharePageUrl } from "@/utils/exportShareCard";
import {
  buildPostBackgroundStyle,
  getPostThemeCaptureBackground,
  POST_ARTBOARD_HEIGHT,
  POST_ARTBOARD_WIDTH,
  POST_ASPECT_CSS,
  postThemeFontClass,
  textAlignClass,
  withAlpha,
  type PostTheme,
} from "@/utils/postTheme";

export type SharePostCardProps = {
  title: string;
  author?: string;
  /** Each string is one couplet (lines joined with \n). */
  stanzas: string[];
  pageUrl: string;
  lang: string;
  dir: "ltr" | "rtl";
  design: PostTheme;
  exportId?: string;
  compact?: boolean;
  /** Live editor preview: full card width, scroll inside frame when lyrics overflow. */
  preview?: boolean;
  /** Fixed 420px artboard (export + scaled preview). */
  artboard?: boolean;
};

export default function SharePostCard({
  title,
  author,
  stanzas,
  pageUrl,
  lang,
  dir,
  design,
  exportId = "kalam-share-card",
  compact = false,
  preview = false,
  artboard = false,
}: SharePostCardProps) {
  const isUrdu = lang === "urdu";
  const canonical = normalizeSharePageUrl(pageUrl);
  const displayUrl = canonical.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const contactPhone = getShareContactDefaults().whatsappDisplay;

  const fontClass = postThemeFontClass(design.typography.fontFamily, isUrdu);
  const align = textAlignClass(design.typography.textAlign);
  const fs = design.typography.fontSize;
  const titleSize = Math.round(fs * 1.15);
  const footerSize = Math.max(9, Math.round(fs * 0.72));
  const poetSize = Math.max(10, Math.round(fs * 0.78));

  const sherBg = withAlpha(design.sherCard.background, design.sherCard.opacity / 100);
  const rootBg = buildPostBackgroundStyle(design);
  const captureBg = getPostThemeCaptureBackground(design);
  const artboardHeight = POST_ARTBOARD_HEIGHT[design.layout.aspectRatio];

  return (
    <div
      id={exportId}
      data-share-capture-bg={captureBg}
      className={`relative mx-auto flex flex-col overflow-hidden border text-center ${align} ${
        artboard ? "w-[420px] shadow-none" : preview ? "w-full max-w-[28rem] shadow-lg" : "w-full max-w-md shadow-lg"
      }`}
      style={{
        ...rootBg,
        ...(artboard
          ? { width: POST_ARTBOARD_WIDTH, height: artboardHeight, flexShrink: 0 }
          : { aspectRatio: POST_ASPECT_CSS[design.layout.aspectRatio] }),
        borderColor: design.colors.border,
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      {design.background.pattern === "dot-grid" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-dot-grid opacity-[0.08]"
        />
      ) : null}

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: design.colors.brandLabel }}
              aria-hidden
            />
            <span
              className="font-sans text-[9px] font-bold uppercase tracking-[0.18em] sm:text-[10px]"
              style={{ color: design.colors.brandLabel }}
            >
              Kalam Library
            </span>
          </div>
          <span
            className="font-sans text-[9px] font-medium sm:text-[10px]"
            style={{ color: design.colors.siteHost }}
          >
            kalamlibrary.me
          </span>
        </div>

        <h3
          lang={isUrdu ? "ur" : undefined}
          dir={isUrdu ? "rtl" : dir}
          className={`shrink-0 ${fontClass} font-bold leading-snug ${align}`}
          style={{ color: design.colors.title, fontSize: titleSize }}
        >
          {title}
        </h3>
        {design.visibility.poetName && author ? (
          <p
            className={`mt-1 font-sans ${align}`}
            style={{ color: design.colors.poet, fontSize: poetSize }}
          >
            {author}
          </p>
        ) : null}

        <div
          className="mx-auto my-2 h-px w-10 shrink-0"
          style={{ backgroundColor: design.colors.divider }}
          aria-hidden
        />

        <div
          className={`flex min-h-0 flex-1 flex-col overflow-hidden ${
            preview ? "justify-start" : "justify-center"
          }`}
        >
          {stanzas.length > 0 ? (
            <div
              lang={isUrdu ? "ur" : undefined}
              dir={dir}
              className={`share-post-lyrics mx-auto w-full space-y-2 ${fontClass} ${align} ${
                compact ? "leading-[1.75]" : "leading-[1.78] sm:leading-[1.85]"
              }`}
              style={{ color: design.colors.sher, fontSize: fs }}
            >
              {stanzas.map((block, i) => (
                <div
                  key={i}
                  className="whitespace-pre-wrap break-words border px-3 py-2.5 sm:px-3.5 sm:py-3"
                  style={{
                    backgroundColor: sherBg,
                    borderColor: design.sherCard.border,
                    borderRadius: design.sherCard.radius,
                  }}
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
            <p className="py-4 font-sans text-xs" style={{ color: design.colors.footer }}>
              Tap couplets above to add them to this post
            </p>
          )}
        </div>

        {(design.visibility.websiteLink || design.visibility.contactNumber) && (
          <div
            className={`mt-3 shrink-0 space-y-1 font-sans leading-relaxed ${align}`}
            style={{ fontSize: footerSize }}
          >
            {design.visibility.websiteLink ? (
              <>
                <p style={{ color: design.colors.footer }}>Read full naat on Kalam Library</p>
                <p className="break-all" style={{ color: design.colors.footerUrl }}>
                  {displayUrl}
                </p>
              </>
            ) : null}
            {design.visibility.contactNumber ? (
              <p className={design.visibility.websiteLink ? "pt-1" : ""} style={{ color: design.colors.footer }}>
                Contact me:{" "}
                <span style={{ color: design.colors.footerPhone }}>{contactPhone}</span>
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
