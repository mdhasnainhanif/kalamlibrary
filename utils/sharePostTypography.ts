export type SharePoetryFontOverride = "auto" | "display" | "ui" | "urdu";

export type ShareContentLang = "urdu" | "hindi" | "bangla" | "roman-english";

export function normalizeShareContentLang(lang: string): ShareContentLang {
  if (lang === "urdu") return "urdu";
  if (lang === "hindi") return "hindi";
  if (lang === "bangla") return "bangla";
  return "roman-english";
}

export function sharePostHtmlLang(contentLang: ShareContentLang): string {
  const map: Record<ShareContentLang, string> = {
    urdu: "ur",
    hindi: "hi",
    bangla: "bn",
    "roman-english": "en",
  };
  return map[contentLang];
}

/** UI chrome on the card (brand, footer labels) — always Figtree / font-sans. */
export function sharePostChromeFontClass(): string {
  return "font-sans";
}

function poetryFontForAuto(contentLang: ShareContentLang): string {
  switch (contentLang) {
    case "urdu":
      return "font-urdu font-semibold";
    case "hindi":
      return "font-devanagari font-medium";
    case "bangla":
      return "font-bengali font-medium";
    default:
      return "font-display font-semibold";
  }
}

/** Title, sher lines, and poet name (poetry layer). */
export function sharePostPoetryFontClass(
  contentLang: ShareContentLang,
  override: SharePoetryFontOverride
): string {
  if (override === "display") return "font-display font-semibold";
  if (override === "ui") return "font-sans font-medium";
  if (override === "urdu") return "font-urdu font-semibold";
  return poetryFontForAuto(contentLang);
}

export function sharePostSherLineHeight(contentLang: ShareContentLang): number {
  if (contentLang === "urdu") return 2.2;
  if (contentLang === "hindi" || contentLang === "bangla") return 1.85;
  return 1.78;
}

export function sharePostTitleWeightClass(contentLang: ShareContentLang): string {
  if (contentLang === "urdu") return "font-semibold";
  if (contentLang === "roman-english") return "font-semibold";
  return "font-medium";
}
