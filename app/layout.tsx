import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kalamlibrary.me"),
  title: {
    default: "Kalam Library | Complete Islamic Poetry, Hamd & Naat Lyrics",
    template: "%s | Kalam Library",
  },
  description:
    "Explore authentic Islamic Naat, Hamd, and Sufi Kalam lyrics in Urdu, Hindi, Bangla, and Roman English. Read, search, and verify classic poetry.",
  keywords: [
    "naat lyrics",
    "kalam library",
    "urdu naat lyrics",
    "hindi naat lyrics",
    "roman english naat",
    "hadaiq e bakhshish lyrics",
    "wasail e bakhshish lyrics",
    "sufi poetry",
    "islamic poetry",
    "hamd lyrics",
  ],
  alternates: {
    canonical: "/",
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
    alternateLocale: ["ur_PK"],
    url: "https://kalamlibrary.me",
    siteName: "Kalam Library",
    title: "Kalam Library | Complete Islamic Poetry, Hamd & Naat Lyrics",
    description:
      "Explore authentic Islamic Naat, Hamd, and Sufi Kalam lyrics in Urdu, Hindi, Bangla, and Roman English. Read, search, and verify classic poetry.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Kalam Library - Islamic Poetry & Naat Lyrics Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalam Library | Complete Islamic Poetry, Hamd & Naat Lyrics",
    description:
      "Explore authentic Islamic Naat, Hamd, and Sufi Kalam lyrics in Urdu, Hindi, Bangla, and Roman English. Read, search, and verify classic poetry.",
    images: ["/og-default.jpg"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kalam Library",
  url: "https://kalamlibrary.me/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://kalamlibrary.me/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${outfit.variable} ${notoNastaliqUrdu.variable} h-full antialiased`}
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
