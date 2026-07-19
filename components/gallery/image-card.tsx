import Image from "next/image";

type ImageCardProps = {
  imageUrl: string;
  width: number;
  height: number;
  title: string;
};

/**
 * Static photo tile for the masonry gallery. Never opens a popup — per the
 * gallery spec, only videos are clickable. Renders at its own natural
 * aspect ratio (no cropping/stretching) so the surrounding CSS-columns
 * masonry can pack items tightly without forcing equal heights.
 */
export function ImageCard({ imageUrl, width, height, title }: ImageCardProps) {
  if (!imageUrl) return null;

  return (
    <div className="group relative w-full cursor-pointer overflow-hidden rounded-3xl shadow-[0_1px_3px_rgba(23,20,15,0.08)] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(23,20,15,0.16)]">
      <Image
        src={imageUrl}
        alt={title}
        width={width}
        height={height}
        sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </div>
  );
}
