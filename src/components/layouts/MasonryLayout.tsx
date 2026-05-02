"use client";

import { usePager } from "@/lib/usePager";
import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { ReviewCard } from "../ReviewCard";
import { PageControls } from "./PageControls";

interface MasonryLayoutProps {
  reviews: GoogleReview[];
  cfg: WidgetConfig;
}

export function MasonryLayout({ reviews, cfg }: MasonryLayoutProps) {
  const pageSize = Math.max(1, cfg.rows > 0 ? cfg.rows : 2) * Math.max(1, cfg.columns);
  const { page, totalPages, animKey, pageItems, advance } = usePager(
    reviews,
    pageSize,
    cfg.autoplay,
    cfg.autoplayMs
  );

  const displayReviews = cfg.autoplay
    ? pageItems
    : cfg.rows > 0
    ? reviews.slice(0, cfg.rows * cfg.columns)
    : reviews;

  const id = `pax-masonry-${cfg.columns}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          #${id} { columns: ${cfg.columns}; column-gap: ${cfg.gap}px; }
          #${id} > article { break-inside: avoid; margin-bottom: ${cfg.gap}px; }
          @media (max-width: 640px) { #${id} { columns: ${cfg.mobileColumns}; } }
        `,
      }} />
      <div id={id} aria-label="Customer reviews">
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
