import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HoverLift } from "@/components/motion/hover-lift";
import { cn } from "@/lib/utils";

const CRIMSON = "#e8194d";

/** Static "browse the blog" CTA tile — always present, not tied to a post. */
export function KnowledgeHubCard({ className }: { className?: string }) {
  return (
    <HoverLift className={cn("h-full", className)}>
      <Link
        href="/thinking-out-loud"
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6"
        style={{ backgroundColor: CRIMSON }}
      >
        <span />
        <span className="font-display text-2xl leading-tight font-bold tracking-tight text-white uppercase">
          Knowledge Hub
        </span>
        <span className="mt-6 flex size-12 items-center justify-center rounded-full border-2 border-white">
          <ArrowRight className="size-5 text-white" />
        </span>
      </Link>
    </HoverLift>
  );
}
