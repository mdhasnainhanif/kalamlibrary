import { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy of Kalam Library (kalamlibrary.me). We are committed to transparency, minimal data collection, and protecting your digital reading experience.",
  alternates: {
    canonical: buildCanonicalUrl("/privacy-policy"),
  },
  openGraph: {
    title: `Privacy Policy | ${SITE_CONFIG.name}`,
    description:
      "Learn how Kalam Library respects your privacy. We never sell your personal data, minimize tracking, and keep your poetry reading experience peaceful.",
    url: `${SITE_CONFIG.url}/privacy-policy`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Kalam Library Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy Policy | ${SITE_CONFIG.name}`,
    description:
      "Learn how Kalam Library respects your privacy. We never sell your personal data, minimize tracking, and keep your poetry reading experience peaceful.",
    images: [SITE_CONFIG.defaultOgImage],
  },
};

const GeometricPattern = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none -z-10"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <defs>
      <pattern id="privacy-geom" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-gold-500" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#privacy-geom)" />
  </svg>
);

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
  ]);

  const whatsappUrl = "https://wa.me/923174731957";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="container py-8 md:py-16 flex-grow relative text-left">
        <GeometricPattern />

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center justify-center gap-2">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-400 font-medium">Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12 border-b border-emerald-500/10 pb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your Privacy Matters to Us
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gold-500 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            At Kalam Library, we believe reading sacred poetry and studying literature should be a peaceful, private, and secure experience. Here is an honest, transparent breakdown of how we treat your data.
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Last Updated: September 2026 &bull; Effective Immediately
          </p>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-8 text-gray-300 leading-relaxed text-sm md:text-base">

          {/* 1. Our Privacy Philosophy */}
          <section className="bg-emerald-900/10 border border-emerald-500/15 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">1</span>
              Our Privacy Philosophy
            </h2>
            <p className="mb-3">
              Kalam Library (<strong className="text-gray-100 font-semibold">kalamlibrary.me</strong>) is built with one clear mission: to make spiritual, devotional poetry accessible in multiple scripts to anyone in the world, completely free of charge.
            </p>
            <p>
              We operate under a simple principle: <span className="text-emerald-300 font-medium">we collect only what is strictly necessary to keep the website running fast, securely, and reliably</span>. We do not require accounts, we do not require logins, and we never track you across the web.
            </p>
          </section>

          {/* 2. No Sale of Data Promise - Hero Banner */}
          <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-emerald-900/30 to-emerald-950/70 border border-emerald-500/30 text-gray-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base md:text-lg font-bold text-emerald-300 mb-1">
                  We Never Sell, Rent, or Monetize Your Personal Data
                </h2>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                  We will never sell, lease, rent, trade, or transfer your personal information to third-party data brokers, marketers, or advertisers. Your trust is sacred to us, and Kalam Library is not a data-harvesting business.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Information We Collect */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">2</span>
              Information We Collect
            </h2>
            <p className="mb-4">
              Depending on how you interact with our website, we may collect the following limited categories of information:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/10">
                <h3 className="text-sm font-semibold text-gold-500 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                  A. Anonymous Analytics &amp; Performance Metrics
                </h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                  When you browse pages, we collect aggregated, non-identifiable technical data (e.g., your browser type, device category like mobile vs. desktop, approximate geographic region, pages visited, and load speeds). We use standard tools like Google Analytics solely to measure which poems are most requested and verify that our pages load fast on all devices.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/10">
                <h3 className="text-sm font-semibold text-gold-500 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                  B. Information You Voluntarily Provide
                </h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                  If you contact us via our Contact Us form, email, or WhatsApp, you voluntarily provide details such as your name, email address, phone number (for WhatsApp), and the contents of your message or transcription correction. This information is used strictly to reply to you.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/10">
                <h3 className="text-sm font-semibold text-emerald-400 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  C. What We Do NOT Collect
                </h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                  We do not require account registration, passwords, credit cards, or financial payment details. Reading our complete archive of thousands of kalams is open and requires zero login.
                </p>
              </div>
            </div>
          </section>

          {/* 4. How We Use the Information */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">3</span>
              How We Use the Information
            </h2>
            <p className="mb-3">
              We use the limited information collected strictly for constructive, user-focused purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-gray-300 pl-2">
              <li>
                <strong className="text-gray-200">Optimizing Performance:</strong> Identifying slow loading speeds, broken links, or visual glitches across mobile and desktop devices.
              </li>
              <li>
                <strong className="text-gray-200">Content Curation:</strong> Understanding community interest to prioritize the transcription and translation of requested authors and collections.
              </li>
              <li>
                <strong className="text-gray-200">Customer Support:</strong> Answering your questions, reviewing community-submitted verses, and rectifying transcription typos.
              </li>
              <li>
                <strong className="text-gray-200">Platform Security:</strong> Detecting and mitigating automated bots, scrapers, and malicious intrusion attempts.
              </li>
            </ul>
          </section>

          {/* 5. Cookies and Tracking */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">4</span>
              Cookies &amp; Local Storage
            </h2>
            <p className="mb-3">
              Cookies are small text files stored locally in your browser. We keep cookie usage minimal and functional:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-gray-300 pl-2 mb-4">
              <li>
                <strong className="text-gray-200">Functional &amp; Preferences:</strong> Remembering lightweight user preferences (such as your chosen script tab — Urdu, Hindi, Bangla, or Roman English).
              </li>
              <li>
                <strong className="text-gray-200">Anonymous Analytics:</strong> Used by Google Analytics to recognize unique visitors across browsing sessions without personal identification.
              </li>
            </ul>
            <p className="text-xs md:text-sm text-gray-400">
              💡 <strong>You are in control:</strong> You can modify your browser settings at any time to block, disable, or delete cookies. Disabling cookies will not hinder your ability to read and enjoy any kalam on our site.
            </p>
          </section>

          {/* 6. Data Security & Storage */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">5</span>
              Data Security &amp; Infrastructure
            </h2>
            <p className="mb-3">
              We employ standard, modern security measures to safeguard your interaction with Kalam Library:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-gray-300 pl-2">
              <li>
                <strong className="text-gray-200">Full SSL/TLS Encryption:</strong> All communications between your browser and our servers are encrypted via industry-standard HTTPS.
              </li>
              <li>
                <strong className="text-gray-200">Secure Cloud Hosting:</strong> Our site runs on battle-tested cloud platforms (Next.js infrastructure and Supabase database architecture) with continuous security patch updates and firewall protection.
              </li>
            </ul>
          </section>

          {/* 7. Third-Party Integrations */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">6</span>
              Third-Party Services
            </h2>
            <p className="mb-3">
              To provide you with a smooth web experience, we interface with a few trusted service providers who have their own robust privacy standards:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-gray-300 pl-2">
              <li>
                <strong className="text-gray-200">Google Analytics:</strong> For aggregate traffic measurement and performance monitoring.
              </li>
              <li>
                <strong className="text-gray-200">Google Fonts:</strong> For delivering optimized typography (Nastaliq, Devanagari, and Latin fonts).
              </li>
              <li>
                <strong className="text-gray-200">Social Channels (WhatsApp, Instagram, TikTok):</strong> Direct external links provided for community engagement and support.
              </li>
            </ul>
          </section>

          {/* 8. Your Rights & Control */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">7</span>
              Your Privacy Rights &amp; Choices
            </h2>
            <p className="mb-3">
              Regardless of where you reside, we respect your right to control your information. You may at any time:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-gray-300 pl-2">
              <li>Ask what personal communications or messages we have on record from your past inquiries.</li>
              <li>Request the prompt deletion or modification of any message or email you sent us.</li>
              <li>Opt out of Google Analytics tracking using standard browser extensions or cookie blockers.</li>
            </ul>
          </section>

          {/* 9. Contact & Support */}
          <section className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-emerald-900/20 to-emerald-950/60 border border-emerald-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">8</span>
              Contact Us Regarding Your Privacy
            </h2>
            <p className="mb-5 text-gray-300">
              If you have any questions, suggestions, or concerns regarding our privacy practices, please contact us anytime. We are happy to help:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="mailto:md.hasnain.developer@gmail.com"
                className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-500/15 hover:border-gold-500/40 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs text-gray-400">Direct Email</div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-200 group-hover:text-gold-500 transition-colors truncate">
                    md.hasnain.developer@gmail.com
                  </div>
                </div>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-500/15 hover:border-emerald-500/40 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-400">WhatsApp Support</div>
                  <div className="text-xs sm:text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    +92 317 4731957
                  </div>
                </div>
              </a>
            </div>

            <div className="mt-4 pt-4 border-t border-emerald-500/10 text-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs text-gold-500 hover:text-gold-400 transition-colors font-medium"
              >
                <span>Or send a direct message on our Contact Us page</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
