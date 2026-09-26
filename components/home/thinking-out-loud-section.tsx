import Image from "next/image";
import { FadeIn } from "@/components/motion/fade-in";
import { IconBadge } from "@/components/ui/icon-badge";
import { ThinkingOutLoudCard } from "./thinking-out-loud-card";
import { KnowledgeHubCard } from "./knowledge-hub-card";
import caseStoriesIcon from "@/assets/icons/case-stories-logo.svg";
import { getLatestHomepagePosts } from "@/lib/wordpress/posts";

/** Matches the Thinking Out Loud tile in the Quick Link grid (quick-link-grid.tsx). */
const TILE_BG = "var(--pastel-mustard)";

/** Mobile shows exactly this many latest posts, stacked, between the intro and Knowledge Hub. */
const MOBILE_POST_COUNT = 4;

/**
 * Tablet/desktop show this many latest posts, newest first. With the intro
 * and Knowledge Hub tiles that's an even 4×2 grid (2×4 on tablet) of
 * identically sized tiles, so every post thumbnail gets the same frame.
 * Fewer published posts simply leaves the grid shorter.
 */
const DESKTOP_POST_COUNT = 6;

function IntroTextTile({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-start justify-center gap-3 rounded-3xl p-6 text-left ${className ?? ""}`}
      style={{ backgroundColor: TILE_BG }}
    >
      <IconBadge bg="rgba(255,255,255,0.3)" size="lg">
        <Image
          src={caseStoriesIcon}
          alt=""
          width={28}
          height={28}
          className="h-7 w-auto object-contain"
        />
      </IconBadge>
      <div>
        <h3 className="font-serif text-2xl text-white">Thinking Out Loud</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          Real stories of change, growth, and perspective drawn from everyday
          work with children, families, and schools.
        </p>
      </div>
    </div>
  );
}

/** Every post tile is square on every device, so one thumbnail shape fits all. */
const POST_TILE = "aspect-square h-auto";

export async function ThinkingOutLoudSection() {
  const posts = await getLatestHomepagePosts(DESKTOP_POST_COUNT);
  const mobilePosts = posts.slice(0, MOBILE_POST_COUNT);

  return (
    <section className="bg-cream px-6 py-20 md:py-24">
      <FadeIn>
        {/* Mobile — single stacked column: intro, up to 4 posts, Knowledge Hub */}
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 md:hidden">
          <IntroTextTile />
          {mobilePosts.map((post) => (
            <ThinkingOutLoudCard
              key={post.id}
              href={`/thinking-out-loud/${post.slug}`}
              title={post.title}
              imageUrl={post.featuredImage?.url ?? null}
              className={POST_TILE}
            />
          ))}
          <KnowledgeHubCard className="h-40" />
        </div>

        {/* Tablet/desktop — even grid of equal square tiles:
            Intro, Post 1–6, Knowledge Hub (2 columns on tablet, 4 on desktop) */}
        <div className="mx-auto hidden max-w-[1200px] grid-cols-2 gap-6 md:grid lg:grid-cols-4">
          <IntroTextTile />
          {posts.map((post) => (
            <ThinkingOutLoudCard
              key={post.id}
              href={`/thinking-out-loud/${post.slug}`}
              title={post.title}
              imageUrl={post.featuredImage?.url ?? null}
              className={POST_TILE}
            />
          ))}
          <KnowledgeHubCard className="min-h-40" />
        </div>
      </FadeIn>
    </section>
  );
}
