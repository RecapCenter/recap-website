import { cn } from "@/lib/utils";

type EyebrowLabelProps = {
  children: React.ReactNode;
  className?: string;
  color?: "orange" | "ink";
  withDottedLines?: boolean;
};

export function EyebrowLabel({
  children,
  className,
  color = "orange",
  withDottedLines = false,
}: EyebrowLabelProps) {
  const label = (
    <span
      className={cn(
        "font-script text-xl leading-none",
        color === "orange" ? "text-accent-orange" : "text-ink/70",
        className,
      )}
    >
      {children}
    </span>
  );

  if (!withDottedLines) return label;

  return (
    <span className="inline-flex items-center gap-3">
      <span className="h-px w-8 border-t border-dashed border-current opacity-40" />
      {label}
      <span className="h-px w-8 border-t border-dashed border-current opacity-40" />
    </span>
  );
}
