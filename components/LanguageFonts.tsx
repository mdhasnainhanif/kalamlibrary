import { Noto_Sans_Bengali, Noto_Sans_Devanagari } from "next/font/google";

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export default function LanguageFonts({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${notoSansDevanagari.variable} ${notoSansBengali.variable}`}>
      {children}
    </div>
  );
}
