"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Mail } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
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
 * Recap Lab "get notified" signup. There's no separate list: it subscribes
 * the address to the slow letter (same /api/newsletter → MailPoet flow as the
 * footer form), where Recap Lab will be announced.
 */
export function NotifyForm() {
  const [submitted, setSubmitted] = useState(false);
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
      setSubmitted(true);
      trackEvent("sign_up", { method: "newsletter", location: "recap_lab" });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Couldn't sign you up right now. Please try again shortly.",
      );
    }
  }

  function onInvalid() {
    scrollAndFocus(document.getElementById("notify-email"));
  }

  return (
    <section className="px-6 pb-12 md:pb-16">
      <FadeIn className="mx-auto max-w-xl text-center">
        <SectionHeading as="h3">Get notified when it opens</SectionHeading>
        <p className="text-body-gray mx-auto mt-3 max-w-md text-base leading-relaxed">
          Join the slow letter, our newsletter, and you&apos;ll be the first to
          hear the moment Recap Lab opens up.
        </p>
        {submitted ? (
          <p
            role="status"
            className="text-ink mt-6 flex items-start justify-center gap-2 text-base leading-relaxed"
          >
            <CircleCheck className="text-accent-orange mt-1 size-4 shrink-0" />
            You&rsquo;re on the list. We&rsquo;ll let you know the moment Recap
            Lab opens.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onValid, onInvalid)}
            noValidate
            className="relative mt-6 flex flex-col gap-1.5"
          >
            <BotTrapField inputRef={botTrap.inputRef} />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <div
                className={`focus-within:ring-accent-orange/20 focus-within:border-accent-orange flex h-11 items-center gap-2 rounded-full border bg-white px-4 focus-within:ring-2 ${
                  errors.email ? "border-accent-red" : "border-border"
                }`}
              >
                <Mail className="text-body-gray size-4 shrink-0" />
                <input
                  id="notify-email"
                  type="email"
                  placeholder="you@somewhere.com"
                  aria-label="Email address"
                  aria-invalid={!!errors.email}
                  aria-describedby={
                    errors.email ? "notify-email-error" : undefined
                  }
                  className="text-ink placeholder:text-body-gray/70 w-full bg-transparent text-base focus:outline-none sm:w-56"
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
                {isSubmitting ? "Signing you up…" : "Notify me"}
              </Button>
            </div>
            <FieldError
              id="notify-email-error"
              message={errors.email?.message}
            />
            {serverError && (
              <p role="alert" className="text-accent-red text-sm">
                {serverError}
              </p>
            )}
          </form>
        )}
      </FadeIn>
    </section>
  );
}
