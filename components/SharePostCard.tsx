"use client";

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
  const fontClass = postThemeFontClass(design.typography.fontFamily, isUrdu);
  const align = textAlignClass(design.typography.textAlign);
  const fs = design.typography.fontSize;
  const titleSize = Math.round(fs * 1.15);
  const poetSize = Math.max(10, Math.round(fs * 0.78));

  const sherBg = withAlpha(design.sherCard.background, design.sherCard.opacity / 100);
  const rootBg = buildPostBackgroundStyle(design);
  const captureBg = getPostThemeCaptureBackground(design);
  const artboardHeight = POST_ARTBOARD_HEIGHT[design.layout.aspectRatio];

  return (
    <div
      id={exportId}
      data-share-capture-bg={captureBg}
      className={`relative mx-auto flex flex-col overflow-hidden border text-center ${align} ${artboard ? "w-[420px] shadow-none" : preview ? "w-full max-w-[28rem] shadow-lg" : "w-full max-w-md shadow-lg"
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

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4 sm:px-5 sm:py-4">
        <div className="mb-2.5 flex shrink-0 items-center justify-between gap-2">
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

        {/* Main vertically centered content: Title + Poet + Divider + Shers */}
        <div className="my-auto flex min-h-0 flex-1 flex-col justify-center w-full">
          <div className="shrink-0 mb-2">
            <h3
              lang={isUrdu ? "ur" : undefined}
              dir={isUrdu ? "rtl" : dir}
              className={`${fontClass} font-bold leading-snug ${align}`}
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
              className="mx-auto my-1.5 h-px w-10 shrink-0"
              style={{ backgroundColor: design.colors.divider }}
              aria-hidden
            />
          </div>

            {stanzas.length > 0 ? (
              <div
                lang={isUrdu ? "ur" : undefined}
                dir={dir}
              className={`share-post-lyrics mx-auto w-full overflow-hidden ${stanzas.length >= 4
                    ? "space-y-1.5"
                    : stanzas.length === 3
                      ? "space-y-2"
                      : "space-y-2.5"
                  } ${fontClass} ${align} ${compact ? "leading-[1.75]" : "leading-[1.78] sm:leading-[1.85]"
                  }`}
                style={{ color: design.colors.sher, fontSize: fs }}
              >
                {stanzas.map((block, i) => (
                  <div
                    key={i}
                    className={`whitespace-pre-wrap break-words overflow-hidden border ${
                      stanzas.length >= 4
                        ? "px-3 py-1.5 sm:px-3 sm:py-2"
                        : stanzas.length === 3
                          ? "px-3.5 py-2.5 sm:px-4 sm:py-2.5"
                          : "px-3.5 py-3 sm:px-4 sm:py-3.5"
                    }`}
                    style={{
                      backgroundColor: sherBg,
                      borderColor: design.sherCard.border,
                      borderRadius: design.sherCard.radius,
                    }}
                  >
                {block.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-1" : ""}>
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

        {/* Simple elegant footer */}
          <div className="shrink-0 pt-2 text-center font-sans">
            <div className="flex items-center justify-center gap-2">
              <span
                className="h-px w-6 opacity-30"
                style={{ backgroundColor: design.colors.divider }}
                aria-hidden
              />
              <span
                className="text-[10px] font-medium tracking-[0.2em] uppercase opacity-75"
                style={{ color: design.colors.footer }}
              >
                kalamlibrary.me
              </span>
              <span
                className="h-px w-6 opacity-30"
                style={{ backgroundColor: design.colors.divider }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
      );
}
