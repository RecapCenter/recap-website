import Image, { type StaticImageData } from "next/image";
import { Star } from "lucide-react";

type TestimonialCardProps = {
  quote: string;
  name: string;
  avatar: StaticImageData;
};

export function TestimonialCard({ quote, name, avatar }: TestimonialCardProps) {
  return (
    <div>
      <div className="flex gap-1 text-ink">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4 fill-ink" />
        ))}
      </div>
      <p className="mt-4 text-base leading-relaxed text-ink/90">{quote}</p>
      <div className="mt-5 flex items-center gap-3">
        <Image
          src={avatar}
          alt={name}
          className="size-12 rounded-full object-cover"
        />
        <span className="font-semibold text-ink">{name}</span>
      </div>
    </div>
  );
}
