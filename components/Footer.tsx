import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-emerald-950/40 border-t border-emerald-500/10 py-12 px-4 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About Section */}
        <div className="md:col-span-2 flex flex-col gap-4 text-left">
          <div className="flex flex-col">
            <span className="text-xl font-urdu text-gold-500 font-bold" dir="rtl">
              کلام لائبریری
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-sm">
            Kalam Library is a curated, dynamic repository dedicated to transcribing and sharing classic Sufi Kalam, Hamd, and Naat poetry in Roman English, Urdu Nastaliq, Hindi, and Bangla translations.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4 text-left">
          <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Quick Navigation</h4>
          <ul className="flex flex-col gap-2.5 text-xs md:text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
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
        </div>

        {/* Support & Contact */}
        <div className="flex flex-col gap-4 text-left">
          <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Contact Details</h4>
          <ul className="flex flex-col gap-2.5 text-xs md:text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:md.hasnain.developer@gmail.com" className="hover:text-gold-500 transition-colors break-all">
                md.hasnain.developer@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <a href="https://wa.me/923174731957" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">
                WhatsApp Support
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-6xl mx-auto border-t border-emerald-500/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs text-gray-500">
        <p>&copy; {currentYear} Kalam Library. All rights reserved.</p>
        <p>Built with love for Islamic poetry, spiritual odes, and literature digitization.</p>
      </div>
    </footer>
  );
}
