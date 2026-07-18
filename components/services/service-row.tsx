import Image, { type StaticImageData } from "next/image";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

type ServiceRowProps = {
  image: StaticImageData;
  iconBg: string;
  title: string;
  description: string;
  points: readonly string[];
  reverse?: boolean;
};

export function ServiceRow({
  image,
  iconBg,
  title,
  description,
  points,
  reverse = false,
}: ServiceRowProps) {
  return (
    <FadeIn
      className={cn(
        "grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16",
      )}
    >
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-t-[50%] rounded-b-none",
          reverse && "md:order-2",
        )}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="scale-125 object-cover"
        />
      </div>
      <div className={cn(reverse && "md:order-1")}>
        <SectionHeading as="h3">{title}</SectionHeading>
        <p className="text-body-gray mt-4 text-base leading-relaxed">
          {description}
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: iconBg }}
              >
                <Check className="text-ink size-3" />
              </span>
              <span className="text-body-gray text-sm leading-relaxed">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </FadeIn>
  );
}
