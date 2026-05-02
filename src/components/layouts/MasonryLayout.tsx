import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { ReviewCard } from "../ReviewCard";

interface MasonryLayoutProps {
  reviews: GoogleReview[];
  cfg: WidgetConfig;
}

export function MasonryLayout({ reviews, cfg }: MasonryLayoutProps) {
  const id = "masonry-" + cfg.columns;
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          #${id} { columns: ${cfg.columns}; column-gap: ${cfg.gap}px; }
          #${id} > article { break-inside: avoid; margin-bottom: ${cfg.gap}px; }
          @media (max-width: 640px) {
            #${id} { columns: ${cfg.mobileColumns}; }
          }
        `,
      }} />
      <div id={id} aria-label="Customer reviews">
        {reviews.map((r, i) => (
          <ReviewCard key={`${r.author_name}-${i}`} review={r} cfg={cfg} />
        ))}
      </div>
    </>
  );
}
