import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { StarRating } from "../StarRating";

interface BadgesLayoutProps {
  reviews: GoogleReview[];
  cfg: WidgetConfig;
}

export function BadgesLayout({ reviews, cfg }: BadgesLayoutProps) {
  return (
    <div
      className="flex flex-wrap"
      style={{ gap: `${cfg.gap}px` }}
      aria-label="Customer reviews"
    >
      {reviews.map((r, i) => (
        <div
          key={`${r.author_name}-${i}`}
          className="flex items-center gap-2 px-3 py-2"
          style={{
            backgroundColor: cfg.colorCard,
            borderRadius: `${cfg.borderRadius}px`,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
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
  );
}
