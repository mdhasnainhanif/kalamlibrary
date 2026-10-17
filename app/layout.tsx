import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

import NavbarWithPoets from "@/components/NavbarWithPoets";
import SearchHeroBanner from "@/components/SearchHeroBanner";
import Footer from "@/components/Footer";
import FooterGate from "@/components/FooterGate";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import AppToaster from "@/components/AppToaster";
import CookieConsent from "@/components/CookieConsent";
import SiteBackground from "@/components/ui/SiteBackground";
import { SITE_CONFIG, buildWebSiteSchema } from "@/utils/seoConfig";
import { ADSENSE_CLIENT, ADSENSE_SCRIPT_SRC } from "@/utils/adsConfig";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans-premium",
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
      className={`${plusJakarta.variable} ${notoNastaliqUrdu.variable} min-h-full scroll-smooth antialiased`}
    >
      <head>
        <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
        {/* AdSense site verification + ad script (required in <head> per Google) */}
        <script async src={ADSENSE_SCRIPT_SRC} crossOrigin="anonymous" />
        {/* Structured Data: WebSite & SearchAction for Google Sitelinks Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="relative flex min-h-full flex-col overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-gold-500 focus:px-4 focus:py-2.5 focus:font-bold focus:text-black focus:shadow-xl focus:outline-none"
          >
            Skip to main content
          </a>

          <SiteBackground />

          <NavbarWithPoets />
          <SearchHeroBanner />
          <div id="app-main-slot" className="relative z-[1] flex min-h-0 w-full flex-1 flex-col">
            {children}
          </div>
          <FooterGate>
            <Footer />
          </FooterGate>

          {/* Floating Theme Toggle (Light / Dark) */}
          <ThemeToggle />
          <AppToaster />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
