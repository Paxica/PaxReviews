import { Suspense } from "react";
import { ReviewsWidget } from "@/components/ReviewsWidget";

export default function WidgetPage() {
  return (
    <main className="min-h-screen w-full bg-transparent">
      <Suspense fallback={<WidgetSkeleton />}>
        <ReviewsWidget />
      </Suspense>
    </main>
  );
}

function WidgetSkeleton() {
  return (
    <section className="w-full px-4 py-6">
      <div className="mb-5 h-10 w-48 animate-pulse rounded-lg bg-white/10" />
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-44 w-72 flex-shrink-0 animate-pulse rounded-2xl bg-white/5"
          />
        ))}
      </div>
    </section>
  );
}
