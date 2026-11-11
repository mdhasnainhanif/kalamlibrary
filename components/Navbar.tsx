"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import KalamLibraryWordmark from "@/components/KalamLibraryWordmark";

export type NavPoet = {
  nameRoman: string;
  nameUrdu: string;
  href: string;
};

type NavbarProps = {
  poets: NavPoet[];
};

const navLinks = [
  { href: "/kalams", label: "Browse Kalams" },
  { href: "/trending", label: "Trending" },
  { href: "/durood-o-salam", label: "Durood o Salam" },
  { href: "/aurad-o-wazaif", label: "Aurad o Wazaif" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

const linkClass = (active: boolean) =>
  `rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
    active
      ? "bg-gold-500 font-semibold text-black shadow-md shadow-gold-500/10"
      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 dark:text-gray-300 dark:hover:bg-emerald-900/40 dark:hover:text-white"
  }`;

export default function Navbar({ poets }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  // The mobile poets list is open only for the path it was opened on, so it closes on navigation
  // without an effect that sets state.
  const [poetsOpenAt, setPoetsOpenAt] = useState<string | null>(null);
  const poetsMobileOpen = poetsOpenAt === pathname;
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const poetsActive = isActive("/authors") || pathname.startsWith("/author/");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isOpen) setIsOpen(false);
        setPoetsOpenAt(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const poetsDropdownPanel = (onNavigate?: () => void) => (
    <ul className="py-1">
      <li>
        <Link
          href="/authors"
          onClick={onNavigate}
          className="block px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 dark:text-gold-500 dark:hover:bg-emerald-900/50"
        >
          All poets
        </Link>
      </li>
      <li aria-hidden className="mx-3 my-1 border-t border-emerald-500/15" />
      {poets.map((poet) => (
        <li key={poet.href}>
          <Link
            href={poet.href}
            onClick={onNavigate}
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 dark:text-gray-300 dark:hover:bg-emerald-900/40 dark:hover:text-white"
          >
            <span className="block font-medium leading-snug">{poet.nameRoman}</span>
            {poet.nameUrdu ? (
              <span lang="ur" dir="rtl" className="font-urdu mt-0.5 block text-xs text-emerald-700/90 dark:text-emerald-400/80">
                {poet.nameUrdu}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <header
      className={`sticky top-0 z-[100] isolate w-full shrink-0 overflow-visible transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out ${
        scrolled
          ? "border-b border-emerald-200/70 bg-white/72 shadow-[0_1px_0_rgba(16,185,129,0.06),0_10px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl backdrop-saturate-150 dark:border-emerald-500/20 dark:bg-emerald-950/75 dark:shadow-lg dark:shadow-black/25"
          : "border-b border-emerald-100/60 bg-white/50 backdrop-blur-md dark:border-emerald-500/10 dark:bg-emerald-950/35 dark:backdrop-blur-[2px]"
      }`}
    >
      <div
        aria-hidden
        className={`navbar-glass-tint pointer-events-none absolute inset-0 transition-colors duration-300 ${
          scrolled
            ? "bg-white/55 dark:bg-emerald-950/65"
            : "bg-gradient-to-b from-white/45 to-white/15 dark:from-emerald-950/40 dark:to-emerald-950/20"
        }`}
      />

      <nav aria-label="Main navigation" className="container relative z-[1]">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" aria-label="Kalam Library Home" className="group flex items-center">
            <KalamLibraryWordmark className="text-xl transition-colors group-hover:text-gold-100 md:text-2xl" />
          </Link>

          <div className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={linkClass(isActive(link.href))}>
                    {link.label}
                  </Link>
                </li>
              ))}

              <li className="group/poets relative">
                <Link
                  href="/authors"
                  aria-current={poetsActive ? "page" : undefined}
                  className={`inline-flex items-center gap-0.5 rounded-xl py-2 pl-4 pr-3 text-sm font-medium transition-all duration-300 ${
                    poetsActive
                      ? "bg-gold-500 font-semibold text-black shadow-md shadow-gold-500/10"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 dark:text-gray-300 dark:hover:bg-emerald-900/40 dark:hover:text-white"
                  }`}
                >
                  Poets
                  <ChevronDown
                    className="h-3.5 w-3.5 shrink-0 opacity-75 transition-transform duration-200 group-hover/poets:rotate-180 group-focus-within/poets:rotate-180"
                    aria-hidden
                  />
                </Link>

                <div className="pointer-events-none absolute left-0 top-full z-[110] w-72 pt-1 opacity-0 invisible transition-[opacity,visibility] duration-150 group-hover/poets:pointer-events-auto group-hover/poets:visible group-hover/poets:opacity-100 group-focus-within/poets:pointer-events-auto group-focus-within/poets:visible group-focus-within/poets:opacity-100">
                  <div className="overflow-hidden rounded-xl border border-emerald-500/20 bg-white shadow-xl dark:border-emerald-500/15 dark:bg-emerald-950/95">
                    <div className="max-h-[min(24rem,70vh)] overflow-y-auto overscroll-contain">
                      {poetsDropdownPanel()}
                    </div>
                  </div>
                </div>
              </li>

              {navLinks.slice(4).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={linkClass(isActive(link.href))}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-900 focus:outline-none dark:text-gray-400 dark:hover:bg-emerald-900/40 dark:hover:text-white lg:hidden"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close main menu" : "Open main menu"}
          >
            {isOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </nav>

      {isOpen ? (
        <div
          className={`relative z-[1] border-t border-emerald-100/80 backdrop-blur-xl lg:hidden dark:border-emerald-500/15 ${
            scrolled ? "bg-white/92 dark:bg-emerald-950/90" : "bg-white/88 dark:bg-emerald-950/80"
          }`}
          id="mobile-menu"
        >
          <div className="container max-h-[min(80vh,32rem)] space-y-1 overflow-y-auto py-3">
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`block rounded-xl px-4 py-3 text-base font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-gold-500 font-semibold text-black"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 dark:text-gray-300 dark:hover:bg-emerald-900/40 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="rounded-xl border border-emerald-500/10 dark:border-emerald-500/15">
              <div className="flex items-stretch">
                <Link
                  href="/authors"
                  onClick={() => setIsOpen(false)}
                  className={`flex-1 px-4 py-3 text-base font-medium ${
                    poetsActive ? "bg-gold-500 font-semibold text-black" : "text-slate-600 dark:text-gray-300"
                  }`}
                >
                  Poets
                </Link>
                <button
                  type="button"
                  aria-expanded={poetsMobileOpen}
                  aria-label="Expand poets list"
                  onClick={() => setPoetsOpenAt(poetsMobileOpen ? null : pathname)}
                  className="border-l border-emerald-500/10 px-3 dark:border-emerald-500/15"
                >
                  <ChevronDown className={`h-5 w-5 ${poetsMobileOpen ? "rotate-180" : ""}`} aria-hidden />
                </button>
              </div>
              {poetsMobileOpen ? (
                <div className="border-t border-emerald-500/10 dark:border-emerald-500/15">{poetsDropdownPanel(() => setIsOpen(false))}</div>
              ) : null}
            </div>

            {navLinks.slice(4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`block rounded-xl px-4 py-3 text-base font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-gold-500 font-semibold text-black"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 dark:text-gray-300 dark:hover:bg-emerald-900/40 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
