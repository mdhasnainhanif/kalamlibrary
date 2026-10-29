import type { CSSProperties } from "react";
import { getIslamicHeroPatternDataUri } from "@/utils/islamicHeroPatternDataUri";

export type CardPatternStyle = "star-lattice" | "islamic-star" | "dot-grid" | "none";

export const CARD_PATTERN_OPTIONS: Array<{ id: CardPatternStyle; label: string }> = [
  { id: "star-lattice", label: "Star lattice" },
  { id: "islamic-star", label: "Classic star" },
  { id: "dot-grid", label: "Dot grid" },
  { id: "none", label: "Plain" },
];

export type CardPreset = {
  id: string;
  name: string;
  bg: string;
  bg2: string;
  pattern: string;
  title: string;
  text: string;
  muted: string;
  accent: string;
  verseBg: string;
  border: string;
};

export const CARD_PRESETS: CardPreset[] = [
  {
    id: "emerald-green",
    name: "Emerald",
    bg: "#062a1f",
    bg2: "#031510",
    pattern: "#eab308",
    title: "#f2c94c",
    text: "#f1f5ef",
    muted: "#9fb8aa",
    accent: "#d4a537",
    verseBg: "rgba(4,35,24,0.72)",
    border: "rgba(212,165,55,0.35)",
  },
  {
    id: "royal-gold",
    name: "Royal Gold",
    bg: "#2b1d06",
    bg2: "#140d02",
    pattern: "#f5d27a",
    title: "#f8dc8a",
    text: "#fff7e6",
    muted: "#cbb68a",
    accent: "#e8b84a",
    verseBg: "rgba(43,29,6,0.7)",
    border: "rgba(232,184,74,0.4)",
  },
  {
    id: "midnight-blue",
    name: "Midnight",
    bg: "#0d1b3a",
    bg2: "#060d1f",
    pattern: "#93b4ff",
    title: "#e8c872",
    text: "#eef2ff",
    muted: "#a5b4d4",
    accent: "#e8c872",
    verseBg: "rgba(13,27,58,0.72)",
    border: "rgba(232,200,114,0.35)",
  },
  {
    id: "maroon",
    name: "Maroon",
    bg: "#3d0d14",
    bg2: "#1f0509",
    pattern: "#f0b4a0",
    title: "#f3cf8a",
    text: "#fff1ee",
    muted: "#d4a8a0",
    accent: "#f3cf8a",
    verseBg: "rgba(61,13,20,0.7)",
    border: "rgba(243,207,138,0.35)",
  },
  {
    id: "pure-white",
    name: "Ivory",
    bg: "#faf6ec",
    bg2: "#f0e8d4",
    pattern: "#8a6b24",
    title: "#1f3a2b",
    text: "#2a2a22",
    muted: "#6b6552",
    accent: "#9a7b2e",
    verseBg: "rgba(255,255,255,0.88)",
    border: "rgba(154,123,46,0.35)",
  },
  {
    id: "black-gold",
    name: "Black & Gold",
    bg: "#141414",
    bg2: "#050505",
    pattern: "#d4a537",
    title: "#e9c25a",
    text: "#f5f5f5",
    muted: "#a3a3a3",
    accent: "#d4a537",
    verseBg: "rgba(20,20,20,0.75)",
    border: "rgba(212,165,55,0.4)",
  },
  {
    id: "soft-rose",
    name: "Soft Rose",
    bg: "#fbefee",
    bg2: "#f3dcd9",
    pattern: "#b5646b",
    title: "#6d2a33",
    text: "#3a2224",
    muted: "#86605f",
    accent: "#b5646b",
    verseBg: "rgba(255,255,255,0.8)",
    border: "rgba(181,100,107,0.3)",
  },
];

export const ASPECTS = {
  square: { label: "Square 1:1", css: "1 / 1", scale: 0.86 },
  portrait: { label: "Portrait 4:5", css: "4 / 5", scale: 0.86 },
  story: { label: "Story 9:16", css: "9 / 16", scale: 0.7 },
} as const;

export type Aspect = keyof typeof ASPECTS;

export type CardDesign = {
  presetId: string;
  aspect: Aspect;
  fontSize: number;
  showAuthor: boolean;
  patternStyle: CardPatternStyle;
  /** Pattern visibility (star / islamic patterns). */
  patternStrength: number;
};

const DESIGN_STORAGE_KEY = "kalamlibrary.shareCardDesign.v3";

export const DEFAULT_CARD_DESIGN: CardDesign = {
  presetId: CARD_PRESETS[0]!.id,
  aspect: "portrait",
  fontSize: 13,
  showAuthor: true,
  patternStyle: "star-lattice",
  patternStrength: 0.18,
};

const VALID_PATTERNS = new Set<CardPatternStyle>(CARD_PATTERN_OPTIONS.map((o) => o.id));

export function getPresetById(id: string): CardPreset {
  return CARD_PRESETS.find((p) => p.id === id) ?? CARD_PRESETS[0]!;
}

export function patternUri(color: string, opacity = 0.18): string {
  const c = encodeURIComponent(color);
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='${c}' stroke-opacity='${opacity}' stroke-width='1'%3E%3Cpath d='M40 5l10 25 25 10-25 10-10 25-10-25-25-10 25-10z'/%3E%3Cpath d='M40 18l6 16 16 6-16 6-6 16-6-16-16-6 16-6z'/%3E%3Ccircle cx='0' cy='0' r='8'/%3E%3Ccircle cx='80' cy='0' r='8'/%3E%3Ccircle cx='0' cy='80' r='8'/%3E%3Ccircle cx='80' cy='80' r='8'/%3E%3C/g%3E%3C/svg%3E")`;
}

export function buildCardBackgroundStyle(
  preset: CardPreset,
  design: Pick<CardDesign, "patternStyle" | "patternStrength">
): CSSProperties {
  const vignette = `radial-gradient(ellipse at 50% 0%, ${preset.bg} 0%, ${preset.bg2} 85%)`;
  const strength = Math.min(0.5, Math.max(0.04, design.patternStrength));
  const layers: string[] = [];

  if (design.patternStyle === "star-lattice") {
    layers.push(patternUri(preset.pattern, strength));
  } else if (design.patternStyle === "islamic-star") {
    layers.push(`url("${getIslamicHeroPatternDataUri(preset.pattern, strength)}")`);
  }

  layers.push(vignette);

  const bgSize =
    design.patternStyle === "islamic-star"
      ? "120px 120px, cover"
      : design.patternStyle === "star-lattice"
        ? "80px 80px, cover"
        : "cover";

  return {
    backgroundColor: preset.bg,
    backgroundImage: layers.join(", "),
    backgroundSize: bgSize,
  };
}

export function cardUsesDotGridPattern(design: Pick<CardDesign, "patternStyle">): boolean {
  return design.patternStyle === "dot-grid";
}

export async function captureShareCardNode(node: HTMLElement, bg: string): Promise<Blob> {
  const { toBlob } = await import("html-to-image");
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }
  await toBlob(node, { pixelRatio: 1, backgroundColor: bg, cacheBust: true }).catch(() => null);
  const blob = await toBlob(node, { pixelRatio: 2.5, backgroundColor: bg, cacheBust: true });
  if (!blob) throw new Error("Could not create image");
  return blob;
}

export function downloadShareBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function loadCardDesignFromStorage(): CardDesign {
  if (typeof window === "undefined") return { ...DEFAULT_CARD_DESIGN };
  try {
    const raw = localStorage.getItem(DESIGN_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CARD_DESIGN };
    const parsed = JSON.parse(raw) as CardDesign;
    return {
      ...DEFAULT_CARD_DESIGN,
      ...parsed,
      presetId: CARD_PRESETS.some((p) => p.id === parsed.presetId) ? parsed.presetId : DEFAULT_CARD_DESIGN.presetId,
      patternStyle: VALID_PATTERNS.has(parsed.patternStyle) ? parsed.patternStyle : DEFAULT_CARD_DESIGN.patternStyle,
      patternStrength:
        typeof parsed.patternStrength === "number" && parsed.patternStrength >= 0.04 && parsed.patternStrength <= 0.5
          ? parsed.patternStrength
          : DEFAULT_CARD_DESIGN.patternStrength,
    };
  } catch {
    return { ...DEFAULT_CARD_DESIGN };
  }
}

export function saveCardDesignToStorage(design: CardDesign): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(design));
  } catch {
    /* ignore */
  }
}

/** Preview wrapper height factor (width 420 × scale). */
export function previewSlotHeight(aspect: Aspect, scale: number): number {
  const w = 420 * scale;
  const ratio = aspect === "square" ? 1 : aspect === "portrait" ? 5 / 4 : 16 / 9;
  return w * ratio;
}
