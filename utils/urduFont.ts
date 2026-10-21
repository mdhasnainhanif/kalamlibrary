import { Noto_Nastaliq_Urdu } from "next/font/google";

/** Loaded client-side after first paint — keep out of root layout critical path. */
export const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
  fallback: ["Noto Naskh Arabic", "serif"],
});
