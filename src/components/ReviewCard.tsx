"use client";

import { useState } from "react";
import Image from "next/image";
import { StarRating } from "./StarRating";
import type { GoogleReview } from "@/lib/reviews";

interface ReviewCardProps {
  review: GoogleReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 180;

  return (
    <article className="flex-shrink-0 w-72 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
      {/* Reviewer info */}
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10">
          {review.profile_photo_url ? (
            <Image
              src={review.profile_photo_url}
              alt={review.author_name}
              fill
              sizes="40px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-700 text-sm font-semibold text-white">
              {review.author_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {review.author_name}
          </p>
          <p className="text-xs text-gray-400">
            {review.relative_time_description}
          </p>
        </div>
      </div>

      {/* Stars */}
      <StarRating rating={review.rating} size="sm" />

      {/* Review text */}
      <div className="flex-1">
        <p
          className={`text-sm leading-relaxed text-gray-300 ${
            !expanded && isLong ? "line-clamp-3" : ""
          }`}
        >
          {review.text || <span className="italic text-gray-500">No review text.</span>}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </article>
  );
}
