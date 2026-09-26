"use client";

import { Fragment } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export type ColumnPhoto = {
  id: number;
  imageUrl: string;
  width: number;
  height: number;
};

/**
 * One endlessly scrolling column of gallery photos. The list is rendered
 * twice and the track slides up by exactly half its height, so the loop
 * seam is invisible. Purely decorative (a section background), so it's
 * hidden from assistive tech and never takes pointer events; it stays still
 * for visitors who prefer reduced motion.
 */
export function PhotoColumn({
  photos,
  duration = 30,
  className,
}: {
  photos: ColumnPhoto[];
  duration?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={className}>
      <motion.div
        animate={reduceMotion ? undefined : { translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-4 pb-4"
      >
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {photos.map((photo, i) => (
              <div
                key={`${photo.id}-${i}`}
                className="overflow-hidden rounded-sm shadow-lg shadow-black/5"
              >
                <Image
                  src={photo.imageUrl}
                  alt=""
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw"
                  className="block h-auto w-full"
                />
              </div>
            ))}
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
