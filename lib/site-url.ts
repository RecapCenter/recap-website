/**
 * The public site origin, from NEXT_PUBLIC_SITE_URL, always without a
 * trailing slash — so `${SITE_URL}/about` never becomes `…//about`, which
 * search engines treat as a different page from `/about`.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");
