"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's <section>, marked `data-offscreen` while it's scrolled out of
 * view so app/globals.css can pause the boat and bird loops. Otherwise they
 * keep repainting forever under the rest of the page, which costs frames
 * and battery on iOS.
 */
export function HeroVisibility({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      section.toggleAttribute("data-offscreen", !entry.isIntersecting);
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
