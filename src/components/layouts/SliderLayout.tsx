"use client";

import { useState, useEffect, useCallback } from "react";
import type { GoogleReview } from "@/lib/reviews";
import type { WidgetConfig } from "@/lib/config";
import { ReviewCard } from "../ReviewCard";
import { PageControls } from "./PageControls";

interface SliderLayoutProps {
  reviews: GoogleReview[];
  cfg: WidgetConfig;
}

export function SliderLayout({ reviews, cfg }: SliderLayoutProps) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const go = useCallback(
    (dir: "prev" | "next") => {
      if (fading) return;
      setFading(true);
      setTimeout(() => {
        setIndex((i) =>
          dir === "next"
            ? (i + 1) % reviews.length
            : (i - 1 + reviews.length) % reviews.length
        );
        setFading(false);
      }, 280);
    },
    [fading, reviews.length]
  );

  useEffect(() => {
    if (!cfg.autoplay || reviews.length < 2) return;
    const id = setInterval(() => go("next"), cfg.autoplayMs);
    return () => clearInterval(id);
  }, [cfg.autoplay, cfg.autoplayMs, go, reviews.length]);

  if (reviews.length === 0) return null;

  const safeIndex = Math.min(index, reviews.length - 1);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Card with fade transition */}
      <div
        className="w-full max-w-lg mx-auto"
        style={{
          opacity: fading ? 0 : 1,
          transform: fading ? "translateY(6px) scale(0.99)" : "translateY(0) scale(1)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
        }}
      >
        <ReviewCard
          // Key changes with index so pax-card-enter animation re-fires
          key={safeIndex}
          review={reviews[safeIndex]}
          cfg={cfg}
          index={0}
        />
      </div>

      {/* Controls */}
      <PageControls
        page={safeIndex}
        totalPages={reviews.length}
        cfg={cfg}
        onAdvance={go}
      />
    </div>
  );
}
