import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { HoverLift } from "@/components/motion/hover-lift";
import { cn } from "@/lib/utils";

type QuickLinkCardProps = {
  href: string;
  label: string;
  bg: string;
  labelColor: string;
  icon: StaticImageData;
  className?: string;
};

export function QuickLinkCard({
  href,
  label,
  bg,
  labelColor,
  icon,
  className,
}: QuickLinkCardProps) {
  return (
    <HoverLift className={cn("h-full", className)}>
      <Link
        href={href}
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6"
        style={{ backgroundColor: bg }}
      >
        <span className="absolute top-4 right-4 flex size-7 items-center justify-center rounded-full bg-white/30">
          <Plus className="size-4 text-white" />
        </span>
        <span className="flex flex-1 items-center justify-center">
          <Image
            src={icon}
            alt=""
            width={64}
            height={64}
            className="h-16 w-auto object-contain"
          />
        </span>
        <span
          className="font-serif text-xl leading-tight font-bold"
          style={{ color: labelColor }}
        >
          {label}
        </span>
      </Link>
    </HoverLift>
  );
}
