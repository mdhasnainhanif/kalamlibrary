"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import HeroIslamicPattern from "@/components/ui/HeroIslamicPattern";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/kalams", label: "Browse Kalams" },
    { href: "/durood-o-salam", label: "Durood o Salam" },
    { href: "/authors", label: "Poets" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
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

  return (
    <header
      className={`sticky top-0 z-[100] isolate w-full shrink-0 overflow-hidden transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out ${
        scrolled
          ? "border-b border-emerald-200/70 bg-white/72 shadow-[0_1px_0_rgba(16,185,129,0.06),0_10px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl backdrop-saturate-150 dark:border-emerald-500/20 dark:bg-emerald-950/75 dark:shadow-lg dark:shadow-black/25"
          : "border-b border-emerald-100/60 bg-white/50 backdrop-blur-md dark:border-emerald-500/10 dark:bg-emerald-950/35 dark:backdrop-blur-[2px]"
      }`}
    >
      <HeroIslamicPattern
        fullPage
        className="hero-islamic-pattern-tone absolute inset-0 hidden text-gold-500/18 opacity-90 dark:block"
      />
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
            <span
              lang="ur"
              dir="rtl"
              className="font-urdu text-xl font-bold leading-none text-gold-500 transition-colors group-hover:text-gold-100 md:text-2xl"
            >
              کلام لائبریری
            </span>
          </Link>

          <div className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        active
                          ? "bg-gold-500 font-semibold text-black shadow-md shadow-gold-500/10"
                          : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 dark:text-gray-300 dark:hover:bg-emerald-900/40 dark:hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
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
          <div className="container space-y-1 py-3">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition-all ${
                    active
                      ? "bg-gold-500 font-semibold text-black"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 dark:text-gray-300 dark:hover:bg-emerald-900/40 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
