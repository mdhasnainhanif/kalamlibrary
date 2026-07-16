import Link from "next/link";
import { supabase } from "@/utils/supabase";
import SearchBar from "@/components/SearchBar";

export const revalidate = 3600; // Cache for 1 hour

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
  <div className="flex items-center justify-center gap-4 my-8 w-full">
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

  // Fetch recent/featured Kalams
  const { data: kalams, error: kalamsError } = await supabase
    .from("kalams")
    .select("*, authors(*)")
    .order("created_at", { ascending: false })
    .limit(8);

  // Fetch kalam translation counts to show on author cards
  const { data: allKalams } = await supabase.from("kalams").select("id, author_id");
  const authorKalamCounts: Record<string, number> = {};
  if (allKalams) {
    allKalams.forEach((k) => {
      if (k.author_id) {
        authorKalamCounts[k.author_id] = (authorKalamCounts[k.author_id] || 0) + 1;
      }
    });
  }

  // FAQ Items
  const faqItems = [
    {
      q: "What is Kalam Library?",
      a: "Kalam Library is a structured digital archive containing lyrics of classic Sufi Kalam, Hamd, and Naat poetry. It provides exact transcriptions and translation variants across Roman English, Urdu Nastaliq, Hindi, and Bangla scripts."
    },
    {
      q: "Who are the primary poets featured here?",
      a: "Our archive focuses on prominent scholars and poets of spiritual odes, including Ala Hazrat Imam Ahmad Raza Khan Qadri, Allama Hasan Raza Khan, Mufti-e-Azam Hind Mustafa Raza Khan Qadri, and Maulana Muhammad Ilyas Attar Qadri."
    },
    {
      q: "Are these lyric transcriptions authenticated?",
      a: "Yes. Every poem is scanned and verified directly from printed publications (like Hadaiq-e-Bakhshish, Saman-e-Bakhshish, and Wasail-e-Bakhshish) utilizing advanced multimodal AI parsing engines, ensuring high accuracy line-by-line."
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

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kalam Library",
    "url": "https://kalamlibrary.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://kalamlibrary.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

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

      <main className="w-full flex-grow relative py-12 md:py-20 px-4 flex flex-col items-center">
        {/* Subtle repeating background */}
        <GeometricPattern />

        {/* Hero Section */}
        <div className="w-full max-w-4xl text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gold-500 mb-6 tracking-tight flex flex-col items-center gap-1.5">
            <span className="font-urdu text-3xl md:text-5xl text-emerald-400 font-bold block mb-2" dir="rtl">
              کلام لائبریری
            </span>
            <span className="font-sans">Kalam Library</span>
          </h1>
          
          <p className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            The ultimate multi-language Naat lyrics repository. Discover, read, and share classic Sufi poetry in Roman English, Urdu, Hindi, and Bangla.
          </p>

          {/* Search Box */}
          <SearchBar />

          {/* Core CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href="#featured"
              className="px-6 py-3 rounded-xl bg-gold-500 text-black font-bold text-sm transition-all hover:bg-gold-600 shadow-lg shadow-gold-500/10"
            >
              Browse Kalams
            </a>
            <Link
              href="/about"
              className="px-6 py-3 rounded-xl bg-emerald-950/60 text-gray-200 border border-emerald-500/10 font-bold text-sm transition-all hover:bg-emerald-900/40 hover:text-white"
            >
              Read Our Story
            </Link>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4" id="featured">
          
          {/* Left Side: Popular Poets list (1 column) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-emerald-500/15 pb-3">
              <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider font-sans">Browse by Poet</h2>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-ping"></span>
            </div>

            {authorsError || !authors || authors.length === 0 ? (
              <p className="text-xs text-gray-500">No poets uploaded yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {authors.map((author) => {
                  const authorSlug = slugify(author.name_roman);
                  const kalamCount = authorKalamCounts[author.id] || 0;
                  return (
                    <Link
                      key={author.id}
                      href={`/author/${authorSlug}`}
                      className="p-4 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center border border-gold-500/10 text-gold-500 font-semibold shrink-0 group-hover:border-gold-500/30 transition-colors">
                        {author.name_roman.charAt(0)}
                      </div>
                      <div className="flex-grow min-w-0 text-left">
                        <h3 className="font-semibold text-gray-200 group-hover:text-gold-500 transition-colors truncate">
                          {author.name_roman}
                        </h3>
                        <div className="flex justify-between items-center mt-0.5">
                          {author.name_urdu && (
                            <span className="text-[11px] text-emerald-400 font-urdu" dir="rtl">
                              {author.name_urdu}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-500 font-sans ml-auto">
                            {kalamCount} Kalam{kalamCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side: Featured Kalam list (2 columns) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-emerald-500/15 pb-3">
              <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider font-sans">Recently Added Kalam</h2>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
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

                  return (
                    <Link
                      key={kalam.id}
                      href={`/kalam/${kalam.slug}/roman-english`}
                      className="p-5 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex flex-col justify-between h-36 text-left group"
                    >
                      <div>
                        <h3 className="font-bold text-gray-100 group-hover:text-gold-500 transition-colors line-clamp-1">
                          {kalam.primary_title_roman}
                        </h3>
                        {kalam.primary_title_urdu && (
                          <p className="text-sm text-emerald-400/80 font-urdu mt-1.5 line-clamp-1" dir="rtl">
                            {kalam.primary_title_urdu}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-gray-400 font-medium truncate max-w-[70%]">
                          By {authorName}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-emerald-950/80 flex items-center justify-center text-emerald-400 border border-emerald-500/10 shrink-0">
                          <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Ornamental Divider */}
        <div className="w-full max-w-6xl">
          <OrnamentalDivider />
        </div>

        {/* Browse by Language Quick Links */}
        <div className="w-full max-w-6xl py-8 text-center">
          <h2 className="text-xl font-bold text-gray-200 mb-6 font-sans">Browse lyrics by Language</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Roman English", sub: "English Transliteration", href: "/search?q=roman", badge: "Roman" },
              { label: "Urdu (Nastaliq)", sub: "اردو رسم الخط", href: "/search?q=urdu", badge: "Urdu" },
              { label: "Hindi (Devanagari)", sub: "हिन्दी लिपि", href: "/search?q=hindi", badge: "Hindi" },
              { label: "Bangla (Bengali)", sub: "বাংলা লিপি", href: "/search?q=bangla", badge: "Bangla" }
            ].map((lang) => (
              <Link
                key={lang.label}
                href={lang.href}
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
                <p className="text-xs text-gray-400 mt-1.5">{lang.sub}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Teaser block linking to About/Services */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
          <div className="p-6 rounded-2xl bg-emerald-900/10 border border-emerald-500/10 flex flex-col justify-between text-left">
            <div>
              <h3 className="text-lg font-bold text-gold-500 mb-2">Our Digital Mission</h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
                We are archiving and preserving spiritual poetry. Utilizing advanced AI OCR models, we digitize text exactly from historical collections like Hadaiq-e-Bakhshish and Wasail-e-Bakhshish, translating odes into multiple languages for readers globally.
              </p>
            </div>
            <Link
              href="/about"
              className="text-xs font-bold text-emerald-400 hover:text-gold-500 flex items-center gap-1 group w-fit"
            >
              <span>Learn about our mission</span>
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-900/10 border border-emerald-500/10 flex flex-col justify-between text-left">
            <div>
              <h3 className="text-lg font-bold text-gold-500 mb-2">Digitization Services</h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
                Do you have a scanned compilation or a rare collection of Naats and Kalam that you want digitized? We offer accurate transcription, custom transliterations, and multi-language translation formatting.
              </p>
            </div>
            <Link
              href="/services"
              className="text-xs font-bold text-emerald-400 hover:text-gold-500 flex items-center gap-1 group w-fit"
            >
              <span>Explore services</span>
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* WhatsApp Support CTA */}
        <div className="w-full max-w-6xl p-6 md:p-8 rounded-2xl bg-emerald-950/60 border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left mt-8">
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-100 flex items-center justify-center md:justify-start gap-2">
              <svg className="w-5 h-5 text-emerald-400 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.46 4.887 1.461 5.436-.001 9.861-4.43 9.864-9.869.003-2.636-1.018-5.114-2.875-6.974C16.602 1.95 14.135.928 11.5.927c-5.439 0-9.867 4.431-9.87 9.871-.001 1.765.467 3.49 1.357 5.018l-.989 3.607 3.659-.97zm11.755-7.25c-.322-.162-1.905-.94-2.2-.1.047-.297-.156-.454-.234-.57l-.375-.544c-.218-.328-.5-.331-.765-.112l-.24.2c-.22.18-.35.32-.5.53-.15.2-.28.45-.44.62-.31.33-.6.3-.92.12-.32-.18-.62-.38-.91-.6-.24-.18-.46-.38-.68-.6-.23-.23-.42-.48-.6-.74-.18-.26-.17-.4-.05-.55.12-.15.24-.31.36-.47.12-.16.16-.27.24-.45.08-.18.04-.33-.02-.49-.06-.16-.54-1.32-.74-1.81-.19-.48-.38-.41-.53-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.03 0 1.2.88 2.37 1 2.53.12.16 1.73 2.637 4.19 3.7c.584.253 1.04.404 1.396.517.588.187 1.123.161 1.546.098.472-.07 1.464-.599 1.67-1.177.206-.577.206-1.072.144-1.176-.06-.104-.22-.167-.54-.33z" />
              </svg>
              <span>Join our WhatsApp Community</span>
            </h3>
            <p className="text-xs text-gray-400 mt-2 max-w-lg leading-relaxed">
              Stay updated with newly digitized books, transcription releases, and corrections. Join our active WhatsApp group.
            </p>
          </div>
          <a
            href="https://wa.me/923174731957"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shrink-0 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            Join Group
          </a>
        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-3xl py-12 text-left">
          <h2 className="text-2xl font-bold text-gold-500 mb-2 text-center font-sans">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-400 text-center mb-8">Got questions? We have answers.</p>
          
          <div className="flex flex-col gap-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-emerald-900/10 border border-emerald-500/10"
              >
                <h3 className="font-bold text-gray-100 text-sm md:text-base mb-2">
                  {item.q}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
