/**
 * Sends a Google Analytics event if GA is loaded (it only is when
 * NEXT_PUBLIC_GA_ID is set — see components/analytics/google-analytics.tsx),
 * and silently does nothing otherwise.
 *
 * Never pass personal data (names, emails, phone numbers, message text):
 * GA's terms forbid it and the privacy policy promises it doesn't happen.
 * Categories like a form's "reason" dropdown value are fine.
 */
type GtagParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: GtagParams) => void;
  }
}

export function trackEvent(name: string, params?: GtagParams): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
