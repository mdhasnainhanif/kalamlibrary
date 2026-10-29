"use client";

import { forwardRef } from "react";
import { getShareContactDefaults } from "@/utils/shareKalamPost";
import {
  ASPECTS,
  buildCardBackgroundStyle,
  cardUsesDotGridPattern,
  getPresetById,
  type CardDesign,
} from "@/utils/shareCardDesign";
import {
  normalizeShareContentLang,
  sharePostChromeFontClass,
  sharePostHtmlLang,
  sharePostPoetryFontClass,
  sharePostSherLineHeight,
} from "@/utils/sharePostTypography";

export type ShareCardProps = {
  title: string;
  author?: string;
  /** Each entry is one couplet; lines within a couplet. */
  stanzas: string[][];
  lang: string;
  dir: "ltr" | "rtl";
  design: CardDesign;
  siteName?: string;
  siteUrl?: string;
  exportId?: string;
};

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  {
    title,
    author,
    stanzas,
    lang,
    dir,
    design,
    siteName = "Kalam Library",
    siteUrl = "kalamlibrary.me",
    exportId = "kalam-share-card",
  },
  ref
) {
  const preset = getPresetById(design.presetId);
  const contentLang = normalizeShareContentLang(lang);
  const htmlLang = sharePostHtmlLang(contentLang);
  const isRtl = dir === "rtl" || contentLang === "urdu";
  const poetryFont = sharePostPoetryFontClass(contentLang, "auto");
  const chromeFont = sharePostChromeFontClass();
  const fs = design.fontSize;
  const contact = getShareContactDefaults().whatsappDisplay;

  return (
    <div
      ref={ref}
      id={exportId}
      data-share-capture-bg={preset.bg2}
      className={chromeFont}
      style={{
        width: 420,
        aspectRatio: ASPECTS[design.aspect].css,
        ...buildCardBackgroundStyle(preset, design),
        color: preset.text,
        display: "flex",
        flexDirection: "column",
        padding: 26,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {cardUsesDotGridPattern(design) ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-dot-grid opacity-[0.12]"
        />
      ) : null}

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 10,
          border: `1px solid ${preset.border}`,
          borderRadius: 4,
          pointerEvents: "none",
        }}
      />

      <div
        className={chromeFont}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 700,
          position: "relative",
          zIndex: 1,
        }}
      >
        <span style={{ color: preset.accent }}>✦ {siteName}</span>
        <span style={{ color: preset.muted, letterSpacing: "0.05em", textTransform: "none", fontWeight: 500 }}>
          {siteUrl}
        </span>
      </div>

      <div style={{ textAlign: "center", marginTop: 18, position: "relative", zIndex: 1 }}>
        <div
          lang={htmlLang}
          dir={isRtl ? "rtl" : dir}
          className={poetryFont}
          style={{
            color: preset.title,
            fontSize: Math.round(fs * (contentLang === "urdu" ? 1.05 : 1.35)),
            fontWeight: 600,
            lineHeight: contentLang === "urdu" ? 2 : 1.2,
          }}
        >
          {title}
        </div>
        {design.showAuthor && author ? (
          <div
            lang={htmlLang}
            dir={isRtl ? "rtl" : dir}
            className={`${poetryFont} ${chromeFont}`}
            style={{ color: preset.muted, fontSize: 11, marginTop: 6, letterSpacing: "0.04em" }}
          >
            {author}
          </div>
        ) : null}
        <div
          style={{
            height: 1,
            width: 80,
            margin: "14px auto 0",
            background: `linear-gradient(90deg, transparent, ${preset.accent}, transparent)`,
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 10,
          marginTop: 14,
          position: "relative",
          zIndex: 1,
          minHeight: 0,
        }}
      >
        {stanzas.length === 0 ? (
          <div className={chromeFont} style={{ color: preset.muted, textAlign: "center", fontSize: 12 }}>
            No text selected
          </div>
        ) : (
          stanzas.map((lines, i) => (
            <div
              key={i}
              lang={htmlLang}
              dir={isRtl ? "rtl" : dir}
              className={`share-post-lyrics ${poetryFont} ${contentLang === "urdu" ? "share-post-lyrics--urdu" : ""}`}
              style={{
                background: preset.verseBg,
                border: `1px solid ${preset.border}`,
                borderRadius: 10,
                padding: contentLang === "urdu" ? "6px 14px" : "10px 14px",
                textAlign: "center",
                fontSize: fs,
                lineHeight: sharePostSherLineHeight(contentLang),
              }}
            >
              {lines.map((line, j) => (
                <div key={j}>{line}</div>
              ))}
            </div>
          ))
        )}
      </div>

      <div
        className={chromeFont}
        style={{
          textAlign: "center",
          marginTop: 14,
          fontSize: 9.5,
          color: preset.muted,
          lineHeight: 1.6,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ color: preset.accent, fontWeight: 600 }}>Read the full kalam at {siteUrl}</div>
        <div style={{ marginTop: 4 }}>Contact: {contact}</div>
      </div>
    </div>
  );
});
