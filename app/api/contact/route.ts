import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const VALID_REASONS = ["session", "workshop", "school", "other"];

type ContactRequestBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  reason?: unknown;
  message?: unknown;
  agreed?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactRequestBody | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const agreed = body.agreed === true;

  if (!name || name.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "A valid name is required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (phone.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: "Phone number is too long" }, { status: 400 });
  }
  if (reason && !VALID_REASONS.includes(reason)) {
    return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
  }
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "A message is required" }, { status: 400 });
  }
  if (!agreed) {
    return NextResponse.json(
      { error: "Consent to follow up is required" },
      { status: 400 },
    );
  }

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
