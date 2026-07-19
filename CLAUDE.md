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
- Eyebrow labels / handwritten accents: `font-script` (Caveat).
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

**Decorative accents**

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

**Shared components to reuse rather than reinvent**

`SectionHeading`, `Button`, `Card`, `IconBadge`, `EyebrowLabel`,
`DecorativeBlob`, `PageIntro`, `CTABanner`.

---

## Git Commits

- Write clear, concise commit messages that explain why the change was made.
- Do NOT add a "Co-Authored-By: Claude" (or similar AI co-author) trailer to
  commits in this repo.

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
