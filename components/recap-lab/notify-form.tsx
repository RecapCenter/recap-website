"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { emailOnlySchema, type EmailOnlyValues } from "@/lib/validation/contact";
import { scrollAndFocus } from "@/lib/validation/scroll-to-error";

export function NotifyForm() {
  const [submitted, setSubmitted] = useState(false);

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

  function onValid() {
    setSubmitted(true);
    reset();
  }

  function onInvalid() {
    scrollAndFocus(document.getElementById("notify-email"));
  }

  return (
    <section className="px-6 pb-12 md:pb-16">
      <FadeIn className="mx-auto max-w-xl text-center">
        <SectionHeading as="h3">Want early access?</SectionHeading>
        <p className="text-body-gray mx-auto mt-3 max-w-md text-sm leading-relaxed">
          Leave your email and we&apos;ll let you know the moment Recap Lab
          opens up.
        </p>
        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          noValidate
          className="mt-6 flex flex-col gap-1.5"
        >
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
                aria-describedby={errors.email ? "notify-email-error" : undefined}
                className="text-ink placeholder:text-body-gray/70 w-full bg-transparent text-sm focus:outline-none sm:w-56"
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
              {submitted ? "You're on the list!" : "Notify me"}
            </Button>
          </div>
          <FieldError id="notify-email-error" message={errors.email?.message} />
        </form>
      </FadeIn>
    </section>
  );
}
