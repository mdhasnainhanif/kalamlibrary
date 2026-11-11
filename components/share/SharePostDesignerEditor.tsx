"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Loader2,
  MessageCircle,
  Minus,
  Palette,
  Plus,
  RectangleVertical,
  RotateCcw,
  Type,
} from "lucide-react";
import {
  POST_THEME_PRESETS,
  getPostThemePreset,
  type PostAspectRatio,
  type PostTheme,
} from "@/utils/postTheme";

type DesignerTab = "colours" | "size" | "text";

type Props = {
  theme: PostTheme;
  onChange: (next: PostTheme) => void;
  onReset: () => void;
  imageBusy: boolean;
  stanzaCount: number;
  onWhatsApp: () => void;
  onSaveImage: () => void;
  onCopyText: () => void;
  copyDone: boolean;
};

/** Diagonal split: theme base (top-left) + accent (bottom-right), like the design mock. */
function swatchDiagonalSplit(presetId: string, t: PostTheme): string {
  const base = t.background.type === "solid" ? t.background.solidColor : t.background.gradientFrom;
  let accent: string;
  if (presetId === "soft-rose") {
    accent = t.colors.poet;
  } else if (presetId === "pure-white") {
    accent = "#c9a227";
  } else {
    const brand = t.colors.brandLabel;
    if (typeof brand === "string" && brand.startsWith("#")) {
      accent = brand;
    } else if (typeof t.colors.title === "string" && t.colors.title.startsWith("#")) {
      accent = t.colors.title;
    } else {
      accent = "#d4af37";
    }
  }
  return `linear-gradient(135deg, ${base} 0%, ${base} 50%, ${accent} 50%, ${accent} 100%)`;
}

const PRESET_SWATCH_LABEL: Record<string, string> = {
  "emerald-green": "Emerald",
  "royal-gold": "Royal Gold",
  "midnight-blue": "Midnight",
  "maroon": "Maroon",
  "pure-white": "Ivory",
  "black-gold": "Black & Gold",
  "forest-night": "Forest",
  "soft-rose": "Soft Rose",
};

function sizeOutlineRatio(id: PostAspectRatio): number {
  if (id === "square") return 1;
  if (id === "portrait") return 5 / 4;
  return 16 / 9;
}

const SIZE_LABELS: Record<PostAspectRatio, string> = {
  square: "Square",
  portrait: "Portrait",
  story: "Story",
};

export default function SharePostDesignerEditor({
  theme,
  onChange,
  onReset,
  imageBusy,
  stanzaCount,
  onWhatsApp,
  onSaveImage,
  onCopyText,
  copyDone,
}: Props) {
  const [tab, setTab] = useState<DesignerTab>("colours");

  const patchTypo = (partial: Partial<PostTheme["typography"]>) =>
    onChange({ ...theme, presetId: null, typography: { ...theme.typography, ...partial } });
  const patchLayout = (partial: Partial<PostTheme["layout"]>) =>
    onChange({ ...theme, presetId: null, layout: { ...theme.layout, ...partial } });
  const patchVis = (partial: Partial<PostTheme["visibility"]>) =>
    onChange({ ...theme, presetId: null, visibility: { ...theme.visibility, ...partial } });

  const selectedPreset = POST_THEME_PRESETS.find((p) => p.id === theme.presetId);
  const themeLabel = theme.presetId
    ? (PRESET_SWATCH_LABEL[theme.presetId] ?? selectedPreset?.label ?? "Custom")
    : "Custom";

  const tabs: { id: DesignerTab; label: string; Icon: typeof Palette }[] = [
    { id: "colours", label: "Colours", Icon: Palette },
    { id: "size", label: "Size", Icon: RectangleVertical },
    { id: "text", label: "Text", Icon: Type },
  ];

  const fs = theme.typography.fontSize;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        role="tablist"
        aria-label="Design sections"
        className="grid grid-cols-3 gap-1 rounded-xl bg-[var(--muted)] p-1"
      >
        {tabs.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              id={`share-tab-${id}`}
              aria-controls={`share-panel-${id}`}
              onClick={() => setTab(id)}
              className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                active
                  ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
        {tab === "colours" ? (
          <div
            role="tabpanel"
            id="share-panel-colours"
            aria-labelledby="share-tab-colours"
            className="space-y-3"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Colour theme ·{" "}
              <span className="normal-case tracking-normal text-[var(--foreground)]">{themeLabel}</span>
            </p>
            <div className="grid grid-cols-4 gap-x-2 gap-y-3 sm:grid-cols-4">
              {POST_THEME_PRESETS.map((p) => {
                const active = theme.presetId === p.id;
                const shortLabel = PRESET_SWATCH_LABEL[p.id] ?? p.label;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={active}
                    aria-label={`${shortLabel} theme`}
                    onClick={() => {
                      const next = getPostThemePreset(p.id);
                      if (next) onChange(next);
                    }}
                    className="group flex w-full min-w-0 cursor-pointer flex-col items-center gap-1.5 active:scale-[0.97]"
                  >
                    <span
                      className={`relative box-border flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-[var(--background)] transition-[transform,border-color] ${
                        active ? "border-[var(--primary)]" : "border-[var(--border)]"
                      }`}
                    >
                      <span
                        className="absolute inset-[2px] rounded-[10px]"
                        style={{ background: swatchDiagonalSplit(p.id, p.theme) }}
                        aria-hidden
                      />
                      {active ? (
                        <span
                          className="relative z-[1] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                          aria-hidden
                        >
                          <Check className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={`w-full px-0.5 text-center text-[10px] leading-tight [overflow-wrap:anywhere] ${
                        active
                          ? "font-semibold text-[var(--foreground)]"
                          : "font-normal text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                      }`}
                    >
                      {shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {tab === "size" ? (
          <div role="tabpanel" id="share-panel-size" aria-labelledby="share-tab-size" className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
              Post size
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["square", "portrait", "story"] as const).map((id) => {
                const active = theme.layout.aspectRatio === id;
                const ratio = sizeOutlineRatio(id);
                const oh = 22 * ratio;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => patchLayout({ aspectRatio: id })}
                    className={`flex h-full min-h-[5.25rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 px-2 py-3 transition-colors ${
                      active
                        ? "border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--foreground)]"
                        : "border-[color-mix(in_srgb,var(--border)_35%,transparent)] text-[var(--muted-foreground)] hover:border-[var(--border)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    <span
                      className="flex h-11 w-full items-center justify-center"
                      aria-hidden
                    >
                      <span
                        className={`block w-[22px] shrink-0 rounded-sm border-2 ${
                          active ? "border-[var(--primary)]" : "border-[var(--border)]"
                        }`}
                        style={{ height: oh }}
                      />
                    </span>
                    <span className="text-center text-[11px] font-medium leading-tight">
                      {SIZE_LABELS[id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {tab === "text" ? (
          <div role="tabpanel" id="share-panel-text" aria-labelledby="share-tab-text" className="space-y-4">
            <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
              Text size
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease text size"
                disabled={fs <= 11}
                onClick={() => patchTypo({ fontSize: Math.max(11, fs - 1) })}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] disabled:opacity-40"
              >
                <Minus className="h-4 w-4" aria-hidden />
              </button>
              <input
                type="range"
                min={11}
                max={26}
                value={fs}
                onChange={(e) => patchTypo({ fontSize: parseInt(e.target.value, 10) })}
                className="h-2 min-w-0 flex-1 cursor-pointer accent-[var(--primary)]"
                aria-label="Text size"
              />
              <button
                type="button"
                aria-label="Increase text size"
                disabled={fs >= 26}
                onClick={() => patchTypo({ fontSize: Math.min(26, fs + 1) })}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] disabled:opacity-40"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </button>
              <span className="w-7 shrink-0 text-right text-sm tabular-nums text-[var(--foreground)]">{fs}</span>
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-3">
              <span className="text-sm text-[var(--foreground)]">Show poet name</span>
              <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={theme.visibility.poetName}
                  onChange={(e) => patchVis({ poetName: e.target.checked })}
                />
                <span
                  className="absolute inset-0 rounded-full bg-[var(--muted)] transition-colors peer-checked:bg-[var(--primary)]"
                  aria-hidden
                />
                <span
                  className="absolute start-0.5 h-5 w-5 rounded-full bg-[var(--background)] shadow transition-transform peer-checked:translate-x-5"
                  aria-hidden
                />
              </span>
            </label>

            <button
              type="button"
              onClick={onReset}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Reset design
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-3 shrink-0 space-y-2 border-t border-[var(--border)] bg-[var(--background)] pt-3 max-md:shadow-[0_-8px_24px_color-mix(in_srgb,var(--background)_85%,transparent)]">
        <button
          type="button"
          disabled={imageBusy || stanzaCount === 0}
          onClick={onWhatsApp}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-base font-semibold text-[var(--primary-foreground)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {imageBusy ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <MessageCircle className="h-5 w-5" aria-hidden />
          )}
          Share on WhatsApp
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={imageBusy || stanzaCount === 0}
            onClick={onSaveImage}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm font-medium text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {imageBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}
            Save image
          </button>
          <button
            type="button"
            onClick={onCopyText}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm font-medium text-[var(--foreground)]"
          >
            <Copy className="h-4 w-4" aria-hidden />
            {copyDone ? "Copied" : "Copy text"}
          </button>
        </div>
      </div>
    </div>
  );
}
