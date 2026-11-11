import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found | Kalam Library",
  description:
    "The Islamic poetry, Naat, or Kalam page you are looking for could not be found. Search our archive or explore popular poets.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main id="main-content" className="container min-h-[75vh] flex items-center justify-center py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-500/30 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
          404 &bull; Page Not Found
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Page <span className="text-gold-500">Not Found</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-emerald-100/80 mb-8 max-w-lg mx-auto leading-relaxed">
          The Naat, Kalam, or poet profile you are looking for does not exist or may have been moved. Search our complete archive below:
        </p>

        <div className="mb-10 max-w-md mx-auto relative z-30">
          <SearchBar />
        </div>

        {/* Helpful Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button href="/kalams" variant="filled" size="md" className="hover:scale-105 active:scale-95">
            Explore All Kalams
          </Button>
          <Button href="/authors" variant="outline" size="md" className="hover:scale-105 active:scale-95">
            Browse Poets &amp; Scholars
          </Button>
          <Button href="/" variant="outline" size="md" className="hover:scale-105 active:scale-95">
            Return to Homepage
          </Button>
        </div>

        {/* Arabic/Urdu Calligraphy Motif */}
        <div className="mt-12 pt-8 border-t border-emerald-500/20 text-emerald-800/70 dark:text-emerald-500/40 text-sm md:text-base font-urdu">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ &bull; کلام لائبریری
        </div>
      </div>
    </main>
  );
}
