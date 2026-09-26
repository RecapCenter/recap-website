import { LaptopHero, PhoneHero, TabletHero } from "./hero/hero-layouts";

/*
 * Homepage hero, built from vector elements and live text (see
 * components/home/hero/) instead of flat banner images, so it stays sharp
 * at every screen size and animates in. Three art-directed layouts swap at
 * the site's breakpoints: phone < 768px, tablet 768–1023px, laptop 1024px+.
 * The artwork is decorative; the visually hidden heading carries the
 * semantics for search engines and screen readers.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#fcf6e8]">
      <h1 className="sr-only">
        Realm of Counselling &amp; Psychological Services
      </h1>
      <p className="sr-only">From managing chaos to developing perspective.</p>

      <PhoneHero className="block h-auto w-full md:hidden" />
      <TabletHero className="hidden h-auto w-full md:block lg:hidden" />
      <LaptopHero className="hidden h-auto w-full lg:block" />
    </section>
  );
}
