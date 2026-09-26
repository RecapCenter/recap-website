# RECAP Website

Redesign of the RECAP website. The supplied design screenshots are the
single source of truth: do NOT redesign sections, simplify layouts, replace
real images with placeholders, or invent new UI patterns. If a screenshot is
ambiguous, infer the missing parts while staying consistent with the
surrounding design and with the Design System rules below.

---

## Architecture

- Next.js 15 (App Router only, no `pages/`), Turbopack for dev/build.
- TypeScript, `strict: true`. Path alias `@/*` → repo root.
- Tailwind CSS v4, CSS-first config — all tokens live in `app/globals.css`
  (no `tailwind.config.js`). shadcn/ui (`style: base-nova`) + `@base-ui/react`
  (only `Dialog` is used from it).
- Framer Motion is the only animation library in active use. `gsap` is an
  unused dependency — do not add new GSAP code; use Framer Motion instead.
- Headless WordPress CMS via a hand-rolled typed REST client (`lib/wordpress/`).
- Forms: `react-hook-form` + `zod`. Email via `nodemailer`/SMTP.
- Deployed on Vercel, no `vercel.json` (zero-config Next.js detection).

## Commands

```bash
npm run dev          # Turbopack dev server
npm run build        # Turbopack production build
npm run start         # serve production build
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run format         # Prettier write
npm run format:check   # Prettier check
```

## Important Routes

| Route | Notes |
|---|---|
| `/` | Home — server components pulling live WP data (latest posts, gallery, reviews) |
| `/about`, `/services`, `/faq`, `/privacy`, `/terms` | Static |
| `/contact` | Static page + working enquiry form (see below) |
| `/reviews` | CMS `review` CPT + Google Business reviews, merged |
| `/thinking-out-loud`, `/thinking-out-loud/[slug]` | WordPress `posts` |
| `/gallery`, `/freebies`, `/recap-recommends` | WordPress CPTs |
| `/recap-lab` | Static "coming soon" — see Recap Lab Architecture |
| `/api/contact` | POST — sends enquiry email |
| `/api/revalidate` | POST — WP webhook, secret-authenticated |
| `sitemap.ts` / `robots.ts` | Must stay in sync with routes + dynamic post slugs — update when adding/removing a route |

---

## WordPress CMS Rules

- WordPress is content-only — read via REST, never rendered server-side.
  Do not migrate away from it.
- Dynamic/CMS-managed: Thinking Out Loud (native `posts`), Gallery, Freebies,
  Recap Recommends, Reviews, and (future) Recap Lab resources — each has its
  own CPT registered in `wordpress/mu-plugins/recap-headless-bridge/`.
- Static/hardcoded-in-repo: Home, About, Services, FAQ, Contact copy, Header,
  Footer. Do not wire these to WP unless explicitly asked.
- All WP reads go through `lib/wordpress/*` typed fetchers — one module per
  content type, each failing soft (empty array/`null`) on error so pages
  render an `EmptyState` instead of crashing. Follow this pattern for any new
  fetcher; never call `fetch()` against the WP API directly from a component.
- Revalidation is on-demand: WP calls `POST /api/revalidate` with
  `x-recap-revalidate-secret` on publish/update, which calls
  `revalidateTag`/`revalidatePath`. There's also a 60s time-based fallback in
  `wpFetch` — keep both; don't remove the fallback even if the webhook seems
  reliable.
- `next.config.ts`'s `images.remotePatterns` for WP media is gated on
  `WORDPRESS_MEDIA_HOSTNAME` being set at **build time** — if it's missing,
  every WP-hosted image silently fails to render. Verify it's set before
  debugging "images not loading" on a WP-backed page.
- Don't add public WP REST *write* endpoints for forms — see Contact/Enquiry
  Architecture below for the intended pattern.

## Recap Lab Architecture

- `/recap-lab` is intentionally a static "coming soon" page
  (`components/recap-lab/coming-soon-hero.tsx`, `preview-tiles.tsx`,
  `notify-form.tsx`). Do NOT build the real Lab application here.
- The real Lab product will live on a separate subdomain
  (`lab.recapcenter.com`) — this repo only needs to link out to it once it
  exists, not host it.
- `lib/wordpress/lab.ts` (a `lab_resource` CPT fetcher) already exists for
  when real Lab content is ready, but is intentionally not called by the
  page yet. Leave it disconnected until told to wire it up.
- The "Notify me" form is a client-only stub (local state, no submit
  endpoint) — don't assume it sends email like the contact form does.

## Contact / Enquiry Architecture

- `components/contact/contact-form.tsx` → `zod`-validated → `POST
  /api/contact` → `lib/email.ts` (`sendContactEmail`, nodemailer/SMTP) →
  founder's inbox. This is the full flow; there is no database or CRM.
- Validation is duplicated intentionally: client-side via
  `lib/validation/contact.ts`'s `contactFormSchema` (same schema reused for
  the client `useForm` resolver and the server-side `safeParse` in the API
  route) — keep both in sync, never trust client validation alone.
- Booking is intentionally manual: visitors submit the enquiry form and the
  founder follows up by hand. Do NOT build automated scheduling/booking.
- The footer newsletter form is a separate, unrelated client-only stub (no
  submit endpoint) — don't conflate it with the contact flow.

---

## Vercel Deployment Rules

- No `vercel.json` — rely on Next.js auto-detection. Don't add one unless a
  specific override is required.
- Required env vars: `NEXT_PUBLIC_SITE_URL`, `WORDPRESS_API_URL`,
  `WORDPRESS_MEDIA_HOSTNAME`, `WORDPRESS_REVALIDATE_SECRET`, `SMTP_HOST`,
  `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`. Optional: `SMTP_FROM_NAME`,
  `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` (reviews degrade gracefully to
  CMS-only without these).
- Static export (`output: 'export'`) must never be enabled — on-demand
  revalidation depends on a running Node server.
- Security headers are set in `next.config.ts` (`X-Content-Type-Options`,
  `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`) — don't
  remove or weaken them.

## Design System Rules

Contact page (`components/contact/*`) is the canonical typography/color/
spacing reference — match it rather than drifting back to older patterns.

- Headings: `font-serif` (Playfair Display), never `font-bold`, except large
  numeral badges/stats and saturated homepage CTA tiles. Body: `font-sans`
  (Inter). Eyebrows/handwritten accents: `font-script` (Caveat). `font-display`
  (Baloo 2) is retired — never reintroduce it.
- Use Tailwind's default `text-*`/`leading-*`/`tracking-*` scale; don't invent
  custom values.
- Color tokens live in `app/globals.css` (`--cream`/`--ink`/`--body-gray`,
  accent/pastel set). Never use `bg-white` for a full-section background —
  use `bg-cream`.
- Reuse shared components instead of rebuilding: `SectionHeading`, `Button`,
  `Card`, `IconBadge`, `EyebrowLabel`, `DecorativeBlob`, `PageIntro`,
  `CTABanner`, `Marquee`, `FAQAccordion`, `CategoryTabs`.
- Spacing: one continuous flow (hero + its own content) gets tight one-sided
  padding (`pb-8`/`pb-12/16`); reserve full `py-20/24` for genuine section
  breaks (e.g. before a `CTABanner`).
- Never change color/spacing/typography away from this system without being
  explicitly asked.

## Animation Rules

- Two shared primitives cover the whole site — use them, don't hand-roll
  `motion.div` variants elsewhere:
  - `FadeIn` (`components/motion/fade-in.tsx`) — scroll-in fade/slide-up,
    `viewport={{ once: true }}`. Use on every new section/card entrance.
  - `HoverLift` (`components/motion/hover-lift.tsx`) — `y: -6` hover lift
    for cards.
- `AnimatePresence` is the pattern for conditional UI (FAQ accordion, form
  error messages, lightbox transitions) — follow it for similar cases.
- Don't add a new animation library (GSAP, react-spring, etc.) for something
  Framer Motion already covers.

## 3D / Globe Performance Rules

- The only 3D/WebGL element is `components/home/globe-polaroids.tsx` (`cobe`),
  homepage-only, one `<canvas>` instance.
- Keep the existing performance guards: lazy-init via `ResizeObserver` until
  the canvas has real width, `devicePixelRatio` capped at 2, pause rotation
  while the user is dragging (`isPausedRef`).
- Marker images must be real, optimized assets — not hotlinked stock photos
  (current Unsplash placeholders are known debt, not a pattern to copy).
- Don't add a second WebGL/3D element to a page without profiling — one
  `cobe` globe is already the site's performance budget for this class of
  effect.

## Accessibility Rules

- Semantic HTML throughout; art-directed images that bake text into the
  artwork (e.g. the homepage hero) need a paired `sr-only` heading carrying
  the real semantics.
- Every form input: paired `<label>`, `aria-invalid`, `aria-describedby`
  pointing at its error element — follow `contact-form.tsx`'s pattern exactly
  for new fields.
- Invalid submits scroll to and focus the first errored field
  (`lib/validation/scroll-to-error.ts`) — reuse this for any new form.
- Keyboard support is required for anything interactive (lightbox arrow-key
  nav, dialog focus trap, accordion toggles) — don't ship a mouse-only
  interaction.
- Respect `prefers-reduced-motion` for any new scroll/hover animation.

## SEO Rules

- Every route needs its own `metadata` export (`title`, `description`) —
  don't rely on inheriting the root layout's default (currently the one gap:
  `app/page.tsx` has none).
- Root layout (`app/layout.tsx`) owns the default OpenGraph/Twitter card and
  `metadataBase` — per-page overrides should extend, not duplicate, it.
- `app/sitemap.ts` must include every static route plus dynamic blog slugs
  (via `getAllPostSlugs()`) — update it whenever a route is added or removed.
- No JSON-LD/structured data exists yet. If asked to add it, scope it
  narrowly (e.g. `Organization`/`LocalBusiness` on the root layout) rather
  than a sitewide overhaul.

## Security Rules

- Never expose SMTP credentials, `WORDPRESS_REVALIDATE_SECRET`, or Google
  Places API keys to the client — they're server-only env vars, read only in
  `lib/email.ts`, `app/api/revalidate/route.ts`, `lib/google-reviews.ts`.
- `/api/revalidate` must stay secret-header-authenticated
  (`x-recap-revalidate-secret`) — never make it a public/unauthenticated
  endpoint.
- Contact form data is validated with `zod` on both client and server — any
  new form must validate server-side too, not just via the client resolver.
- Any new use of `dangerouslySetInnerHTML` (currently only
  `components/thinking-out-loud/post-body.tsx` for WP post content) must stay
  scoped under the `.wp-content` CSS class and only render trusted WP output,
  never raw user input.
- Keep the security headers in `next.config.ts` intact (see Vercel rules).

---

## Git Workflow

- Write clear, concise commit messages that explain *why*, not just *what*.
- Do NOT add a "Co-Authored-By: Codex" (or similar AI co-author) trailer.
- Group related changes into one commit; give unrelated work its own commit
  rather than bundling a whole session together (e.g. split "new pages" from
  "image cleanup" from "form validation").

## Development Rules

Always: create reusable components, use Server Components where possible,
keep components small, use semantic HTML, ensure accessibility, optimize
images (`next/image` only, no raw `<img>` unless paired with `getImageProps`
for art-directed breakpoints), maintain responsiveness, follow the
screenshots exactly, follow the Design System rules above, and keep this file
updated when a change establishes or corrects a pattern.

Never: change colors/spacing/typography away from the Design System without
being explicitly asked, modernize the UI, or use placeholder assets when
originals exist.

The design screenshots take precedence over assumptions.
