import Image from "next/image";
import { Play } from "lucide-react";

type VideoThumbnailProps = {
  imageUrl: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  onOpen: () => void;
};

/**
 * Clickable video tile for the masonry gallery — thumbnail only, never an
 * embedded player. Opens the VideoModal on click; the actual player (HTML5
 * or YouTube) is lazy-mounted only once the modal is open.
 */
export function VideoThumbnail({
  imageUrl,
  width,
  height,
  title,
  caption,
  onOpen,
}: VideoThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={caption ? `Play video: ${caption}` : `Play video: ${title}`}
      className="group relative block w-full cursor-pointer overflow-hidden rounded-3xl shadow-[0_1px_3px_rgba(23,20,15,0.08)] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(23,20,15,0.16)]"
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          width={width}
          height={height}
          sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 group-hover:bg-black/25">
        <span className="flex size-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Play className="size-6 fill-white text-white" />
        </span>
      </span>
      {caption && (
        <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/60 to-transparent p-3 text-left text-sm text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          {caption}
        </span>
      )}
    </button>
  );
}
