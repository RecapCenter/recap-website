import { wordpressConfig } from "@/lib/wordpress/config";

const FETCH_TIMEOUT_MS = 8000;

export class NewsletterUnavailableError extends Error {}

/**
 * Forwards a newsletter action server-to-server to the WordPress bridge
 * (wordpress/mu-plugins/recap-headless-bridge/newsletter.php), which talks
 * to MailPoet. Sends the shared secret so the bridge only accepts calls
 * from this site; the secret never reaches the browser.
 *
 * Throws NewsletterUnavailableError when WordPress isn't configured here,
 * and a plain Error when WordPress or MailPoet reject the request.
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
    throw new Error(
      `Newsletter ${action}: WordPress responded ${response.status} ${await response.text()}`,
    );
  }
}
