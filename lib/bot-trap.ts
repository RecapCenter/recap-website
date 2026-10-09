/**
 * Lightweight spam protection shared by every public form: a hidden
 * honeypot field that people never see (bots fill in every input), plus
 * how long the form was open before submitting (bots submit instantly).
 * The client side lives in components/ui/bot-trap.tsx.
 *
 * Routes answer a tripped trap with the normal success response and do
 * nothing else, so bots get no signal to adapt to.
 */

/** Deliberately meaningless, so browser autofill never targets it. */
export const HONEYPOT_FIELD = "hp_check";
export const ELAPSED_FIELD = "elapsed_ms";

/** Contact needs a message, a reason and a tick — nobody does that in 3s. */
export const CONTACT_MIN_FILL_MS = 3000;
/** Email-only forms can be filled by autofill plus one click. */
export const EMAIL_FORM_MIN_FILL_MS = 1500;

export type BotTrapValues = {
  [HONEYPOT_FIELD]: string;
  [ELAPSED_FIELD]: number;
};

/**
 * True when a submission carries a bot signal. Missing fields are allowed
 * through on purpose: a visitor whose tab still runs JS from before this
 * shipped would otherwise lose their message silently. Direct API scripts
 * are left to the Vercel Firewall rate limit (and Turnstile, later).
 */
export function isLikelyBot(data: unknown, minFillMs: number): boolean {
  if (typeof data !== "object" || data === null) return false;
  const record = data as Record<string, unknown>;

  const honeypot = record[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;

  const elapsed = record[ELAPSED_FIELD];
  return typeof elapsed === "number" && elapsed < minFillMs;
}
