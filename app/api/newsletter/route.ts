import { NextResponse } from "next/server";
import { wordpressConfig } from "@/lib/wordpress/config";
import { emailOnlySchema } from "@/lib/validation/contact";

const FETCH_TIMEOUT_MS = 8000;

/**
 * Footer newsletter ("the slow letter") signup. Validates the email, then
 * forwards it server-to-server to the WordPress bridge endpoint
 * (wordpress/mu-plugins/recap-headless-bridge/newsletter.php), which adds it
 * to MailPoet and sends MailPoet's confirmation email. The shared secret
 * stays on the server, so the WordPress endpoint can't be called directly.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = emailOnlySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error:
          result.error.issues[0]?.message ?? "Enter a valid email address.",
      },
      { status: 400 },
    );
  }

  const apiUrl = wordpressConfig.apiUrl;
  const secret = wordpressConfig.revalidateSecret;
  if (!apiUrl || !secret) {
    console.error(
      "Newsletter signup: WORDPRESS_API_URL or WORDPRESS_REVALIDATE_SECRET is not set",
    );
    return NextResponse.json(
      { error: "Signups aren't available right now. Please try again later." },
      { status: 503 },
    );
  }

  // WORDPRESS_API_URL points at /wp-json/wp/v2; the bridge lives at /wp-json/recap/v1.
  const endpoint = `${apiUrl.replace(/\/wp\/v2$/, "")}/recap/v1/subscribe`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-recap-secret": secret },
      body: JSON.stringify({ email: result.data.email }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error(
        `Newsletter signup: WordPress responded ${response.status}`,
        await response.text(),
      );
      throw new Error(`WordPress responded ${response.status}`);
    }
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return NextResponse.json(
      { error: "Couldn't sign you up right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
