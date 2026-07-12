import { cn } from "@/lib/utils";

type DecorativeBlobProps = {
  color: string;
  size?: number;
  className?: string;
};

/** Soft, heavily-blurred gradient glow used behind Contact-page hero/cards. */
export function DecorativeBlob({
  color,
  size = 420,
  className,
}: DecorativeBlobProps) {
  return (
    <div
      className={cn("pointer-events-none absolute z-0 rounded-full blur-3xl opacity-60", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      aria-hidden
    />
  );
}
