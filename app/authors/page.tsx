import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { getAuthorUrduName } from "@/utils/authorHelper";
import { filterIndexableKalams } from "@/utils/kalam";
import { SITE_CONFIG, buildBreadcrumbJsonLd, buildCanonicalUrl } from "@/utils/seoConfig";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "All Poets & Authors - Devotional Kalam Directory",
  description: "Browse the complete directory of classic Sufi poets, scholars, and ode writers featured on Kalam Library. Read lyrics in Urdu, Roman English, Hindi, and Bangla.",
  alternates: {
    canonical: buildCanonicalUrl("/authors"),
  },
  openGraph: {
    title: "All Poets & Authors | Kalam Library",
    description: "Browse the complete directory of classic Sufi poets, scholars, and ode writers featured on Kalam Library.",
    url: `${SITE_CONFIG.url}/authors`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Poets & Authors Directory - Kalam Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Poets & Authors | Kalam Library",
    description: "Browse the complete directory of classic Sufi poets, scholars, and ode writers featured on Kalam Library.",
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

export default async function AuthorsPage() {
  const { data: authors, error: authorsError } = await supabase
    .from("authors")
    .select("*")
    .order("name_roman", { ascending: true });

  const { data: allKalams } = await supabase
    .from("kalams")
    .select("id, author_id, slug, primary_title_roman, primary_title_urdu");

  const authorKalamCounts: Record<string, number> = {};
  filterIndexableKalams(allKalams).forEach((k) => {
    if (k.author_id) {
      authorKalamCounts[k.author_id] = (authorKalamCounts[k.author_id] || 0) + 1;
    }
  });

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Poets & Authors Directory - Kalam Library",
    "description": "Complete collection of Sufi poetry authors and lyricists digitized in Kalam Library.",
    "url": `${SITE_CONFIG.url}/authors`,
    "hasPart": (authors || []).map((author) => ({
      "@type": "Person",
      "name": author.name_roman,
      "url": `${SITE_CONFIG.url}/author/${slugify(author.name_roman)}`,
    })),
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Poets", url: "/authors" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="container py-8 md:py-12 flex-1">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center justify-center gap-2">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-400 font-medium">Poets</span>
        </nav>

        {/* Directory Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gold-500 mb-4 tracking-tight">
            Poets Directory
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore the revered Islamic scholars, Sufi saints, and poets whose timeless verses and devotional hymns are preserved in our digital library.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/15 text-xs text-emerald-300 font-medium">
            <span>{authors?.length || 0} Esteemed Poets Digitized</span>
          </div>
        </header>

        {/* Authors Grid */}
        {authorsError || !authors || authors.length === 0 ? (
          <div className="text-center py-16 bg-emerald-900/10 border border-dashed border-emerald-500/15 rounded-2xl">
            <p className="text-gray-400 text-sm">No poets found in the archive.</p>
          </div>
        ) : (
          <section aria-label="All Authors" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => {
              const authorSlug = slugify(author.name_roman);
              const kalamCount = authorKalamCounts[author.id] || 0;
              const urduName = getAuthorUrduName(author);

              return (
                <Link
                  key={author.id}
                  href={`/author/${authorSlug}`}
                  aria-label={`View all Kalam written by ${author.name_roman}`}
                  className="group p-6 rounded-2xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div aria-hidden="true" className="w-12 h-12 rounded-full bg-emerald-950 flex items-center justify-center border border-gold-500/20 text-gold-500 font-bold text-lg shrink-0 group-hover:border-gold-500/40 transition-colors">
                        {author.name_roman.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-bold text-gray-100 group-hover:text-gold-500 transition-colors text-base truncate">
                          {author.name_roman}
                        </h2>
                        {urduName && (
                          <span lang="ur" className="text-xs md:text-sm text-emerald-400 font-urdu block leading-relaxed mt-0.5" dir="rtl">
                            {urduName}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-4">
                      {author.bio || "Devotional Sufi Naats, Hamd, and spiritual odes."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-emerald-500/10 text-xs">
                    <span className="text-gray-400 font-medium">
                      {kalamCount} Kalam{kalamCount !== 1 ? "s" : ""}
                    </span>
                    <span className="text-emerald-400 group-hover:text-gold-500 font-semibold flex items-center gap-1 transition-colors">
                      Browse lyrics &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}
