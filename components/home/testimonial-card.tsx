import { Star } from "lucide-react";
import type { Review } from "@/lib/wordpress/reviews";

export function TestimonialCard({ quote, name, rating }: Review) {
  return (
    <div>
      <div className="text-ink flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={i < rating ? "fill-ink size-4" : "fill-none size-4"}
          />
        ))}
      </div>
      <p className="text-ink/90 mt-4 text-base leading-relaxed">{quote}</p>
      <span className="text-ink mt-5 block font-semibold">{name}</span>
    </div>
  );
}
