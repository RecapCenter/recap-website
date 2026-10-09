import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/http";
import { emailOnlySchema } from "@/lib/validation/contact";
import {
  NewsletterUnavailableError,
  callNewsletterBridge,
} from "@/lib/newsletter";

/**
 * Footer newsletter ("the slow letter") signup. Validates the email and
 * hands it to MailPoet via the WordPress bridge, which sends MailPoet's
 * confirmation email (double opt-in).
 */
export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const result = emailOnlySchema.safeParse(body.data);
  if (!result.success) {
    return NextResponse.json(
      {
        error:
          result.error.issues[0]?.message ?? "Enter a valid email address.",
      },
      { status: 400 },
    );
  }

  try {
    await callNewsletterBridge("subscribe", { email: result.data.email });
  } catch (error) {
    console.error("Newsletter signup failed", error);
    const unavailable = error instanceof NewsletterUnavailableError;
    return NextResponse.json(
      {
        error: unavailable
          ? "Signups aren't available right now. Please try again later."
          : "Couldn't sign you up right now. Please try again shortly.",
      },
      { status: unavailable ? 503 : 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
