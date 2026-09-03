import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services & Requests - Digitization & Corrections",
  description: "Learn about Kalam Library services. We offer Naat lyrics digitization, scanned book transcription, corrections, and translation services.",
  alternates: {
    canonical: "https://kalamlibrary.com/services",
  },
  openGraph: {
    title: "Services & Requests - Digitization & Corrections | Kalam Library",
    description: "Learn about Kalam Library services. We offer Naat lyrics digitization, scanned book transcription, corrections, and translation services.",
    url: "https://kalamlibrary.com/services",
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
      <pattern id="services-geom" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-gold-500" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#services-geom)" />
  </svg>
);

export default function ServicesPage() {
  return (
    <main id="main-content" className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16 flex-grow relative text-left">
      <GeometricPattern />

      {/* Header */}
      <div className="text-center mb-12 border-b border-emerald-500/10 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-gold-500 mb-4">Services & Requests</h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          How to request new book digitization, contribute corrections, or ask for multi-language translations of classic Kalams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Service 1: Book Digitization */}
        <div className="p-6 rounded-2xl bg-emerald-900/10 border border-emerald-500/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center border border-gold-500/20 text-gold-500 mb-4">
              <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-100 mb-2">1. Book Digitization Request</h2>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
              Do you have a scanned collection of Naats, Hamds, or Manqabats that is not available online? You can submit the PDF or image files to our team.
            </p>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              We utilize our custom stateful AI parsing pipeline to extract, translate, and upload the odes to the Kalam Library database.
            </p>
          </div>
          <Link
            href="/contact?subject=Digitization%20Request"
            aria-label="Request digitization for scanned books"
            className="mt-6 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs hover:bg-gold-600 transition-colors w-fit"
          >
            Request Digitization
          </Link>
        </div>

        {/* Service 2: Corrections */}
        <div className="p-6 rounded-2xl bg-emerald-900/10 border border-emerald-500/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center border border-gold-500/20 text-gold-500 mb-4">
              <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-100 mb-2">2. Lyric Correction Submission</h2>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
              Accuracy is our highest priority. If you identify a typo, a missing couplet, or an incorrect transliteration in any of our Urdu, Roman, Hindi, or Bangla lyrics, let us know.
            </p>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              Submit the correct verses along with the Kalam title, and our reviewers will cross-verify and update the records.
            </p>
          </div>
          <Link
            href="/contact?subject=Lyric%20Correction"
            aria-label="Submit a lyric correction"
            className="mt-6 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/10 text-gold-500 font-bold text-xs hover:bg-emerald-900/40 hover:text-white transition-colors w-fit"
          >
            Submit a Correction
          </Link>
        </div>

        {/* Service 3: Translations */}
        <div className="p-6 rounded-2xl bg-emerald-900/10 border border-emerald-500/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center border border-gold-500/20 text-gold-500 mb-4">
              <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 7.31 16.5 3 19" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-100 mb-2">3. Translation Additions</h2>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
              We are constantly seeking to add missing translations. If you have an ode that exists in Urdu, but is missing Devanagari Hindi or Bengali transliterations, we can generate them.
            </p>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              Our automated models verify phonetic matches across scripts so that reciters can easily read their native script.
            </p>
          </div>
          <Link
            href="/contact?subject=Translation%20Addition"
            aria-label="Request multi-language translation additions"
            className="mt-6 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/10 text-gold-500 font-bold text-xs hover:bg-emerald-900/40 hover:text-white transition-colors w-fit"
          >
            Request Translation
          </Link>
        </div>

        {/* Service 4: Licensing */}
        <div className="p-6 rounded-2xl bg-emerald-900/10 border border-emerald-500/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center border border-gold-500/20 text-gold-500 mb-4">
              <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-100 mb-2">4. Licensing & Attribution</h2>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
              Kalam Library&apos;s digitizations, transliterations, and custom translations are open-resource. You are welcome to reference our formatted lyrics on other platforms.
            </p>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              We only request that you provide proper attribution and a backlink to the respective Kalam page on Kalam Library to credit our indexing work.
            </p>
          </div>
          <Link
            href="/about"
            aria-label="View licensing and attribution details"
            className="mt-6 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/10 text-gold-500 font-bold text-xs hover:bg-emerald-900/40 hover:text-white transition-colors w-fit"
          >
            Licensing Details
          </Link>
        </div>

      </div>
    </main>
  );
}
