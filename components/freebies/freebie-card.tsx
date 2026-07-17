import Image from "next/image";
import { FileText } from "lucide-react";
import { HoverLift } from "@/components/motion/hover-lift";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";
import { formatFileSize } from "@/lib/utils";
import type { Freebie } from "@/lib/wordpress/freebies";

type FreebieCardProps = Freebie & {
  onOpen: () => void;
};

export function FreebieCard({
  title,
  description,
  thumbnailUrl,
  fileSizeBytes,
  onOpen,
}: FreebieCardProps) {
  const fileSizeLabel = formatFileSize(fileSizeBytes);

  return (
    <HoverLift className="h-full">
      <button type="button" onClick={onOpen} className="block h-full w-full text-left">
        <Card className="flex h-full flex-col">
          <div className="relative aspect-[3/4] w-full">
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            )}
            <IconBadge
              bg="var(--pastel-blue)"
              className="absolute top-4 left-4 shadow-sm"
            >
              <FileText className="size-5 text-[#1a2a6b]" />
            </IconBadge>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-6">
            <h3 className="font-display text-ink text-lg font-bold">{title}</h3>
            <p className="text-body-gray line-clamp-3 flex-1 text-sm leading-relaxed">
              {description}
            </p>
            {fileSizeLabel && (
              <span className="text-body-gray/70 text-xs">{fileSizeLabel}</span>
            )}
          </div>
        </Card>
      </button>
    </HoverLift>
  );
}
