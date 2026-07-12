import { FadeIn } from "@/components/motion/fade-in";
import { GlobePolaroids } from "./globe-polaroids";

export function GlobeSection() {
  return (
    <section className="bg-white px-6 py-20 md:py-24">
      <FadeIn className="mx-auto max-w-md">
        <GlobePolaroids />
      </FadeIn>
    </section>
  );
}
