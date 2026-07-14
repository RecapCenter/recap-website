import { wpFetch } from "./client";
import { collectionTag } from "./revalidation";
import type { WPFreebieRaw } from "./types";

export type Freebie = {
  id: number;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  pdfUrl: string;
  fileSizeBytes: number;
};

function mapFreebie(raw: WPFreebieRaw): Freebie {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    description: raw.acf.description ?? raw.excerpt.rendered,
    thumbnailUrl: raw.acf.thumbnail.url,
    pdfUrl: raw.acf.pdf_file.url,
    fileSizeBytes: raw.acf.pdf_file.filesize,
  };
}

export async function getFreebies(): Promise<Freebie[]> {
  try {
    const { data } = await wpFetch<WPFreebieRaw[]>("/freebies", {
      params: { per_page: 100 },
      tags: [collectionTag("freebie")],
    });
    return data.map(mapFreebie);
  } catch (error) {
    console.error("Failed to fetch WordPress freebies", error);
    return [];
  }
}
