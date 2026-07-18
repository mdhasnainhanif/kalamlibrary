import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Kalam Library",
    default: "Kalam Library - Naat Lyrics in Urdu, Hindi, Roman English & Bangla",
  },
  description: "Explore a vast collection of Islamic Naats, Hamd, and Sufi Kalam in multiple languages including Roman English, Urdu (Nastaliq), Hindi (Devanagari), and Bangla.",
  keywords: ["naats lyrics", "kalam library", "urdu naat", "hindi naat", "roman english lyrics", "hadaiq e bakhshish lyrics", "wasail e bakhshish lyrics", "sufi poetry"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        {/* Global Glowing Background Elements */}
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none"></div>
        <div className="fixed bottom-10 left-10 w-70 h-70 bg-gold-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <Navbar />
        <div className="flex-1 flex flex-col w-full">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
