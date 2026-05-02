import { Suspense } from "react";
import { parseConfig } from "@/lib/config";
import { ReviewsWidget } from "@/components/ReviewsWidget";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WidgetPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const placeId = process.env.GOOGLE_PLACE_ID ?? "";
  const cfg = parseConfig(params, placeId);

  return (
    <main className="w-full bg-transparent">
      <Suspense fallback={<WidgetSkeleton />}>
        <ReviewsWidget cfg={cfg} />
      </Suspense>
    </main>
  );
}

function WidgetSkeleton() {
  return (
    <section className="w-full px-4 py-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-5 w-20 animate-pulse rounded bg-white/10" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-24 animate-pulse rounded bg-white/10" />
        </div>
      </div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 w-72 flex-shrink-0 animate-pulse rounded-2xl bg-white/5"
          />
        ))}
      </div>
    </section>
  );
}
