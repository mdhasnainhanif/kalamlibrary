import type { Metadata, Viewport } from "next";
import { Outfit, Noto_Nastaliq_Urdu, Noto_Sans_Devanagari, Noto_Sans_Bengali } from "next/font/google";
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

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  display: "swap",
});

import { SITE_CONFIG, buildWebSiteSchema } from "@/utils/seoConfig";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020806",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: "Naats & Kalams | Islamic Naats, Kalams & Recitations | Kalam Library",
    template: "%s | Kalam Library",
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.creator,
  publisher: SITE_CONFIG.publisher,
  applicationName: SITE_CONFIG.name,
  category: SITE_CONFIG.category,
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ur_PK", "hi_IN", "bn_BD"],
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: "Naats & Kalams | Islamic Naats, Kalams & Recitations | Kalam Library",
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Kalam Library - Islamic Poetry & Naat Lyrics Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naats & Kalams | Islamic Naats, Kalams & Recitations | Kalam Library",
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.defaultOgImage],
  },
};

const websiteSchema = buildWebSiteSchema();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${outfit.variable} ${notoNastaliqUrdu.variable} ${notoSansDevanagari.variable} ${notoSansBengali.variable} h-full antialiased`}
    >
      <head>
        {/* Structured Data: WebSite & SearchAction for Google Sitelinks Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

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
