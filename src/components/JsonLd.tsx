import type { PlaceDetails, GoogleReview } from "@/lib/reviews";

interface JsonLdProps {
  place: PlaceDetails;
  reviews: GoogleReview[];
}

export function JsonLd({ place, reviews }: JsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: place.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: place.rating?.toFixed(1),
      reviewCount: place.user_ratings_total,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author_name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.text,
      datePublished: new Date(r.time * 1000).toISOString().split("T")[0],
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
