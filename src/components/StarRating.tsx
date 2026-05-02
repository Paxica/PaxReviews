interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function StarRating({
  rating,
  size = "md",
  color = "#FBBC04",
}: StarRatingProps) {
  const dim =
    size === "sm" ? 14 : size === "lg" ? 22 : 18;

  return (
    <span
      className="inline-flex gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        const id = `h-${star}-${Math.round(rating * 10)}`;
        return (
          <svg
            key={star}
            viewBox="0 0 20 20"
            width={dim}
            height={dim}
            fill={filled ? color : half ? `url(#${id})` : "#374151"}
            aria-hidden="true"
          >
            {half && (
              <defs>
                <linearGradient id={id}>
                  <stop offset="50%" stopColor={color} />
                  <stop offset="50%" stopColor="#374151" />
                </linearGradient>
              </defs>
            )}
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </span>
  );
}
