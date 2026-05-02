// Uses the Google Places API (New) — v1
// Requires "Places API (New)" enabled in Google Cloud Console,
// NOT the legacy "Places API".

export interface OwnerResponse {
  text: string;
  relative_time_description: string;
}

export interface GoogleReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;       // always the reviewer's original language
  time: number;       // Unix seconds
  owner_response?: OwnerResponse;
}

export interface PlaceDetails {
  name: string;
  rating: number;
  user_ratings_total: number;
}

export interface ReviewsData {
  place: PlaceDetails;
  reviews: GoogleReview[];
}

// ── Internal v1 API types ──────────────────────────────────────────────────

interface V1Text { text: string; languageCode: string }

interface V1Review {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text?: V1Text;
  originalText?: V1Text;
  authorAttribution: { displayName: string; uri: string; photoUri: string };
  publishTime: string;
  ownerResponse?: {
    relativePublishTimeDescription?: string;
    text?: V1Text;
  };
}

interface V1Place {
  displayName: { text: string };
  rating: number;
  userRatingCount: number;
  reviews?: V1Review[];
}

function mapReview(r: V1Review): GoogleReview {
  return {
    author_name:       r.authorAttribution?.displayName ?? "Anonymous",
    author_url:        r.authorAttribution?.uri ?? "",
    profile_photo_url: r.authorAttribution?.photoUri ?? "",
    rating:            r.rating,
    relative_time_description: r.relativePublishTimeDescription,
    // Prefer the original-language text; fall back to whatever Google returns
    text: r.originalText?.text ?? r.text?.text ?? "",
    time: Math.floor(new Date(r.publishTime).getTime() / 1000),
    owner_response: r.ownerResponse?.text?.text
      ? {
          text: r.ownerResponse.text.text,
          relative_time_description:
            r.ownerResponse.relativePublishTimeDescription ?? "",
        }
      : undefined,
  };
}

// ── In-memory cache ────────────────────────────────────────────────────────

let cache: { data: ReviewsData; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function getReviews(): Promise<ReviewsData> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) return cache.data;

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    throw new Error(
      "Missing env vars: GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID"
    );
  }

  const fields = [
    "displayName",
    "rating",
    "userRatingCount",
    "reviews",
  ].join(",");

  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fields,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Places API (New) error ${res.status}: ${body.slice(0, 200)}`
    );
  }

  const json: V1Place = await res.json();

  const place: PlaceDetails = {
    name:               json.displayName?.text ?? "Unknown",
    rating:             json.rating ?? 0,
    user_ratings_total: json.userRatingCount ?? 0,
  };

  const reviews: GoogleReview[] = (json.reviews ?? []).map(mapReview);

  const data: ReviewsData = { place, reviews };
  cache = { data, fetchedAt: now };
  return data;
}
