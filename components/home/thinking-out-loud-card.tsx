import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { HoverLift } from "@/components/motion/hover-lift";
import { cn } from "@/lib/utils";

type ThinkingOutLoudCardProps = {
  href: string;
  label: string;
  bg: string;
  labelColor: string;
  variant?: "default" | "cta";
  className?: string;
};

export function ThinkingOutLoudCard({
  href,
  label,
  bg,
  labelColor,
  variant = "default",
  className,
}: ThinkingOutLoudCardProps) {
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

        <span />

        <span
          className={cn(
            "font-display leading-tight font-bold",
            variant === "cta"
              ? "text-2xl tracking-tight uppercase"
              : "text-xl",
          )}
          style={{ color: labelColor }}
        >
          {label}
        </span>

        {variant === "cta" && (
          <span
            className="mt-6 flex size-12 items-center justify-center rounded-full border-2"
            style={{ borderColor: labelColor }}
          >
            <ArrowRight className="size-5" style={{ color: labelColor }} />
          </span>
        )}
      </Link>
    </HoverLift>
  );
}
