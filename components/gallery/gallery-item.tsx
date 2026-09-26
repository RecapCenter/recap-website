import { ImageCard } from "./image-card";
import { VideoThumbnail } from "./video-thumbnail";
import type { GalleryItem as GalleryItemType } from "@/lib/wordpress/gallery";

type GalleryItemProps = GalleryItemType & {
  onOpen: () => void;
};

/** Routes each gallery entry to the right tile: photos open full size in a
 * new tab, videos open the in-page popup. */
export function GalleryItem({ type, onOpen, ...item }: GalleryItemProps) {
  if (type === "video") {
    return <VideoThumbnail {...item} onOpen={onOpen} />;
  }
  return <ImageCard {...item} />;
}
