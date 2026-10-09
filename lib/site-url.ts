/**
 * The public site origin (no trailing slash, so `${SITE_URL}/about` never
 * becomes `…//about`). The single source for metadataBase, canonical URLs,
 * Open Graph, robots.txt and sitemap.xml.
 *
 * Production builds (VERCEL_ENV=production) fail outright unless
 * NEXT_PUBLIC_SITE_URL is the real https domain: a missing or wrong value
 * would otherwise ship canonical tags and a sitemap pointing search
 * engines at localhost or the *.vercel.app alias. Vercel keeps serving the
 * last good deployment when a build fails, so this can't take the site
 * down. Previews fall back to their own deployment URL, local dev to
 * localhost.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  // NODE_ENV too: `vercel env pull` writes VERCEL_ENV=production into
  // .env.local, and `next dev` shouldn't refuse to start because of it.
  if (
    process.env.VERCEL_ENV === "production" &&
    process.env.NODE_ENV === "production"
  ) {
    const problem = productionUrlProblem(raw);
    if (problem) {
      throw new Error(
        `NEXT_PUBLIC_SITE_URL ${problem}. Set it to the live domain (e.g. https://recapcenter.com) in Vercel's Production environment.`,
      );
    }
    return new URL(raw!).origin;
  }

  if (raw && URL.canParse(raw)) return new URL(raw).origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function productionUrlProblem(raw: string | undefined): string | null {
  if (!raw) return "is not set";
  if (!URL.canParse(raw)) return `is not a valid URL ("${raw}")`;

  const url = new URL(raw);
  if (url.protocol !== "https:") return `must use https ("${raw}")`;
  if (["localhost", "127.0.0.1", "0.0.0.0"].includes(url.hostname)) {
    return `points at a local address ("${raw}")`;
  }
  if (url.hostname.endsWith(".vercel.app")) {
    return `points at a *.vercel.app alias instead of the real domain ("${raw}")`;
  }
  return null;
}

export const SITE_URL = resolveSiteUrl();
