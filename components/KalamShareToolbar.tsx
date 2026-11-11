"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Share2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { isPlaceholderAuthorName } from "@/utils/authorHelper";
import { normalizeSharePageUrl } from "@/utils/exportShareCard";
import {
  buildShareCaption,
  getShareContactDefaults,
  stanzaLinesToText,
} from "@/utils/shareKalamPost";
import SharePreviewModal from "@/components/SharePreviewModal";

type KalamShareToolbarProps = {
  getFullLyrics: () => string;
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
  getFullLyrics,
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
      await navigator.clipboard.writeText(`${header}\n\n${getFullLyrics()}`);
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
      toast.success("Text copied");
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
          <Button type="button" variant="outline" shape="pill" size="md" onClick={handleCopyFull}>
            {copiedFull ? "Copied!" : "Copy full lyrics"}
          </Button>
          <Button
            type="button"
            variant="filled"
            shape="pill"
            size="md"
            onClick={openSharePreview}
            aria-expanded={previewOpen}
          >
            <Share2 className="h-4 w-4" aria-hidden />
            {selectionCount > 0 ? `Create post (${selectionCount})` : "Create share post"}
          </Button>
        </div>

      </div>

      {previewOpen ? (
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
      ) : null}

      {selectionCount > 0 ? (
        <div className="fixed bottom-4 left-3 right-3 z-[95] flex items-center justify-between gap-3 rounded-xl border border-gold-500/30 bg-emerald-950/95 px-4 py-3 shadow-xl backdrop-blur-md md:hidden">
          <span className="text-sm font-medium text-gray-200">{selectionCount} selected</span>
          <Button type="button" variant="filled" size="sm" onClick={() => setPreviewOpen(true)}>
            Preview post
          </Button>
        </div>
      ) : null}
    </>
  );
}
