import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { HoverLift } from "@/components/motion/hover-lift";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/lib/wordpress/recommendations";

const CATEGORY_COLORS: Record<string, string> = {
  Books: "var(--pastel-mustard)",
  Music: "var(--pastel-lavender)",
  "Research Papers": "var(--pastel-blue)",
};

export function RecommendationCard({
  title,
  description,
  imageUrl,
  externalLink,
  category,
}: Recommendation) {
  const categoryColor = CATEGORY_COLORS[category] ?? "var(--pastel-cream-tan)";

  return (
    <HoverLift className="h-full">
      <Card className="flex h-full flex-col">
        <div className="relative aspect-square w-full">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          )}
          {category && (
            <span
              className={cn(
                "absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm",
              )}
              style={{ backgroundColor: categoryColor }}
            >
              {category}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="font-serif text-ink text-lg">{title}</h3>
          <p className="text-body-gray line-clamp-2 flex-1 text-sm leading-relaxed">
            {description}
          </p>
          <Button
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            icon={<ExternalLink className="size-4" />}
            className="w-full"
          >
            Visit
            <span className="sr-only"> (opens in a new tab)</span>
          </Button>
        </div>
      </Card>
    </HoverLift>
  );
}
