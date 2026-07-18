import Image, { type StaticImageData } from "next/image";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { IconBadge } from "@/components/ui/icon-badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

type ServiceRowProps = {
  icon: StaticImageData;
  iconBg: string;
  image: StaticImageData;
  title: string;
  description: string;
  points: readonly string[];
  reverse?: boolean;
};

export function ServiceRow({
  icon,
  iconBg,
  image,
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
          "relative aspect-[4/3] w-full overflow-hidden rounded-3xl",
          reverse && "md:order-2",
        )}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className={cn(reverse && "md:order-1")}>
        <IconBadge bg={iconBg} size="lg">
          <Image
            src={icon}
            alt=""
            width={28}
            height={28}
            className="h-7 w-auto object-contain"
          />
        </IconBadge>
        <SectionHeading as="h3" className="mt-5">
          {title}
        </SectionHeading>
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
