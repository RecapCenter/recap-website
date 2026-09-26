import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { HoverLift } from "@/components/motion/hover-lift";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/lib/wordpress/recommendations";

export function RecommendationCard({
  title,
  description,
  imageUrl,
  imageLetterboxed,
  externalLink,
  category,
}: Recommendation) {
  return (
    <HoverLift className="h-full">
      <Card className="flex h-full flex-col">
        <div className="relative aspect-square w-full overflow-hidden">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              // Scaling past YouTube's baked-in black bars (4:3 frame, 16:9 video).
              className={cn("object-cover", imageLetterboxed && "scale-[1.34]")}
            />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex flex-col items-start gap-2">
            {category && (
              <span className="bg-muted text-body-gray rounded-full px-3 py-1 text-xs font-medium">
                {category}
              </span>
            )}
            <h3 className="text-ink font-serif text-lg">{title}</h3>
          </div>
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
