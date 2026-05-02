import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { ReviewCard } from "../ReviewCard";

interface GridLayoutProps {
  reviews: GoogleReview[];
  cfg: WidgetConfig;
}

export function GridLayout({ reviews, cfg }: GridLayoutProps) {
  const id = "grid-" + cfg.columns;
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
        {reviews.map((r, i) => (
          <ReviewCard key={`${r.author_name}-${i}`} review={r} cfg={cfg} />
        ))}
      </div>
    </>
  );
}
