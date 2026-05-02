import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { ReviewCard } from "../ReviewCard";

interface ListLayoutProps {
  reviews: GoogleReview[];
  cfg: WidgetConfig;
}

export function ListLayout({ reviews, cfg }: ListLayoutProps) {
  return (
    <div
      className="flex flex-col"
      style={{ gap: `${cfg.gap}px` }}
      role="list"
      aria-label="Customer reviews"
    >
      {reviews.map((r, i) => (
        <ReviewCard key={`${r.author_name}-${i}`} review={r} cfg={cfg} />
      ))}
    </div>
  );
}
