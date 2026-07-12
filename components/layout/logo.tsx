import Image from "next/image";
import { cn } from "@/lib/utils";
import recapMark from "@/assets/icons/recap-logo.svg";

type LogoProps = {
  variant?: "ink" | "cream";
  className?: string;
};

/**
 * Recap mark (assets/icons/recap-logo.svg), shared by Navbar and Footer.
 *
 * The source asset is a black mark on an opaque white square, so each
 * variant uses a blend mode to drop that square against its background:
 * `multiply` erases white on the light navbar, and `invert` + `screen`
 * flips the mark to white and erases the (now black) square on the dark
 * footer.
 */
export function Logo({ variant = "ink", className }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Image
        src={recapMark}
        alt="Recap"
        width={36}
        height={36}
        className={
          variant === "cream" ? "invert mix-blend-screen" : "mix-blend-multiply"
        }
      />
    </span>
  );
}
