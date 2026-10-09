import { NextResponse } from "next/server";
import { CONTACT_MIN_FILL_MS, isLikelyBot } from "@/lib/bot-trap";
import { sendContactEmail } from "@/lib/email";
import { readJsonBody } from "@/lib/http";
import { contactFormSchema } from "@/lib/validation/contact";

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  if (isLikelyBot(body.data, CONTACT_MIN_FILL_MS)) {
    // Same answer as a real success, so bots learn nothing; no email or PII logged.
    console.warn("Dropped likely bot submission to /api/contact");
    return NextResponse.json({ ok: true });
  }
  if (!body.data) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = contactFormSchema.safeParse(body.data);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Invalid form data" },
      { status: 400 },
    );
  }

  const { name, email, phone, reason, message, agreed } = result.data;

  try {
    await sendContactEmail({ name, email, phone, reason, message, agreed });
  } catch (error) {
    console.error("Failed to send contact form email", error);
    return NextResponse.json(
      { error: "Couldn't send your message right now. Please try again shortly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
