import { NextResponse } from "next/server";
import { unsubscribeSchema } from "@/lib/validation/contact";
import {
  NewsletterUnavailableError,
  callNewsletterBridge,
} from "@/lib/newsletter";

/**
 * /unsubscribe page submission: removes the address from "The Slow Letter"
 * list in MailPoet and records the reason in wp-admin (Unsubscribe
 * Reasons). The response is the same whether or not the address was
 * subscribed, so the page can't be used to check who is on the list.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = unsubscribeSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Please check the form." },
      { status: 400 },
    );
  }

  const { email, reason, note } = result.data;

  try {
    await callNewsletterBridge("unsubscribe", { email, reason, note });
  } catch (error) {
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
