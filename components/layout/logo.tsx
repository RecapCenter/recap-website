import Image from "next/image";
import { cn } from "@/lib/utils";
import recapMark from "@/assets/icons/recap-logo.webp";

type LogoProps = {
  variant?: "ink" | "cream";
  className?: string;
};

/**
 * Recap mark (assets/icons/recap-logo.webp), shared by Navbar and Footer.
 *
 * The source is a black mark on a transparent background, so the `cream`
 * variant just inverts it to white for the dark footer.
 */
export function Logo({ variant = "ink", className }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Image
        src={recapMark}
        alt="Recap"
        width={36}
        height={36}
        className={variant === "cream" ? "invert" : undefined}
      />
    </span>
  );
}
