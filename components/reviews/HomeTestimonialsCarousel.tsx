"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "@/components/reviews/ReviewCard";
import type { PublicReview } from "@/utils/reviewsData";

const AUTO_MS = 5500;
const GAP_PX = 16;

function visibleCardCount(viewportWidth: number) {
  if (viewportWidth >= 1024) return 3;
  if (viewportWidth >= 640) return 2;
  return 1;
}

type Props = {
  reviews: PublicReview[];
};

export default function HomeTestimonialsCarousel({ reviews }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [slideWidth, setSlideWidth] = useState(280);
  const [visibleCount, setVisibleCount] = useState(3);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const count = visibleCardCount(viewport.clientWidth);
    const gaps = GAP_PX * Math.max(0, count - 1);
    const width = Math.floor((viewport.clientWidth - gaps) / count);
    setVisibleCount(count);
    setSlideWidth(Math.max(240, width));
  }, []);

  useEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(viewport);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const scrollByCard = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current;
      if (!track) return;
      const step = slideWidth + GAP_PX;
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

      if (direction === 1 && track.scrollLeft >= maxScroll - 6) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      if (direction === -1 && track.scrollLeft <= 6) {
        track.scrollTo({ left: maxScroll, behavior: "smooth" });
        return;
      }
      track.scrollBy({ left: direction * step, behavior: "smooth" });
    },
    [slideWidth],
  );

  useEffect(() => {
    if (reviews.length <= visibleCount || paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const id = window.setInterval(() => scrollByCard(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, reviews.length, scrollByCard, visibleCount]);

  const arrowClass =
    "kalam-btn kalam-btn--filled kalam-btn--pill !h-11 !w-11 !p-0 shrink-0 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:cursor-not-allowed disabled:opacity-40 sm:!h-12 sm:!w-12";

  return (
    <div
      className="mx-auto w-full max-w-5xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          className={arrowClass}
          aria-label="Previous review"
          disabled={reviews.length <= 1}
        >
          <ChevronLeft className="h-6 w-6 stroke-[2.5]" aria-hidden />
        </button>

        <div ref={viewportRef} className="min-w-0 flex-1 overflow-hidden">
          <div
            ref={trackRef}
            className="flex scroll-smooth snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ gap: GAP_PX }}
            role="region"
            aria-roledescription="carousel"
            aria-label="Reader reviews"
          >
            {reviews.map((review, index) => (
              <div
                key={review.id}
                data-review-slide
                className="shrink-0 snap-start"
                style={{ width: slideWidth }}
                aria-label={`Review ${index + 1} of ${reviews.length}`}
              >
                <ReviewCard review={review} variant="slider" />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollByCard(1)}
          className={arrowClass}
          aria-label="Next review"
          disabled={reviews.length <= 1}
        >
          <ChevronRight className="h-6 w-6 stroke-[2.5]" aria-hidden />
        </button>
      </div>
    </div>
  );
}
