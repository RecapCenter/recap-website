import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { QuickLinkGrid } from "@/components/home/quick-link-grid";
import { ServicesSection } from "@/components/home/services-section";
import { ThinkingOutLoudSection } from "@/components/home/thinking-out-loud-section";
import { GallerySection } from "@/components/home/gallery-section";
import { GlobeSection } from "@/components/home/globe-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

// Title, description and sharing tags come from the root layout. The
// canonical lives here, not there, so other pages never inherit "/".
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <QuickLinkGrid />
      <ServicesSection />
      <ThinkingOutLoudSection />
      <GallerySection />
      <GlobeSection />
      <TestimonialsSection />
    </main>
  );
}
