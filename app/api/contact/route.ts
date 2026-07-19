import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { contactFormSchema } from "@/lib/validation/contact";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = contactFormSchema.safeParse(body);
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
