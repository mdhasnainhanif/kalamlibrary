"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="w-full bg-emerald-950/80 backdrop-blur-md border-b border-emerald-500/10 sticky top-0 z-50 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group">
              <span className="text-xl md:text-2xl font-urdu text-gold-500 font-bold tracking-wide transition-colors group-hover:text-gold-100 relative -top-[2px] md:-top-[3px]" dir="rtl">
                کلام لائبریری
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      active
                        ? "bg-gold-500 text-black font-semibold shadow-md shadow-gold-500/10"
                        : "text-gray-300 hover:text-white hover:bg-emerald-900/40"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-emerald-900/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-emerald-950 border-b border-emerald-500/10" id="mobile-menu">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    active
                      ? "bg-gold-500 text-black font-semibold"
                      : "text-gray-300 hover:text-white hover:bg-emerald-900/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 2000,
          style: {
            background: "#061410",
            color: "#f3f4f6",
            border: "1px solid rgba(16, 185, 129, 0.15)",
            fontSize: "14px",
            fontFamily: "var(--font-sans), sans-serif",
          },
          success: {
            iconTheme: {
              primary: "#eab308", // gold success icon matching the logo
              secondary: "#061410",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#061410",
            },
          },
        }}
      />
    </nav>
  );
}
