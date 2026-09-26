import Link from "next/link";
import { HoverLift } from "@/components/motion/hover-lift";
import { Card } from "@/components/ui/card";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import type { BlogPost } from "@/lib/wordpress/posts";
import { PostThumbnail } from "./post-thumbnail";

/**
 * Blog grid / related-posts card. Every card is identical — same square
 * thumbnail frame as the homepage Thinking Out Loud tiles — so one
 * featured-image shape works everywhere a post appears.
 */
export function BlogCard({
  slug,
  title,
  excerpt,
  featuredImage,
  publishedAt,
  contentHtml,
}: BlogPost) {
  return (
    <HoverLift className="h-full">
      <Link href={`/thinking-out-loud/${slug}`} className="block h-full">
        <Card className="flex h-full flex-col">
          <div className="bg-pastel-cream-tan relative aspect-square w-full overflow-hidden">
            <PostThumbnail
              url={featuredImage?.url ?? null}
              alt={featuredImage?.alt}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 p-6">
            <h3
              className="text-ink font-serif text-xl leading-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p
              className="text-body-gray line-clamp-2 flex-1 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
            <div className="text-body-gray/70 flex items-center gap-2 text-xs">
              <span>{formatDate(publishedAt)}</span>
              <span aria-hidden>·</span>
              <span>{estimateReadingTime(contentHtml)}</span>
            </div>
          </div>
        </Card>
      </Link>
    </HoverLift>
  );
}
