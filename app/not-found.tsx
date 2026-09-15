import type { Metadata } from "next";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export const metadata: Metadata = {
  title: "Page Not Found | Kalam Library",
  description: "The Islamic poetry, Naat, or Kalam page you are looking for could not be found. Search our archive or explore popular poets.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          404 &bull; Error
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 font-serif">
          Page <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-400">Not Found</span>
        </h1>

        <p className="text-base sm:text-lg text-emerald-100/70 mb-8 max-w-lg mx-auto leading-relaxed">
          The Naat, Kalam, or scholar profile you are looking for does not exist or may have been moved. Search our complete archive below:
        </p>

        {/* Live Search Component */}
        <div className="mb-10 max-w-md mx-auto relative z-30">
          <SearchBar />
        </div>

        {/* Helpful Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/kalams"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-emerald-950 font-bold text-sm transition-all shadow-md hover:shadow-amber-500/20"
          >
            Explore All Kalams
          </Link>
          <Link
            href="/authors"
            className="px-5 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 hover:text-white font-semibold text-sm transition-all"
          >
            Browse Poets &amp; Scholars
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-700/40 text-slate-300 hover:text-white font-medium text-sm transition-all"
          >
            Return to Homepage
          </Link>
        </div>

        {/* Arabic/Urdu Calligraphy Motif */}
        <div className="mt-12 pt-8 border-t border-emerald-900/40 text-emerald-700/40 text-sm font-urdu">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ &bull; کلام لائبریری
        </div>
      </div>
    </div>
  );
}
