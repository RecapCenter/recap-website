# RECAP Website

This repository contains the complete implementation of the RECAP website.

## Goal

Recreate the supplied design screenshots as accurately as possible.

The screenshots are the single source of truth.

Do NOT redesign any section.

Do NOT simplify layouts.

Do NOT replace images with placeholders.

Do NOT invent new UI patterns.

If a screenshot is ambiguous, infer the missing parts while staying consistent with the surrounding design.

---

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Headless WordPress CMS

---

## Design System Reference

The Contact page (`components/contact/*`) is the canonical reference for
typography, color, and spacing across the whole site. It was used to bring
every other page into alignment, so new work should match it rather than
drift back to old patterns.

**Typography**

- Headings/titles: `font-serif` (Playfair Display), regular weight — no
  `font-bold` on headings. Size tiers: hero `text-3xl md:text-5xl`, section
  `text-3xl md:text-4xl`, sub/card `text-2xl md:text-3xl` (see
  `components/ui/section-heading.tsx`).
- Body copy: `font-sans` (Inter), `text-base leading-relaxed` for paragraphs.
- Eyebrow labels / handwritten accents: `font-script` (Caveat),
  `text-2xl md:text-3xl` (24px → 30px) — Caveat's small letters need the
  extra size. `EyebrowLabel` already applies it.
- Form fields (inputs, selects, textareas, search) are never below
  `text-base` — iOS Safari zooms the page on focus of anything under 16px.
- FAQ answers are body copy (`text-base`), not captions. Blog post bodies
  (`.wp-content`) use `text-lg` for long-form reading. `text-sm` is for card
  descriptions/captions, `text-xs` for meta (dates, file sizes) — nothing
  smaller.
- `font-display` (Baloo 2) has been retired — do not reintroduce it. The only
  intentional exception to the "no bold headings" rule is large numeral
  badges/stats (e.g. About's stat numbers, timeline year circles, Services'
  step numbers) and saturated homepage CTA tiles (Quick Link grid, Knowledge
  Hub) — those keep `font-bold` since Contact has no equivalent element to
  extract a rule from.
- Font tokens: `--font-heading` (serif) and `--font-body` (sans) in
  `app/globals.css`. Rely on Tailwind's default `text-*`/`leading-*`/
  `tracking-*` scale rather than inventing custom values.

**Color**

- `--cream` / `--ink` / `--body-gray` are aligned to Contact's warm tones
  (`#fbf4ec` / `#2a2019` / `#8b7e70`). Accent colors (orange, red, lime,
  pastel blue/lavender/mustard/peach) are untouched by this system.
- Avoid `bg-white` for full-section backgrounds — use `bg-cream`, matching
  Contact's convention of never using pure white for a section wrapper.
- Intentional exception: the homepage Gallery section
  (`components/home/gallery-section.tsx`) is a dark band — scrolling photo
  columns under a black-to-grey gradient, with white copy and the
  `solid-accent` button — at the user's request.

**Decorative accents**

- `CTABanner` (`components/ui/cta-banner.tsx`), the closing banner on every
  page, is the "Set sail" design: full width, no card, centred copy over
  watercolour waves with the hero artwork's gold line (`--gold`) and a
  bobbing paper boat (`animate-bob`, still under reduced motion). It sits
  directly above the dark footer.
- `components/ui/decorative-blob.tsx` (soft blurred radial-gradient glows)
  is Contact's hero treatment, reused on other pages' hero/intro sections
  (`components/ui/page-intro.tsx`, About hero, Recap Lab hero).

**Spacing rhythm**

- Sections that are one continuous flow (e.g. a hero immediately followed by
  its own supporting content) use tight, one-sided padding like Contact does
  (`pb-8`, `pb-12/16`) — not a full `py-20/24` on both sides.
- Reserve the full `py-20/24` rhythm for genuine section breaks (e.g. before
  a closing `CTABanner`).
- A vivid/saturated hero background (unlike Contact's cream-on-cream hero)
  still needs real top padding on the section after it — a flush zero-gap
  seam only reads as "intentional" when both sides are the same neutral tone.

**Fixed, transparent navbar**

- The navbar (`components/layout/navbar.tsx`) is `fixed` on every page and
  device: transparent at the top, cream (`bg-cream/95` + blur + border) once
  scrolled or while the mobile menu is open. It takes no space in the flow.
- So every page's first section must add `var(--nav-height)` (defined in
  `app/globals.css`) to its top padding, e.g.
  `pt-[calc(var(--nav-height)+4rem)]` instead of `pt-16`. `PageIntro`, the
  About/Contact/Recap Lab heroes, the blog post page and 404 already do. The
  homepage hero is the one exception: its artwork deliberately runs under the
  bar.

**Thinking Out Loud thumbnails**

- Every place a post's featured image appears (homepage tiles, the
  `/thinking-out-loud` grid, related posts) uses
  `components/thinking-out-loud/post-thumbnail.tsx` inside a **square**
  frame: the image is shown whole with a blurred copy filling any gap. The
  blog grid is an even grid of identical `BlogCard`s (no oversized featured
  card). Recommended upload: square, ~1200×1200px.

**Shared components to reuse rather than reinvent**

`SectionHeading`, `Button`, `Card`, `IconBadge`, `EyebrowLabel`,
`DecorativeBlob`, `PageIntro`, `CTABanner`.

---

## Security & SEO Conventions

- **Site URL:** `lib/site-url.ts` (`SITE_URL`) is the only source of the
  public origin — never read `NEXT_PUBLIC_SITE_URL` directly or add a
  localhost fallback elsewhere. Production builds fail unless it's the real
  https domain.
- **Canonical URLs:** every indexable page sets
  `alternates: { canonical: "/route" }` in its own metadata (dynamic routes
  in `generateMetadata`). Never put a canonical — or `openGraph.url` — in
  the root layout: every page would inherit it and claim the homepage.
- **Public POST routes** (forms) read bodies with `readJsonBody()`
  (`lib/http.ts`: JSON only, 8 KB cap) and check `isLikelyBot()`
  (`lib/bot-trap.ts`) before validating. Their forms render
  `<BotTrapField>` and spread `useBotTrap().values()` into the request body
  (`components/ui/bot-trap.tsx`).
- **Share cards:** never set `title`/`description` inside the root
  layout's `openGraph`/`twitter` — every page would share with the
  homepage's text. Pages get og/twitter title and description from their
  own `title`/`description`. A page that sets its own `openGraph` replaces
  the layout's entirely, so it must repeat images/siteName (see the blog
  post page).
- **WordPress text in metadata:** use `titleText` / `description` from
  `BlogPost` (plain text via `lib/wordpress/text.ts`), never the raw
  `.rendered` HTML, or search results show codes like `&#8211;`.
- **Structured data** goes through `components/seo/json-ld.tsx`, which
  escapes `<` so CMS text can't break out of the script tag.
- **Analytics events** use `trackEvent()` (`lib/analytics.ts`) and must
  never include personal data (names, emails, phones, message text).
- **Favicon / app icons** (`app/favicon.ico`, `app/icon.svg`,
  `app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png`,
  `app/manifest.ts`) are generated from the Recap "R" vector by
  `node scripts/generate-icons.mjs`. Regenerate rather than hand-edit, and
  don't add an `icons` field to layout metadata (the file conventions
  already emit the tags; both would duplicate them).
- **Validation:** every string schema has a `.max()`, applied before any
  regex, and regexes must not have overlapping quantifiers (the old email
  regex was a ReDoS).

## Performance on iOS (WebKit)

Every iOS browser runs on WebKit, which lags where Android doesn't. Two
rules came out of fixing a laggy homepage on iPhones:

- **WebKit repaints a whole SVG when anything inside it changes.** Never
  mix a forever-looping animation with heavy static SVG content (filters,
  long text, big paths) in the same `<svg>`. The homepage hero is split
  into three stacked SVGs for this reason — static filtered art, a
  one-shot intro layer, and a tiny `hero-loop` layer for the boat/birds
  (`components/home/hero/hero-layouts.tsx`).
- **No render loop may run while off screen.** Anything driven by
  `requestAnimationFrame` (e.g. the cobe globe in
  `components/home/globe-polaroids.tsx`) must stop when it leaves the
  viewport (IntersectionObserver) and must not auto-animate under
  `prefers-reduced-motion`. Infinite CSS loops should pause off screen too
  (`HeroVisibility` sets `data-offscreen`).

---

## Git Commits

- Write clear, concise commit messages that explain why the change was made.
- Do NOT add a "Co-Authored-By: Claude" (or similar AI co-author) trailer to
  commits in this repo.
- Group related/similar changes into a single commit; give unrelated work its
  own separate commit rather than bundling everything from a session into
  one. When pushing accumulated changes, split them by topic (e.g. "new
  pages" vs "image cleanup" vs "form validation") instead of one giant
  catch-all commit.

---

## Development Rules

Always:

- create reusable components
- use Server Components where possible
- keep components small
- use semantic HTML
- ensure accessibility
- optimize images
- maintain responsiveness
- follow the screenshots exactly
- follow the Design System Reference above for typography/color/spacing
- keep this file updated: when a change establishes or corrects a pattern
  (a new shared component, a fixed inconsistency, a design-system decision),
  add or update the relevant section here so future work starts from the
  current understanding instead of rediscovering it

Never:

- change colors, spacing, or typography away from the Design System
  Reference above without being explicitly asked to
- modernize the UI
- use placeholder assets when originals exist

---

The design screenshots inside the design folder take precedence over assumptions.
