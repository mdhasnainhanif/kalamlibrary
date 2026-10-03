import type { Metadata } from "next";
import HomePageView from "@/components/home/HomePageView";
import { supabase } from "@/utils/supabase";
import { SITE_CONFIG, buildCanonicalUrl, buildWebSiteSchema } from "@/utils/seoConfig";
import { FEATURED_KALAM_SLUGS, filterIndexableKalams } from "@/utils/kalam";

/** 7 days — see utils/cacheConfig.ts PAGE_REVALIDATE_SECONDS */
export const revalidate = 604800;

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

export default async function Home() {
  const { data: authors, error: authorsError } = await supabase.from("authors").select("*").limit(8);

  const { data: featuredRows, error: kalamsError } = await supabase
    .from("kalams")
    .select("*, authors(*), kalam_translations(language, title)")
    .in("slug", [...FEATURED_KALAM_SLUGS]);

  const featuredBySlug = new Map((featuredRows || []).map((row) => [row.slug, row]));
  const kalams = FEATURED_KALAM_SLUGS.map((slug) => featuredBySlug.get(slug)).filter(
    (row): row is NonNullable<typeof row> => Boolean(row)
  );

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

  const faqItems = [
    {
      q: "What is Kalam Library?",
      a: "Kalam Library is a structured digital archive containing lyrics of classic Sufi Kalam, Hamd, and Naat poetry. It provides exact transcriptions and translation variants across Roman English, Urdu Nastaliq, Hindi, and Bangla scripts.",
    },
    {
      q: "Who are the primary poets featured here?",
      a: "Our archive focuses on prominent scholars and poets of spiritual odes, including <strong>Ala Hazrat Imam Ahmad Raza Khan Qadri</strong>, <strong>Allama Hasan Raza Khan</strong>, <strong>Mufti-e-Azam Hind Mustafa Raza Khan Qadri</strong>, and <strong>Maulana Muhammad Ilyas Attar Qadri</strong>.",
    },
    {
      q: "How accurate are these lyric transcriptions?",
      a: "Poems are digitized from printed books such as Hadaiq-e-Bakhshish, Saman-e-Bakhshish, and Wasail-e-Bakhshish using an AI-assisted OCR pipeline, then formatted into Roman English, Urdu, Hindi, and Bangla. The archive is a reading aid, not a certified critical edition. Please use the Report an error link on any kalam page if you spot a mistake.",
    },
    {
      q: "Can I request a Naat or Kalam to be digitized?",
      a: "Absolutely! If you have a scanned book, PDF or specific Kalam you want added to our digital library, you can request it through our Services page or contact our team directly via WhatsApp.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const orgSchema = buildWebSiteSchema();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <HomePageView
        authors={authors}
        authorsError={Boolean(authorsError)}
        kalams={kalams}
        kalamsError={Boolean(kalamsError)}
        authorKalamCounts={authorKalamCounts}
        faqItems={faqItems}
      />
    </>
  );
}
