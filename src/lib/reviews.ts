export interface GoogleReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface PlaceDetails {
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
}

export interface ReviewsResult {
  place: PlaceDetails;
  filteredReviews: GoogleReview[];
}

// In-memory cache — survives for the lifetime of the serverless function warm instance.
// Vercel re-deploys reset it; for persistent cross-cold-start caching use KV or ISR revalidation.
let cache: { data: ReviewsResult; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function getReviews(): Promise<ReviewsResult> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  const minStars = parseInt(process.env.MIN_STAR_RATING ?? "4", 10);

  if (!apiKey || !placeId) {
    throw new Error(
      "Missing required env vars: GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID"
    );
  }

  const fields = "name,rating,user_ratings_total,reviews";
  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=${encodeURIComponent(fields)}` +
    `&key=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Google Places API HTTP error: ${res.status}`);
  }

  const json = await res.json();
  if (json.status !== "OK") {
    throw new Error(`Google Places API error: ${json.status} — ${json.error_message ?? ""}`);
  }

  const place: PlaceDetails = json.result;
  const filteredReviews: GoogleReview[] = (place.reviews ?? [])
    .filter((r) => r.rating >= minStars)
    .sort((a, b) => b.time - a.time);

  const data: ReviewsResult = { place, filteredReviews };
  cache = { data, fetchedAt: now };
  return data;
}
