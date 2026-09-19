import { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the terms and conditions for using Kalam Library (kalamlibrary.me). Learn about our educational mission, intellectual property attribution, and user guidelines.",
  alternates: {
    canonical: buildCanonicalUrl("/terms-and-conditions"),
  },
  openGraph: {
    title: `Terms and Conditions | ${SITE_CONFIG.name}`,
    description:
      "Understand the terms of using Kalam Library. A respectful, transparent guide to our Islamic poetry archive, author attributions, and user responsibilities.",
    url: `${SITE_CONFIG.url}/terms-and-conditions`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Kalam Library Terms and Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Terms and Conditions | ${SITE_CONFIG.name}`,
    description:
      "Understand the terms of using Kalam Library. A respectful, transparent guide to our Islamic poetry archive, author attributions, and user responsibilities.",
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
      <pattern id="terms-geom" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-gold-500" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#terms-geom)" />
  </svg>
);

export default function TermsAndConditionsPage() {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Terms and Conditions", url: "/terms-and-conditions" },
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
          <span className="text-gray-400 font-medium">Terms and Conditions</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12 border-b border-emerald-500/10 pb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/20 text-gold-500 mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Transparency &amp; Trust
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gold-500 mb-4 tracking-tight">Terms and Conditions</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to Kalam Library. Please take a moment to understand the gentle guidelines that keep our platform a peaceful, respectful space for literature lovers worldwide.
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Last Updated: September 2026 &bull; Effective Immediately
          </p>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-8 text-gray-300 leading-relaxed text-sm md:text-base">

          {/* 1. Introduction & Welcome */}
          <section className="bg-emerald-900/10 border border-emerald-500/15 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">1</span>
              Welcome to Kalam Library
            </h2>
            <p className="mb-3">
              Kalam Library (<strong className="text-gray-100 font-semibold">kalamlibrary.me</strong>) is a non-profit-oriented digital library and literary archival platform. Our heartfelt objective is to preserve, transcribe, and index historic Islamic poetry, Hamd, Naat, and Sufi Kalams across Urdu, Hindi, Bangla, and Roman English scripts.
            </p>
            <p>
              By visiting, browsing, or utilizing our website, you agree to comply with these friendly and transparent Terms and Conditions. If you have any concerns or disagree with any part of these terms, you are free to reach out to us at any time.
            </p>
          </section>

          {/* 2. Intellectual Property & Poetic Attribution */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">2</span>
              Intellectual Property &amp; Author Attribution
            </h2>
            <p className="mb-3">
              We hold the greatest admiration and reverence for the poets, scholars, and mystics who penned these timeless verses.
            </p>
            
            {/* Key Callout Box */}
            <div className="my-4 p-4 md:p-5 rounded-xl bg-emerald-950/50 border border-gold-500/20 text-gray-200">
              <p className="font-semibold text-gold-500 mb-1 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Devotional Heritage Belongs to the Respective Authors
              </p>
              <p className="text-xs md:text-sm text-gray-300">
                All original poetic texts, verses, odes, and lyrics presented on Kalam Library remain the intellectual and spiritual legacy of their respective historical authors, poets, and their literary estates (e.g., Imam Ahmad Raza Khan Qadri, Allama Muhammad Iqbal, Bedam Shah Warsi, Mufti Ahmad Yar Khan Naeemi, etc.). Kalam Library does not claim proprietary ownership over the original underlying poetry.
              </p>
            </div>

            <p className="mb-3">
              <strong className="text-gray-100 font-semibold">Educational &amp; Cultural Mission:</strong> Verses are shared on this platform under fair-use and public educational principles to assist learners, students of literature, reciters, and spiritual seekers.
            </p>
            <p>
              <strong className="text-gray-100 font-semibold">Our Platform Assets:</strong> While the sacred poetry belongs to its creators, the custom website software, digital multi-script transcriptions, user interface design, logos, and curated indexing systems are the property of Kalam Library.
            </p>
          </section>

          {/* 3. User Responsibilities & Good Conduct */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">3</span>
              User Responsibilities &amp; Fair Conduct
            </h2>
            <p className="mb-3">
              We strive to keep Kalam Library welcoming, speedy, and open for everyone. As a user, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-gray-300 pl-2">
              <li>
                <strong className="text-gray-200">Personal &amp; Educational Use:</strong> Use the lyrics and translations for personal recitation, study, memorization, and sharing with appropriate attribution.
              </li>
              <li>
                <strong className="text-gray-200">Respect Platform Infrastructure:</strong> Refrain from launching automated bots, aggressive crawlers, or scrapers that overload our servers and disrupt access for other users.
              </li>
              <li>
                <strong className="text-gray-200">Integrity:</strong> Do not attempt to reverse engineer, tamper with our security mechanisms, or inject malicious code into forms or search inputs.
              </li>
              <li>
                <strong className="text-gray-200">Constructive Community:</strong> When submitting feedback or suggested corrections, maintain a kind, polite, and constructive manner.
              </li>
            </ul>
          </section>

          {/* 4. Textual Accuracy & Historical Variants */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">4</span>
              Textual Accuracy &amp; Poetic Variants
            </h2>
            <p className="mb-3">
              Historical Islamic poetry has been transcribed and passed down through generations across diwans, manuscripts, and oral recitations. As a natural result, different published editions may contain subtle variations in wording, stanza sequencing, or diacritical marks (A&apos;raab).
            </p>
            <p className="mb-3">
              Our team takes meticulous care to cross-reference multiple authentic sources and verify translations. However, all content is provided on an <em className="text-gray-200 font-medium">“as is”</em> educational basis.
            </p>
            <p className="text-xs md:text-sm text-emerald-400">
              💡 <strong>Found a typo or variant?</strong> We warmly welcome corrections! Please send us a message via our contact channels with the verse and reference edition, and our editors will verify and update it.
            </p>
          </section>

          {/* 5. Disclaimer of Warranties */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">5</span>
              Disclaimer of Warranties &amp; Limitation of Liability
            </h2>
            <p className="mb-3">
              Kalam Library is provided completely free of charge. While we work hard to maintain 100% uptime and smooth browsing, we cannot guarantee that the service will be entirely uninterrupted, error-free, or compatible with every legacy browser setup.
            </p>
            <p className="text-xs md:text-sm text-gray-400">
              Under no circumstances shall the maintainers of Kalam Library be held liable for any direct, indirect, or incidental issues arising from your use of, or inability to access, the website or external links.
            </p>
          </section>

          {/* 6. External Links & Third-Party Services */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">6</span>
              External Links &amp; Community Channels
            </h2>
            <p>
              Our website may feature links to external third-party platforms, including WhatsApp, Instagram, and TikTok for community engagement. Please note that external sites have their own terms and privacy practices, which are independent of Kalam Library.
            </p>
          </section>

          {/* 7. Changes to Terms */}
          <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">7</span>
              Updates to These Terms
            </h2>
            <p>
              As we introduce new features, multi-language libraries, or mobile apps, we may update these Terms and Conditions to reflect those advancements. Any changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date. Continued use of the platform after updates signifies your acceptance.
            </p>
          </section>

          {/* 8. Contact Information */}
          <section className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-emerald-900/20 to-emerald-950/60 border border-emerald-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/25 flex items-center justify-center text-gold-500 text-xs font-bold">8</span>
              Questions, Copyright Inquiries, or Feedback?
            </h2>
            <p className="mb-5 text-gray-300">
              If you have any questions about these Terms and Conditions, wish to report a copyright concern, or would like to suggest a literary collaboration, our doors are always open:
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
                <span>Or visit our interactive Contact Us page</span>
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
