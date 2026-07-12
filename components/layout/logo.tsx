import Image from "next/image";
import { cn } from "@/lib/utils";
import recapMark from "@/assets/icons/recap-logo.svg";

type LogoProps = {
  variant?: "ink" | "cream";
  className?: string;
};

/** Recap mark (assets/icons/recap-logo.svg) + "recap." script wordmark, shared by Navbar and Footer. */
export function Logo({ variant = "ink", className }: LogoProps) {
  const accentColor =
    variant === "ink" ? "text-accent-orange" : "text-footer-accent";

  const mark = <Image src={recapMark} alt="Recap" width={36} height={36} />;

  return (
    <span className={cn("flex items-center gap-2", className)}>
      {variant === "cream" ? (
        <span className="bg-cream flex size-9 items-center justify-center rounded-full p-1">
          {mark}
        </span>
      ) : (
        mark
      )}
      <span className={cn("font-script text-xl", accentColor)}>recap.</span>
    </span>
  );
}
