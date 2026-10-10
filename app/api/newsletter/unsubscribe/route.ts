import { NextResponse } from "next/server";
import { EMAIL_FORM_MIN_FILL_MS, isLikelyBot } from "@/lib/bot-trap";
import { readJsonBody } from "@/lib/http";
import { unsubscribeSchema } from "@/lib/validation/contact";
import {
  NewsletterRejectedError,
  NewsletterUnavailableError,
  callNewsletterBridge,
} from "@/lib/newsletter";

const INVALID_LINK_MESSAGE =
  "This unsubscribe link isn't valid. Please use the link in your most recent slow letter, or write to hello@recapcenter.com and we'll remove you.";

/**
 * /unsubscribe page submission: removes the address from "The Slow Letter"
 * list in MailPoet and records the reason in wp-admin (Unsubscribe
 * Reasons). Requires the signature from the emailed link — WordPress checks
 * it, so nobody can unsubscribe an address they don't receive mail at. The
 * response is the same whether or not the address was subscribed, so the
 * page can't be used to check who is on the list.
 */
export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  if (isLikelyBot(body.data, EMAIL_FORM_MIN_FILL_MS)) {
    // Same answer as a real success, so bots learn nothing; no email or PII logged.
    console.warn(
      "Dropped likely bot submission to /api/newsletter/unsubscribe",
    );
    return NextResponse.json({ ok: true });
  }

  const result = unsubscribeSchema.safeParse(body.data);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Please check the form." },
      { status: 400 },
    );
  }

  const { email, token, reason, note } = result.data;

  try {
    await callNewsletterBridge("unsubscribe", { email, token, reason, note });
  } catch (error) {
    if (
      error instanceof NewsletterRejectedError &&
      error.code === "recap_invalid_unsubscribe_link"
    ) {
      return NextResponse.json(
        { error: INVALID_LINK_MESSAGE },
        { status: 400 },
      );
    }
    console.error("Newsletter unsubscribe failed", error);
    const unavailable = error instanceof NewsletterUnavailableError;
    return NextResponse.json(
      {
        error: unavailable
          ? "Unsubscribing isn't available right now. Please try again later."
          : "Couldn't unsubscribe you right now. Please try again shortly.",
      },
      { status: unavailable ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
