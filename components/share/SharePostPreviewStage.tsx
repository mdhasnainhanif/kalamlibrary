"use client";

import { useEffect, useRef, useState } from "react";
import SharePostCard from "@/components/SharePostCard";
import { POST_ARTBOARD_HEIGHT, POST_ARTBOARD_WIDTH, type PostTheme } from "@/utils/postTheme";

type Props = {
  title: string;
  author?: string;
  stanzas: string[];
  pageUrl: string;
  lang: string;
  dir: "ltr" | "rtl";
  design: PostTheme;
};

export default function SharePostPreviewStage({
  title,
  author,
  stanzas,
  pageUrl,
  lang,
  dir,
  design,
}: Props) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.85);

  const cardHeight = POST_ARTBOARD_HEIGHT[design.layout.aspectRatio];

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;

    const compute = () => {
      const { width, height } = el.getBoundingClientRect();
      const padX = width < 768 ? 20 : 64;
      const padY = width < 768 ? 20 : 64;
      const areaW = Math.max(0, width - padX);
      const areaH = Math.max(0, height - padY);
      const maxScale = width < 768 ? 1 : 0.88;
      const s = Math.min(areaW / POST_ARTBOARD_WIDTH, areaH / cardHeight, maxScale);
      setScale(Number.isFinite(s) && s > 0 ? s : 0.85);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cardHeight]);

  const outerW = POST_ARTBOARD_WIDTH * scale;
  const outerH = cardHeight * scale;

  return (
    <div
      ref={areaRef}
      className="relative z-[1] flex h-full max-h-full min-h-0 w-full flex-1 items-center justify-center overflow-hidden p-3 md:p-6"
    >
      <div
        className="relative overflow-hidden rounded-xl ring-1 ring-[color-mix(in_srgb,var(--foreground)_12%,transparent)] transition-[width,height] duration-300 ease-out"
        style={{
          width: outerW,
          height: outerH,
          boxShadow:
            "0 8px 16px -4px color-mix(in srgb, #000 35%, transparent), 0 24px 48px -16px color-mix(in srgb, #000 45%, transparent)",
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: POST_ARTBOARD_WIDTH,
            height: cardHeight,
            transform: `scale(${scale})`,
          }}
        >
          <SharePostCard
            artboard
            title={title}
            author={author}
            stanzas={stanzas}
            pageUrl={pageUrl}
            lang={lang}
            dir={dir}
            design={design}
          />
        </div>
      </div>
    </div>
  );
}
