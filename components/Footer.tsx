import type { ReactNode } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { SITE_CONFIG } from "@/utils/seoConfig";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/kalams", label: "Browse Kalams" },
  { href: "/trending", label: "Trending" },
  { href: "/search", label: "Search" },
  { href: "/authors", label: "All Poets" },
] as const;

const collectionLinks = [
  { href: "/durood-o-salam", label: "Durood o Salam" },
  { href: "/aurad-o-wazaif", label: "Aurad o Wazaif" },
] as const;

const languageLinks = [
  { href: "/lyrics/roman-english", label: "Roman English" },
  { href: "/lyrics/urdu", label: "Urdu (Nastaliq)" },
  { href: "/lyrics/hindi", label: "Hindi" },
  { href: "/lyrics/bangla", label: "Bangla" },
] as const;

const aboutLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reader reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
] as const;

function FooterContact({ supportEmail, whatsappUrl }: { supportEmail: string; whatsappUrl: string }) {
  return (
    <FooterSubsection title="Contact">
      <ul className="mt-3 space-y-2 text-sm">
        <li>
          <a
            href={`mailto:${supportEmail}`}
            className="flex w-full min-w-0 items-start gap-2 text-gray-500 transition-colors hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400"
          >
            <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600 dark:text-gold-500" />
            <span className="min-w-0 flex-1 text-[13px] leading-snug break-words">{supportEmail}</span>
          </a>
        </li>
        <li>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-300"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0 text-emerald-500" />
            WhatsApp support
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      </ul>
    </FooterSubsection>
  );
}

function FooterSubsection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="text-left">
      <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-gold-600 dark:text-gold-500">
        {title}
      </h2>
      {children}
    </div>
  );
}

function FooterLinkList({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <nav aria-label={title} className="flex flex-col gap-3 text-left">
      <h2 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-gold-600 dark:text-gold-500">
        {title}
      </h2>
      <ul className="flex flex-col gap-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex text-sm text-gray-500 transition-colors hover:text-gold-600 dark:text-gray-400 dark:hover:text-gold-400"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.44-.04 2.7-1.03 3.04-2.43.14-.54.17-1.11.16-1.67V.02z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 448 512" fill="currentColor" aria-hidden>
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
}

const socialButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-900/25 text-gray-400 transition-all hover:border-gold-500/40 hover:bg-emerald-900/50 hover:text-gold-500";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { whatsappUrl, instagramUrl, tiktokUrl } = SITE_CONFIG;
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || SITE_CONFIG.supportEmail;

  return (
    <footer className="relative mt-auto w-full border-t border-emerald-500/15 bg-gradient-to-b from-emerald-950/35 via-emerald-950/55 to-emerald-950/80 pt-12 pb-8 dark:from-emerald-950/50 dark:via-emerald-950/70 dark:to-[#020806]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/35 to-transparent"
      />

      <div className="container">
        <div className="flex flex-col gap-10 lg:flex-row lg:flex-nowrap lg:items-start lg:gap-5 xl:gap-6">
          <div className="min-w-0 text-left lg:w-[19%] lg:max-w-[220px] lg:shrink-0">
            <div>
              <Link href="/" className="inline-block">
                <span lang="ur" dir="rtl" className="font-urdu text-3xl font-bold leading-none text-gold-600 dark:text-gold-500">
                  کلام لائبریری
                </span>
              </Link>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-700/80 dark:text-emerald-400/80">
                Kalam Library
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              A Naat lyrics archive for Islamic Hamd, Naat, and Sufi Kalam in Roman English, Urdu Nastaliq, Hindi, and
              Bangla.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram (opens in new tab)"
                className={socialButtonClass}
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok (opens in new tab)"
                className={socialButtonClass}
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp (opens in new tab)"
                className={`${socialButtonClass} hover:text-emerald-400`}
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button href="/reviews" variant="outline" size="sm">
                Share feedback
              </Button>
            </div>
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-2 gap-6 md:flex md:gap-4 lg:gap-5">
            <div className="min-w-0 md:flex-[0.9]">
              <FooterLinkList title="Explore" links={exploreLinks} />
            </div>
            <div className="min-w-0 md:flex-[0.95]">
              <div className="flex flex-col gap-5">
                <FooterLinkList title="Collections" links={collectionLinks} />
                <FooterLinkList title="By language" links={languageLinks} />
              </div>
            </div>
            <div className="col-span-2 min-w-0 md:col-span-1 md:min-w-[11.5rem] md:flex-[1.15]">
              <div className="flex flex-col gap-5">
                <FooterLinkList title="About & legal" links={aboutLinks} />
                <FooterContact supportEmail={supportEmail} whatsappUrl={whatsappUrl} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-emerald-500/15 pt-6 text-center text-xs text-gray-500 md:flex-row md:text-left dark:text-gray-400">
          <p>&copy; {currentYear} Kalam Library. All rights reserved.</p>
          <p>
            Built for Naat readers.{" "}
            <Link href="/services" className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-300">
              Digitization &amp; web services
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
