"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Figtree } from "next/font/google";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import SharePostPreviewStage from "@/components/share/SharePostPreviewStage";
import SharePostDesignerEditor from "@/components/share/SharePostDesignerEditor";
import {
  downloadBlob,
  fetchShareCardBlob,
  normalizeSharePageUrl,
  sharePostOnWhatsApp,
} from "@/utils/exportShareCard";
import { getIslamicHeroPatternDataUri } from "@/utils/islamicHeroPatternDataUri";
import {
  defaultPostThemeForLang,
  loadPostThemeFromStorage,
  savePostThemeToStorage,
  type PostTheme,
} from "@/utils/postTheme";

const uiFont = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-share-ui",
});

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

const girihPattern = getIslamicHeroPatternDataUri("#059669", 0.07);
const girihPatternDark = getIslamicHeroPatternDataUri("#d97706", 0.06);

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
  const titleId = useId();
  const descId = useId();
  const [imageBusy, setImageBusy] = useState(false);
  const [postTheme, setPostTheme] = useState<PostTheme>(() => defaultPostThemeForLang(lang));
  const themeHydrated = useRef(false);

  const pageUrl =
    typeof window !== "undefined" ? normalizeSharePageUrl(window.location.href) : "";

  useEffect(() => {
    if (themeHydrated.current) return;
    themeHydrated.current = true;
    const stored = loadPostThemeFromStorage();
    setPostTheme(stored);
  }, []);

  const handleThemeChange = useCallback((next: PostTheme) => {
    setPostTheme(next);
    savePostThemeToStorage(next);
  }, []);

  const handleResetTheme = useCallback(() => {
    const next = defaultPostThemeForLang(lang);
    setPostTheme(next);
    savePostThemeToStorage(next);
  }, [lang]);

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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
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
      toast.success("Image downloaded");
    } catch {
      toast.error("Could not create image — keep the designer open and try again");
    } finally {
      setImageBusy(false);
    }
  };

  const handleWhatsAppShare = async () => {
    if (stanzaCount === 0) {
      toast("Select at least one couplet first", { duration: 3000 });
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
        toast.success("WhatsApp opened — attach the image if needed");
      } else if (result === "text-plus-download") {
        toast.success("WhatsApp opened — attach the downloaded image", { duration: 5000 });
      } else {
        toast.success("WhatsApp opened — attach the downloaded image");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("Share failed");
      }
    } finally {
      setImageBusy(false);
    }
  };

  const coupletLine =
    stanzaCount === 1 ? "1 couplet selected" : `${stanzaCount} couplets selected`;

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`share-designer ${uiFont.variable} fixed inset-0 z-[200] font-[family-name:var(--font-share-ui)]`}
      style={{ fontFamily: "var(--font-share-ui), system-ui, sans-serif" }}
    >
      <button
        type="button"
        aria-label="Close designer"
        className="absolute inset-0 cursor-default bg-[color-mix(in_srgb,#0a1210_55%,transparent)] backdrop-blur-[6px] md:bg-[color-mix(in_srgb,#0a1210_62%,transparent)]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-[1] flex h-[100dvh] w-full flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)] md:absolute md:left-1/2 md:top-1/2 md:h-[min(720px,92vh)] md:w-full md:max-w-[1024px] md:-translate-x-1/2 md:-translate-y-1/2 md:flex-row md:rounded-2xl md:border md:border-[var(--border)] md:shadow-2xl"
      >
        {/* Mobile top bar */}
        <header className="share-designer-topbar flex shrink-0 items-start justify-between gap-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] px-4 py-3 backdrop-blur-md md:hidden">
          <div>
            <h2
              id={titleId}
              className="font-[family-name:var(--font-display)] text-lg font-semibold leading-tight text-[var(--foreground)]"
            >
              Design your post
            </h2>
            <p id={descId} className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              {coupletLine}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        {/* Preview column — capped on mobile so editor + actions stay in view */}
        <section className="flex h-[min(38dvh,340px)] min-h-0 shrink-0 flex-col overflow-hidden md:h-full md:min-w-0 md:flex-1">
          <div className="share-designer-preview-pane flex min-h-0 flex-col">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.32] dark:hidden"
              style={{
                backgroundImage: `url("${girihPattern}")`,
                backgroundSize: "112px 112px",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden opacity-25 dark:block"
              style={{
                backgroundImage: `url("${girihPatternDark}")`,
                backgroundSize: "112px 112px",
              }}
            />
            <SharePostPreviewStage
              title={title}
              author={author || undefined}
              stanzas={selectedStanzas}
              pageUrl={pageUrl}
              lang={lang}
              dir={dir}
              design={postTheme}
            />
          </div>
          <p className="hidden shrink-0 border-t border-[var(--border)] px-4 py-2 text-center text-[11px] text-[var(--muted-foreground)] md:block">
            Live preview · the saved image is high resolution
          </p>
        </section>

        {/* Editor column */}
        <aside className="flex min-h-0 w-full flex-1 flex-col overflow-hidden border-t border-[var(--border)] bg-[var(--background)] pb-[env(safe-area-inset-bottom)] md:h-full md:flex-none md:w-[340px] md:pb-0 md:border-l md:border-t-0">
          <header className="hidden shrink-0 items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-4 md:flex">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight text-[var(--foreground)]">
                Design your post
              </h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{coupletLine}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-1 pt-3 md:pb-2 md:pt-4">
            <SharePostDesignerEditor
              theme={postTheme}
              onChange={handleThemeChange}
              onReset={handleResetTheme}
              imageBusy={imageBusy}
              stanzaCount={stanzaCount}
              onWhatsApp={handleWhatsAppShare}
              onSaveImage={handleSaveImage}
              onCopyText={onCopyCaption}
              copyDone={copyDone}
            />
          </div>
        </aside>
      </div>
    </div>,
    document.body
  );
}
