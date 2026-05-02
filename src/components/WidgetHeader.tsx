import type { PlaceDetails } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { StarRating } from "./StarRating";
import { GoogleLogo } from "./GoogleLogo";

interface WidgetHeaderProps {
  place: PlaceDetails;
  cfg: WidgetConfig;
}

export function WidgetHeader({ place, cfg }: WidgetHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <GoogleLogo />
        <div>
          <h2
            style={{
              fontSize: `${cfg.fontSizeTitle}px`,
              color: cfg.colorText,
            }}
            className="font-semibold leading-tight"
          >
            {place.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span
              style={{ color: cfg.colorText }}
              className="text-2xl font-bold tabular-nums leading-none"
            >
              {place.rating?.toFixed(1)}
            </span>
            <StarRating
              rating={place.rating ?? 0}
              color={cfg.colorStars}
              size="md"
            />
            <span style={{ color: cfg.colorMuted }} className="text-sm">
              ({place.user_ratings_total?.toLocaleString()})
            </span>
          </div>
        </div>
      </div>

      {cfg.showWriteReview && cfg.writeReviewUrl && (
        <a
          href={cfg.writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: cfg.colorAccent }}
          className="rounded-full px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 whitespace-nowrap"
        >
          Write a Review
        </a>
      )}
    </div>
  );
}
