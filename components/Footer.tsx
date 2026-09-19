import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = "https://wa.me/923174731957";
  const instagramUrl = "https://www.instagram.com/kalamlibrary.me";
  const tiktokUrl = "https://www.tiktok.com/@kalam.library";

  return (
    <footer className="w-full bg-emerald-950/40 border-t border-emerald-500/10 py-12 mt-auto">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* About & Social Media Section */}
        <div className="md:col-span-2 flex flex-col gap-5 text-left">
          <div className="flex flex-col">
            <span lang="ur" className="text-2xl font-urdu text-gold-500 font-bold mb-1.5 inline-block min-h-[2.25rem] leading-none" dir="rtl">
              کلام لائبریری
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-sm">
            A Naat lyrics archive for Islamic Hamd, Naat, and Sufi Kalam in Roman English, Urdu Nastaliq, Hindi, and Bangla.
          </p>

          {/* Social Media Links */}
          <div className="flex flex-col gap-2.5 pt-1">
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Connect With Us
            </span>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Kalam Library on Instagram (opens in new tab)"
                className="w-9 h-9 rounded-xl bg-emerald-900/20 border border-emerald-500/15 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:border-gold-500/40 hover:bg-emerald-900/40 transition-all group"
              >
                <svg
                  className="w-4 h-4 fill-current transform group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Kalam Library on TikTok (opens in new tab)"
                className="w-9 h-9 rounded-xl bg-emerald-900/20 border border-emerald-500/15 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:border-gold-500/40 hover:bg-emerald-900/40 transition-all group"
              >
                <svg
                  className="w-4 h-4 fill-current transform group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.44-.04 2.7-1.03 3.04-2.43.14-.54.17-1.11.16-1.67V.02z" />
                </svg>
              </a>

              {/* WhatsApp Chat */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Kalam Library on WhatsApp (opens in new tab)"
                className="w-9 h-9 rounded-xl bg-emerald-900/20 border border-emerald-500/15 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-900/40 transition-all group"
              >
                <svg
                  className="w-4 h-4 fill-current transform group-hover:scale-110 transition-transform"
                  viewBox="0 0 448 512"
                  aria-hidden="true"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <nav aria-label="Footer navigation" className="flex flex-col gap-4 text-left">
          <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Quick Navigation</h2>
          <ul className="flex flex-col gap-2.5 text-xs md:text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/kalams" className="hover:text-gold-500 transition-colors">All Kalams</Link>
            </li>
            <li>
              <Link href="/authors" className="hover:text-gold-500 transition-colors">All Poets</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-500 transition-colors">About Story</Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-gold-500 transition-colors">Our Services</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-500 transition-colors">Contact Us</Link>
            </li>
          </ul>
        </nav>

        {/* Support & Contact */}
        <div className="flex flex-col gap-4 text-left">
          <h2 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Contact Details</h2>
          <ul className="flex flex-col gap-2.5 text-xs md:text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <svg aria-hidden="true" className="w-4 h-4 text-gold-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:md.hasnain.developer@gmail.com" className="hover:text-gold-500 transition-colors break-all">
                md.hasnain.developer@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg aria-hidden="true" className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 448 512" fill="currentColor">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">
                WhatsApp Support <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright & Legal Links */}
      <div className="container border-t border-emerald-500/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs text-gray-400">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <p>&copy; {currentYear} Kalam Library. All rights reserved.</p>
          <span className="hidden sm:inline text-emerald-500/30">|</span>
          <div className="flex items-center gap-3">
            <Link href="/terms-and-conditions" className="hover:text-gold-500 transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-emerald-500/30">&bull;</span>
            <Link href="/privacy-policy" className="hover:text-gold-500 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
        <p>
          Built for Naat readers.{" "}
          <Link href="/services" className="hover:text-gold-500 transition-colors">
            Digitization &amp; web services
          </Link>
        </p>
      </div>
    </footer>
  );
}

