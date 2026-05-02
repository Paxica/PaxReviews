import { getReviews } from "@/lib/reviews";
import { filterReviews } from "@/lib/filterReviews";
import type { WidgetConfig } from "@/lib/config";
import { WidgetHeader } from "./WidgetHeader";
import { JsonLd } from "./JsonLd";
import { GridLayout } from "./layouts/GridLayout";
import { MasonryLayout } from "./layouts/MasonryLayout";
import { ListLayout } from "./layouts/ListLayout";
import { BadgesLayout } from "./layouts/BadgesLayout";
import { CarouselLayout } from "./layouts/CarouselLayout";
import { SliderLayout } from "./layouts/SliderLayout";

interface ReviewsWidgetProps {
  cfg: WidgetConfig;
}

export async function ReviewsWidget({ cfg }: ReviewsWidgetProps) {
  let data;
  try {
    data = await getReviews();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return (
      <div
        className="flex items-center justify-center p-8 text-sm"
        style={{ color: "#f87171" }}
      >
        Could not load reviews: {msg}
      </div>
    );
  }

  const { place, reviews: raw } = data;
  const reviews = filterReviews(raw, cfg);

  return (
    <section
      className="w-full px-4 py-6 select-none"
      style={{ backgroundColor: "transparent" }}
    >
      {cfg.showJsonLd && <JsonLd place={place} reviews={reviews} />}

      {cfg.showHeader && <WidgetHeader place={place} cfg={cfg} />}

      {reviews.length === 0 ? (
        <p className="text-sm italic" style={{ color: cfg.colorMuted }}>
          No reviews match the current filters.
        </p>
      ) : (
        <LayoutSwitch reviews={reviews} cfg={cfg} />
      )}
    </section>
  );
}

function LayoutSwitch({
  reviews,
  cfg,
}: {
  reviews: ReturnType<typeof filterReviews>;
  cfg: WidgetConfig;
}) {
  switch (cfg.layout) {
    case "grid":
      return <GridLayout reviews={reviews} cfg={cfg} />;
    case "masonry":
      return <MasonryLayout reviews={reviews} cfg={cfg} />;
    case "list":
      return <ListLayout reviews={reviews} cfg={cfg} />;
    case "badges":
      return <BadgesLayout reviews={reviews} cfg={cfg} />;
    case "slider":
      return <SliderLayout reviews={reviews} cfg={cfg} />;
    case "carousel":
    default:
      return <CarouselLayout reviews={reviews} cfg={cfg} />;
  }
}
