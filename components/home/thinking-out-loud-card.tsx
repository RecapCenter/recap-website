import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { HoverLift } from "@/components/motion/hover-lift";
import { cn } from "@/lib/utils";

type ThinkingOutLoudCardProps = {
  href: string;
  title: string;
  imageUrl: string | null;
  className?: string;
};

/** Featured-post preview tile: image + title only — see homepage §"Homepage Cards". */
export function ThinkingOutLoudCard({
  href,
  title,
  imageUrl,
  className,
}: ThinkingOutLoudCardProps) {
  return (
    <HoverLift className={cn("h-full", className)}>
      <Link
        href={href}
        className="bg-pastel-cream-tan relative block h-full overflow-hidden rounded-3xl"
      >
        {/* Posters are shown whole (object-contain) rather than cropped to
            the tile's fixed bento shape; a blurred copy fills the leftover
            space so the tile never shows bare bands. */}
        {imageUrl && (
          <>
            <Image
              src={imageUrl}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="scale-110 object-cover opacity-60 blur-xl"
            />
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-contain"
            />
          </>
        )}
        <span className="absolute top-4 right-4 flex size-7 items-center justify-center rounded-full bg-white/30">
          <Plus className="size-4 text-white" />
        </span>
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span
            className="font-serif block text-lg leading-tight text-white"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </span>
      </Link>
    </HoverLift>
  );
}
