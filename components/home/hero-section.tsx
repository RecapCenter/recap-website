import Image from "next/image";
import heroCover from "@/assets/images/Recap-Cover-2560x1440-1.png";
import { FadeIn } from "@/components/motion/fade-in";

export function HeroSection() {
  return (
    <section className="relative aspect-[2560/1440] w-full overflow-hidden">
      <FadeIn className="absolute inset-0">
        <Image
          src={heroCover}
          alt=""
          aria-hidden="true"
          priority
          fill
          sizes="100vw"
          className="object-cover"
        />
      </FadeIn>
      <h1 className="sr-only">
        Realm of Counselling &amp; Psychological Services — from managing
        chaos to developing perspective
      </h1>
    </section>
  );
}
