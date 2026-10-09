import { LifeBuoy } from "lucide-react";

/**
 * Shown beside the contact form (above it on mobile): the form is read by a
 * person, not monitored around the clock, so anyone in crisis is pointed to
 * emergency and 24/7 support instead. Numbers are India's (most clients);
 * everyone else is told to use their local emergency number.
 */
export function CrisisNotice() {
  return (
    <aside
      aria-labelledby="crisis-notice-title"
      className="border-contact-border bg-contact-card mt-6 flex gap-3 rounded-2xl border p-5"
    >
      <LifeBuoy
        aria-hidden
        className="text-contact-accent mt-0.5 size-5 shrink-0"
      />
      <div className="flex flex-col gap-2 text-base leading-relaxed">
        <p id="crisis-notice-title" className="text-contact-ink font-medium">
          Need help right now?
        </p>
        <p className="text-contact-body">
          This form isn&rsquo;t monitored around the clock, so please don&rsquo;t
          use it in an emergency. If you or someone else is in immediate danger,
          call{" "}
          <a
            href="tel:112"
            className="text-contact-ink font-medium underline underline-offset-4"
          >
            112
          </a>{" "}
          (India) or your local emergency number. For urgent emotional support
          in India, call Tele-MANAS on{" "}
          <a
            href="tel:14416"
            className="text-contact-ink font-medium underline underline-offset-4"
          >
            14416
          </a>
          , free and available 24/7.
        </p>
        <p className="text-contact-body text-sm italic">
          You don&rsquo;t need to share medical details or a diagnosis here,
          just enough for us to get back to you. We&rsquo;ll talk through the
          rest together.
        </p>
      </div>
    </aside>
  );
}
