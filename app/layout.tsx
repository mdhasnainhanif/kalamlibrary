import type { Metadata } from "next";
import { Outfit, Noto_Nastaliq_Urdu } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kalamlibrary.me"),
  title: {
    template: "%s | Kalam Library",
    default: "Kalam Library - Naat Lyrics in Urdu, Hindi, Roman English & Bangla",
  },
  description: "Explore a vast collection of Islamic Naats, Hamd, and Sufi Kalam in multiple languages including Roman English, Urdu (Nastaliq), Hindi (Devanagari), and Bangla.",
  keywords: ["naats lyrics", "kalam library", "urdu naat", "hindi naat", "roman english lyrics", "hadaiq e bakhshish lyrics", "wasail e bakhshish lyrics", "sufi poetry"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${notoNastaliqUrdu.variable} h-full antialiased`}
    >
      <head>
        {/* Google Analytics (gtag.js) - Defer with lazyOnload to prevent blocking critical path and avoid forced reflow */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z7H5JF3KB9"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z7H5JF3KB9');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        {/* Keyboard Accessibility: Skip to Main Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-gold-500 focus:text-black focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Global Glowing Background Elements - Hardware accelerated with transform-gpu to prevent layout invalidation */}
        <div aria-hidden="true" className="fixed top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none transform-gpu will-change-transform"></div>
        <div aria-hidden="true" className="fixed bottom-10 left-10 w-70 h-70 bg-gold-500/5 rounded-full blur-[100px] -z-10 pointer-events-none transform-gpu"></div>

        <Navbar />
        <div className="flex-1 flex flex-col w-full">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
