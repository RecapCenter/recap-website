/**
 * The slow letter (newsletter) is switched off: visitors are pointed to
 * Recap's WhatsApp channel and socials instead. All the newsletter code
 * stays in place — set NEXT_PUBLIC_NEWSLETTER_ENABLED=true in Vercel and
 * redeploy to bring back the signup forms, the /unsubscribe page, the API
 * routes and the newsletter wording in the privacy policy and FAQ.
 */
export const NEWSLETTER_ENABLED =
  process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === "true";
