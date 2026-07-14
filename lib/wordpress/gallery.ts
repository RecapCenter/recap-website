import { wpFetch } from "./client";
import { collectionTag } from "./revalidation";
import type { WPGalleryItemRaw } from "./types";

export type GalleryItem = {
  id: number;
  type: "photo" | "video";
  title: string;
  caption: string;
  imageUrl: string;
  videoUrl: string | null;
  order: number;
};

function mapGalleryItem(raw: WPGalleryItemRaw): GalleryItem {
  const isVideo = raw.acf.media_type === "video";
  return {
    id: raw.id,
    type: raw.acf.media_type,
    title: raw.title.rendered,
    caption: raw.acf.caption ?? "",
    imageUrl: isVideo
      ? (raw.acf.video_thumbnail?.url ?? "")
      : (raw.acf.photo?.url ?? ""),
    videoUrl: (isVideo && (raw.acf.video_url ?? raw.acf.video_file?.url)) || null,
    order: raw.acf.display_order ?? 0,
  };
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const { data } = await wpFetch<WPGalleryItemRaw[]>("/gallery", {
      params: { per_page: 100 },
      tags: [collectionTag("gallery_item")],
    });
    return data.map(mapGalleryItem).sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Failed to fetch WordPress gallery items", error);
    return [];
  }
}
