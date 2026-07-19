import { cn } from "@/lib/utils";

type CharacterCounterProps = {
  id: string;
  current: number;
  max: number;
  /** Layout-only overrides (e.g. margins). Must not include a text-color utility. */
  className?: string;
  /** Text color for the normal (non-approaching, non-exceeded) state. */
  mutedClassName?: string;
};

/** Live "current / max" counter for a length-limited textarea/input. */
export function CharacterCounter({
  id,
  current,
  max,
  className,
  mutedClassName = "text-body-gray",
}: CharacterCounterProps) {
  const isExceeded = current > max;
  const isApproaching = !isExceeded && current / max >= 0.9;
  const stateColor = isExceeded
    ? "text-accent-red font-medium"
    : isApproaching
      ? "text-accent-orange"
      : mutedClassName;

  return (
    <p
      id={id}
      aria-live="polite"
      className={cn("mt-1 text-right text-xs tabular-nums", stateColor, className)}
    >
      {current} / {max}
    </p>
  );
}
