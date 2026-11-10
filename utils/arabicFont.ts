import { Amiri } from "next/font/google";

/** Naskh face for Quranic / Arabic litany text in the paged reader. */
export const amiriArabic = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  fallback: ["Noto Naskh Arabic", "serif"],
});
