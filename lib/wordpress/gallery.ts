import { getVideoEmbedUrl, getYouTubeThumbnailUrl } from "@/lib/utils";
import { wpFetch } from "./client";
import { collectionTag } from "./revalidation";
import type { WPGalleryItemRaw } from "./types";

/** YouTube's hqdefault thumbnail is always served at this fixed size. */
const YOUTUBE_THUMB_WIDTH = 480;
const YOUTUBE_THUMB_HEIGHT = 360;

/** Fallback used only when the CMS genuinely has no dimensions on file. */
const FALLBACK_WIDTH = 800;
const FALLBACK_HEIGHT = 600;

export type GalleryItem = {
  id: number;
  type: "photo" | "video";
  title: string;
  caption: string;
  imageUrl: string;
  width: number;
  height: number;
  videoUrl: string | null;
  /** How the video should be played in the modal — null for photos. */
  videoSource: "embed" | "upload" | null;
  order: number;
};

function mapGalleryItem(raw: WPGalleryItemRaw): GalleryItem {
  const isVideo = raw.acf.media_type === "video";
  const videoUrl = (isVideo && (raw.acf.video_url ?? raw.acf.video_file?.url)) || null;
  const isEmbed = !!videoUrl && !!getVideoEmbedUrl(videoUrl);

  const thumbnail = isVideo ? raw.acf.video_thumbnail : raw.acf.photo;
  const youtubeThumb = isVideo && videoUrl ? getYouTubeThumbnailUrl(videoUrl) : null;

  let width = thumbnail?.width;
  let height = thumbnail?.height;
  if (!thumbnail?.url && youtubeThumb) {
    width = YOUTUBE_THUMB_WIDTH;
    height = YOUTUBE_THUMB_HEIGHT;
  }

  return {
    id: raw.id,
    type: raw.acf.media_type,
    title: raw.title.rendered,
    caption: raw.acf.caption ?? "",
    imageUrl: thumbnail?.url ?? youtubeThumb ?? "",
    width: width ?? FALLBACK_WIDTH,
    height: height ?? FALLBACK_HEIGHT,
    videoUrl,
    videoSource: !isVideo ? null : isEmbed ? "embed" : "upload",
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
