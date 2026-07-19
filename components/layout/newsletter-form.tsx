"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { emailOnlySchema, type EmailOnlyValues } from "@/lib/validation/contact";
import { scrollAndFocus } from "@/lib/validation/scroll-to-error";

export function NewsletterForm() {
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
    reset();
  }

  function onInvalid() {
    scrollAndFocus(document.getElementById("newsletter-email"));
  }

  return (
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      noValidate
      className="flex flex-col gap-1.5"
    >
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
            placeholder="you@somewhere.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "newsletter-email-error" : undefined}
            className="text-cream placeholder:text-footer-muted w-full bg-transparent text-sm focus:outline-none sm:w-56"
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
          Subscribe
        </Button>
      </div>
      <FieldError id="newsletter-email-error" message={errors.email?.message} />
    </form>
  );
}
