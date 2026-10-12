import { getIslamicHeroPatternDataUri } from "@/utils/islamicHeroPatternDataUri";

export type SharePostTheme = "light" | "dark";

export function resolveSharePostTheme(resolvedTheme?: string | null): SharePostTheme {
  if (resolvedTheme === "light") return "light";
  if (resolvedTheme === "dark") return "dark";
  if (typeof document !== "undefined" && document.documentElement.classList.contains("light")) {
    return "light";
  }
  return "dark";
}

export function shareCardCaptureBackground(theme: SharePostTheme): string {
  return theme === "light" ? "#faf6ec" : "#020806";
}

export function getSharePostSurface(theme: SharePostTheme) {
  if (theme === "light") {
    const patternBg = getIslamicHeroPatternDataUri("#8a6b24", 0.16);
    return {
      rootStyle: {
        backgroundColor: "#faf6ec",
        backgroundImage: `url("${patternBg}"), linear-gradient(180deg, #faf6ec 0%, #f2ecdd 100%)`,
        backgroundSize: "120px 120px, cover",
      },
      borderClass: "border-[#d4c9ae]",
      brandDot: "bg-[#9a7b2e]",
      brandLabel: "text-[#2f4a33]",
      siteHost: "text-[#2f4a33]/80",
      titleUrdu: "text-[#243a28]",
      titleLatin: "text-[#2f4a33]",
      author: "text-[#5c5748]",
      divider: "bg-[#9a7b2e]/55",
      lyrics: "text-[#2a2a22]",
      stanzaBox: "border-[#d4c9ae] bg-white/95",
      footerLead: "text-[#2f4a33]",
      footerUrl: "text-[#9a7b2e]",
      footerContact: "text-[#5c5748]",
      footerPhone: "text-[#2f4a33] font-medium",
      emptyHint: "text-[#8a8370]",
      dotGridOpacity: "opacity-[0.06]",
    };
  }

  const patternBg = getIslamicHeroPatternDataUri("#eab308", 0.2);
  return {
    rootStyle: {
      backgroundColor: "#031510",
      backgroundImage: `url("${patternBg}"), radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 50%), linear-gradient(180deg, rgba(3,21,16,0.5) 0%, rgba(2,8,6,0.65) 100%)`,
      backgroundSize: "120px 120px, cover, cover",
    },
    borderClass: "border-amber-500/25",
    brandDot: "bg-amber-400",
    brandLabel: "text-amber-400/95",
    siteHost: "text-emerald-400",
    titleUrdu: "text-amber-400",
    titleLatin: "text-amber-300",
    author: "text-gray-400",
    divider: "bg-amber-500/55",
    lyrics: "text-gray-100",
    stanzaBox: "border-emerald-600/25 bg-[#042318]/75",
    footerLead: "text-emerald-400/95",
    footerUrl: "text-amber-500/75",
    footerContact: "text-gray-500",
    footerPhone: "text-emerald-400/90 font-medium",
    emptyHint: "text-gray-400",
    dotGridOpacity: "opacity-[0.08]",
  };
}
