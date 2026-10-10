import { wordpressConfig } from "@/lib/wordpress/config";

const FETCH_TIMEOUT_MS = 8000;

export class NewsletterUnavailableError extends Error {}

/**
 * WordPress answered but refused the request. `code` is the WP_Error code
 * (e.g. "recap_invalid_unsubscribe_link"), so routes can turn specific
 * refusals into helpful messages instead of a generic failure.
 */
export class NewsletterRejectedError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string | null,
  ) {
    super(message);
    this.name = "NewsletterRejectedError";
  }
}

/**
 * Forwards a newsletter action server-to-server to the WordPress bridge
 * (wordpress/mu-plugins/recap-headless-bridge/newsletter.php), which talks
 * to MailPoet. Sends the shared secret so the bridge only accepts calls
 * from this site; the secret never reaches the browser.
 *
 * Throws NewsletterUnavailableError when WordPress isn't configured here,
 * NewsletterRejectedError when WordPress or MailPoet refuse the request, and
 * a plain Error when it can't be reached at all.
 */
export async function callNewsletterBridge(
  action: "subscribe" | "unsubscribe",
  body: Record<string, string>,
): Promise<void> {
  const apiUrl = wordpressConfig.apiUrl;
  const secret = wordpressConfig.revalidateSecret;
  if (!apiUrl || !secret) {
    throw new NewsletterUnavailableError(
      "WORDPRESS_API_URL or WORDPRESS_REVALIDATE_SECRET is not set",
    );
  }

  // WORDPRESS_API_URL points at /wp-json/wp/v2; the bridge lives at /wp-json/recap/v1.
  const endpoint = `${apiUrl.replace(/\/wp\/v2$/, "")}/recap/v1/${action}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-recap-secret": secret },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    let code: string | null = null;
    try {
      code = (JSON.parse(text) as { code?: string }).code ?? null;
    } catch {
      // Not JSON (e.g. a proxy error page) — keep code null.
    }
    throw new NewsletterRejectedError(
      `Newsletter ${action}: WordPress responded ${response.status} ${text.slice(0, 300)}`,
      response.status,
      code,
    );
  }
}
