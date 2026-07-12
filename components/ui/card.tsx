import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  bordered?: boolean;
  shadow?: boolean;
};

export function Card({
  className,
  bordered = true,
  shadow = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl bg-white",
        bordered && "border-contact-border border",
        shadow && "shadow-[0_8px_30px_rgba(23,20,15,0.06)]",
        className,
      )}
      {...props}
    />
  );
}
