"use client";

import { useRef, useEffect, useCallback } from "react";
import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { ReviewCard } from "../ReviewCard";

interface CarouselLayoutProps {
  reviews: GoogleReview[];
  cfg: WidgetConfig;
}

export function CarouselLayout({ reviews, cfg }: CarouselLayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((dir: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.85;
    if (dir === "next") {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: delta, behavior: "smooth" });
      }
    } else {
      el.scrollBy({ left: -delta, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!cfg.autoplay) return;
    const id = setInterval(() => scrollBy("next"), cfg.autoplayMs);
    return () => clearInterval(id);
  }, [cfg.autoplay, cfg.autoplayMs, scrollBy]);

  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{
        __html: `
          .pax-carousel-card {
            flex-shrink: 0;
            min-width: calc(${100 / cfg.columns}% - ${(cfg.gap * (cfg.columns - 1)) / cfg.columns}px);
            scroll-snap-align: start;
          }
          @media (max-width: 640px) {
            .pax-carousel-card {
              min-width: calc(${100 / cfg.mobileColumns}% - ${(cfg.gap * (cfg.mobileColumns - 1)) / cfg.mobileColumns}px);
            }
          }
        `,
      }} />

      {/* Track */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-2"
        style={{
          gap: `${cfg.gap}px`,
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
        role="list"
        aria-label="Customer reviews"
      >
        {reviews.map((r, i) => (
          <div key={`${r.author_name}-${i}`} className="pax-carousel-card">
            <ReviewCard review={r} cfg={cfg} index={i} />
          </div>
        ))}
      </div>

      {/* Nav arrows */}
      {cfg.showNav && reviews.length > cfg.columns && (
        <div className="flex justify-center gap-3 mt-4">
          <NavButton onClick={() => scrollBy("prev")} label="Previous" dir="prev" cfg={cfg} />
          <NavButton onClick={() => scrollBy("next")} label="Next"     dir="next" cfg={cfg} />
        </div>
      )}
    </div>
  );
}

function NavButton({
  onClick, label, dir, cfg,
}: {
  onClick: () => void;
  label: string;
  dir: "prev" | "next";
  cfg: WidgetConfig;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center transition-opacity hover:opacity-75"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: cfg.colorCard,
        border: "1px solid rgba(255,255,255,0.12)",
        color: cfg.colorText,
        cursor: "pointer",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: dir === "prev" ? "rotate(180deg)" : "none" }} aria-hidden="true">
        <polyline points="6,3 11,8 6,13" />
      </svg>
    </button>
  );
}
