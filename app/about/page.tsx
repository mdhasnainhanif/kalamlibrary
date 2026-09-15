import { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";

export const metadata: Metadata = {
  title: "About Us - Our Mission & Story",
  description: "Learn about the mission of Kalam Library. We digitize, transcribe, and translate classic Sufi Kalam and Naat poetry using AI-assisted pipelines.",
  alternates: {
    canonical: buildCanonicalUrl("/about"),
  },
  openGraph: {
    title: `About Us - Our Mission & Story | ${SITE_CONFIG.name}`,
    description: "Learn about the mission of Kalam Library. We digitize, transcribe, and translate classic Sufi Kalam and Naat poetry.",
    url: `${SITE_CONFIG.url}/about`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "About Kalam Library - Islamic Poetry Digitization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About Us - Our Mission & Story | ${SITE_CONFIG.name}`,
    description: "Learn about the mission of Kalam Library. We digitize, transcribe, and translate classic Sufi Kalam and Naat poetry.",
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
      <pattern id="about-geom" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-gold-500" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#about-geom)" />
  </svg>
);

export default function AboutPage() {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16 flex-grow relative text-left">
        <GeometricPattern />

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-400 font-medium">About Us</span>
        </nav>

      {/* Header */}
      <div className="text-center mb-12 border-b border-emerald-500/10 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-gold-500 mb-4">Our Story & Mission</h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Kalam Library is a digital initiative dedicated to preserving and indexing the rich legacy of devotional Islamic poetry.
        </p>
      </div>

      {/* Story Sections */}
      <div className="flex flex-col gap-10">
        
        {/* Why Kalam Library Exists */}
        <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-4">Why We Exist</h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4">
            Devotional poetry—specifically Hamd, Naat, and Manqabat—holds a sacred place in Islamic culture, literature, and spiritual expression. However, many historical odes remain locked inside out-of-print books, handwritten manuscripts, or poorly scanned documents.
          </p>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            <strong className="text-gray-100 font-semibold">Kalam Library</strong> bridges this gap by digitizing these texts, correcting transcription anomalies, and making them easily accessible online in multiple scripts and formats.
          </p>
        </section>

        {/* The Multi-Lingual Approach */}
        <section className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-4">The Multi-Lingual Approach</h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4">
            Spiritual poetry is recited globally, crossing language boundaries. Pronunciation and literal meaning can easily be misconstrued when reading in non-native scripts.
          </p>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4">
            To make these classics accessible to everyone, we compile lyrics across four scripts:
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-300 flex flex-col gap-2">
            <li><strong>Urdu (Nastaliq):</strong> The original script for high-accuracy traditional recitation.</li>
            <li><strong>Roman English:</strong> Transliteration to assist Urdu learners and global readers with phonetic pronunciation.</li>
            <li><strong>Hindi (Devanagari):</strong> Complete script transliteration for readers in the Indian subcontinent.</li>
            <li><strong>Bangla (Bengali):</strong> Regional transliteration for the Bengali-speaking community.</li>
          </ul>
        </section>

        {/* Ingestion Engine / Technology */}
        <section className="bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-4">AI-Assisted Digitation Ingestion</h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4">
            Instead of manually typing thousands of pages of old scanned books (which often introduces human errors), we developed a custom <strong className="text-gray-100 font-semibold">Stateful AI OCR Parsing Pipeline</strong>.
          </p>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4">
            Our ingestion tools render high-resolution page buffers and process them in state-tracked batches using <strong className="text-gray-100 font-semibold">Gemini 3.1 Flash Lite</strong> API.
          </p>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            The model reads the printed pages, transcribes the lyrics line-by-line, and translates them into matching stanzas in all target scripts, which are then synchronized to our PostgreSQL database.
          </p>
        </section>

        {/* Poets & Sourcing */}
        <section className="p-6 md:p-8 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-4">Our Poets & Sourcing</h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4">
            We feature authentic poetry from renowned classical poets and spiritual figures. Some of our key featured collections include:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/5">
              <h3 className="font-bold text-gold-500 text-sm md:text-base mb-1">Imam Ahmad Raza Khan</h3>
              <p className="text-xs text-gray-400">Author of the classic 12-volume collection <em>Hadaiq-e-Bakhshish</em>, a masterpiece of devotional poetry.</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/5">
              <h3 className="font-bold text-gold-500 text-sm md:text-base mb-1">Maulana Ilyas Attar Qadri</h3>
              <p className="text-xs text-gray-400">Founder of Dawat-e-Islami and writer of <em>Wasail-e-Bakhshish</em>, focused on moral guidelines and devotion.</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/5">
              <h3 className="font-bold text-gold-500 text-sm md:text-base mb-1">Allama Hasan Raza Khan</h3>
              <p className="text-xs text-gray-400">Classical poet renowned for odes praising the Prophet Muhammad ﷺ and Sufi saints.</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/5">
              <h3 className="font-bold text-gold-500 text-sm md:text-base mb-1">Mufti-e-Azam Mustafa Raza</h3>
              <p className="text-xs text-gray-400">Prominent scholar and writer of the compilation <em>Saman-e-Bakhshish</em>.</p>
            </div>
          </div>
        </section>

      </div>
    </main>
    </>
  );
}
