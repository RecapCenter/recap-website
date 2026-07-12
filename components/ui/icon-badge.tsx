import { cn } from "@/lib/utils";

type IconBadgeProps = {
  children: React.ReactNode;
  bg?: string;
  className?: string;
  size?: "md" | "lg";
};

export function IconBadge({
  children,
  bg = "var(--pastel-mustard)",
  className,
  size = "md",
}: IconBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full shrink-0",
        size === "md" ? "size-12" : "size-16",
        className
      )}
      style={{ backgroundColor: bg }}
    >
      {children}
    </span>
  );
}
