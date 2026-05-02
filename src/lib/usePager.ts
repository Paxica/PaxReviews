import { useState, useEffect } from "react";

interface UsePagerResult<T> {
  page: number;
  totalPages: number;
  animKey: number;
  pageItems: T[];
  advance: (dir: "next" | "prev") => void;
}

export function usePager<T>(
  items: T[],
  pageSize: number,
  autoplay: boolean,
  autoplayMs: number
): UsePagerResult<T> {
  const [page, setPage] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Reset when item pool or page size changes
  useEffect(() => {
    setPage(0);
    setAnimKey((k) => k + 1);
  }, [items.length, pageSize]);

  // Auto-advance
  useEffect(() => {
    if (!autoplay || totalPages <= 1) return;
    const id = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
      setAnimKey((k) => k + 1);
    }, autoplayMs);
    return () => clearInterval(id);
  }, [autoplay, autoplayMs, totalPages]);

  const advance = (dir: "next" | "prev") => {
    setPage((p) =>
      dir === "next"
        ? (p + 1) % totalPages
        : (p - 1 + totalPages) % totalPages
    );
    setAnimKey((k) => k + 1);
  };

  const pageItems = items.slice(page * pageSize, (page + 1) * pageSize);

  return { page, totalPages, animKey, pageItems, advance };
}
