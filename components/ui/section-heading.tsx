import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  as?: "h1" | "h2" | "h3";
  children: React.ReactNode;
  className?: string;
};

export function SectionHeading({
  as = "h2",
  children,
  className,
}: SectionHeadingProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "text-ink font-serif leading-tight",
        as === "h1" && "text-3xl md:text-5xl",
        as === "h2" && "text-3xl md:text-4xl",
        as === "h3" && "text-2xl md:text-3xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Highlighter-marker rectangle behind a word/phrase, e.g. lime or orange accents. */
export function HighlightMark({
  children,
  color = "lime",
  className,
}: {
  children: React.ReactNode;
  color?: "lime" | "orange";
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block -rotate-1 px-1.5", className)}>
      <span
        className={cn(
          "absolute inset-x-0 inset-y-[15%] -z-10 rounded-sm",
          color === "lime" ? "bg-highlight-lime" : "bg-accent-orange/30",
        )}
      />
      {children}
    </span>
  );
}

/** Loose hand-drawn dashed circle/ellipse wrapped around a word. */
export function CircleAnnotation({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block px-2", className)}>
      <svg
        viewBox="0 0 200 90"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]"
        aria-hidden
      >
        <ellipse
          cx="100"
          cy="45"
          rx="97"
          ry="42"
          fill="none"
          stroke="var(--accent-red)"
          strokeWidth="3"
          strokeDasharray="10 8"
          strokeLinecap="round"
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/** Small hand-drawn dashed arrow doodle, absolutely positioned by the parent. */
export function DashedArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 60"
      className={cn("pointer-events-none", className)}
      aria-hidden
    >
      <path
        d="M4 6C30 10 55 34 90 48"
        fill="none"
        stroke="var(--accent-red)"
        strokeWidth="3"
        strokeDasharray="8 7"
        strokeLinecap="round"
      />
      <path
        d="M74 40 L92 50 L78 56"
        fill="none"
        stroke="var(--accent-red)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
