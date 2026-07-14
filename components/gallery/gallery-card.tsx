import Image from "next/image";
import { Play } from "lucide-react";
import { HoverLift } from "@/components/motion/hover-lift";
import { IconBadge } from "@/components/ui/icon-badge";
import type { GalleryItem } from "@/lib/wordpress/gallery";

type GalleryCardProps = GalleryItem & {
  onOpen: () => void;
};

export function GalleryCard({
  type,
  imageUrl,
  title,
  caption,
  onOpen,
}: GalleryCardProps) {
  return (
    <HoverLift>
      <button
        type="button"
        onClick={onOpen}
        className="group relative block aspect-square w-full overflow-hidden rounded-3xl"
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        )}
        {type === "video" && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/10">
            <IconBadge bg="rgba(255,255,255,0.3)" size="lg">
              <Play className="size-6 fill-white text-white" />
            </IconBadge>
          </span>
        )}
        {caption && (
          <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/60 to-transparent p-3 text-left text-sm text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            {caption}
          </span>
        )}
      </button>
    </HoverLift>
  );
}
