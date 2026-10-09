"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CircleCheck, Send, TriangleAlert } from "lucide-react";
import { BotTrapField, useBotTrap } from "@/components/ui/bot-trap";
import { Card } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { CharacterCounter } from "@/components/ui/character-counter";
import {
  CONTACT_FIELD_ORDER,
  CONTACT_REASONS,
  MESSAGE_MAX_LENGTH,
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validation/contact";
import { scrollAndFocus } from "@/lib/validation/scroll-to-error";
import { trackEvent } from "@/lib/analytics";

const inputClasses =
  // text-base (16px), not smaller: iOS Safari zooms the page on focus of any field under 16px.
  "h-11 w-full rounded-xl border bg-contact-input px-4 text-base text-contact-ink placeholder:text-contact-body focus:outline-none focus:ring-2 transition-colors";
const validBorder =
  "border-contact-border focus:border-contact-accent focus:ring-contact-accent/20";
const invalidBorder =
  "border-accent-red focus:border-accent-red focus:ring-accent-red/20";

const labelClasses = "font-script text-lg text-contact-accent";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // First name only, to greet them on the thank-you message.
  const [sentBy, setSentBy] = useState("");
  const thankYouRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the thank-you heading so screen readers announce it and
  // keyboard users aren't left on a control that no longer exists.
  useEffect(() => {
    if (submitted) thankYouRef.current?.focus();
  }, [submitted]);

  const fieldRefs = useRef<
    Partial<Record<keyof ContactFormValues, HTMLElement | null>>
  >({});
  const botTrap = useBotTrap();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      reason: "",
      message: "",
      agreed: false,
    },
  });

  const messageValue = watch("message") ?? "";
  const agreed = watch("agreed");

  const { ref: nameRhfRef, ...nameField } = register("name");
  const { ref: emailRhfRef, ...emailField } = register("email");
  const { ref: phoneRhfRef, ...phoneField } = register("phone");
  const { ref: reasonRhfRef, ...reasonField } = register("reason");
  const { ref: messageRhfRef, ...messageField } = register("message");
  const { ref: agreedRhfRef, ...agreedField } = register("agreed");

  async function onValid(data: ContactFormValues) {
    setSubmitError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...botTrap.values() }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          body?.error || "Something went wrong. Please try again.",
        );
      }

      setSentBy(data.name.trim().split(/\s+/)[0] ?? "");
      setSubmitted(true);
      reset();
      // A count of enquiries by topic for Google Analytics — no personal data.
      trackEvent("generate_lead", { form: "contact", reason: data.reason });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  function onInvalid(invalidErrors: typeof errors) {
    for (const field of CONTACT_FIELD_ORDER) {
      if (invalidErrors[field]) {
        scrollAndFocus(fieldRefs.current[field]);
        return;
      }
    }
  }

  return (
    <Card className="bg-contact-card border-contact-border relative overflow-hidden p-8 md:p-10">
      <div
        className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full opacity-90"
        style={{ background: "#f0c368" }}
        aria-hidden
      />

      {submitted ? (
        <div
          role="status"
          className="relative flex flex-col items-center gap-4 text-center"
        >
          <CircleCheck className="text-contact-accent size-10" aria-hidden />
          <h2
            ref={thankYouRef}
            tabIndex={-1}
            className="text-contact-ink font-serif text-2xl outline-none md:text-3xl"
          >
            Thank you{sentBy ? `, ${sentBy}` : ""}. Your message is with us.
          </h2>
          <p className="text-contact-body max-w-md text-base leading-relaxed">
            A real person will read it and reply personally, usually within 48
            hours. If things feel urgent before then, please call 112 or
            Tele-MANAS on 14416 (India), free and available 24/7.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-contact-accent mt-2 text-base font-medium underline underline-offset-4"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          noValidate
          className="relative flex flex-col gap-5"
        >
          <BotTrapField inputRef={botTrap.inputRef} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className={labelClasses}>
                your name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Anaya"
                className={`${inputClasses} ${errors.name ? invalidBorder : validBorder}`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...nameField}
                ref={(el) => {
                  nameRhfRef(el);
                  fieldRefs.current.name = el;
                }}
              />
              <FieldError id="name-error" message={errors.name?.message} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className={labelClasses}>
                email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@somewhere.com"
                className={`${inputClasses} ${errors.email ? invalidBorder : validBorder}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...emailField}
                ref={(el) => {
                  emailRhfRef(el);
                  fieldRefs.current.email = el;
                }}
              />
              <FieldError id="email-error" message={errors.email?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className={labelClasses}>
                phone number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="e.g. +1 555 123 4567"
                className={`${inputClasses} ${errors.phone ? invalidBorder : validBorder}`}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                {...phoneField}
                ref={(el) => {
                  phoneRhfRef(el);
                  fieldRefs.current.phone = el;
                }}
              />
              <FieldError id="phone-error" message={errors.phone?.message} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reason" className={labelClasses}>
                reaching out about
              </label>
              <div className="relative">
                <select
                  id="reason"
                  defaultValue=""
                  className={`${inputClasses} appearance-none pr-10 ${errors.reason ? invalidBorder : validBorder}`}
                  aria-invalid={!!errors.reason}
                  aria-describedby={errors.reason ? "reason-error" : undefined}
                  {...reasonField}
                  ref={(el) => {
                    reasonRhfRef(el);
                    fieldRefs.current.reason = el;
                  }}
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {CONTACT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="text-contact-body pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
              </div>
              <FieldError id="reason-error" message={errors.reason?.message} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className={labelClasses}>
              your message
            </label>
            <textarea
              id="message"
              rows={4}
              maxLength={MESSAGE_MAX_LENGTH}
              placeholder="Say as little or as much as you'd like. This is a safe place to begin."
              className={`${inputClasses} h-auto resize-y py-3 ${errors.message ? invalidBorder : validBorder}`}
              aria-invalid={!!errors.message}
              aria-describedby={[
                errors.message ? "message-error" : null,
                "message-counter",
              ]
                .filter(Boolean)
                .join(" ")}
              {...messageField}
              ref={(el) => {
                messageRhfRef(el);
                fieldRefs.current.message = el;
              }}
            />
            <div className="flex items-start justify-between gap-4">
              <FieldError
                id="message-error"
                message={errors.message?.message}
              />
              <CharacterCounter
                id="message-counter"
                current={messageValue.length}
                max={MESSAGE_MAX_LENGTH}
                className="ml-auto"
                mutedClassName="text-contact-body"
              />
            </div>
          </div>

          <label className="text-contact-body flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="accent-contact-accent mt-1 size-4 shrink-0"
              aria-invalid={!!errors.agreed}
              aria-describedby={errors.agreed ? "agreed-error" : undefined}
              {...agreedField}
              ref={(el) => {
                agreedRhfRef(el);
                fieldRefs.current.agreed = el;
              }}
            />
            I&rsquo;d like Recap to reach out to me about my message. My details
            are used only to reply to me and are never sold or shared for
            marketing.
          </label>

          <AnimatePresence>
            {errors.agreed && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                id="agreed-error"
                role="alert"
                className="border-accent-red/30 bg-accent-red/10 text-accent-red flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
              >
                <TriangleAlert className="size-4 shrink-0" />
                {errors.agreed.message}
              </motion.p>
            )}
            {submitError && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                role="alert"
                className="border-accent-red/30 bg-accent-red/10 text-accent-red flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
              >
                <TriangleAlert className="size-4 shrink-0" />
                {submitError}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting || submitted}
            aria-busy={isSubmitting}
            className={`flex h-13 items-center justify-center gap-2 rounded-2xl text-base font-medium text-white transition-colors ${
              agreed
                ? "bg-[#2b1f17] hover:bg-[#2b1f17]/90"
                : "bg-[#2b1f17]/40 hover:bg-[#2b1f17]/40"
            }`}
          >
            <Send className="size-4" />
            {submitted ? "Sent!" : isSubmitting ? "Sending…" : "Send it across"}
          </button>
          <p className="text-contact-body text-center text-sm italic">
            Replies are personal and usually arrive within 48 hours.
          </p>
        </form>
      )}
    </Card>
  );
}
