import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { getAuthorUrduName } from "@/utils/authorHelper";
import SearchBar from "@/components/SearchBar";
import FAQAccordion from "@/components/FAQAccordion";
import { SITE_CONFIG, buildCanonicalUrl, buildWebSiteSchema } from "@/utils/seoConfig";
import { FEATURED_KALAM_SLUGS, filterIndexableKalams, kalamHref } from "@/utils/kalam";

export const revalidate = 3600; // Cache for 1 hour

export const metadata: Metadata = {
  title: {
    absolute: "Naat Lyrics in Urdu, Hindi, Roman & Bangla | Kalam Library",
  },
  description: SITE_CONFIG.description,
  alternates: {
    canonical: buildCanonicalUrl("/"),
  },
  openGraph: {
    title: "Naat Lyrics in Urdu, Hindi, Roman & Bangla | Kalam Library",
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    type: "website",
    siteName: SITE_CONFIG.name,
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

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

// Geometric Pattern Component for background styling
const GeometricPattern = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none -z-10"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <defs>
      <pattern
        id="islamic-geom"
        width="80"
        height="80"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 40,0 L 60,20 L 80,40 L 60,60 L 40,80 L 20,60 L 0,40 L 20,20 Z M 40,15 L 40,65 M 15,40 L 65,40 M 20,20 L 60,60 M 20,60 L 60,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gold-500"
        />
        <circle
          cx="40"
          cy="40"
          r="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gold-500"
        />
        <polygon
          points="40,28 48,40 40,52 32,40"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          className="text-gold-500"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamic-geom)" />
  </svg>
);

// Rosette Flourish Divider
const OrnamentalDivider = () => (
  <div aria-hidden="true" className="flex items-center justify-center gap-4 my-8 w-full">
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-gold-500/30"></div>
    <div className="text-gold-500 flex items-center justify-center shrink-0 w-6 h-6">
      <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="1" viewBox="0 0 24 24">
        <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </div>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-gold-500/30"></div>
  </div>
);

export default async function Home() {
  // Fetch popular poets
  const { data: authors, error: authorsError } = await supabase
    .from("authors")
    .select("*")
    .limit(8);

  const { data: featuredRows, error: kalamsError } = await supabase
    .from("kalams")
    .select("*, authors(*), kalam_translations(language, title)")
    .in("slug", [...FEATURED_KALAM_SLUGS]);

  const featuredBySlug = new Map((featuredRows || []).map((row) => [row.slug, row]));
  const kalams = FEATURED_KALAM_SLUGS.map((slug) => featuredBySlug.get(slug)).filter(
    (row): row is NonNullable<typeof row> => Boolean(row)
  );

  function featuredUrduTitle(kalam: (typeof kalams)[number]): string {
    const primary = (kalam.primary_title_urdu || "").trim();
    if (primary && /[\u0600-\u06FF]/.test(primary)) return primary;
    const translations = kalam.kalam_translations;
    const list = Array.isArray(translations) ? translations : translations ? [translations] : [];
    const urduRow = list.find((t) => t.language === "urdu");
    const fromTrans = (urduRow?.title || "").trim();
    if (fromTrans && /[\u0600-\u06FF]/.test(fromTrans)) return fromTrans;
    return primary;
  }

  const { data: allKalams } = await supabase
    .from("kalams")
    .select("id, author_id, slug, primary_title_roman, primary_title_urdu");
  const indexableKalams = filterIndexableKalams(allKalams);
  const authorKalamCounts: Record<string, number> = {};
  indexableKalams.forEach((k) => {
    if (k.author_id) {
      authorKalamCounts[k.author_id] = (authorKalamCounts[k.author_id] || 0) + 1;
    }
  });

  // FAQ Items
  const faqItems = [
    {
      q: "What is Kalam Library?",
      a: "Kalam Library is a structured digital archive containing lyrics of classic Sufi Kalam, Hamd, and Naat poetry. It provides exact transcriptions and translation variants across Roman English, Urdu Nastaliq, Hindi, and Bangla scripts."
    },
    {
      q: "Who are the primary poets featured here?",
      a: "Our archive focuses on prominent scholars and poets of spiritual odes, including <strong>Ala Hazrat Imam Ahmad Raza Khan Qadri</strong>, <strong>Allama Hasan Raza Khan</strong>, <strong>Mufti-e-Azam Hind Mustafa Raza Khan Qadri</strong>, and <strong>Maulana Muhammad Ilyas Attar Qadri</strong>."
    },
    {
      q: "How accurate are these lyric transcriptions?",
      a: "Poems are digitized from printed books such as Hadaiq-e-Bakhshish, Saman-e-Bakhshish, and Wasail-e-Bakhshish using an AI-assisted OCR pipeline, then formatted into Roman English, Urdu, Hindi, and Bangla. The archive is a reading aid, not a certified critical edition. Please use the Report an error link on any kalam page if you spot a mistake."
    },
    {
      q: "Can I request a Naat or Kalam to be digitized?",
      a: "Absolutely! If you have a scanned book, PDF or specific Kalam you want added to our digital library, you can request it through our Services page or contact our team directly via WhatsApp."
    }
  ];

  // FAQ Schema.org JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  const orgSchema = buildWebSiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <main id="main-content" className="container flex-grow relative py-12 md:py-20 flex flex-col items-center">
        {/* Subtle repeating background */}
        <GeometricPattern />

        {/* Hero Section */}
        <div className="w-full max-w-4xl text-center mb-16 relative z-0">
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gold-500 mb-6 tracking-tight flex flex-col items-center gap-1.5">
            <span lang="ur" className="font-urdu text-3xl md:text-5xl text-emerald-400 font-bold block mb-2 min-h-[2.75rem] md:min-h-[4rem]" dir="rtl">
              کلام لائبریری
            </span>
            <span className="font-sans">Kalam Library</span>
            <span className="text-base md:text-2xl font-semibold text-gray-200 tracking-normal">
              Naat Lyrics in Urdu, Hindi, Roman &amp; Bangla
            </span>
          </h1>
          
          <p className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            A digital archive of Islamic Naat, Hamd, and Sufi Kalam lyrics. Read classic and contemporary poems in Roman English, Urdu Nastaliq, Hindi, and Bangla.
          </p>

          {/* Search Box */}
          <SearchBar />

          {/* Core CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/kalams"
              className="px-6 py-3 rounded-xl bg-gold-500 text-black font-bold text-sm transition-all hover:bg-gold-600 shadow-lg shadow-gold-500/10"
            >
              Browse All Kalams
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 rounded-xl bg-emerald-950/60 text-gray-200 border border-emerald-500/10 font-bold text-sm transition-all hover:bg-emerald-900/40 hover:text-white"
            >
              Read Our Story
            </Link>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4" id="featured">
          
          {/* Left Side: Popular Poets list (1 column) */}
          <section className="lg:col-span-1 flex flex-col gap-6" aria-label="Browse by Poet">
            <div className="flex items-center gap-2 border-b border-emerald-500/15 pb-3">
              <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider font-sans">Browse by Poet</h2>
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
            </div>

            {authorsError || !authors || authors.length === 0 ? (
              <p className="text-xs text-gray-400">No poets uploaded yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {authors.map((author) => {
                  const authorSlug = slugify(author.name_roman);
                  const kalamCount = authorKalamCounts[author.id] || 0;
                  const urduName = getAuthorUrduName(author);
                  return (
                    <Link
                      key={author.id}
                      href={`/author/${authorSlug}`}
                      aria-label={`Read Kalam lyrics by ${author.name_roman}`}
                      className="p-4 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex items-center gap-4 group"
                    >
                      <div aria-hidden="true" className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center border border-gold-500/10 text-gold-500 font-semibold shrink-0 group-hover:border-gold-500/30 transition-colors">
                        {author.name_roman.charAt(0)}
                      </div>
                      <div className="flex-grow min-w-0 text-left">
                        <h3 className="font-semibold text-gray-200 group-hover:text-gold-500 transition-colors truncate">
                          {author.name_roman}
                        </h3>
                        <div className="flex justify-between items-center mt-0.5">
                          {urduName && (
                             <span lang="ur" className="text-xs text-emerald-400 font-urdu block py-0.5" dir="rtl">
                               {urduName}
                             </span>
                           )}
                          <span className="text-[10px] text-gray-400 font-sans ml-auto">
                            {kalamCount} Kalam{kalamCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                <Link
                  href="/authors"
                  className="mt-1 p-3 text-center rounded-xl bg-emerald-950/40 border border-emerald-500/15 text-gold-500 hover:text-white hover:bg-emerald-900/40 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View all poets</span>
                  <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </section>

          {/* Right Side: Featured Kalam list (2 columns) */}
          <section className="lg:col-span-2 flex flex-col gap-6" aria-label="Popular Naats">
            <div className="flex items-center gap-2 border-b border-emerald-500/15 pb-3">
              <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider font-sans">Popular Naats</h2>
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
            </div>

            {kalamsError || !kalams || kalams.length === 0 ? (
              <div className="text-center py-12 bg-emerald-900/5 border border-dashed border-emerald-500/10 rounded-xl">
                <p className="text-gray-400 text-sm">No Kalam found in the library yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kalams.map((kalam) => {
                  const authorData = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;
                  const authorName = authorData ? authorData.name_roman : "Unknown Poet";
                  const urduTitle = featuredUrduTitle(kalam);

                  return (
                    <Link
                      key={kalam.id}
                      href={kalamHref(kalam.slug)}
                      aria-label={`Read ${kalam.primary_title_roman} lyrics by ${authorName}`}
                      className="kalam-list-card p-5 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex flex-col justify-between min-h-36 text-left group"
                    >
                      <div className="kalam-list-card__body">
                        <h3 className="kalam-list-title kalam-list-title--1 font-bold text-gray-100 group-hover:text-gold-500 transition-colors">
                          {kalam.primary_title_roman}
                        </h3>
                        {urduTitle && (
                          <p lang="ur" className="kalam-list-urdu text-lg text-emerald-400/80 font-urdu mt-1.5 py-1" dir="rtl">
                            {urduTitle}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-gray-400 font-medium truncate max-w-[70%]">
                          By {authorName}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-emerald-950/80 flex items-center justify-center text-emerald-400 border border-emerald-500/10 shrink-0">
                          <svg aria-hidden="true" className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                <div className="md:col-span-2 pt-2">
                  <Link
                    href="/kalams"
                    className="p-3.5 text-center rounded-xl bg-emerald-950/40 border border-emerald-500/15 text-gold-500 hover:text-white hover:bg-emerald-900/40 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 w-full"
                  >
                    <span>Explore all 700+ Kalams in Library</span>
                    <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </section>

        </div>

        {/* Ornamental Divider */}
        <div className="w-full">
          <OrnamentalDivider />
        </div>

        {/* Browse by Language Quick Links */}
        <section className="w-full py-8 text-center" aria-label="Browse lyrics by Language">
          <h2 className="text-xl font-bold text-gray-200 mb-6 font-sans">Browse lyrics by Language</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Roman English", sub: "English Transliteration", href: "/lyrics/roman-english", badge: "Roman", langCode: "en", dir: "ltr", fontClass: "" },
              { label: "Urdu (Nastaliq)", sub: "اردو رسم الخط", href: "/lyrics/urdu", badge: "Urdu", langCode: "ur", dir: "rtl", fontClass: "font-urdu text-sm" },
              { label: "Hindi (Devanagari)", sub: "हिन्दी लिपि", href: "/lyrics/hindi", badge: "Hindi", langCode: "hi", dir: "ltr", fontClass: "" },
              { label: "Bangla (Bengali)", sub: "বাংলা লিপি", href: "/lyrics/bangla", badge: "Bangla", langCode: "bn", dir: "ltr", fontClass: "" }
            ].map((lang) => (
              <Link
                key={lang.label}
                href={lang.href}
                aria-label={`Browse Naat lyrics in ${lang.label}`}
                className="p-5 rounded-xl bg-emerald-900/10 border border-emerald-500/10 hover:bg-emerald-900/20 hover-gold-glow transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/10 text-emerald-300 font-semibold uppercase tracking-wider">
                    {lang.badge}
                  </span>
                  <h3 className="font-bold text-gray-100 group-hover:text-gold-500 transition-colors mt-3 text-sm md:text-base">
                    {lang.label}
                  </h3>
                </div>
                <p
                  lang={lang.langCode}
                  dir={lang.dir as "ltr" | "rtl"}
                  className={`text-xs text-gray-400 mt-1.5 ${lang.fontClass}`}
                >
                  {lang.sub}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Teaser block linking to About/Services */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
          <div className="p-6 rounded-2xl bg-emerald-900/10 border border-emerald-500/10 flex flex-col justify-between text-left">
            <div>
              <h2 className="text-lg font-bold text-gold-500 mb-2">Our Digital Mission</h2>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
                We digitize printed Hamd, Naat, and Kalam collections such as Hadaiq-e-Bakhshish and Wasail-e-Bakhshish, then present the lyrics in Urdu, Hindi, Bangla, and Roman English. The archive is a reading aid produced with an AI-assisted pipeline, and we welcome corrections.
              </p>
            </div>
            <Link
              href="/about"
              className="text-xs font-bold text-emerald-400 hover:text-gold-500 flex items-center gap-1 group w-fit"
            >
              <span>Learn about our mission</span>
              <svg aria-hidden="true" className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-900/10 border border-emerald-500/10 flex flex-col justify-between text-left">
            <div>
              <h2 className="text-lg font-bold text-gold-500 mb-2">Digitization Services</h2>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
                Do you have a scanned compilation or a rare collection of Naats and Kalam that you want digitized? We offer accurate transcription, custom transliterations, and multi-language translation formatting.
              </p>
            </div>
            <Link
              href="/services"
              className="text-xs font-bold text-emerald-400 hover:text-gold-500 flex items-center gap-1 group w-fit"
            >
              <span>Explore services</span>
              <svg aria-hidden="true" className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Spiritual Couplet Showcase */}
        <section aria-label="Spiritual Couplet Showcase" className="w-full p-8 md:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-emerald-900/10 to-emerald-950/40 border border-emerald-500/10 text-center relative overflow-hidden mt-8 shadow-2xl">
          <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div aria-hidden="true" className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <span className="text-[10px] uppercase font-bold text-gold-500 tracking-[0.2em] mb-4 block">Spiritual Couplet Showcase</span>
          
          <p lang="ur" className="font-urdu text-2xl md:text-3xl lg:text-4xl text-emerald-300 leading-loose mb-6 max-w-3xl mx-auto" dir="rtl">
            مصطفٰے جانِ رحمت پہ لاکھوں سلام<br />
            شمعِ بزمِ ہدایت پہ لاکھوں سلام
          </p>
          
          <p className="text-xs md:text-sm text-gray-400 italic mb-2 font-sans">
            &quot;Mustafa Jaan-e-Rehmat Pe Lakhon Salaam, Shama-e-Bazm-e-Hidayat Pe Lakhon Salaam&quot;
          </p>
          <p className="text-xs text-gold-500 font-semibold font-sans">
            — Imam Ahmad Raza Khan Qadri (Hadaiq-e-Bakhshish)
          </p>
        </section>

        {/* FAQ Section */}
        <section aria-label="Frequently Asked Questions" className="w-full max-w-3xl py-12 text-left">
          <h2 className="text-2xl font-bold text-gold-500 mb-2 text-center font-sans">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-400 text-center mb-8">Got questions? We have answers.</p>
          
          <FAQAccordion items={faqItems} />
        </section>

      </main>
    </>
  );
}
