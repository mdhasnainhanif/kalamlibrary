import { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";
import {
  Smartphone,
  Globe,
  Palette,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileEdit,
  Languages,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services - Software Development & Poetry Digitization",
  description:
    "Explore our software engineering & creative design services (Next.js web apps, mobile apps, branding) alongside our open Islamic poetry digitization and translation initiatives.",
  alternates: {
    canonical: buildCanonicalUrl("/services"),
  },
  openGraph: {
    title: `Services - Software Development & Digitization | ${SITE_CONFIG.name}`,
    description:
      "Explore our software engineering & creative design services alongside our open Islamic poetry digitization and translation initiatives.",
    url: `${SITE_CONFIG.url}/services`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Services & Solutions - Kalam Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Services - Software Development & Digitization | ${SITE_CONFIG.name}`,
    description:
      "Explore our software engineering & creative design services alongside our open Islamic poetry digitization and translation initiatives.",
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
      <pattern id="services-geom" width="80" height="80" patternUnits="userSpaceOnUse">
        <path
          d="M40 0 L80 40 L40 80 L0 40 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          className="text-gold-500"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#services-geom)" />
  </svg>
);

export default function ServicesPage() {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
  ]);

  const whatsappUrl = "https://wa.me/923174731957?text=Hi%20Hasnain%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.";

  const softwareServices = [
    {
      title: "Mobile App Development",
      badge: "iOS & Android",
      icon: Smartphone,
      description:
        "High-performance, native-feel cross-platform mobile apps built with React Native. We deliver seamless touch interactions, offline data persistence, and fluid UI experiences published directly to the App Store and Google Play.",
      features: ["React Native Cross-Platform", "Fluid Animations & Gestures", "Offline-Ready Architecture", "App Store & Play Store Setup"],
    },
    {
      title: "Website Design & Development",
      badge: "Modern Web Stacks",
      icon: Globe,
      description:
        "Fast, responsive, and SEO-dominant web applications crafted with Next.js, React, and Tailwind CSS. Designed for blazing load speeds, flawless mobile responsiveness, and optimal conversion rates.",
      features: ["Next.js & React Mastery", "Tailwind CSS Design Systems", "100/100 Core Web Vitals", "Custom API & Database Integration"],
    },
    {
      title: "Graphic Design",
      badge: "Creative Visuals",
      icon: Palette,
      description:
        "Eye-catching visual designs and high-impact marketing materials tailored to captivate your audience across social media campaigns, print collaterals, digital advertisements, and editorial assets.",
      features: ["Social Media & Ad Creatives", "Marketing Banners & Flyers", "Typography & Layout Curation", "Pixel-Perfect Vector Graphics"],
    },
    {
      title: "Logo Design & Branding",
      badge: "Identity Systems",
      icon: Sparkles,
      description:
        "Memorable, bespoke logo designs that establish timeless brand authority. We develop cohesive visual identity kits complete with custom color palettes, typography rules, and vector source assets.",
      features: ["Custom Concept Logos", "Complete Brand Guidelines", "Infinite Resolution Vectors", "Multi-Platform Export Formats"],
    },
  ];

  const libraryServices = [
    {
      title: "1. Book Digitization Request",
      icon: BookOpen,
      description:
        "Do you have a scanned collection of classic Naats, Hamds, or Manqabats that is not available online? Submit your scanned PDF or images to our team.",
      extra: "We utilize custom transcription pipelines to index and publish odes to the Kalam Library repository.",
      actionLabel: "Request Digitization",
      actionHref: "/contact?subject=Digitization%20Request",
    },
    {
      title: "2. Lyric Correction Submission",
      icon: FileEdit,
      description:
        "Accuracy is our highest priority. If you identify a typo, missing couplet, or incorrect transliteration in any of our Urdu, Roman, Hindi, or Bangla lyrics, let us know.",
      extra: "Submit the corrected verses along with the Kalam title, and our reviewers will verify and update the records.",
      actionLabel: "Submit a Correction",
      actionHref: "/contact?subject=Lyric%20Correction",
    },
    {
      title: "3. Multi-Lingual Translations",
      icon: Languages,
      description:
        "We continuously expand cross-language accessibility. If you have an ode that exists in Urdu, but lacks Devanagari Hindi or Bengali transliterations, we can generate them.",
      extra: "Our models verify phonetic accuracy so reciters can effortlessly read in their native script.",
      actionLabel: "Request Translation",
      actionHref: "/contact?subject=Translation%20Addition",
    },
    {
      title: "4. Licensing & Attribution",
      icon: ShieldCheck,
      description:
        "Kalam Library's digitizations, transliterations, and custom translations are open-resource. You are welcome to reference our formatted lyrics on external platforms.",
      extra: "We only request proper attribution and a backlink to the respective Kalam page to credit our archival work.",
      actionLabel: "Licensing Details",
      actionHref: "/terms-and-conditions",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main
        id="main-content"
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 flex-grow relative text-left"
      >
        <GeometricPattern />

        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center justify-center gap-2"
        >
          <Link href="/" className="hover:text-gold-500 transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-400 font-medium">Services &amp; Solutions</span>
        </nav>

        {/* Page Header */}
        <header className="text-center mb-16 border-b border-emerald-500/10 pb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 dark:bg-emerald-950/80 border border-emerald-500/20 text-gold-500 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            Engineering &amp; Archival Capabilities
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gold-500 mb-4 tracking-tight">
            Our Services &amp; Solutions
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            From modern bespoke software engineering and creative digital branding to preserving and translating timeless Islamic literary heritage.
          </p>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: SOFTWARE & DIGITAL SERVICES (FEATURED)            */}
        {/* ------------------------------------------------------------- */}
        <section aria-labelledby="software-services-heading" className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Custom Development &amp; Design
              </span>
              <h2
                id="software-services-heading"
                className="text-2xl md:text-3xl font-bold text-gray-100 mt-1"
              >
                Software &amp; Digital Services
              </h2>
            </div>
            <p className="text-xs md:text-sm text-gray-400 max-w-md">
              Need custom software, an engaging mobile application, or a stand-out brand identity? We engineer high-performance solutions tailored to your vision.
            </p>
          </div>

          {/* 4-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {softwareServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl bg-emerald-950/40 dark:bg-emerald-950/50 border border-emerald-500/15 hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between"
                >
                  <div>
                    {/* Icon & Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 dark:bg-emerald-950 border border-gold-500/20 flex items-center justify-center text-gold-500 group-hover:scale-110 group-hover:bg-gold-500/20 transition-all">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-900/30 dark:bg-emerald-900/40 text-emerald-400 border border-emerald-500/20">
                        {service.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-100 group-hover:text-gold-500 transition-colors mb-2.5">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-5">
                      {service.description}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-4 border-t border-emerald-500/10">
                    <ul className="space-y-2 text-xs text-gray-300">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prominent WhatsApp CTA Box */}
          <div className="mt-10 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-emerald-900/30 to-emerald-950/70 border border-emerald-500/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 hidden sm:flex">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 448 512" aria-hidden="true">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-100 mb-1">
                  Have a Project in Mind? Let&apos;s Build It.
                </h3>
                <p className="text-xs md:text-sm text-gray-300">
                  Contact us directly to get a prompt free quote, discuss technical architecture, or explore design samples.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 group cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Discuss Your Project</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: KALAM ARCHIVAL & DIGITIZATION INITIATIVE          */}
        {/* ------------------------------------------------------------- */}
        <section aria-labelledby="archival-services-heading">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-500">
              Preservation &amp; Community Contributions
            </span>
            <h2
              id="archival-services-heading"
              className="text-2xl md:text-3xl font-bold text-gray-100 mt-1"
            >
              Kalam Digitization &amp; Translations
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-xl">
              Our community archival efforts preserve historical manuscripts and diwans into searchable multi-script digital text.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {libraryServices.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-emerald-900/10 dark:bg-emerald-950/40 border border-emerald-500/10 flex flex-col justify-between hover:border-emerald-500/25 transition-all"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center border border-gold-500/20 text-gold-500 mb-4">
                      <ServiceIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-100 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-3">
                      {service.description}
                    </p>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                      {service.extra}
                    </p>
                  </div>
                  <Link
                    href={service.actionHref}
                    className="mt-6 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/20 text-gold-500 font-bold text-xs hover:bg-emerald-900/40 hover:text-white transition-colors w-fit"
                  >
                    {service.actionLabel}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
