"use client";

import type { ReactNode } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import {
  DEFAULT_POST_THEME,
  GRADIENT_PRESETS,
  POST_THEME_PRESETS,
  getPostThemePreset,
  type GradientDirection,
  type PostAspectRatio,
  type PostFontFamily,
  type PostPattern,
  type PostTextAlign,
  type PostTheme,
} from "@/utils/postTheme";

type Props = {
  theme: PostTheme;
  onChange: (next: PostTheme) => void;
  onReset: () => void;
};

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-xs text-gray-600 dark:text-gray-400">
      <span className="min-w-0 truncate">{label}</span>
      <input
        type="color"
        value={value.startsWith("#") && value.length >= 7 ? value.slice(0, 7) : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-10 shrink-0 cursor-pointer rounded border border-emerald-500/20 bg-transparent p-0.5"
        aria-label={label}
      />
    </label>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2 border-b border-emerald-500/10 pb-3 last:border-0 last:pb-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400/90">
        {title}
      </p>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-xs text-gray-700 dark:text-gray-300">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-emerald-500/30 accent-emerald-600"
      />
    </label>
  );
}

export default function SharePostCustomizePanel({ theme, onChange, onReset }: Props) {
  const patchBg = (partial: Partial<PostTheme["background"]>) =>
    onChange({ ...theme, presetId: null, background: { ...theme.background, ...partial } });
  const patchColors = (partial: Partial<PostTheme["colors"]>) =>
    onChange({ ...theme, presetId: null, colors: { ...theme.colors, ...partial } });
  const patchSher = (partial: Partial<PostTheme["sherCard"]>) =>
    onChange({ ...theme, presetId: null, sherCard: { ...theme.sherCard, ...partial } });
  const patchTypo = (partial: Partial<PostTheme["typography"]>) =>
    onChange({ ...theme, presetId: null, typography: { ...theme.typography, ...partial } });
  const patchLayout = (partial: Partial<PostTheme["layout"]>) =>
    onChange({ ...theme, presetId: null, layout: { ...theme.layout, ...partial } });
  const patchVis = (partial: Partial<PostTheme["visibility"]>) =>
    onChange({ ...theme, presetId: null, visibility: { ...theme.visibility, ...partial } });

  return (
    <details className="group rounded-xl border border-emerald-500/15 bg-emerald-50/50 dark:bg-emerald-950/40">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold text-emerald-900 dark:text-emerald-100 [&::-webkit-details-marker]:hidden">
        <span>Customize design</span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
      </summary>

      <div className="max-h-[min(50vh,420px)] space-y-3 overflow-y-auto border-t border-emerald-500/10 px-3 py-3">
        <Section title="Theme presets">
          <div className="flex flex-wrap gap-1.5">
            {POST_THEME_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  const next = getPostThemePreset(p.id);
                  if (next) onChange(next);
                }}
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  theme.presetId === p.id
                    ? "bg-emerald-600 text-white"
                    : "bg-white/80 text-emerald-900 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-100 dark:hover:bg-emerald-800/60"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Post size">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["square", "Square 1:1"],
                ["portrait", "Portrait 4:5"],
                ["story", "Story 9:16"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => patchLayout({ aspectRatio: id as PostAspectRatio })}
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                  theme.layout.aspectRatio === id
                    ? "bg-emerald-600 text-white"
                    : "bg-white/80 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Background">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => patchBg({ type: "solid" })}
              className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${
                theme.background.type === "solid" ? "bg-emerald-600 text-white" : "bg-white/80 dark:bg-emerald-900/50"
              }`}
            >
              Solid
            </button>
            <button
              type="button"
              onClick={() => patchBg({ type: "gradient" })}
              className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${
                theme.background.type === "gradient" ? "bg-emerald-600 text-white" : "bg-white/80 dark:bg-emerald-900/50"
              }`}
            >
              Gradient
            </button>
          </div>
          {theme.background.type === "solid" ? (
            <ColorInput
              label="Background color"
              value={theme.background.solidColor}
              onChange={(solidColor) => patchBg({ solidColor })}
            />
          ) : (
            <>
              <ColorInput label="Gradient start" value={theme.background.gradientFrom} onChange={(gradientFrom) => patchBg({ gradientFrom })} />
              <ColorInput label="Gradient end" value={theme.background.gradientTo} onChange={(gradientTo) => patchBg({ gradientTo })} />
              <label className="block text-xs text-gray-600 dark:text-gray-400">
                Direction
                <select
                  value={theme.background.gradientDirection}
                  onChange={(e) => patchBg({ gradientDirection: e.target.value as GradientDirection })}
                  className="mt-1 w-full rounded-lg border border-emerald-500/20 bg-white px-2 py-1.5 text-xs dark:bg-emerald-950"
                >
                  <option value="to-b">Top → bottom</option>
                  <option value="to-t">Bottom → top</option>
                  <option value="to-r">Left → right</option>
                  <option value="to-l">Right → left</option>
                  <option value="to-br">Diagonal ↘</option>
                  <option value="to-bl">Diagonal ↙</option>
                </select>
              </label>
              <div className="flex flex-wrap gap-1">
                {GRADIENT_PRESETS.map((g) => (
                  <button
                    key={g.label}
                    type="button"
                    onClick={() =>
                      patchBg({
                        type: "gradient",
                        gradientFrom: g.from,
                        gradientTo: g.to,
                        gradientDirection: g.direction,
                      })
                    }
                    className="cursor-pointer rounded px-2 py-0.5 text-[10px] font-medium bg-white/80 dark:bg-emerald-900/40"
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </>
          )}
          <label className="block text-xs text-gray-600 dark:text-gray-400">
            Pattern
            <select
              value={theme.background.pattern}
              onChange={(e) => patchBg({ pattern: e.target.value as PostPattern })}
              className="mt-1 w-full rounded-lg border border-emerald-500/20 bg-white px-2 py-1.5 text-xs dark:bg-emerald-950"
            >
              <option value="none">None</option>
              <option value="star">Star (Islamic)</option>
              <option value="dot-grid">Dot grid</option>
            </select>
          </label>
          {theme.background.pattern === "star" ? (
            <>
              <ColorInput label="Pattern color" value={theme.background.patternColor} onChange={(patternColor) => patchBg({ patternColor })} />
              <label className="block text-xs text-gray-600 dark:text-gray-400">
                Pattern strength
                <input
                  type="range"
                  min={0}
                  max={0.5}
                  step={0.02}
                  value={theme.background.patternOpacity}
                  onChange={(e) => patchBg({ patternOpacity: parseFloat(e.target.value) })}
                  className="mt-1 w-full accent-emerald-600"
                />
              </label>
            </>
          ) : null}
        </Section>

        <Section title="Text colors">
          <ColorInput label="Title" value={theme.colors.title} onChange={(title) => patchColors({ title })} />
          <ColorInput label="Sher text" value={theme.colors.sher} onChange={(sher) => patchColors({ sher })} />
          <ColorInput label="Poet name" value={theme.colors.poet} onChange={(poet) => patchColors({ poet })} />
          <ColorInput label="Footer" value={theme.colors.footer} onChange={(footer) => patchColors({ footer })} />
        </Section>

        <Section title="Sher card">
          <ColorInput label="Box background" value={theme.sherCard.background} onChange={(background) => patchSher({ background })} />
          <ColorInput label="Border" value={theme.sherCard.border.startsWith("#") ? theme.sherCard.border : "#059669"} onChange={(border) => patchSher({ border })} />
          <label className="block text-xs text-gray-600 dark:text-gray-400">
            Opacity ({theme.sherCard.opacity}%)
            <input
              type="range"
              min={20}
              max={100}
              value={theme.sherCard.opacity}
              onChange={(e) => patchSher({ opacity: parseInt(e.target.value, 10) })}
              className="mt-1 w-full accent-emerald-600"
            />
          </label>
          <label className="block text-xs text-gray-600 dark:text-gray-400">
            Corner radius ({theme.sherCard.radius}px)
            <input
              type="range"
              min={0}
              max={24}
              value={theme.sherCard.radius}
              onChange={(e) => patchSher({ radius: parseInt(e.target.value, 10) })}
              className="mt-1 w-full accent-emerald-600"
            />
          </label>
        </Section>

        <Section title="Font & size">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["sans", "Sans"],
                ["serif", "Serif"],
                ["urdu", "Urdu / Nastaliq"],
                ["classic", "Classic"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => patchTypo({ fontFamily: id as PostFontFamily })}
                className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${
                  theme.typography.fontFamily === id ? "bg-emerald-600 text-white" : "bg-white/80 dark:bg-emerald-900/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="block text-xs text-gray-600 dark:text-gray-400">
            Font size ({theme.typography.fontSize}px)
            <input
              type="range"
              min={11}
              max={20}
              value={theme.typography.fontSize}
              onChange={(e) => patchTypo({ fontSize: parseInt(e.target.value, 10) })}
              className="mt-1 w-full accent-emerald-600"
            />
          </label>
          <div className="flex gap-1.5">
            {(["left", "center", "right"] as PostTextAlign[]).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => patchTypo({ textAlign: align })}
                className={`flex-1 rounded-lg py-1 text-[11px] font-semibold capitalize ${
                  theme.typography.textAlign === align ? "bg-emerald-600 text-white" : "bg-white/80 dark:bg-emerald-900/50"
                }`}
              >
                {align}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Show on post">
          <Toggle label="Poet name" checked={theme.visibility.poetName} onChange={(poetName) => patchVis({ poetName })} />
          <Toggle label="Website link" checked={theme.visibility.websiteLink} onChange={(websiteLink) => patchVis({ websiteLink })} />
          <Toggle label="Contact number" checked={theme.visibility.contactNumber} onChange={(contactNumber) => patchVis({ contactNumber })} />
        </Section>

        <button
          type="button"
          onClick={onReset}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-emerald-500/25 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/80 dark:text-emerald-200 dark:hover:bg-emerald-900/50"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset to default
        </button>
      </div>
    </details>
  );
}
