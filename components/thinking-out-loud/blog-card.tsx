import Image from "next/image";
import Link from "next/link";
import { HoverLift } from "@/components/motion/hover-lift";
import { Card } from "@/components/ui/card";
import { cn, formatDate, estimateReadingTime } from "@/lib/utils";
import type { BlogPost } from "@/lib/wordpress/posts";

type BlogCardProps = BlogPost & {
  featured?: boolean;
};

export function BlogCard({
  slug,
  title,
  excerpt,
  featuredImage,
  publishedAt,
  contentHtml,
  featured = false,
}: BlogCardProps) {
  return (
    <HoverLift className={cn("h-full", featured && "md:col-span-2")}>
      <Link href={`/thinking-out-loud/${slug}`} className="block h-full">
        <Card className="flex h-full flex-col">
          <div
            className={cn(
              "relative w-full",
              featured ? "aspect-[21/9]" : "aspect-[16/10]",
            )}
          >
            {featuredImage && (
              <Image
                src={featuredImage.url}
                alt={featuredImage.alt}
                fill
                sizes={
                  featured
                    ? "100vw"
                    : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                }
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-3 p-6">
            <h3
              className={cn(
                "font-display text-ink leading-tight font-bold",
                featured ? "text-2xl" : "text-xl",
              )}
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
