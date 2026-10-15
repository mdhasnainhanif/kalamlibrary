"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Globe2,
  Languages,
  Library,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import FAQAccordion from "@/components/FAQAccordion";
import HomePageAd from "@/components/HomePageAd";
import { authorLabelFromRoman, getAuthorUrduName } from "@/utils/authorHelper";
import { kalamHref } from "@/utils/kalam";
import {
  bentoCtaBlockClass,
  bentoCtaClass,
  bentoInnerCardClass,
  bentoPanelClass,
  kalamGridCardClass,
  kalamGridCardFooterClass,
  poetAvatarClass,
} from "@/utils/kalamCardStyles";

export type HomeAuthor = {
  id: string;
  name_roman: string;
};

export type HomeKalam = {
  id: string;
  slug: string;
  primary_title_roman: string;
  primary_title_urdu?: string | null;
  authors: { name_roman: string } | { name_roman: string }[] | null;
  kalam_translations?: { language: string; title: string }[] | null;
};

export type FAQItem = { q: string; a: string };

type HomePageViewProps = {
  authors: HomeAuthor[] | null;
  authorsError: boolean;
  kalams: HomeKalam[];
  kalamsError: boolean;
  authorKalamCounts: Record<string, number>;
  faqItems: FAQItem[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

function featuredUrduTitle(kalam: HomeKalam): string {
  const primary = (kalam.primary_title_urdu || "").trim();
  if (primary && /[\u0600-\u06FF]/.test(primary)) return primary;
  const translations = kalam.kalam_translations;
  const list = Array.isArray(translations) ? translations : translations ? [translations] : [];
  const urduRow = list.find((t) => t.language === "urdu");
  const fromTrans = (urduRow?.title || "").trim();
  if (fromTrans && /[\u0600-\u06FF]/.test(fromTrans)) return fromTrans;
  return primary;
}

const cardHover = "transition-all duration-300 hover:scale-[1.02] hover-gold-glow";

const showcasePanelClass =
  "kalam-card-surface glass-panel premium-card relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-white/80 p-6 text-center md:p-8 dark:border-emerald-500/10 dark:bg-gradient-to-br dark:from-emerald-950/40 dark:via-emerald-900/10 dark:to-emerald-950/40";

export default function HomePageView({
  authors,
  authorsError,
  kalams,
  kalamsError,
  authorKalamCounts,
  faqItems,
}: HomePageViewProps) {
  const languages = [
    { label: "Roman English", sub: "English Transliteration", href: "/lyrics/roman-english", badge: "Roman", langCode: "en", dir: "ltr" as const, fontClass: "" },
    { label: "Urdu (Nastaliq)", sub: "اردو رسم الخط", href: "/lyrics/urdu", badge: "Urdu", langCode: "ur", dir: "rtl" as const, fontClass: "font-urdu text-sm" },
    { label: "Hindi (Devanagari)", sub: "हिन्दी लिपि", href: "/lyrics/hindi", badge: "Hindi", langCode: "hi", dir: "ltr" as const, fontClass: "" },
    { label: "Bangla (Bengali)", sub: "বাংলা লিপি", href: "/lyrics/bangla", badge: "Bangla", langCode: "bn", dir: "ltr" as const, fontClass: "" },
  ];

  return (
    <main id="main-content" className="relative flex flex-col items-stretch">
      {/* Hero — white band */}
      <section className="page-section w-full py-8 md:py-12">
        <div className="container relative mx-auto max-w-4xl text-center">
        <div className="relative z-10">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/75 px-3 py-1 text-xs font-medium tracking-wide text-slate-600 shadow-sm backdrop-blur-md dark:border-emerald-500/15 dark:bg-emerald-950/50 dark:text-gray-300 dark:shadow-none">
            <Sparkles className="h-3.5 w-3.5 text-gold-500" aria-hidden />
            750+ Naats · Urdu · Roman · Hindi · Bangla
          </p>
          <h1 className="flex flex-col items-center gap-2 tracking-tight">
            <span lang="ur" dir="rtl" className="font-urdu text-3xl font-bold text-emerald-400 md:text-5xl">
              کلام لائبریری
            </span>
            <span className="text-4xl font-extrabold text-gold-500 sm:text-5xl md:text-6xl lg:text-7xl">
              Kalam Library
            </span>
            <span className="mt-1 max-w-2xl text-base font-semibold leading-relaxed text-slate-700 md:text-2xl dark:text-gray-200">
              Naat Lyrics in Urdu, Hindi, Roman &amp; Bangla
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-lg dark:text-gray-300">
            A digital archive of Islamic Naat, Hamd, and Sufi Kalam. Read classic and contemporary poems in Roman
            English, Urdu Nastaliq, Hindi, and Bangla.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/kalams"
              className={`inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-gold-500/10 hover:bg-gold-600 ${cardHover}`}
            >
              Browse All Kalams
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/about"
              className={`inline-flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-white/90 px-6 py-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md hover:bg-emerald-50 hover:text-emerald-900 dark:border-emerald-500/10 dark:bg-emerald-950/60 dark:text-gray-200 dark:shadow-none dark:hover:bg-emerald-900/40 dark:hover:text-white ${cardHover}`}
            >
              Read Our Story
            </Link>
          </div>
        </div>
        </div>
      </section>

      <HomePageAd />

      {/* Bento: Poets + Popular — soft gray-green band */}
      <section className="page-section-alt w-full py-8 md:py-12" id="featured" aria-label="Featured content">
        <div className="container mx-auto">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Discover</h2>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-800 md:text-3xl dark:text-gray-200">
              Poets &amp; popular naats
            </p>
          </div>
          <Link
            href="/trending"
            className="hidden items-center gap-1 text-sm font-medium text-slate-500 hover:text-gold-500 sm:inline-flex dark:text-gray-400"
          >
            Trending <TrendingUp className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-5">
          {/* Poets — tall bento */}
          <article className={`${bentoPanelClass} lg:col-span-4 lg:row-span-2`}>
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-gold-500" aria-hidden />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-200">
                Browse by Poet
              </h3>
            </div>
            {authorsError || !authors?.length ? (
              <p className="text-sm text-gray-400">No poets uploaded yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {authors.map((author) => {
                  const authorSlug = slugify(author.name_roman);
                  const kalamCount = authorKalamCounts[author.id] || 0;
                  const urduName = getAuthorUrduName(author);
                  return (
                    <li key={author.id}>
                      <Link
                        href={`/author/${authorSlug}`}
                        className={`${bentoInnerCardClass} group flex items-start gap-3 p-3 ${cardHover}`}
                      >
                        <span className={poetAvatarClass}>{author.name_roman.charAt(0)}</span>
                        <span className="min-w-0 flex-1 text-left">
                          <span className="author-list-name font-semibold text-slate-800 group-hover:text-amber-800 dark:text-gray-200 dark:group-hover:text-gold-500">
                            {author.name_roman}
                          </span>
                          <span className="mt-1 flex items-center justify-between gap-2">
                            {urduName ? (
                              <span
                                lang="ur"
                                dir="rtl"
                                className="author-list-urdu font-urdu text-xs text-emerald-700 dark:text-emerald-400"
                              >
                                {urduName}
                              </span>
                            ) : (
                              <span className="min-w-0 flex-1" />
                            )}
                            <span className="shrink-0 rounded-md bg-emerald-100/80 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-gray-400">
                              {kalamCount} Kalam{kalamCount !== 1 ? "s" : ""}
                            </span>
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link href="/authors" className={`${bentoCtaClass} mt-4`}>
              View all poets <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </article>

          {/* Popular naats — wide bento */}
          <article className={`${bentoPanelClass} lg:col-span-8`}>
            <div className="mb-4 flex items-center gap-2">
              <Library className="h-5 w-5 text-gold-500" aria-hidden />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-200">Popular Naats</h3>
            </div>
            {kalamsError || !kalams.length ? (
              <p className="rounded-xl border border-dashed border-emerald-500/10 py-12 text-center text-sm text-gray-400">
                No Kalam found in the library yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {kalams.map((kalam) => {
                  const authorData = Array.isArray(kalam.authors) ? kalam.authors[0] : kalam.authors;
                  const authorName = authorLabelFromRoman(authorData?.name_roman);
                  const urduTitle = featuredUrduTitle(kalam);
                  return (
                    <Link
                      key={kalam.id}
                      href={kalamHref(kalam.slug)}
                      className={`${kalamGridCardClass} ${cardHover}`}
                    >
                      <div className="kalam-list-card__body space-y-1.5">
                        <h4 className="kalam-list-title kalam-list-title--4 text-sm font-bold leading-snug text-slate-800 group-hover:text-amber-800 dark:text-gray-100 dark:group-hover:text-gold-500">
                          {kalam.primary_title_roman}
                        </h4>
                        {urduTitle ? (
                          <p
                            lang="ur"
                            dir="rtl"
                            className="kalam-list-urdu font-urdu text-base text-emerald-700 dark:text-emerald-400/90"
                          >
                            {urduTitle}
                          </p>
                        ) : null}
                      </div>
                      {authorName ? (
                        <div className={kalamGridCardFooterClass}>
                          <span className="kalam-card-author text-[11px] text-slate-500 dark:text-gray-400">
                            By {authorName}
                          </span>
                        </div>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            )}
            <Link href="/kalams" className={`${bentoCtaBlockClass} mt-4`}>
              Explore all 700+ Kalams <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </article>

          {/* Language bento strip */}
          <article className={`${bentoPanelClass} lg:col-span-8`}>
            <div className="mb-4 flex items-center gap-2">
              <Languages className="h-5 w-5 text-gold-500" aria-hidden />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-200">Browse by language</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {languages.map((lang) => (
                <Link
                  key={lang.href}
                  href={lang.href}
                  className={`${bentoInnerCardClass} group p-4 text-left ${cardHover}`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    {lang.badge}
                  </span>
                  <span className="mt-2 block text-sm font-bold text-slate-800 group-hover:text-gold-500 dark:text-gray-100">{lang.label}</span>
                  <span
                    lang={lang.langCode}
                    dir={lang.dir}
                    className={`mt-1 block text-xs text-slate-500 dark:text-gray-400 ${lang.fontClass}`}
                  >
                    {lang.sub}
                  </span>
                </Link>
              ))}
            </div>
          </article>
        </div>
        </div>
      </section>

      {/* Mission bento — white band */}
      <section className="page-section w-full py-8 md:py-12" aria-label="Mission and services">
        <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <div className={`${bentoPanelClass} p-6 md:p-8 ${cardHover}`}>
            <BookOpen className="mb-3 h-6 w-6 text-gold-500" aria-hidden />
            <h2 className="text-lg font-bold tracking-tight text-gold-500">Our Digital Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-gray-400">
              We digitize printed Hamd, Naat, and Kalam collections such as Hadaiq-e-Bakhshish and Wasail-e-Bakhshish,
              then present lyrics in Urdu, Hindi, Bangla, and Roman English — a reading aid with community corrections.
            </p>
            <Link href="/about" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-400 hover:text-gold-500">
              Learn about our mission <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className={`${bentoPanelClass} p-6 md:p-8 ${cardHover}`}>
            <Globe2 className="mb-3 h-6 w-6 text-gold-500" aria-hidden />
            <h2 className="text-lg font-bold tracking-tight text-gold-500">Digitization Services</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-gray-400">
              Have a scanned compilation or rare Naat collection? We offer transcription, transliteration, and
              multi-language formatting for your library or community.
            </p>
            <Link href="/services" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-400 hover:text-gold-500">
              Explore services <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="page-section-alt w-full py-8 md:py-10" aria-label="Spiritual Couplet Showcase">
        <div className="container mx-auto">
          <div className={`${showcasePanelClass} relative z-10`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500">
              Spiritual Couplet Showcase
            </span>
            <p
              lang="ur"
              dir="rtl"
              className="font-urdu mx-auto mt-4 max-w-3xl text-2xl text-emerald-800 md:text-3xl lg:text-4xl dark:text-emerald-300"
            >
              مصطفٰے جانِ رحمت پہ لاکھوں سلام
              <br />
              شمعِ بزمِ ہدایت پہ لاکھوں سلام
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm italic text-slate-600 dark:text-gray-400">
              &quot;Mustafa Jaan-e-Rehmat Pe Lakhon Salaam, Shama-e-Bazm-e-Hidayat Pe Lakhon Salaam&quot;
            </p>
            <p className="mt-2 text-xs font-semibold text-gold-500">
              — Imam Ahmad Raza Khan Qadri (Hadaiq-e-Bakhshish)
            </p>
          </div>
        </div>
      </section>

      {/* FAQ — white band */}
      <section className="page-section w-full py-12 md:pb-16" aria-label="Frequently Asked Questions">
        <div className="container mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gold-500 md:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="mb-8 mt-2 text-center text-xs text-slate-500 dark:text-gray-400">Got questions? We have answers.</p>
        <FAQAccordion items={faqItems} />
        </div>
      </section>
    </main>
  );
}
