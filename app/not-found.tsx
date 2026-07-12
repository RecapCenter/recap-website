import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SectionHeading, HighlightMark } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Page not found — Recap",
};

export default function NotFound() {
  return (
    <section className="bg-cream flex min-h-[70vh] items-center justify-center px-6 py-24 text-center">
      <div className="mx-auto max-w-xl">
        <EyebrowLabel withDottedLines>oops, wrong turn</EyebrowLabel>
        <SectionHeading as="h1" className="mt-4">
          This page took a <HighlightMark>break</HighlightMark>.
        </SectionHeading>
        <p className="text-body-gray mx-auto mt-6 max-w-md text-base leading-relaxed">
          We couldn&apos;t find the page you were looking for. It may have
          moved, or the link might be out of date.
        </p>
        <div className="mt-10 flex justify-center">
          <Button href="/" variant="solid-accent" size="lg">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}
