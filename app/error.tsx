"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SectionHeading, HighlightMark } from "@/components/ui/section-heading";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-cream flex min-h-[70vh] items-center justify-center px-6 py-24 text-center">
      <div className="mx-auto max-w-xl">
        <EyebrowLabel withDottedLines>something went sideways</EyebrowLabel>
        <SectionHeading as="h1" className="mt-4">
          A <HighlightMark color="orange">hiccup</HighlightMark> on our end.
        </SectionHeading>
        <p className="text-body-gray mx-auto mt-6 max-w-md text-base leading-relaxed">
          Something unexpected happened while loading this page. Please try
          again in a moment.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Button onClick={reset} variant="solid-accent" size="lg">
            Try again
          </Button>
          <Button href="/" variant="outline" size="lg">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}
