import { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";

interface PageProps {
  searchParams: Promise<{ subject?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { subject } = await searchParams;
  const hasPrefill = Boolean(subject?.trim());

  return {
    title: "Contact Us - Support & Inquiries",
    description: "Get in touch with the Kalam Library team. Contact us on WhatsApp +92 317 4731957 or email md.hasnain.developer@gmail.com for corrections or requests.",
    robots: hasPrefill ? { index: false, follow: true, googleBot: { index: false, follow: true } } : undefined,
    alternates: {
      canonical: buildCanonicalUrl("/contact"),
    },
    openGraph: {
      title: `Contact Us - Support & Inquiries | ${SITE_CONFIG.name}`,
      description: "Get in touch with the Kalam Library team. Contact us on WhatsApp +92 317 4731957 or email md.hasnain.developer@gmail.com.",
      url: `${SITE_CONFIG.url}/contact`,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.defaultOgImage,
          width: 1200,
          height: 630,
          alt: "Contact Kalam Library - Devotional Poetry Support",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Contact Us - Support & Inquiries | ${SITE_CONFIG.name}`,
      description: "Get in touch with the Kalam Library team. Contact us on WhatsApp +92 317 4731957 or email md.hasnain.developer@gmail.com.",
      images: [SITE_CONFIG.defaultOgImage],
    },
  };
}

const GeometricPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none -z-10"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <defs>
      <pattern id="contact-geom" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M25 0 L50 25 L25 50 L0 25 Z M25 10 L25 40 M10 25 L40 25" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-gold-500" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#contact-geom)" />
  </svg>
);

export default async function ContactPage({ searchParams }: PageProps) {
  const { subject = "" } = await searchParams;

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Kalam Library",
    "description": "Contact methods for Kalam Library including WhatsApp support and online messaging form.",
    "mainEntity": {
      "@type": "ContactPoint",
      "telephone": "+92-317-4731957",
      "contactType": "customer support",
      "email": "md.hasnain.developer@gmail.com",
      "availableLanguage": ["Urdu", "English", "Hindi", "Bengali"]
    }
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
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
          <span className="text-gray-400 font-medium">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12 border-b border-emerald-500/10 pb-6">
          <h1 className="text-3xl md:text-5xl font-bold text-gold-500 mb-4">Contact Us</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Have questions, correction submissions, or book requests? Get in touch with our digitization team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Contact Details (1 Column) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Direct Cards */}
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/10 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider">Direct Contacts</h2>
              
              {/* WhatsApp Card */}
              <a
                href="https://wa.me/923174731957"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp +92 317 4731957 (opens in a new tab)"
                className="p-4 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow flex items-center gap-4 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-400/20 text-emerald-400 shrink-0">
                  <svg aria-hidden="true" className="w-5 h-5 fill-current" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-200 group-hover:text-gold-500 transition-colors text-sm">WhatsApp Chat</h3>
                  <p className="text-xs text-gray-400 mt-0.5">+92 317 4731957 <span className="sr-only">(opens in a new tab)</span></p>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:md.hasnain.developer@gmail.com"
                aria-label="Send email to md.hasnain.developer@gmail.com"
                className="p-4 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow flex items-center gap-4 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center border border-gold-500/25 text-gold-500 shrink-0">
                  <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-200 group-hover:text-gold-500 transition-colors text-sm">Email Address</h3>
                  <p className="text-xs text-gray-400 mt-0.5 break-words">md.hasnain.developer@gmail.com</p>
                </div>
              </a>

            </div>

            {/* Note Panel */}
            <div className="p-6 rounded-2xl bg-emerald-900/10 border border-emerald-500/10 text-left">
              <h2 className="text-sm font-bold text-gold-500 mb-2">Response Expectation</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                We read every submission. We usually reply within <strong>24 to 48 hours</strong>. For digitization requests, processing timelines may vary depending on the count of pages in the submitted PDF files.
              </p>
            </div>

          </div>

          {/* Form Ingestion (2 Columns) */}
          <div className="lg:col-span-2">
            <ContactForm defaultSubject={subject} />
          </div>

        </div>
      </main>
    </>
  );
}
