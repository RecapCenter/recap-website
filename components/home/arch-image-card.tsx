import Image, { type StaticImageData } from "next/image";
import { HoverLift } from "@/components/motion/hover-lift";

type ArchImageCardProps = {
  image: StaticImageData;
  title: string;
  subtext: string;
};

export function ArchImageCard({ image, title, subtext }: ArchImageCardProps) {
  return (
    <HoverLift className="flex flex-col items-center text-center">
      <div className="relative aspect-[290/288] w-full max-w-[290px] overflow-hidden rounded-t-full">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 640px) 290px, 80vw"
          className="scale-125 object-cover"
        />
      </div>
      <h3 className="font-serif text-ink mt-5 text-2xl">{title}</h3>
      <p className="text-body-gray mt-1 text-sm">{subtext}</p>
    </HoverLift>
  );
}
