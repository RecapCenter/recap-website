"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";

export const Dialog = BaseDialog.Root;
export const DialogClose = BaseDialog.Close;

export function DialogPortal({
  children,
  ...props
}: React.ComponentProps<typeof BaseDialog.Portal>) {
  return (
    <BaseDialog.Portal {...props}>
      <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-black/90 transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      {children}
    </BaseDialog.Portal>
  );
}

export function DialogPopup({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup>) {
  return (
    <BaseDialog.Popup
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 outline-none transition-all duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}
