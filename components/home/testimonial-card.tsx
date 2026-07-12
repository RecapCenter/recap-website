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
      <div className="text-ink flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="fill-ink size-4" />
        ))}
      </div>
      <p className="text-ink/90 mt-4 text-base leading-relaxed">{quote}</p>
      <div className="mt-5 flex items-center gap-3">
        <Image
          src={avatar}
          alt={name}
          className="size-12 rounded-full object-cover"
        />
        <span className="text-ink font-semibold">{name}</span>
      </div>
    </div>
  );
}
