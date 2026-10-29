"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Copy, Download, Loader2, MessageCircle, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { ShareCard } from "@/components/ShareCard";
import { sharePostOnWhatsApp } from "@/utils/exportShareCard";
import {
  ASPECTS,
  CARD_PATTERN_OPTIONS,
  CARD_PRESETS,
  captureShareCardNode,
  downloadShareBlob,
  loadCardDesignFromStorage,
  previewSlotHeight,
  saveCardDesignToStorage,
  type Aspect,
  type CardDesign,
} from "@/utils/shareCardDesign";
import { normalizeSharePageUrl } from "@/utils/exportShareCard";

type SharePreviewModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  author: string;
  caption: string;
  selectedStanzas: string[];
  stanzaCount: number;
  lang: string;
  dir: "ltr" | "rtl";
};

function stanzasToBlocks(selected: string[]): string[][] {
  return selected.map((block) => block.split("\n"));
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
}: SharePreviewModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<null | "download" | "whatsapp">(null);
  const [design, setDesign] = useState<CardDesign>(() => loadCardDesignFromStorage());
  const [portalReady, setPortalReady] = useState(false);
  const hydrated = useRef(false);

  const stanzaBlocks = stanzasToBlocks(selectedStanzas);
  const pageUrl =
    typeof window !== "undefined" ? normalizeSharePageUrl(window.location.href) : "";
  const displayHost = pageUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") || "kalamlibrary.me";

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    setDesign(loadCardDesignFromStorage());
  }, []);

  const patchDesign = useCallback((partial: Partial<CardDesign>) => {
    setDesign((prev) => {
      const next = { ...prev, ...partial };
      saveCardDesignToStorage(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const getBlob = async () => {
    const node = cardRef.current;
    if (!node) throw new Error("Share card not found");
    const preset = CARD_PRESETS.find((p) => p.id === design.presetId) ?? CARD_PRESETS[0]!;
    return captureShareCardNode(node, preset.bg2);
  };

  const onDownload = async () => {
    if (stanzaCount === 0) {
      toast("Pehle couplets select karein", { duration: 3000 });
      return;
    }
    setBusy("download");
    try {
      const blob = await getBlob();
      const slug = title.slice(0, 40).replace(/[^\w\u0600-\u06FF]+/g, "-") || "kalam-post";
      downloadShareBlob(blob, `${slug}.png`);
      toast.success("Image saved");
    } catch {
      toast.error("Could not create image");
    } finally {
      setBusy(null);
    }
  };

  const onWhatsApp = async () => {
    if (stanzaCount === 0) {
      toast("Pehle couplets select karein", { duration: 3000 });
      return;
    }
    setBusy("whatsapp");
    try {
      let imageBlob: Blob | null = null;
      try {
        imageBlob = await getBlob();
      } catch {
        imageBlob = null;
      }
      const result = await sharePostOnWhatsApp({ caption, title, imageBlob });
      if (result === "native-with-image") {
        toast.success("WhatsApp ya koi app choose karein");
      } else if (result === "text-plus-download") {
        toast.success("WhatsApp khul gaya — image attach karein", { duration: 5000 });
      } else {
        toast.success("WhatsApp par contact choose karke bhejein");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") toast.error("Share nahi ho saka");
    } finally {
      setBusy(null);
    }
  };

  const onCopyText = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      toast.success("Caption copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  if (!open || !portalReady) return null;

  const scale = ASPECTS[design.aspect].scale;
  const slotH = previewSlotHeight(design.aspect, scale);

  return createPortal(
    <div
      className="fixed inset-0 z-[250] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
    >
      <button
        type="button"
        className="absolute inset-0 z-0 cursor-pointer bg-black/55 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-4xl max-h-[min(92vh,900px)] min-h-[min(85vh,640px)] flex-col overflow-hidden rounded-t-2xl border border-emerald-500/20 bg-[#faf6ec] shadow-2xl sm:min-h-0 sm:rounded-2xl dark:border-emerald-500/15 dark:bg-[#0a1812]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 cursor-pointer rounded-lg p-2 text-gray-600 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid min-h-0 flex-1 overflow-hidden md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_320px]">
          {/* Preview */}
          <div className="flex items-center justify-center bg-[#e8ece9]/90 p-5 dark:bg-[#051510]/90 md:p-8">
            <div style={{ width: 420 * scale, height: slotH, position: "relative" }}>
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: 420,
                }}
              >
                <ShareCard
                  ref={cardRef}
                  title={title}
                  author={author || undefined}
                  stanzas={stanzaBlocks}
                  lang={lang}
                  dir={dir}
                  design={design}
                  siteUrl={displayHost.split("/")[0]}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex max-h-[50vh] flex-col gap-5 overflow-y-auto border-t border-emerald-900/10 p-5 md:max-h-none md:border-t-0 md:border-l dark:border-emerald-500/10">
            <div className="pr-8">
              <h2 id="share-dialog-title" className="font-display text-2xl font-semibold text-[#1f3a2b] dark:text-emerald-50">
                Create a share card
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[#5c5748] dark:text-emerald-200/70">
                {stanzaCount > 0
                  ? `${stanzaCount} couplet${stanzaCount === 1 ? "" : "s"} selected. Style it, then download or send on WhatsApp.`
                  : "Select couplets above to preview your post."}
              </p>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#2f4a33] dark:text-emerald-400/90">
                Palette
              </p>
              <div className="flex flex-wrap gap-2">
                {CARD_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    title={p.name}
                    onClick={() => patchDesign({ presetId: p.id })}
                    className={`h-9 w-9 cursor-pointer rounded-full border-2 transition-transform hover:scale-110 ${
                      design.presetId === p.id
                        ? "border-[#062a1f] ring-2 ring-[#062a1f]/40 dark:border-gold-500 dark:ring-gold-500/40"
                        : "border-white/80 dark:border-emerald-800"
                    }`}
                    style={{ background: `linear-gradient(135deg, ${p.bg} 50%, ${p.accent} 50%)` }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#2f4a33] dark:text-emerald-400/90">
                Background pattern
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {CARD_PATTERN_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => patchDesign({ patternStyle: opt.id })}
                    className={`cursor-pointer rounded-lg border px-2 py-2 text-[10px] font-semibold sm:text-[11px] ${
                      design.patternStyle === opt.id
                        ? "border-[#062a1f] bg-[#062a1f] text-white dark:border-emerald-600 dark:bg-emerald-700"
                        : "border-emerald-900/15 bg-white/70 text-[#2f4a33] dark:border-emerald-500/20 dark:bg-emerald-950/50 dark:text-emerald-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {design.patternStyle !== "none" && design.patternStyle !== "dot-grid" ? (
                <label className="mt-3 block text-xs text-[#5c5748] dark:text-emerald-200/70">
                  Pattern strength
                  <input
                    type="range"
                    min={0.06}
                    max={0.45}
                    step={0.02}
                    value={design.patternStrength}
                    onChange={(e) => patchDesign({ patternStrength: parseFloat(e.target.value) })}
                    className="mt-1.5 h-2 w-full cursor-pointer accent-[#062a1f] dark:accent-emerald-500"
                  />
                </label>
              ) : null}
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#2f4a33] dark:text-emerald-400/90">
                Format
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(ASPECTS) as Aspect[]).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => patchDesign({ aspect: a })}
                    className={`cursor-pointer rounded-lg border px-1.5 py-2 text-[10px] font-semibold leading-tight transition-colors sm:text-[11px] ${
                      design.aspect === a
                        ? "border-[#062a1f] bg-[#062a1f] text-white dark:border-emerald-600 dark:bg-emerald-700"
                        : "border-emerald-900/15 bg-white/70 text-[#2f4a33] hover:bg-white dark:border-emerald-500/20 dark:bg-emerald-950/50 dark:text-emerald-100"
                    }`}
                  >
                    {ASPECTS[a].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#2f4a33] dark:text-emerald-400/90">
                Text size
                <span>{design.fontSize}px</span>
              </p>
              <input
                type="range"
                min={11}
                max={26}
                step={1}
                value={design.fontSize}
                onChange={(e) => patchDesign({ fontSize: parseInt(e.target.value, 10) })}
                className="h-2 w-full cursor-pointer accent-[#062a1f] dark:accent-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-[#2f4a33] dark:text-emerald-100">
              <span>Show poet name</span>
              <button
                type="button"
                role="switch"
                aria-checked={design.showAuthor}
                onClick={() => patchDesign({ showAuthor: !design.showAuthor })}
                className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  design.showAuthor ? "bg-[#062a1f] dark:bg-emerald-600" : "bg-gray-300 dark:bg-emerald-900"
                }`}
              >
                <span
                  className={`absolute top-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    design.showAuthor ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="mt-auto grid gap-2 pt-2">
              <button
                type="button"
                disabled={!!busy || stanzaCount === 0}
                onClick={onWhatsApp}
                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#062a1f] text-sm font-bold text-white hover:bg-[#0a3d2d] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-emerald-700 dark:hover:bg-emerald-600"
              >
                {busy === "whatsapp" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
                Share on WhatsApp
              </button>
              <button
                type="button"
                disabled={!!busy || stanzaCount === 0}
                onClick={onDownload}
                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-[#062a1f] bg-white text-sm font-bold text-[#062a1f] hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-emerald-500/40 dark:bg-transparent dark:text-emerald-100"
              >
                {busy === "download" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download image
              </button>
              <button
                type="button"
                onClick={onCopyText}
                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-900/15 bg-white/80 text-sm font-semibold text-[#2f4a33] hover:bg-white dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-100"
              >
                <Copy className="h-4 w-4" />
                Copy as text
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
