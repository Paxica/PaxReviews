"use client";

import { usePager } from "@/lib/usePager";
import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { StarRating } from "../StarRating";
import { PageControls } from "./PageControls";

interface BadgesLayoutProps {
  reviews: GoogleReview[];
  cfg: WidgetConfig;
}

export function BadgesLayout({ reviews, cfg }: BadgesLayoutProps) {
  const pageSize = cfg.rows > 0 ? cfg.rows : 8;
  const { page, totalPages, animKey, pageItems, advance } = usePager(
    reviews,
    pageSize,
    cfg.autoplay,
    cfg.autoplayMs
  );

  const displayReviews = cfg.autoplay
    ? pageItems
    : cfg.rows > 0
    ? reviews.slice(0, cfg.rows)
    : reviews;

  return (
    <>
      <div
        className="flex flex-wrap"
        style={{ gap: `${cfg.gap}px` }}
        aria-label="Customer reviews"
      >
        {displayReviews.map((r, i) => (
          <div
            key={cfg.autoplay ? `${animKey}-${i}` : `${r.author_name}-${i}`}
            className="pax-card-enter flex items-center gap-2 px-3 py-2"
            style={{
              backgroundColor: cfg.colorCard,
              borderRadius: `${cfg.borderRadius}px`,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              animationDelay: `${i * 50}ms`,
            }}
          >
            <StarRating rating={r.rating} size="sm" color={cfg.colorStars} />
            <span
              className="text-xs font-medium truncate max-w-[120px]"
              style={{ color: cfg.colorText }}
            >
              {r.author_name}
            </span>
          </div>
        ))}
      </div>

      {cfg.autoplay && (
        <PageControls
          page={page}
          totalPages={totalPages}
          cfg={cfg}
          onAdvance={advance}
        />
      )}
    </>
  );
}
