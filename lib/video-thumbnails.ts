import { getYouTubeThumbnailUrl } from "@/lib/utils";

/** Thumbnails for a given video essentially never change. */
const CACHE_SECONDS = 60 * 60 * 24;
const FETCH_TIMEOUT_MS = 5000;

export type VideoThumbnail = {
  url: string;
  /**
   * YouTube's always-available `hqdefault` frame is 4:3 with black bars
   * baked in above and below 16:9 videos; callers cropping it into a frame
   * should scale it up by ~1.34 to hide them. False for bar-free images.
   */
  letterboxed: boolean;
};

async function fetchOk(url: string, method: "GET" | "HEAD" = "GET") {
  try {
    const response = await fetch(url, {
      method,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: CACHE_SECONDS },
    });
    return response.ok ? response : null;
  } catch {
    return null;
  }
}

/**
 * Best available thumbnail for a YouTube or Vimeo link, or null for any
 * other URL. Server-only: it may call out to YouTube/Vimeo.
 *
 * - YouTube: the full-HD `maxresdefault` frame when the video has one,
 *   otherwise the letterboxed `hqdefault` every video has.
 * - Vimeo: the thumbnail from Vimeo's public oEmbed endpoint.
 */
export async function getVideoThumbnail(
  url: string,
): Promise<VideoThumbnail | null> {
  const hqDefault = getYouTubeThumbnailUrl(url);
  if (hqDefault) {
    const maxRes = hqDefault.replace("/hqdefault.jpg", "/maxresdefault.jpg");
    return (await fetchOk(maxRes, "HEAD"))
      ? { url: maxRes, letterboxed: false }
      : { url: hqDefault, letterboxed: true };
  }

  if (/vimeo\.com\/\d+/.test(url)) {
    const response = await fetchOk(
      `https://vimeo.com/api/oembed.json?width=1280&url=${encodeURIComponent(url)}`,
    );
    const data = (await response?.json().catch(() => null)) as {
      thumbnail_url?: string;
    } | null;
    return data?.thumbnail_url
      ? { url: data.thumbnail_url, letterboxed: false }
      : null;
  }

  return null;
}
