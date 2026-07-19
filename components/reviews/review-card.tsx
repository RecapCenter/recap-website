import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Review } from "@/lib/reviews";

/**
 * Masonry-grid review card: fills its column's width and grows naturally
 * with the review text — the full review is always shown, no truncation.
 */
export function ReviewCard({ quote, name, rating }: Review) {
  return (
    <Card className="p-5">
      <div className="text-ink flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={i < rating ? "fill-ink size-4" : "fill-none size-4"}
          />
        ))}
      </div>
      <p className="text-ink/90 mt-3 text-sm leading-relaxed">{quote}</p>
      <span className="text-ink mt-4 block text-sm font-semibold">
        {name}
      </span>
    </Card>
  );
}
