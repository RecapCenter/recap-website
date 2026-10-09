"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { BotTrapField, useBotTrap } from "@/components/ui/bot-trap";
import { Card } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { CharacterCounter } from "@/components/ui/character-counter";
import {
  UNSUBSCRIBE_NOTE_MAX_LENGTH,
  UNSUBSCRIBE_REASONS,
  unsubscribeSchema,
  type UnsubscribeValues,
} from "@/lib/validation/contact";
import { scrollAndFocus } from "@/lib/validation/scroll-to-error";

// Field styling mirrors the Contact form (components/contact/contact-form.tsx).
// text-base (16px), not smaller: iOS Safari zooms the page on focus of any field under 16px.
const inputClasses =
  "h-11 w-full rounded-xl border bg-contact-input px-4 text-base text-contact-ink placeholder:text-contact-body focus:outline-none focus:ring-2 transition-colors";
const validBorder =
  "border-contact-border focus:border-contact-accent focus:ring-contact-accent/20";
const invalidBorder =
  "border-accent-red focus:border-accent-red focus:ring-accent-red/20";
const labelClasses = "font-script text-xl text-contact-accent";

const FIELD_ORDER = ["email", "reason", "note", "confirmed"] as const;

/**
 * Unsubscribe from "the slow letter": email (prefilled from the email
 * link), a required reason, an optional note and an explicit confirmation.
 * Posts to /api/newsletter/unsubscribe.
 */
export function UnsubscribeForm({ initialEmail }: { initialEmail: string }) {
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UnsubscribeValues>({
    resolver: zodResolver(unsubscribeSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: initialEmail,
      reason: "",
      note: "",
      confirmed: false,
    },
  });

  const note = watch("note") ?? "";
  const botTrap = useBotTrap();

  async function onValid(values: UnsubscribeValues) {
    setSubmitError(null);
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
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
            "Couldn't unsubscribe you right now. Please try again shortly.",
        );
      }
      setDone(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Couldn't unsubscribe you right now. Please try again shortly.",
      );
    }
  }

  function onInvalid(fieldErrors: Partial<Record<string, unknown>>) {
    const first = FIELD_ORDER.find((name) => fieldErrors[name]);
    if (first) {
      scrollAndFocus(
        document.getElementById(first === "reason" ? "reason-0" : first),
      );
    }
  }

  if (done) {
    return (
      <Card className="bg-contact-card border-contact-border flex flex-col items-center gap-4 p-8 text-center md:p-10">
        <CircleCheck className="text-contact-accent size-10" />
        <h2 className="text-contact-ink font-serif text-2xl md:text-3xl">
          You&rsquo;re unsubscribed.
        </h2>
        <p className="text-contact-body max-w-md text-base leading-relaxed">
          You won&rsquo;t receive the slow letter any more. Thank you for
          telling us why — it genuinely helps us write better letters.
        </p>
        <Link
          href="/"
          className="text-contact-accent mt-2 text-base font-medium underline underline-offset-4"
        >
          Back to the homepage
        </Link>
      </Card>
    );
  }

  return (
    <Card className="bg-contact-card border-contact-border p-8 md:p-10">
      <form
        onSubmit={handleSubmit(onValid, onInvalid)}
        noValidate
        className="relative flex flex-col gap-6"
      >
        <BotTrapField inputRef={botTrap.inputRef} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={labelClasses}>
            your email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@somewhere.com"
            className={`${inputClasses} ${errors.email ? invalidBorder : validBorder}`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className={`${labelClasses} mb-1.5`}>
            why are you leaving?
          </legend>
          {UNSUBSCRIBE_REASONS.map((reason, i) => (
            <label
              key={reason.value}
              htmlFor={`reason-${i}`}
              className="border-contact-border text-contact-ink has-[:checked]:border-contact-accent has-[:checked]:bg-contact-accent/5 flex cursor-pointer items-center gap-3 rounded-xl border bg-white/60 px-4 py-3 text-base transition-colors"
            >
              <input
                id={`reason-${i}`}
                type="radio"
                value={reason.value}
                className="accent-contact-accent size-4 shrink-0"
                aria-describedby={errors.reason ? "reason-error" : undefined}
                {...register("reason")}
              />
              {reason.label}
            </label>
          ))}
          <FieldError id="reason-error" message={errors.reason?.message} />
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="note" className={labelClasses}>
            anything else you&rsquo;d like to tell us? (optional)
          </label>
          <textarea
            id="note"
            rows={3}
            maxLength={UNSUBSCRIBE_NOTE_MAX_LENGTH}
            placeholder="What would have made the slow letter worth keeping?"
            className={`${inputClasses} h-auto resize-y py-3 ${errors.note ? invalidBorder : validBorder}`}
            aria-invalid={!!errors.note}
            aria-describedby={[
              errors.note ? "note-error" : null,
              "note-counter",
            ]
              .filter(Boolean)
              .join(" ")}
            {...register("note")}
          />
          <div className="flex items-start justify-between gap-4">
            <FieldError id="note-error" message={errors.note?.message} />
            <CharacterCounter
              id="note-counter"
              current={note.length}
              max={UNSUBSCRIBE_NOTE_MAX_LENGTH}
              className="ml-auto"
              mutedClassName="text-contact-body"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmed"
            className="text-contact-ink flex items-start gap-3 text-base"
          >
            <input
              id="confirmed"
              type="checkbox"
              className="accent-contact-accent mt-1 size-4 shrink-0"
              aria-invalid={!!errors.confirmed}
              aria-describedby={
                errors.confirmed ? "confirmed-error" : undefined
              }
              {...register("confirmed")}
            />
            Yes, remove me from the slow letter. I understand I won&rsquo;t
            receive future letters.
          </label>
          <FieldError
            id="confirmed-error"
            message={errors.confirmed?.message}
          />
        </div>

        {submitError && (
          <p
            role="alert"
            className="border-accent-red/30 bg-accent-red/10 text-accent-red flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
          >
            <TriangleAlert className="size-4 shrink-0" />
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="flex h-13 items-center justify-center rounded-2xl bg-[#2b1f17] text-base font-medium text-white transition-colors hover:bg-[#2b1f17]/90 disabled:opacity-60"
        >
          {isSubmitting ? "Unsubscribing…" : "Unsubscribe me"}
        </button>
        <p className="text-contact-body text-center text-sm">
          Changed your mind?{" "}
          <Link href="/" className="underline underline-offset-4">
            Stay subscribed and head back home
          </Link>
          .
        </p>
      </form>
    </Card>
  );
}
