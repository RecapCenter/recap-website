import { wpFetch } from "./client";
import { collectionTag } from "./revalidation";
import type { GalleryItem } from "./gallery";
import type { WPCountryPhotoRaw, WPCountryRaw } from "./types";

/** Fallback used only when the CMS genuinely has no dimensions on file. */
const FALLBACK_WIDTH = 800;
const FALLBACK_HEIGHT = 600;

export type Country = {
  id: number;
  name: string;
  slug: string;
  location: [latitude: number, longitude: number];
  coverImageUrl: string;
};

/** Term names come back HTML-escaped (e.g. "Trinidad &amp; Tobago"). */
function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/&amp;/g, "&");
}

function toCoordinate(
  value: number | string | null | undefined,
): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * A country is only usable — as a globe pin and as a page — once it has
 * coordinates, a polaroid photo, and at least one published photo.
 */
function mapCountry(raw: WPCountryRaw): Country | null {
  const latitude = toCoordinate(raw.acf?.latitude);
  const longitude = toCoordinate(raw.acf?.longitude);
  const coverImageUrl = raw.acf?.cover_photo?.url;

  if (
    raw.count === 0 ||
    latitude === null ||
    longitude === null ||
    !coverImageUrl
  ) {
    return null;
  }

  return {
    id: raw.id,
    name: decodeEntities(raw.name),
    slug: raw.slug,
    location: [latitude, longitude],
    coverImageUrl,
  };
}

/** Maps onto the Gallery's item shape so the page can reuse GalleryGrid. */
function mapCountryPhoto(raw: WPCountryPhotoRaw): GalleryItem | null {
  const photo = raw.acf.photo;
  if (!photo?.url) return null;

  return {
    id: raw.id,
    type: "photo",
    title: raw.title.rendered,
    caption: raw.acf.caption ?? "",
    imageUrl: photo.url,
    width: photo.width ?? FALLBACK_WIDTH,
    height: photo.height ?? FALLBACK_HEIGHT,
    videoUrl: null,
    videoSource: null,
    order: Number(raw.acf.display_order) || 0,
  };
}

export async function getCountries(): Promise<Country[]> {
  try {
    const { data } = await wpFetch<WPCountryRaw[]>("/countries", {
      params: { per_page: 100, hide_empty: true },
      tags: [collectionTag("country_photo")],
    });
    return data
      .map(mapCountry)
      .filter((country): country is Country => country !== null);
  } catch (error) {
    console.error("Failed to fetch WordPress countries", error);
    return [];
  }
}

export async function getCountryBySlug(slug: string): Promise<Country | null> {
  const countries = await getCountries();
  return countries.find((country) => country.slug === slug) ?? null;
}

export async function getCountryPhotos(
  countryId: number,
): Promise<GalleryItem[]> {
  try {
    const { data } = await wpFetch<WPCountryPhotoRaw[]>("/around-the-world", {
      params: { per_page: 100, countries: countryId },
      tags: [collectionTag("country_photo")],
    });
    return data
      .map(mapCountryPhoto)
      .filter((photo): photo is GalleryItem => photo !== null)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Failed to fetch WordPress country photos", error);
    return [];
  }
}
