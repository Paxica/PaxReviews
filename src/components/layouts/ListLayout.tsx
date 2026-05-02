"use client";

import { usePager } from "@/lib/usePager";
import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { ReviewCard } from "../ReviewCard";
import { PageControls } from "./PageControls";

interface ListLayoutProps {
  reviews: GoogleReview[];
  cfg: WidgetConfig;
}

export function ListLayout({ reviews, cfg }: ListLayoutProps) {
  const pageSize = cfg.rows > 0 ? cfg.rows : 4;
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
        className="flex flex-col"
        style={{ gap: `${cfg.gap}px` }}
        role="list"
        aria-label="Customer reviews"
      >
        {displayReviews.map((r, i) => (
          <ReviewCard
            key={cfg.autoplay ? `${animKey}-${i}` : `${r.author_name}-${i}`}
            review={r}
            cfg={cfg}
            index={i}
          />
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
