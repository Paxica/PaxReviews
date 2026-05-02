"use client";

import type { WidgetConfig } from "@/lib/config";

interface PageControlsProps {
  page: number;
  totalPages: number;
  cfg: WidgetConfig;
  onAdvance: (dir: "next" | "prev") => void;
}

export function PageControls({ page, totalPages, cfg, onAdvance }: PageControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      {cfg.showNav && (
        <NavButton
          dir="prev"
          label="Previous page"
          cfg={cfg}
          onClick={() => onAdvance("prev")}
        />
      )}

      {cfg.showDots ? (
        <div className="flex gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: i === page ? cfg.colorAccent : cfg.colorMuted,
                display: "inline-block",
                transition: "background-color 0.25s",
              }}
            />
          ))}
        </div>
      ) : (
        <span
          className="text-xs tabular-nums"
          style={{ color: cfg.colorMuted }}
        >
          {page + 1} / {totalPages}
        </span>
      )}

      {cfg.showNav && (
        <NavButton
          dir="next"
          label="Next page"
          cfg={cfg}
          onClick={() => onAdvance("next")}
        />
      )}
    </div>
  );
}

function NavButton({
  dir,
  label,
  cfg,
  onClick,
}: {
  dir: "prev" | "next";
  label: string;
  cfg: WidgetConfig;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center transition-opacity hover:opacity-75"
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: cfg.colorCard,
        border: "1px solid rgba(255,255,255,0.12)",
        color: cfg.colorText,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transform: dir === "prev" ? "rotate(180deg)" : "none" }}
        aria-hidden="true"
      >
        <polyline points="5,3 9,7 5,11" />
      </svg>
    </button>
  );
}
