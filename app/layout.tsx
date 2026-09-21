import type { Metadata, Viewport } from "next";
import { Outfit, Noto_Nastaliq_Urdu } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import Navbar from "@/components/Navbar";
import SearchHeroBanner from "@/components/SearchHeroBanner";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { SITE_CONFIG, buildWebSiteSchema } from "@/utils/seoConfig";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: true,
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
  fallback: ["Noto Naskh Arabic", "serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020806",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: "Naat Lyrics in Urdu, Hindi, Roman & Bangla",
    template: "%s | Kalam Library",
  },
  description: SITE_CONFIG.description,
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.webp", type: "image/webp" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
    title: "Naat Lyrics in Urdu, Hindi, Roman & Bangla | Kalam Library",
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
    title: "Naat Lyrics in Urdu, Hindi, Roman & Bangla | Kalam Library",
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
      suppressHydrationWarning
      className={`${outfit.variable} ${notoNastaliqUrdu.variable} min-h-full antialiased`}
    >
      <head>
        {/* Structured Data: WebSite & SearchAction for Google Sitelinks Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Keyboard Accessibility: Skip to Main Content Link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-gold-500 focus:text-black focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none"
          >
            Skip to main content
          </a>

          {/* Decorative blurs are desktop-only — they stall mobile paint */}
          <div aria-hidden="true" className="hidden md:block fixed top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          <div aria-hidden="true" className="hidden md:block fixed bottom-10 left-10 w-70 h-70 bg-gold-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

          <Navbar />
          <SearchHeroBanner />
          <div className="relative z-0 flex-1 flex flex-col w-full min-h-[100dvh]">
            {children}
          </div>
          <Footer />

          {/* Floating Theme Toggle (Light / Dark) */}
          <ThemeToggle />
        </ThemeProvider>

        {/* Ads + analytics after first paint so they cannot delay LCP or shove the footer */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7173654343893692"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
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
      </body>
    </html>
  );
}
