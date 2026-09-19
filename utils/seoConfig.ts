/**
 * Centralized SEO Configuration and Schema Builders for Kalam Library
 * Focused on Naats, Kalams, Islamic Devotional Poetry, Poets & Scholars.
 */

export const SITE_CONFIG = {
  name: "Kalam Library",
  url: "https://kalamlibrary.me",
  siteUrl: "https://kalamlibrary.me",
  domain: "kalamlibrary.me",
  tagline: "Naat Lyrics in Urdu, Hindi, Roman English & Bangla",
  description:
    "Read Islamic Naat, Hamd, and Sufi Kalam lyrics in Urdu Nastaliq, Hindi, Bangla, and Roman English. A digital archive of classic and contemporary naat poetry.",
  instagramUrl: "https://www.instagram.com/kalamlibrary.me",
  tiktokUrl: "https://www.tiktok.com/@kalam.library",
  whatsappUrl: "https://wa.me/923174731957",
  keywords: [
    "naat lyrics",
    "kalam lyrics",
    "islamic poetry",
    "urdu naat lyrics",
    "hindi naat lyrics",
    "bangla naat lyrics",
    "roman english naat",
    "sufi poetry",
    "hamd lyrics",
    "manqabat lyrics",
    "hadaiq e bakhshish lyrics",
    "wasail e bakhshish lyrics",
    "islamic naat archive",
  ],
  locale: "en_US",
  locales: ["en_US", "ur_PK", "hi_IN", "bn_BD"],
  creator: "Kalam Library",
  publisher: "Kalam Library",
  category: "Islamic Devotional Poetry, Naat & Kalam",
  defaultOgImage: "/og-default.jpg",
  supportEmail: "md.hasnain.developer@gmail.com",
};

/**
 * Builds normalized absolute canonical URL
 */
export function buildCanonicalUrl(path: string, queryParams?: Record<string, string | number | undefined>): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, SITE_CONFIG.url);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Generates dynamic OpenGraph preview URL via Next.js OG API
 */
export function buildOgImageUrl(params: {
  title: string;
  poet?: string;
  sub?: string;
}): string {
  const url = new URL("/api/og", SITE_CONFIG.url);
  url.searchParams.set("title", params.title);
  if (params.poet) {
    url.searchParams.set("poet", params.poet);
  }
  if (params.sub) {
    url.searchParams.set("sub", params.sub);
  }
  return url.toString();
}

/**
 * Schema.org WebSite JSON-LD with Sitelinks SearchAction
 */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    alternateName: ["Kalam Library Naat Lyrics", "KalamLibrary", "کلام لائبریری"],
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      sameAs: [SITE_CONFIG.instagramUrl, SITE_CONFIG.tiktokUrl],
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/icon.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Schema.org BreadcrumbList JSON-LD
 */
export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

/**
 * Schema.org CreativeWork / Poem JSON-LD for Naat & Kalam lyrics
 * Accurately treats sacred spiritual verses as literary poetry rather than commercial pop songs.
 */
export function buildKalamJsonLd(params: {
  title: string;
  url: string;
  lyrics: string;
  authorName: string;
  authorUrl?: string;
  language: string;
  inLanguageLocale?: string;
  dateCreated?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    additionalType: "https://schema.org/Poem",
    name: params.title,
    headline: `${params.title} - Naat & Kalam Lyrics`,
    url: params.url,
    genre: "Islamic Devotional Poetry",
    inLanguage: params.inLanguageLocale || "ur",
    text: params.lyrics,
    author: {
      "@type": "Person",
      name: params.authorName,
      ...(params.authorUrl ? { url: params.authorUrl } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/icon.png`,
      },
    },
    isAccessibleForFree: true,
    ...(params.dateCreated ? { dateCreated: params.dateCreated } : {}),
  };
}

/**
 * Schema.org Person JSON-LD for Islamic poets, scholars, and ode lyricists
 */
export function buildAuthorJsonLd(params: {
  name: string;
  url: string;
  bio?: string;
  kalamCount?: number;
  featuredWorks?: Array<{ title: string; url: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: params.name,
    url: params.url,
    jobTitle: "Islamic Scholar & Devotional Poet",
    description: params.bio || `Devotional Sufi Naats, Hamd, and spiritual odes by ${params.name}.`,
    ...(params.featuredWorks && params.featuredWorks.length > 0
      ? {
          hasPart: params.featuredWorks.map((work) => ({
            "@type": "CreativeWork",
            additionalType: "https://schema.org/Poem",
            name: work.title,
            url: work.url,
          })),
        }
      : {}),
  };
}
