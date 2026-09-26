import Image, { type StaticImageData } from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

type ServiceRowProps = {
  image: StaticImageData;
  title: string;
  tagline: string;
  paragraphs: readonly string[];
  closingLine?: string;
  audience: readonly string[];
  reverse?: boolean;
};

export function ServiceRow({
  image,
  title,
  tagline,
  paragraphs,
  closingLine,
  audience,
  reverse = false,
}: ServiceRowProps) {
  return (
    <FadeIn className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
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
        <SectionHeading as="h2">
          <span className="font-script text-ink/70 mb-3 block text-xl">
            {title}
          </span>
          {tagline}
        </SectionHeading>
        <div className="text-body-gray mt-6 flex flex-col gap-4 text-base leading-relaxed">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {closingLine && (
          <p className="font-serif text-ink mt-6 text-xl">{closingLine}</p>
        )}
        <p className="text-body-gray mt-6 text-sm leading-relaxed">
          <span className="text-ink font-semibold">For:</span>{" "}
          {audience.join(" • ")}
        </p>
      </div>
    </FadeIn>
  );
}
