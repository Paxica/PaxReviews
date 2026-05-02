"use client";

import { usePager } from "@/lib/usePager";
import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { ReviewCard } from "../ReviewCard";
import { PageControls } from "./PageControls";

interface GridLayoutProps {
  reviews: GoogleReview[];
  cfg: WidgetConfig;
}

export function GridLayout({ reviews, cfg }: GridLayoutProps) {
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

  const id = `pax-grid-${cfg.columns}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          #${id} {
            display: grid;
            grid-template-columns: repeat(${cfg.columns}, 1fr);
            gap: ${cfg.gap}px;
          }
          @media (max-width: 640px) {
            #${id} { grid-template-columns: repeat(${cfg.mobileColumns}, 1fr); }
          }
        `,
      }} />
      <div id={id} role="list" aria-label="Customer reviews">
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
