import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui/page-intro";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import {
  getCountries,
  getCountryBySlug,
  getCountryPhotos,
} from "@/lib/wordpress/around-the-world";

/*
 * One page per WordPress "Country" term, reached only from its polaroid on
 * the homepage globe (deliberately not in the nav, footer, or sitemap).
 * Uses the Gallery page's design, photos only.
 */

export const dynamicParams = true;

export async function generateStaticParams() {
  const countries = await getCountries();
  return countries.map((country) => ({ country: country.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) return { title: "Page not found — Recap" };

  return {
    title: `Ideas that travel from ${country.name} — Recap`,
    description: `Photos from Recap's work in ${country.name}.`,
    alternates: { canonical: `/around-the-world/${country.slug}` },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) notFound();

  const photos = await getCountryPhotos(country.id);
  if (photos.length === 0) notFound();

  return (
    <main>
      <PageIntro
        eyebrow="around the world"
        heading={`Ideas that travel from ${country.name}`}
        size="compact"
      />
      <GalleryGrid items={photos} />
    </main>
  );
}
