"use client";

import { useState } from "react";
import Image from "next/image";
import { StarRating } from "./StarRating";
import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";

interface ReviewCardProps {
  review: GoogleReview;
  cfg: WidgetConfig;
}

export function ReviewCard({ review, cfg }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { elements: el } = cfg;
  const isLong = review.text.length > 200;

  const cardStyle = {
    backgroundColor: cfg.colorCard,
    borderRadius: `${cfg.borderRadius}px`,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
  };

  return (
    <article className="flex flex-col gap-3 p-5" style={cardStyle}>
      {/* Reviewer row */}
      {(el.showPhoto || el.showName || el.showDate || el.showVerified || el.showSourceIcon) && (
        <div className="flex items-center gap-3">
          {el.showPhoto && (
            <div
              className="relative flex-shrink-0 overflow-hidden"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
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
                <div
                  className="flex h-full w-full items-center justify-center text-sm font-semibold text-white"
                  style={{ backgroundColor: cfg.colorAccent }}
                >
                  {review.author_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            {el.showName && (
              <p
                className="truncate font-semibold"
                style={{
                  fontSize: `${cfg.fontSizeTitle}px`,
                  color: cfg.colorText,
                }}
              >
                {review.author_name}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              {el.showDate && (
                <span
                  className="text-xs"
                  style={{ color: cfg.colorMuted }}
                >
                  {review.relative_time_description}
                </span>
              )}
              {el.showVerified && (
                <span
                  className="flex items-center gap-0.5 text-xs"
                  style={{ color: cfg.colorAccent }}
                >
                  <CheckIcon size={11} />
                  Verified
                </span>
              )}
              {el.showSourceIcon && <GoogleGIcon size={14} />}
            </div>
          </div>
        </div>
      )}

      {/* Stars */}
      {el.showStars && (
        <StarRating rating={review.rating} size="sm" color={cfg.colorStars} />
      )}

      {/* Review text */}
      {review.text ? (
        <div className="flex-1">
          <p
            className={!expanded && isLong ? "line-clamp-3" : ""}
            style={{
              fontSize: `${cfg.fontSizeBody}px`,
              color: cfg.colorText,
              lineHeight: "1.6",
            }}
          >
            {review.text}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-medium transition-opacity hover:opacity-75"
              style={{ color: cfg.colorAccent }}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      ) : null}

      {/* Owner reply */}
      {el.showReply && review.owner_response && (
        <div
          className="p-3 mt-1"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: `${Math.max(cfg.borderRadius - 4, 4)}px`,
          }}
        >
          <p
            className="text-xs font-semibold mb-1"
            style={{ color: cfg.colorMuted }}
          >
            Response from the owner
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: cfg.colorText }}
          >
            {review.owner_response.text}
          </p>
        </div>
      )}
    </article>
  );
}

function CheckIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="2,6 5,9 10,3" />
    </svg>
  );
}

function GoogleGIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Google"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
