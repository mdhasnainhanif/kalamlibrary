"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface CopyShareButtonsProps {
  lyrics: string;
  title: string;
  author: string;
}

export default function CopyShareButtons({ lyrics, title, author }: CopyShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title} - ${author}\n\n${lyrics}`);
      setCopied(true);
      toast.success("Lyrics copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy lyrics: ", err);
      toast.error("Failed to copy lyrics.");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareText = `Read lyrics of "${title}" by ${author} on Kalam Library.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} Lyrics`,
          text: shareText,
          url: url,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing: ", err);
        }
      }
    } else {
      // Fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShared(true);
        toast.success("Share link copied to clipboard!");
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        console.error("Failed to copy link: ", err);
        toast.error("Failed to copy link.");
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mt-6 justify-center">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-900/60 border border-emerald-500/20 text-emerald-100 hover:bg-emerald-800/80 transition-all hover:border-emerald-400/40 shadow-sm cursor-pointer text-sm font-medium"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4 text-amber-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-amber-500">Copied!</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>Copy Lyrics</span>
          </>
        )}
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-600/80 border border-gold-500/20 text-black hover:bg-gold-500 transition-all hover:scale-105 shadow-sm cursor-pointer text-sm font-semibold"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.028-2.014m0 0a3 3 0 10-2.243-4.077L6.445 6.66m4.267 2.068L8.684 13.25m0 0l4.028 2.014m0 0a3 3 0 102.243-4.077L14.755 13M6.445 15.34l-4.028 2.014m0 0a3 3 0 102.243 4.077l4.028-2.014" />
        </svg>
        <span>{shared ? "Link Copied!" : "Share Kalam"}</span>
      </button>
    </div>
  );
}
