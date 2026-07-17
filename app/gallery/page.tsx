import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/page-intro";
import { CategoryTabs } from "@/components/ui/category-tabs";
import { CTABanner } from "@/components/ui/cta-banner";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { getGalleryItems } from "@/lib/wordpress/gallery";
import thinkingOutLoudIcon from "@/assets/icons/thinking-out-loud-logo.svg";

export const metadata: Metadata = {
  title: "Gallery — Recap",
  description:
    "Photos and videos from Recap's sessions, workshops, and everyday moments with the children, families, and schools we work with.",
};

const TYPES = [
  { label: "All", value: "" },
  { label: "Photos", value: "photo" },
  { label: "Videos", value: "video" },
];

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const items = await getGalleryItems();
  const filtered = type ? items.filter((item) => item.type === type) : items;

  return (
    <main>
      <PageIntro
        icon={thinkingOutLoudIcon}
        iconBg="var(--accent-orange)"
        eyebrow="moments, captured"
        heading="A look inside our world."
        subtext="Photos and videos from sessions, workshops, and the everyday moments in between."
        size="compact"
      />
      <div className="px-6 pb-10">
        <CategoryTabs
          basePath="/gallery"
          categories={TYPES}
          activeValue={type ?? ""}
          paramName="type"
          accentColor="var(--accent-orange)"
        />
      </div>
      <GalleryGrid items={filtered} />
      <CTABanner
        eyebrow="want to see more?"
        heading="Follow along for more moments."
        subtext="New photos and videos from sessions and workshops, added as they happen."
        buttonLabel="Get in touch"
        buttonHref="/contact"
      />
    </main>
  );
}
