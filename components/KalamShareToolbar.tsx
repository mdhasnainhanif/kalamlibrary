"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Share2 } from "lucide-react";
import { isPlaceholderAuthorName } from "@/utils/authorHelper";
import { normalizeSharePageUrl } from "@/utils/exportShareCard";
import {
  buildShareCaption,
  getShareContactDefaults,
  stanzaLinesToText,
} from "@/utils/shareKalamPost";
import SharePreviewModal from "@/components/SharePreviewModal";

type KalamShareToolbarProps = {
  lyrics: string;
  title: string;
  author: string;
  lang: string;
  dir: "ltr" | "rtl";
  stanzas: string[][];
  selectedIndices: Set<number>;
  onSelectAll: () => void;
  onClearSelection: () => void;
};

export default function KalamShareToolbar({
  lyrics,
  title,
  author,
  lang,
  dir,
  stanzas,
  selectedIndices,
  onSelectAll,
  onClearSelection,
}: KalamShareToolbarProps) {
  const [copiedFull, setCopiedFull] = useState(false);
  const [copyPostDone, setCopyPostDone] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const displayAuthor = useMemo(
    () => (author && !isPlaceholderAuthorName(author) ? author : ""),
    [author]
  );

  const selectedStanzas = useMemo(() => {
    return [...selectedIndices]
      .sort((a, b) => a - b)
      .map((i) => stanzaLinesToText(stanzas[i] || []))
      .filter(Boolean);
  }, [selectedIndices, stanzas]);

  const shareInput = useCallback(() => {
    const pageUrl =
      typeof window !== "undefined" ? normalizeSharePageUrl(window.location.href) : "";
    const contact = getShareContactDefaults();
    return {
      title,
      author: displayAuthor,
      selectedStanzas,
      pageUrl,
      ...contact,
    };
  }, [title, displayAuthor, selectedStanzas]);

  const handleCopyFull = async () => {
    const header = displayAuthor ? `${title} — ${displayAuthor}` : title;
    try {
      await navigator.clipboard.writeText(`${header}\n\n${lyrics}`);
      setCopiedFull(true);
      toast.success("Full lyrics copied");
      setTimeout(() => setCopiedFull(false), 2000);
    } catch {
      toast.error("Could not copy lyrics");
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(buildShareCaption(shareInput()));
      setCopyPostDone(true);
      toast.success("Caption copied");
      setTimeout(() => setCopyPostDone(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  const caption = useMemo(() => buildShareCaption(shareInput()), [shareInput]);

  const openSharePreview = () => {
    if (selectedIndices.size === 0) {
      toast.error("Please select at least one couplet (band / شعر) to create your post.", {
        duration: 4500,
      });
      return;
    }
    setPreviewOpen(true);
  };

  const selectionCount = selectedIndices.size;

  return (
    <>
      <div className="mt-4 flex w-full flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
          >
            Select all couplets
          </button>
          {selectionCount > 0 ? (
            <button
              type="button"
              onClick={onClearSelection}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-emerald-50 dark:text-gray-400 dark:hover:bg-emerald-900/40"
            >
              Clear selection
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleCopyFull}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-emerald-500/30 bg-white px-5 py-2.5 text-sm font-medium text-emerald-800 shadow-sm hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-800/80 dark:hover:text-emerald-50"
          >
            {copiedFull ? "Copied!" : "Copy full lyrics"}
          </button>
          <button
            type="button"
            onClick={openSharePreview}
            aria-expanded={previewOpen}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gold-400"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            {selectionCount > 0
              ? `Create post (${selectionCount})`
              : "Create share post"}
          </button>
        </div>

        <SharePreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title={title}
          author={displayAuthor}
          caption={caption}
          selectedStanzas={selectedStanzas}
          stanzaCount={selectionCount}
          lang={lang}
          dir={dir}
          onCopyCaption={handleCopyCaption}
          copyDone={copyPostDone}
        />
      </div>

      {selectionCount > 0 ? (
        <div className="fixed bottom-4 left-3 right-3 z-[95] flex items-center justify-between gap-3 rounded-xl border border-gold-500/30 bg-emerald-950/95 px-4 py-3 shadow-xl backdrop-blur-md md:hidden">
          <span className="text-sm font-medium text-gray-200">{selectionCount} selected</span>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="cursor-pointer rounded-lg bg-gold-500 px-4 py-2 text-sm font-bold text-black"
          >
            Preview post
          </button>
        </div>
      ) : null}
    </>
  );
}
