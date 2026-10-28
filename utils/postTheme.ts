import type { CSSProperties } from "react";
import { getIslamicHeroPatternDataUri } from "@/utils/islamicHeroPatternDataUri";

export type PostAspectRatio = "square" | "portrait" | "story";
export type PostTextAlign = "left" | "center" | "right";
export type PostFontFamily = "sans" | "serif" | "urdu" | "classic";
export type PostPattern = "none" | "star" | "dot-grid";
export type GradientDirection = "to-b" | "to-t" | "to-r" | "to-l" | "to-br" | "to-bl";

export type PostTheme = {
  presetId: string | null;
  background: {
    type: "solid" | "gradient";
    solidColor: string;
    gradientFrom: string;
    gradientTo: string;
    gradientDirection: GradientDirection;
    pattern: PostPattern;
    patternColor: string;
    patternOpacity: number;
  };
  colors: {
    title: string;
    sher: string;
    poet: string;
    footer: string;
    brandLabel: string;
    siteHost: string;
    border: string;
    divider: string;
    footerUrl: string;
    footerPhone: string;
  };
  sherCard: {
    background: string;
    border: string;
    opacity: number;
    radius: number;
  };
  typography: {
    fontFamily: PostFontFamily;
    fontSize: number;
    textAlign: PostTextAlign;
  };
  layout: {
    aspectRatio: PostAspectRatio;
  };
  visibility: {
    poetName: boolean;
    websiteLink: boolean;
    contactNumber: boolean;
  };
};

const STORAGE_KEY = "kalamlibrary.postTheme.v1";

const GRADIENT_ANGLE: Record<GradientDirection, string> = {
  "to-b": "180deg",
  "to-t": "0deg",
  "to-r": "90deg",
  "to-l": "270deg",
  "to-br": "135deg",
  "to-bl": "225deg",
};

export const POST_ASPECT_CSS: Record<PostAspectRatio, string> = {
  square: "1 / 1",
  portrait: "4 / 5",
  story: "9 / 16",
};

export const DEFAULT_POST_THEME: PostTheme = {
  presetId: "emerald-green",
  background: {
    type: "gradient",
    solidColor: "#031510",
    gradientFrom: "#031510",
    gradientTo: "#020806",
    gradientDirection: "to-b",
    pattern: "star",
    patternColor: "#eab308",
    patternOpacity: 0.2,
  },
  colors: {
    title: "#fcd34d",
    sher: "#f3f4f6",
    poet: "#9ca3af",
    footer: "#6b7280",
    brandLabel: "rgba(251, 191, 36, 0.95)",
    siteHost: "#34d399",
    border: "rgba(234, 179, 8, 0.28)",
    divider: "rgba(245, 158, 11, 0.55)",
    footerUrl: "rgba(245, 158, 11, 0.75)",
    footerPhone: "rgba(52, 211, 153, 0.9)",
  },
  sherCard: {
    background: "#042318",
    border: "rgba(16, 185, 129, 0.35)",
    opacity: 75,
    radius: 12,
  },
  typography: {
    fontFamily: "sans",
    fontSize: 14,
    textAlign: "center",
  },
  layout: {
    aspectRatio: "portrait",
  },
  visibility: {
    poetName: true,
    websiteLink: true,
    contactNumber: true,
  },
};

function themeClone(base: PostTheme): PostTheme {
  return JSON.parse(JSON.stringify(base)) as PostTheme;
}

export const POST_THEME_PRESETS: Array<{ id: string; label: string; theme: PostTheme }> = [
  {
    id: "emerald-green",
    label: "Emerald Green",
    theme: DEFAULT_POST_THEME,
  },
  {
    id: "royal-gold",
    label: "Royal Gold",
    theme: {
      ...themeClone(DEFAULT_POST_THEME),
      presetId: "royal-gold",
      background: {
        type: "gradient",
        solidColor: "#1a1208",
        gradientFrom: "#2a1f0a",
        gradientTo: "#0f0a04",
        gradientDirection: "to-br",
        pattern: "star",
        patternColor: "#d4af37",
        patternOpacity: 0.28,
      },
      colors: {
        title: "#ffd700",
        sher: "#fff8e7",
        poet: "#c4b896",
        footer: "#a89870",
        brandLabel: "#ffd700",
        siteHost: "#e8c547",
        border: "rgba(212, 175, 55, 0.45)",
        divider: "rgba(255, 215, 0, 0.5)",
        footerUrl: "#e8c547",
        footerPhone: "#ffd700",
      },
      sherCard: {
        background: "#1f1608",
        border: "rgba(212, 175, 55, 0.4)",
        opacity: 85,
        radius: 14,
      },
    },
  },
  {
    id: "midnight-blue",
    label: "Midnight Blue",
    theme: {
      ...themeClone(DEFAULT_POST_THEME),
      presetId: "midnight-blue",
      background: {
        type: "gradient",
        solidColor: "#0a1628",
        gradientFrom: "#0f2744",
        gradientTo: "#050d18",
        gradientDirection: "to-b",
        pattern: "star",
        patternColor: "#60a5fa",
        patternOpacity: 0.18,
      },
      colors: {
        title: "#93c5fd",
        sher: "#e2e8f0",
        poet: "#94a3b8",
        footer: "#64748b",
        brandLabel: "#60a5fa",
        siteHost: "#38bdf8",
        border: "rgba(96, 165, 250, 0.35)",
        divider: "rgba(147, 197, 253, 0.45)",
        footerUrl: "#38bdf8",
        footerPhone: "#7dd3fc",
      },
      sherCard: {
        background: "#0c1a30",
        border: "rgba(96, 165, 250, 0.35)",
        opacity: 80,
        radius: 12,
      },
    },
  },
  {
    id: "maroon",
    label: "Maroon",
    theme: {
      ...themeClone(DEFAULT_POST_THEME),
      presetId: "maroon",
      background: {
        type: "gradient",
        solidColor: "#2a0a10",
        gradientFrom: "#4a1020",
        gradientTo: "#1a0508",
        gradientDirection: "to-br",
        pattern: "star",
        patternColor: "#f87171",
        patternOpacity: 0.15,
      },
      colors: {
        title: "#fecaca",
        sher: "#fef2f2",
        poet: "#fca5a5",
        footer: "#b91c1c",
        brandLabel: "#f87171",
        siteHost: "#fb7185",
        border: "rgba(248, 113, 113, 0.35)",
        divider: "rgba(252, 165, 165, 0.45)",
        footerUrl: "#fb7185",
        footerPhone: "#fecaca",
      },
      sherCard: {
        background: "#3f0d18",
        border: "rgba(248, 113, 113, 0.35)",
        opacity: 78,
        radius: 12,
      },
    },
  },
  {
    id: "pure-white",
    label: "Pure White",
    theme: {
      ...themeClone(DEFAULT_POST_THEME),
      presetId: "pure-white",
      background: {
        type: "solid",
        solidColor: "#fafafa",
        gradientFrom: "#ffffff",
        gradientTo: "#f0f0f0",
        gradientDirection: "to-b",
        pattern: "dot-grid",
        patternColor: "#059669",
        patternOpacity: 0.08,
      },
      colors: {
        title: "#14532d",
        sher: "#1f2937",
        poet: "#4b5563",
        footer: "#6b7280",
        brandLabel: "#047857",
        siteHost: "#059669",
        border: "#d1d5db",
        divider: "#9ca3af",
        footerUrl: "#047857",
        footerPhone: "#059669",
      },
      sherCard: {
        background: "#ffffff",
        border: "#d1d5db",
        opacity: 100,
        radius: 12,
      },
    },
  },
  {
    id: "black-gold",
    label: "Black & Gold",
    theme: {
      ...themeClone(DEFAULT_POST_THEME),
      presetId: "black-gold",
      background: {
        type: "solid",
        solidColor: "#000000",
        gradientFrom: "#0a0a0a",
        gradientTo: "#000000",
        gradientDirection: "to-b",
        pattern: "star",
        patternColor: "#ca8a04",
        patternOpacity: 0.22,
      },
      colors: {
        title: "#fbbf24",
        sher: "#fafafa",
        poet: "#a3a3a3",
        footer: "#737373",
        brandLabel: "#fbbf24",
        siteHost: "#eab308",
        border: "rgba(234, 179, 8, 0.4)",
        divider: "rgba(251, 191, 36, 0.5)",
        footerUrl: "#eab308",
        footerPhone: "#fbbf24",
      },
      sherCard: {
        background: "#0a0a0a",
        border: "rgba(234, 179, 8, 0.45)",
        opacity: 90,
        radius: 8,
      },
    },
  },
  {
    id: "forest-night",
    label: "Forest Night",
    theme: {
      ...themeClone(DEFAULT_POST_THEME),
      presetId: "forest-night",
      background: {
        type: "gradient",
        solidColor: "#052e16",
        gradientFrom: "#064e3b",
        gradientTo: "#022c22",
        gradientDirection: "to-t",
        pattern: "none",
        patternColor: "#34d399",
        patternOpacity: 0,
      },
      colors: {
        title: "#6ee7b7",
        sher: "#ecfdf5",
        poet: "#a7f3d0",
        footer: "#6ee7b7",
        brandLabel: "#34d399",
        siteHost: "#2dd4bf",
        border: "rgba(52, 211, 153, 0.35)",
        divider: "rgba(110, 231, 183, 0.4)",
        footerUrl: "#2dd4bf",
        footerPhone: "#6ee7b7",
      },
      sherCard: {
        background: "#064e3b",
        border: "rgba(52, 211, 153, 0.4)",
        opacity: 70,
        radius: 16,
      },
    },
  },
  {
    id: "soft-rose",
    label: "Soft Rose",
    theme: {
      ...themeClone(DEFAULT_POST_THEME),
      presetId: "soft-rose",
      background: {
        type: "gradient",
        solidColor: "#fdf2f8",
        gradientFrom: "#fce7f3",
        gradientTo: "#fbcfe8",
        gradientDirection: "to-br",
        pattern: "dot-grid",
        patternColor: "#be185d",
        patternOpacity: 0.06,
      },
      colors: {
        title: "#9d174d",
        sher: "#4c0519",
        poet: "#831843",
        footer: "#9d174d",
        brandLabel: "#be185d",
        siteHost: "#db2777",
        border: "#f9a8d4",
        divider: "#f472b6",
        footerUrl: "#db2777",
        footerPhone: "#be185d",
      },
      sherCard: {
        background: "#fff1f2",
        border: "#f9a8d4",
        opacity: 95,
        radius: 14,
      },
    },
  },
];

export const GRADIENT_PRESETS = [
  { label: "Emerald fade", from: "#031510", to: "#020806", direction: "to-b" as GradientDirection },
  { label: "Gold dusk", from: "#2a1f0a", to: "#0f0a04", direction: "to-br" as GradientDirection },
  { label: "Ocean", from: "#0f2744", to: "#050d18", direction: "to-b" as GradientDirection },
  { label: "Sunset", from: "#4a1020", to: "#1a0508", direction: "to-br" as GradientDirection },
  { label: "Mist", from: "#f8fafc", to: "#e2e8f0", direction: "to-b" as GradientDirection },
];

export function getPostThemePreset(id: string): PostTheme | null {
  const found = POST_THEME_PRESETS.find((p) => p.id === id);
  return found ? themeClone(found.theme) : null;
}

export function loadPostThemeFromStorage(): PostTheme {
  const base = themeClone(DEFAULT_POST_THEME);
  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as PostTheme;
    return {
      ...base,
      ...parsed,
      background: { ...base.background, ...parsed.background },
      colors: { ...base.colors, ...parsed.colors },
      sherCard: { ...base.sherCard, ...parsed.sherCard },
      typography: { ...base.typography, ...parsed.typography },
      layout: { ...base.layout, ...parsed.layout },
      visibility: { ...base.visibility, ...parsed.visibility },
    };
  } catch {
    return base;
  }
}

export function savePostThemeToStorage(theme: PostTheme): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    /* quota / private mode */
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function withAlpha(color: string, alpha: number): string {
  const rgb = hexToRgb(color);
  if (rgb) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  if (color.startsWith("rgba")) return color;
  if (color.startsWith("rgb")) return color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
  return color;
}

export function buildPostBackgroundStyle(theme: PostTheme): CSSProperties {
  const { background: bg } = theme;
  const layers: string[] = [];

  if (bg.pattern === "star") {
    const uri = getIslamicHeroPatternDataUri(bg.patternColor, bg.patternOpacity);
    layers.push(`url("${uri}")`);
  }

  if (bg.type === "gradient") {
    const angle = GRADIENT_ANGLE[bg.gradientDirection];
    layers.push(`linear-gradient(${angle}, ${bg.gradientFrom} 0%, ${bg.gradientTo} 100%)`);
  }

  const baseColor = bg.type === "solid" ? bg.solidColor : bg.gradientFrom;

  return {
    backgroundColor: baseColor,
    backgroundImage: layers.length ? layers.join(", ") : undefined,
    backgroundSize: bg.pattern === "star" ? "120px 120px, cover" : "cover",
  };
}

export function getPostThemeCaptureBackground(theme: PostTheme): string {
  const { background: bg } = theme;
  return bg.type === "solid" ? bg.solidColor : bg.gradientFrom;
}

export function postThemeFontClass(family: PostFontFamily, isUrduContent: boolean): string {
  if (family === "urdu" || (isUrduContent && family === "sans")) return "font-urdu";
  if (family === "serif") return "font-serif";
  if (family === "classic") return "font-[Georgia,Times,'Times New Roman',serif]";
  return "font-sans";
}

export function textAlignClass(align: PostTextAlign): string {
  if (align === "left") return "text-left";
  if (align === "right") return "text-right";
  return "text-center";
}
