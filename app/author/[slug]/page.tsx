import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabase";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 3600; // Cache for 1 hour

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

async function getAuthorData(slug: string) {
  // Fetch all authors (since authors table has no slug, we check them in-memory)
  const { data: authors, error: authorsError } = await supabase
    .from("authors")
    .select("*");

  if (authorsError || !authors) {
    return null;
  }

  const author = authors.find((a) => slugify(a.name_roman) === slug);
  if (!author) {
    return null;
  }

  // Fetch all kalams for this author
  const { data: rawKalams, error: kalamsError } = await supabase
    .from("kalams")
    .select("*")
    .eq("author_id", author.id)
    .order("primary_title_roman", { ascending: true });

  if (kalamsError) {
    return null;
  }

  const kalams = rawKalams?.filter(
    (k) =>
      k.primary_title_roman.toLowerCase().trim() !== "deegar" &&
      k.primary_title_urdu?.trim() !== "دیگر" &&
      !k.slug.startsWith("deegar") &&
      !k.slug.startsWith("digar")
  ) || [];

  return {
    author,
    kalams,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAuthorData(slug);
  if (!data) return {};

  const { author } = data;
  const seoTitle = `${author.name_roman} Naats List & Lyrics - Kalam Library`;
  const seoDesc = `Read all Naats, Hamd, and Sufi Kalam written by ${author.name_roman} on Kalam Library. Access full lyrics in Urdu, Hindi, Bangla, and Roman English.`;

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: `https://kalamlibrary.com/author/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `https://kalamlibrary.com/author/${slug}`,
    },
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getAuthorData(slug);

  if (!data) {
    notFound();
  }

  const { author, kalams } = data;

  return (
    <main id="main-content" className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex-1">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs md:text-sm text-emerald-400/80 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-400 font-medium">Authors</span>
        <span aria-hidden="true">/</span>
        <span className="text-gray-400 font-medium">{author.name_roman}</span>
      </nav>

      {/* Poet Profile Header */}
      <header className="bg-emerald-900/10 border border-emerald-500/10 rounded-2xl p-6 md:p-8 mb-8 shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Placeholder */}
          <div aria-hidden="true" className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-950 flex items-center justify-center border border-gold-500/20 text-gold-500 text-3xl font-bold shadow-inner shrink-0">
            {author.name_roman.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-3 justify-center md:justify-start">
              <h1 className="text-2xl md:text-3xl font-bold text-gold-500 mb-1">{author.name_roman}</h1>
              {author.name_urdu && (
                <span lang="ur" className="text-lg md:text-xl text-emerald-300/85 font-urdu" dir="rtl">
                  ({author.name_urdu})
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mb-4 mt-2">
              {author.bio || "Classic poet of devotional Sufi Naats and Islamic literature."}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/10 text-xs font-semibold text-emerald-300">
              <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{kalams.length} Kalam{kalams.length !== 1 ? "s" : ""} Available</span>
            </div>
          </div>
        </div>
      </header>

      {/* Naats / Kalam List */}
      <section aria-label="Kalam Collection">
        <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
          <span>Kalam Collection</span>
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
        </h2>

        {kalams.length === 0 ? (
          <div className="text-center py-12 bg-emerald-900/5 border border-dashed border-emerald-500/10 rounded-xl">
            <p className="text-gray-400">No Naats uploaded yet for this author.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kalams.map((kalam) => (
              <Link
                key={kalam.id}
                href={`/kalam/${kalam.slug}/roman-english`}
                aria-label={`Read ${kalam.primary_title_roman} lyrics by ${author.name_roman}`}
                className="group p-5 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow transition-all flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-100 group-hover:text-gold-500 transition-colors">
                    {kalam.primary_title_roman}
                  </h3>
                  {kalam.primary_title_urdu && (
                    <span lang="ur" className="text-base text-emerald-400/70 font-urdu block mt-1 py-0.5 truncate" dir="rtl">
                      {kalam.primary_title_urdu}
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:text-gold-500 group-hover:border-gold-500/30 transition-all shrink-0">
                  <svg aria-hidden="true" className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
