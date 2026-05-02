import type { GoogleReview } from "./reviews";
import type { WidgetConfig } from "./config";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function filterReviews(
  reviews: GoogleReview[],
  config: WidgetConfig
): GoogleReview[] {
  let result = reviews.filter((r) => r.rating >= config.minStars);

  if (config.excludeKeywords.length > 0) {
    result = result.filter((r) => {
      const lower = r.text.toLowerCase();
      return !config.excludeKeywords.some((kw) => lower.includes(kw));
    });
  }

  if (config.pickAuthors.length > 0) {
    result = result.filter((r) =>
      config.pickAuthors.some((name) =>
        r.author_name.toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  result =
    config.sort === "random"
      ? shuffle(result)
      : [...result].sort((a, b) => b.time - a.time);

  if (config.rows > 0) {
    const cap =
      config.layout === "list" ||
      config.layout === "slider" ||
      config.layout === "badges"
        ? config.rows
        : config.rows * config.columns;
    result = result.slice(0, cap);
  }

  return result;
}
