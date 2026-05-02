import { getReviews } from "@/lib/reviews";
import { ReviewCard } from "./ReviewCard";
import { StarRating } from "./StarRating";
import { GoogleLogo } from "./GoogleLogo";

export async function ReviewsWidget() {
  let result;
  try {
    result = await getReviews();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return (
      <div className="flex items-center justify-center p-8 text-red-400 text-sm">
        Could not load reviews: {message}
      </div>
    );
  }

  const { place, filteredReviews } = result;

  return (
    <section className="w-full px-4 py-6 select-none">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <GoogleLogo />
          <div>
            <h2 className="text-base font-semibold text-white leading-tight">
              {place.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-bold text-white tabular-nums">
                {place.rating?.toFixed(1)}
              </span>
              <StarRating rating={place.rating ?? 0} size="md" />
              <span className="text-sm text-gray-400">
                ({place.user_ratings_total?.toLocaleString() ?? 0})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable review cards */}
      {filteredReviews.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          No reviews matching the minimum star rating.
        </p>
      ) : (
        <div
          className="reviews-scroll flex gap-4 overflow-x-auto pb-3"
          role="list"
          aria-label="Customer reviews"
        >
          {filteredReviews.map((review, i) => (
            <ReviewCard key={`${review.author_name}-${i}`} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}
