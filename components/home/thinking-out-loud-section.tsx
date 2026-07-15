import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { HoverLift } from "@/components/motion/hover-lift";
import { IconBadge } from "@/components/ui/icon-badge";
import { ThinkingOutLoudCard } from "./thinking-out-loud-card";
import { KnowledgeHubCard } from "./knowledge-hub-card";
import caseStoriesIcon from "@/assets/icons/case-stories-logo.svg";
import storyImage from "@/assets/images/home/service-special-education.png";
import { getFeaturedHomepagePosts } from "@/lib/wordpress/posts";

const LIGHT_GRAY = "#e7e5e2";

const COLUMN_HEIGHT = "h-[34rem]";

/** Mobile shows exactly this many featured posts, stacked, between the intro and Knowledge Hub. */
const MOBILE_POST_COUNT = 3;

/**
 * Desktop bento slots reserved for real featured posts — Knowledge Hub
 * always occupies column 4's second slot on top of this, so it's never
 * one of the posts a WordPress editor controls. A column only renders if
 * at least one post (or, for column 4, Knowledge Hub) is assigned to it,
 * so fewer than 5 featured posts gracefully drops trailing columns.
 */
const DESKTOP_SLOT_LAYOUT = [
  { column: 2, size: "flex-1" },
  { column: 2, size: "flex-1" },
  { column: 3, size: "flex-1" },
  { column: 3, size: "flex-1" },
  { column: 4, size: "flex-[2]" },
] as const;

function IntroTextTile({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-3xl p-6 ${className ?? ""}`}
      style={{ backgroundColor: LIGHT_GRAY }}
    >
      <IconBadge bg="#c9c7c2" size="lg">
        <Image
          src={caseStoriesIcon}
          alt=""
          width={28}
          height={28}
          className="h-7 w-auto object-contain"
        />
      </IconBadge>
      <div>
        <h3 className="font-display text-ink text-2xl font-bold">
          Thinking Out Loud
        </h3>
        <p className="text-body-gray mt-2 text-sm leading-relaxed">
          Real stories of change, growth, and perspective drawn from
          everyday work with children, families, and schools.
        </p>
      </div>
    </div>
  );
}

function IntroPhotoTile({ className }: { className?: string }) {
  return (
    <HoverLift className={className}>
      <Link
        href="/thinking-out-loud"
        className="relative block h-full overflow-hidden rounded-3xl"
      >
        <Image
          src={storyImage}
          alt="A child arranging colorful paper shapes during a special education session"
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover"
        />
        <span className="absolute top-4 right-4 flex size-7 items-center justify-center rounded-full bg-white/30">
          <Plus className="size-4 text-white" />
        </span>
      </Link>
    </HoverLift>
  );
}

export async function ThinkingOutLoudSection() {
  const posts = await getFeaturedHomepagePosts(DESKTOP_SLOT_LAYOUT.length);
  const mobilePosts = posts.slice(0, MOBILE_POST_COUNT);

  const columns = new Map<
    number,
    { id: number; href: string; title: string; imageUrl: string | null; size: string }[]
  >();
  posts.forEach((post, index) => {
    const slot = DESKTOP_SLOT_LAYOUT[index];
    if (!slot) return;
    const tiles = columns.get(slot.column) ?? [];
    tiles.push({
      id: post.id,
      href: `/thinking-out-loud/${post.slug}`,
      title: post.title,
      imageUrl: post.featuredImage?.url ?? null,
      size: slot.size,
    });
    columns.set(slot.column, tiles);
  });

  return (
    <section className="bg-white px-6 py-20 md:py-24">
      <FadeIn>
        {/* Mobile — single stacked column: intro, up to 3 featured posts, Knowledge Hub */}
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 md:hidden">
          <IntroTextTile />
          <IntroPhotoTile className="h-56" />
          {mobilePosts.map((post) => (
            <ThinkingOutLoudCard
              key={post.id}
              href={`/thinking-out-loud/${post.slug}`}
              title={post.title}
              imageUrl={post.featuredImage?.url ?? null}
              className="h-64"
            />
          ))}
          <KnowledgeHubCard className="h-40" />
        </div>

        {/* Desktop — bento grid, unchanged proportions */}
        <div className="mx-auto hidden max-w-[1200px] grid-cols-4 gap-6 md:grid">
          <div className={`flex flex-col gap-6 ${COLUMN_HEIGHT}`}>
            <IntroTextTile className="flex-1" />
            <IntroPhotoTile className="flex-[2]" />
          </div>

          {[2, 3, 4].map((columnIndex) => {
            const tiles = columns.get(columnIndex) ?? [];
            if (columnIndex !== 4 && tiles.length === 0) return null;

            return (
              <div
                key={columnIndex}
                className={`flex flex-col gap-6 ${COLUMN_HEIGHT}`}
              >
                {tiles.map((tile) => (
                  <ThinkingOutLoudCard
                    key={tile.id}
                    href={tile.href}
                    title={tile.title}
                    imageUrl={tile.imageUrl}
                    className={tile.size}
                  />
                ))}
                {columnIndex === 4 && <KnowledgeHubCard className="flex-1" />}
              </div>
            );
          })}
        </div>
      </FadeIn>
    </section>
  );
}
