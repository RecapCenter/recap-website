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
  category: string;
};

function mapFreebie(raw: WPFreebieRaw): Freebie {
  const terms = raw._embedded?.["wp:term"]?.flat() ?? [];
  const category = terms.find((term) => raw.freebie_category.includes(term.id));

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    description: raw.acf.description ?? "",
    thumbnailUrl: raw.acf.thumbnail?.url ?? "",
    pdfUrl: raw.acf.pdf_file.url,
    fileSizeBytes: raw.acf.pdf_file.filesize,
    category: category?.name ?? "",
  };
}

export async function getFreebies(): Promise<Freebie[]> {
  try {
    const { data } = await wpFetch<WPFreebieRaw[]>("/freebies", {
      params: { per_page: 100, _embed: true },
      tags: [collectionTag("freebie")],
    });
    return data.filter((item) => item.acf.pdf_file).map(mapFreebie);
  } catch (error) {
    console.error("Failed to fetch WordPress freebies", error);
    return [];
  }
}
