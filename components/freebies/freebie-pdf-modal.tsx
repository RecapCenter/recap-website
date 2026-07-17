"use client";

import { Download, X } from "lucide-react";
import { Dialog, DialogClose, DialogPopup, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Freebie } from "@/lib/wordpress/freebies";

type FreebiePdfModalProps = {
  freebie: Freebie | null;
  onOpenChange: (open: boolean) => void;
};

export function FreebiePdfModal({ freebie, onOpenChange }: FreebiePdfModalProps) {
  return (
    <Dialog open={freebie !== null} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogPopup className="items-center justify-center">
          {freebie && (
            <div className="relative flex h-[85vh] w-full max-w-3xl flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-lg font-bold text-white">
                  {freebie.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    href={freebie.pdfUrl}
                    download
                    variant="solid-accent"
                    size="md"
                    icon={<Download className="size-4" />}
                    aria-label={`Download PDF: ${freebie.title}`}
                  >
                    Download
                  </Button>
                  <DialogClose className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30">
                    <X className="size-5" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                </div>
              </div>

              <iframe
                src={freebie.pdfUrl}
                title={freebie.title}
                className="w-full flex-1 rounded-2xl bg-white"
              />
            </div>
          )}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
