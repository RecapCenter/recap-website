import { wpFetch } from "./client";
import { collectionTag } from "./revalidation";
import type { WPLabResourceRaw } from "./types";

export type LabResource = {
  id: number;
  slug: string;
  title: string;
  description: string;
  resourceType: string;
  thumbnailUrl: string;
  resourceUrl: string | null;
};

function mapLabResource(raw: WPLabResourceRaw): LabResource {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title.rendered,
    description: raw.acf.description ?? "",
    resourceType: raw.acf.resource_type ?? "",
    thumbnailUrl: raw.acf.thumbnail?.url ?? "",
    resourceUrl: raw.acf.resource_file?.url ?? null,
  };
}

/** Unused until Recap Lab's scope moves past "Coming Soon" — see WORDPRESS_CMS.md. */
export async function getLabResources(): Promise<LabResource[]> {
  try {
    const { data } = await wpFetch<WPLabResourceRaw[]>("/lab-resources", {
      params: { per_page: 100 },
      tags: [collectionTag("lab_resource")],
    });
    return data.map(mapLabResource);
  } catch (error) {
    console.error("Failed to fetch WordPress lab resources", error);
    return [];
  }
}
