import { z } from "zod";

/**
 * Shared validation rules for every form on the site. Both the client
 * (react-hook-form + zodResolver) and the server (app/api/contact/route.ts)
 * import from here so the rules never drift apart.
 */

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;

export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 500;

export const PHONE_MIN_DIGITS = 7;
export const PHONE_MAX_DIGITS = 15;
export const PHONE_ALLOWED_CHARS_RE = /^[0-9+\-() ]+$/;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_REASONS = [
  { value: "session", label: "A session for myself" },
  { value: "workshop", label: "A workshop for my team" },
  { value: "school", label: "School partnership" },
  { value: "other", label: "Something else" },
] as const;

const REASON_VALUES: readonly string[] = CONTACT_REASONS.map((r) => r.value);

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Please enter your name.")
  .min(NAME_MIN_LENGTH, `Name must contain at least ${NAME_MIN_LENGTH} characters.`)
  .max(NAME_MAX_LENGTH, `Name must be ${NAME_MAX_LENGTH} characters or fewer.`);

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Please enter a valid email address.")
  .regex(EMAIL_RE, "Please enter a valid email address.");

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Please enter a valid phone number.")
  .refine((v) => PHONE_ALLOWED_CHARS_RE.test(v), {
    message: "Please enter a valid phone number.",
  })
  .refine(
    (v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= PHONE_MIN_DIGITS && digits.length <= PHONE_MAX_DIGITS;
    },
    { message: "Please enter a valid phone number." },
  );

export const reasonSchema = z
  .string()
  .refine((v) => REASON_VALUES.includes(v), {
    message: "Please choose a reason for reaching out.",
  });

export const messageSchema = z
  .string()
  .trim()
  .min(1, "Please enter your message.")
  .min(MESSAGE_MIN_LENGTH, `Message must contain at least ${MESSAGE_MIN_LENGTH} characters.`)
  .max(MESSAGE_MAX_LENGTH, `Your message cannot exceed ${MESSAGE_MAX_LENGTH} characters.`);

export const agreedSchema = z.boolean().refine((v) => v === true, {
  message: "Please tick the box above so we know it's okay to reach out.",
});

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  reason: reasonSchema,
  message: messageSchema,
  agreed: agreedSchema,
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Field order used to focus/scroll to the first invalid field on submit. */
export const CONTACT_FIELD_ORDER: (keyof ContactFormValues)[] = [
  "name",
  "email",
  "phone",
  "reason",
  "message",
  "agreed",
];

export const emailOnlySchema = z.object({
  email: emailSchema,
});

export type EmailOnlyValues = z.infer<typeof emailOnlySchema>;
