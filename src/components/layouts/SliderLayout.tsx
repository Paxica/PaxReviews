"use client";

import { useState, useEffect, useCallback } from "react";
import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { ReviewCard } from "../ReviewCard";

interface SliderLayoutProps {
  reviews: GoogleReview[];
  cfg: WidgetConfig;
}

export function SliderLayout({ reviews, cfg }: SliderLayoutProps) {
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: "prev" | "next") => {
      setIndex((i) =>
        dir === "next" ? (i + 1) % reviews.length : (i - 1 + reviews.length) % reviews.length
      );
    },
    [reviews.length]
  );

  useEffect(() => {
    if (!cfg.autoplay || reviews.length < 2) return;
    const id = setInterval(() => go("next"), cfg.autoplayMs);
    return () => clearInterval(id);
  }, [cfg.autoplay, cfg.autoplayMs, go, reviews.length]);

  if (reviews.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Single card */}
      <div className="w-full max-w-lg mx-auto">
        <ReviewCard review={reviews[index]} cfg={cfg} />
      </div>

      {/* Navigation */}
      {cfg.showNav && reviews.length > 1 && (
        <div className="flex items-center gap-4">
          <NavBtn onClick={() => go("prev")} label="Previous" dir="prev" cfg={cfg} />

          {/* Counter */}
          <span
            className="text-sm tabular-nums"
            style={{ color: cfg.colorMuted }}
          >
            {index + 1} / {reviews.length}
          </span>

          <NavBtn onClick={() => go("next")} label="Next" dir="next" cfg={cfg} />
        </div>
      )}

      {/* Dot indicators */}
      {cfg.showDots && reviews.length > 1 && (
        <div className="flex gap-1.5 flex-wrap justify-center">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: i === index ? cfg.colorAccent : cfg.colorMuted,
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "background-color 0.2s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavBtn({
  onClick,
  label,
  dir,
  cfg,
}: {
  onClick: () => void;
  label: string;
  dir: "prev" | "next";
  cfg: WidgetConfig;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center transition-opacity hover:opacity-75"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: cfg.colorCard,
        border: "1px solid rgba(255,255,255,0.12)",
        color: cfg.colorText,
        cursor: "pointer",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: dir === "prev" ? "rotate(180deg)" : "none" }}
        aria-hidden="true"
      >
        <polyline points="6,3 11,8 6,13" />
      </svg>
    </button>
  );
}
