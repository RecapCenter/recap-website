"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogClose, DialogPopup, DialogPortal } from "@/components/ui/dialog";
import { getVideoEmbedUrl } from "@/lib/utils";
import type { GalleryItem } from "@/lib/wordpress/gallery";

type LightboxProps = {
  items: GalleryItem[];
  openIndex: number | null;
  onOpenChange: (index: number | null) => void;
};

export function Lightbox({ items, openIndex, onOpenChange }: LightboxProps) {
  const isOpen = openIndex !== null;
  const item = isOpen ? items[openIndex] : null;

  function go(delta: number) {
    if (openIndex === null) return;
    const next = (openIndex + delta + items.length) % items.length;
    onOpenChange(next);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onOpenChange(null)}
    >
      <DialogPortal>
        <DialogPopup
          className="items-center justify-center"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") go(-1);
            if (e.key === "ArrowRight") go(1);
          }}
        >
          {item && (
            <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col items-center gap-4">
              <DialogClose className="absolute top-0 right-0 z-10 flex size-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30">
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </DialogClose>

              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute top-1/2 left-0 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 md:-left-14"
              >
                <ChevronLeft className="size-5" />
                <span className="sr-only">Previous</span>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute top-1/2 right-0 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 md:-right-14"
              >
                <ChevronRight className="size-5" />
                <span className="sr-only">Next</span>
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex max-h-[70vh] w-full items-center justify-center"
                >
                  {item.type === "video" && item.videoUrl ? (
                    getVideoEmbedUrl(item.videoUrl) ? (
                      <iframe
                        src={getVideoEmbedUrl(item.videoUrl)!}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="aspect-video max-h-[70vh] w-full rounded-2xl"
                      />
                    ) : (
                      <video
                        src={item.videoUrl}
                        controls
                        className="max-h-[70vh] max-w-full rounded-2xl"
                      />
                    )
                  ) : (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={1200}
                      height={800}
                      className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {item.caption && (
                <p className="text-center text-sm text-white/80">
                  {item.caption}
                </p>
              )}
            </div>
          )}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
