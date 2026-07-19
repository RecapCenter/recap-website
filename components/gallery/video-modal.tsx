"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogClose, DialogPopup, DialogPortal } from "@/components/ui/dialog";
import { UploadedVideoPlayer } from "./uploaded-video-player";
import { YouTubePlayer } from "./youtube-player";
import { getVideoEmbedUrl } from "@/lib/utils";
import type { GalleryItem } from "@/lib/wordpress/gallery";

type VideoModalProps = {
  /** Video-only items — images never reach this component. */
  videos: GalleryItem[];
  openIndex: number | null;
  onOpenChange: (index: number | null) => void;
};

/** Popup for playing a single video — opened only from VideoThumbnail.
 * Images never open this modal. The actual player (HTML5 or YouTube) is
 * mounted only while open, so closing it fully stops/destroys playback
 * instead of just hiding it. Focus trap, ESC-to-close, click-outside, and
 * scroll lock all come from the underlying Base UI Dialog primitive. */
export function VideoModal({ videos, openIndex, onOpenChange }: VideoModalProps) {
  const isOpen = openIndex !== null;
  const item = isOpen ? videos[openIndex] : null;

  function go(delta: number) {
    if (openIndex === null || videos.length === 0) return;
    const next = (openIndex + delta + videos.length) % videos.length;
    onOpenChange(next);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onOpenChange(null)}>
      <DialogPortal>
        <DialogPopup
          className="items-center justify-center"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") go(-1);
            if (e.key === "ArrowRight") go(1);
          }}
        >
          {item && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative flex max-h-[85vh] w-full max-w-4xl flex-col items-center gap-4"
            >
              <DialogClose className="absolute top-0 right-0 z-10 flex size-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30">
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </DialogClose>

              {videos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="absolute top-1/2 left-0 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 md:-left-14"
                  >
                    <ChevronLeft className="size-5" />
                    <span className="sr-only">Previous video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="absolute top-1/2 right-0 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 md:-right-14"
                  >
                    <ChevronRight className="size-5" />
                    <span className="sr-only">Next video</span>
                  </button>
                </>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex max-h-[70vh] w-full items-center justify-center"
                >
                  {item.videoSource === "embed" && item.videoUrl && getVideoEmbedUrl(item.videoUrl) ? (
                    <YouTubePlayer embedUrl={getVideoEmbedUrl(item.videoUrl)!} title={item.title} />
                  ) : item.videoUrl ? (
                    <UploadedVideoPlayer src={item.videoUrl} title={item.title} />
                  ) : null}
                </motion.div>
              </AnimatePresence>

              {item.caption && (
                <p className="text-center text-sm text-white/80">{item.caption}</p>
              )}
            </motion.div>
          )}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
