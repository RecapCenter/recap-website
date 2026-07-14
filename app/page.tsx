import { HeroSection } from "@/components/home/hero-section";
import { QuickLinkGrid } from "@/components/home/quick-link-grid";
import { ServicesSection } from "@/components/home/services-section";
import { ThinkingOutLoudSection } from "@/components/home/thinking-out-loud-section";
import { GlobeSection } from "@/components/home/globe-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <QuickLinkGrid />
      <ServicesSection />
      <ThinkingOutLoudSection />
      <GlobeSection />
      <TestimonialsSection />
    </main>
  );
}
