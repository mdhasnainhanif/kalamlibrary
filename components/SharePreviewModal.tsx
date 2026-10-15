"use client";

import { useEffect, useRef, useState } from "react";
import { ImageDown, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import SharePostCard from "@/components/SharePostCard";
import {
  downloadBlob,
  fetchShareCardBlob,
  normalizeSharePageUrl,
  sharePostOnWhatsApp,
} from "@/utils/exportShareCard";

type SharePreviewPanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  author: string;
  caption: string;
  selectedStanzas: string[];
  stanzaCount: number;
  lang: string;
  dir: "ltr" | "rtl";
  onCopyCaption: () => void;
  copyDone: boolean;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function SharePreviewModal({
  open,
  onClose,
  title,
  author,
  caption,
  selectedStanzas,
  stanzaCount,
  lang,
  dir,
  onCopyCaption,
  copyDone,
}: SharePreviewPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [imageBusy, setImageBusy] = useState(false);

  const pageUrl =
    typeof window !== "undefined" ? normalizeSharePageUrl(window.location.href) : "";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
    return () => window.clearTimeout(t);
  }, [open]);

  const getImageBlob = async () => {
    return fetchShareCardBlob({
      title,
      author: author || undefined,
      stanzas: selectedStanzas,
      pageUrl,
    });
  };

  const handleSaveImage = async () => {
    setImageBusy(true);
    try {
      const blob = await getImageBlob();
      const slug = title.slice(0, 40).replace(/[^\w\u0600-\u06FF]+/g, "-");
      downloadBlob(blob, `kalam-${slug || "share"}.png`);
      toast.success("Image saved");
    } catch {
      toast.error("Could not create image — post preview khula hona chahiye");
    } finally {
      setImageBusy(false);
    }
  };

  const handleWhatsAppShare = async () => {
    if (stanzaCount === 0) {
      toast("Pehle upar se couplets select karein", { duration: 3000 });
      return;
    }

    setImageBusy(true);
    try {
      let imageBlob: Blob | null = null;
      try {
        imageBlob = await getImageBlob();
      } catch {
        imageBlob = null;
      }

      const result = await sharePostOnWhatsApp({
        caption,
        title,
        imageBlob,
      });

      if (result === "native-with-image") {
        toast.success("WhatsApp ya koi app choose karein");
      } else if (result === "text-plus-download") {
        toast.success("WhatsApp khul gaya — image download ho chuki hai, chat mein attach karein", {
          duration: 5000,
        });
      } else {
        toast.success("WhatsApp par contact choose karke bhejein");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("Share nahi ho saka");
      }
    } finally {
      setImageBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="region"
      aria-labelledby="share-preview-title"
      className="mt-4 w-full overflow-hidden rounded-2xl border border-emerald-500/25 bg-white shadow-lg dark:border-emerald-500/20 dark:bg-emerald-950/95"
    >
      <div className="flex items-center justify-between border-b border-emerald-500/15 px-4 py-3">
        <div>
          <h2 id="share-preview-title" className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Your post
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {stanzaCount > 0
              ? "Neeche WhatsApp dabayein — contact choose karke yahi post bhejein"
              : "Select couplets above, then share"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
          aria-label="Close share preview"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="px-3 py-4 sm:px-4">
        <SharePostCard
          title={title}
          author={author || undefined}
          stanzas={selectedStanzas}
          pageUrl={pageUrl}
          lang={lang}
          dir={dir}
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-emerald-500/15 p-4">
        <button
          type="button"
          disabled={imageBusy || stanzaCount === 0}
          onClick={handleWhatsAppShare}
          className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#20bd5a] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {imageBusy ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <WhatsAppIcon className="h-5 w-5" />
          )}
          Share on WhatsApp
        </button>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={imageBusy || stanzaCount === 0}
            onClick={handleSaveImage}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/70 dark:text-emerald-100 dark:hover:bg-emerald-800/55 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ImageDown className="h-4 w-4" aria-hidden />
            Save image
          </button>
          <button
            type="button"
            onClick={onCopyCaption}
            className="flex-1 cursor-pointer rounded-xl border border-emerald-500/25 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-200 dark:hover:bg-emerald-900/50 dark:hover:text-emerald-50"
          >
            {copyDone ? "Caption copied!" : "Copy caption"}
          </button>
        </div>
      </div>
    </div>
  );
}
