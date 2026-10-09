"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Mail } from "lucide-react";
import { BotTrapField, useBotTrap } from "@/components/ui/bot-trap";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import {
  emailOnlySchema,
  type EmailOnlyValues,
} from "@/lib/validation/contact";
import { scrollAndFocus } from "@/lib/validation/scroll-to-error";
import { trackEvent } from "@/lib/analytics";

/**
 * Footer signup for "the slow letter". Posts to /api/newsletter, which adds
 * the address to MailPoet in WordPress; MailPoet then emails a link to
 * confirm the subscription (double opt-in).
 */
export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmailOnlyValues>({
    resolver: zodResolver(emailOnlySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  });

  const { ref: emailRhfRef, ...emailField } = register("email");
  const botTrap = useBotTrap();

  async function onValid(values: EmailOnlyValues) {
    setServerError(null);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ...botTrap.values() }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          data?.error ??
            "Couldn't sign you up right now. Please try again shortly.",
        );
      }
      reset();
      setStatus("done");
      trackEvent("sign_up", { method: "newsletter", location: "footer" });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Couldn't sign you up right now. Please try again shortly.",
      );
    }
  }

  function onInvalid() {
    scrollAndFocus(document.getElementById("newsletter-email"));
  }

  if (status === "done") {
    return (
      <p
        role="status"
        className="text-cream flex items-start gap-2 text-base leading-relaxed"
      >
        <CircleCheck className="text-footer-accent mt-1 size-4 shrink-0" />
        Almost there — check your inbox and click the link to confirm your
        subscription.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      noValidate
      className="relative flex flex-col gap-1.5"
    >
      <BotTrapField inputRef={botTrap.inputRef} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div
          className={`focus-within:ring-footer-accent/50 flex h-11 items-center gap-2 rounded-full border bg-white/5 px-4 focus-within:ring-2 ${
            errors.email ? "border-accent-red" : "border-white/15"
          }`}
        >
          <Mail className="text-footer-muted size-4 shrink-0" />
          <input
            id="newsletter-email"
            type="email"
            aria-label="Email address"
            autoComplete="email"
            placeholder="you@somewhere.com"
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? "newsletter-email-error" : undefined
            }
            className="text-cream placeholder:text-footer-muted w-full bg-transparent text-base focus:outline-none sm:w-56"
            {...emailField}
            ref={(el) => {
              emailRhfRef(el);
            }}
          />
        </div>
        <Button
          type="submit"
          variant="solid-accent"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      <FieldError id="newsletter-email-error" message={errors.email?.message} />
      {serverError && (
        <p role="alert" className="text-accent-red text-sm">
          {serverError}
        </p>
      )}
    </form>
  );
}
