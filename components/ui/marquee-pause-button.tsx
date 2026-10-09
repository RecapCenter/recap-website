"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Pause/play control for an auto-scrolling Marquee (WCAG 2.2.2: moving
 * content must be pausable). Sets data-paused on the element with
 * `targetId`; app/globals.css pauses any marquee inside it. Hidden under
 * reduced motion, where the marquee doesn't move in the first place.
 */
export function MarqueePauseButton({
  targetId,
  label,
}: {
  targetId: string;
  label: string;
}) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.getElementById(targetId)?.toggleAttribute("data-paused", paused);
  }, [paused, targetId]);

  return (
    <Button
      variant="outline"
      onClick={() => setPaused((value) => !value)}
      aria-pressed={paused}
      aria-controls={targetId}
      icon={
        paused ? (
          <Play className="size-4" aria-hidden />
        ) : (
          <Pause className="size-4" aria-hidden />
        )
      }
      iconPosition="left"
      className="motion-reduce:hidden"
    >
      {paused ? `Play ${label}` : `Pause ${label}`}
    </Button>
  );
}
