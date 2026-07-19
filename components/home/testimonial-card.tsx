import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Review } from "@/lib/wordpress/reviews";

export function TestimonialCard({ quote, name, rating }: Review) {
  return (
    <Card className="w-72 shrink-0 p-5 sm:w-80">
      <div className="text-ink flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={i < rating ? "fill-ink size-4" : "fill-none size-4"}
          />
        ))}
      </div>
      <p className="text-ink/90 mt-3 line-clamp-4 text-sm leading-relaxed">
        {quote}
      </p>
      <span className="text-ink mt-4 block text-sm font-semibold">
        {name}
      </span>
    </Card>
  );
}
