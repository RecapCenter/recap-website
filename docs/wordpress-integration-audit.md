<!-- omit in toc -->
# Project Audit — Headless WordPress Integration (recap-website)

*Read-only inspection report. No files were modified to produce this document.*

---

## 1. Project Overview

| Item | Finding |
|---|---|
| Framework | Next.js **15.5.20** (exact pin, not a caret range) |
| React | **19.1.0** / react-dom 19.1.0 (exact pins) |
| Language | **TypeScript** (`typescript ^5`, `tsconfig.json` present, `strict: true`) |
| Package manager | **npm** (`package-lock.json` present; no yarn.lock/pnpm-lock.yaml) |
| Build tool | **Turbopack** — both `dev` and `build` scripts pass `--turbopack`; no webpack override |
| Router | **App Router** (`app/` directory; no `pages/` directory exists) |
| Tailwind CSS | **v4** (`@tailwindcss/postcss ^4`, CSS-first config in `app/globals.css`, no `tailwind.config.js/.ts`) |
| UI libraries | **shadcn/ui** (`style: "base-nova"`, config in `components.json`) on top of **@base-ui/react ^1.6.0** (headless primitives — currently only `Dialog` is used) |
| Animation | **Framer Motion ^12.42.2** (two shared wrapper primitives: `FadeIn`, `HoverLift`) + **cobe ^2.0.1** (WebGL interactive globe on the homepage) |
| Form libraries | **None** — all 3 forms are hand-rolled HTML forms with local `useState`, no React Hook Form/Formik/Zod |
| Icons | **lucide-react ^1.24.0**, plus a handful of hand-drawn inline SVGs (`value-icons.tsx`, `social-icons.tsx`) |
| CMS already integrated | **Partially.** No CMS npm package is installed; instead there's a hand-rolled headless WordPress REST integration already built: `lib/wordpress/*` (typed client + per-content-type fetchers), `app/api/revalidate/route.ts` (on-demand ISR webhook), and `wordpress/mu-plugins/recap-headless-bridge.php` + `wordpress/README.md` (the WP-side setup). This currently powers **4 of 9** routes: Gallery, Freebies, Recap Recommends, and Thinking Out Loud (+ its `[slug]` detail page). `WORDPRESS_API_URL` is not yet set anywhere, so no real WordPress instance is connected yet — every WP-backed page currently renders its empty state. |

---

## 2. Folder Structure

```
recap-website/
├── app/
│   ├── layout.tsx, page.tsx (home), globals.css
│   ├── error.tsx, not-found.tsx, favicon.ico
│   ├── sitemap.ts, robots.ts
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── freebies/page.tsx                    ← WP-backed
│   ├── gallery/page.tsx                     ← WP-backed
│   ├── recap-lab/page.tsx                   (static "coming soon")
│   ├── recap-recommends/page.tsx            ← WP-backed
│   ├── thinking-out-loud/page.tsx           ← WP-backed
│   │   └── [slug]/page.tsx                  ← WP-backed
│   └── api/revalidate/route.ts
│
├── components/
│   ├── home/          (11 files — hero, quick-links, services, thinking-out-loud teaser, globe, testimonials)
│   ├── about/          (9 files — hero, story, values, timeline, founder)
│   ├── contact/         (6 files — hero, mail card, form, social, FAQ)
│   ├── layout/          (4 files — navbar, footer, logo, newsletter form)
│   ├── recap-lab/       (3 files — coming-soon hero, preview tiles, notify form)
│   ├── thinking-out-loud/ (5 files — WP-backed)
│   ├── gallery/         (3 files — WP-backed)
│   ├── freebies/        (2 files — WP-backed)
│   ├── recap-recommends/ (2 files — WP-backed)
│   ├── ui/              (14 shared files — button, card, dialog, etc.)
│   └── motion/          (2 files — FadeIn, HoverLift, used almost everywhere)
│
├── lib/
│   ├── utils.ts
│   └── wordpress/       (client, config, types, revalidation, + 5 per-type fetchers)
│
├── assets/
│   ├── icons/           (12 SVGs — 4 unused, see §7)
│   └── images/          (home/, about/, + one hero cover — all local/static)
│
├── public/
│   ├── downloads/recap-overview.pdf
│   └── og-image.jpg
│
├── wordpress/            (WP-side setup: mu-plugin + install README)
├── page_ref/             (design screenshots — gitignored, local only)
└── *.md                  (CLAUDE.md, README.md, SITE_STRUCTURE.md, DESIGN_SYSTEM.md, WORDPRESS_CMS.md)
```

---

## 3. Installed Packages

**Framework**
- `next 15.5.20`, `react 19.1.0`, `react-dom 19.1.0`, `typescript ^5`

**UI**
- `shadcn ^4.13.0` (CLI/registry, style `base-nova`)
- `@base-ui/react ^1.6.0` (headless primitives — Dialog in use, others available unused)
- `class-variance-authority ^0.7.1`, `clsx ^2.1.1`, `tailwind-merge ^3.6.0`
- `tailwindcss ^4`, `@tailwindcss/postcss ^4`, `tw-animate-css ^1.4.0`

**Animation**
- `framer-motion ^12.42.2`
- `cobe ^2.0.1` (interactive WebGL globe, homepage only)

**Forms**
- None — no React Hook Form, Formik, Zod, or Yup. All 3 forms are plain controlled `<form>`s.

**Authentication**
- None present in the repo.

**Image**
- `next/image` exclusively (0 raw `<img>` tags found anywhere in the codebase)

**SEO**
- No dedicated package — handled via Next.js's built-in `Metadata`/`MetadataRoute` APIs (`app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`)

**Utilities**
- `clsx`, `tailwind-merge` (via the shared `cn()` helper in `lib/utils.ts`)

**API / Data fetching**
- No SWR/React Query/Apollo — WordPress data fetching is a hand-rolled `fetch()` wrapper (`lib/wordpress/client.ts`) using Next.js's native `fetch` cache + tag-based revalidation

**Icons**
- `lucide-react ^1.24.0`

**Dev tooling**
- `eslint ^9` + `eslint-config-next 15.5.20` (flat config via `@eslint/eslintrc`), `prettier ^3.9.5` + `prettier-plugin-tailwindcss ^0.8.0`, `@types/node`, `@types/react`, `@types/react-dom`

---

## 4. Website Pages

| Route | Component | Static / Dynamic |
|---|---|---|
| `/` | `app/page.tsx` | Static — no data fetching, no `metadata` export (inherits root layout's) |
| `/about` | `app/about/page.tsx` | Static — static `metadata` export |
| `/contact` | `app/contact/page.tsx` | Static — static `metadata` export |
| `/recap-lab` | `app/recap-lab/page.tsx` | Static "coming soon" — a WP fetcher (`lib/wordpress/lab.ts`) already exists but is **not called** by this page yet |
| `/gallery` | `app/gallery/page.tsx` | Dynamic — Server Component, reads `searchParams.type`, calls `getGalleryItems()` |
| `/freebies` | `app/freebies/page.tsx` | Dynamic — Server Component, calls `getFreebies()` |
| `/recap-recommends` | `app/recap-recommends/page.tsx` | Dynamic — reads `searchParams.category`, calls `getRecommendations()` |
| `/thinking-out-loud` | `app/thinking-out-loud/page.tsx` | Dynamic — reads `searchParams` (`q`, `category`, `page`), calls `getCategories()` + `getPosts()` |
| `/thinking-out-loud/[slug]` | `app/thinking-out-loud/[slug]/page.tsx` | Dynamic route with `generateStaticParams` (pre-renders known slugs) + `dynamicParams = true` (new slugs render on demand) + dynamic `generateMetadata` |
| `/api/revalidate` | `app/api/revalidate/route.ts` | API route (POST) — secret-authenticated webhook target for WordPress |
| *(global)* | `app/error.tsx`, `app/not-found.tsx` | Static |
| *(global)* | `app/sitemap.ts`, `app/robots.ts` | **Sitemap only lists `/`, `/about`, `/contact`** — does not include any of the 5 WP-backed routes or dynamic post slugs (flagged again in §18 Risks) |

**Dead link found:** the nav/footer/quick-links all reference `/services`, but no `app/services/` route exists — "Services" only lives as a section on the home page. This 404s today.

---

## 5. Components

### Static-content component groups (candidates for CMS migration)
- **`components/home/`** (11) — `hero-section`, `quick-link-grid` + `quick-link-card`, `services-section` + `arch-image-card`, `thinking-out-loud-section` + `thinking-out-loud-card` (a *homepage teaser*, distinct from the real WP-backed `/thinking-out-loud` page), `globe-section` + `globe-polaroids`, `testimonials-section` + `testimonial-card`.
- **`components/about/`** (9) — `hero-section`, `our-story-section`, `stat-card`, `timeline`, `values-section` + `value-card` + `value-icons`, `founder-section` + `pull-quote-card`.
- **`components/contact/`** (6) — `contact-hero`, `contact-mail-card`, `note-and-form-section`, `contact-form`, `social-card`, `faq-section`.
- **`components/layout/`** (4) — `navbar`, `footer`, `logo`, `newsletter-form`. Used on every page via the root layout.
- **`components/recap-lab/`** (3) — `coming-soon-hero`, `preview-tiles` (reuses About's `ValueCard`), `notify-form`.

### Already WordPress-backed component groups (no changes needed)
- **`components/thinking-out-loud/`** (5) — `blog-card`, `blog-filter-bar`, `blog-grid`, `post-body`, `related-posts`.
- **`components/gallery/`** (3) — `gallery-card`, `gallery-grid`, `lightbox`.
- **`components/freebies/`** (2) — `freebie-card`, `freebies-grid`.
- **`components/recap-recommends/`** (2) — `recommendation-card`, `recommendations-grid`.

### Shared/reusable primitives (`components/ui/`, 14 files)
`button`, `card`, `category-tabs`, `cta-banner`, `decorative-blob`, `dialog`, `empty-state`, `eyebrow-label`, `icon-badge`, `page-intro`, `search-bar`, `section-heading` (+`HighlightMark`/`CircleAnnotation`/`DashedArrow`), `social-icons`. `section-heading` and `eyebrow-label` are used on nearly every page; `cta-banner` is reused with different copy on 6 different pages.

### Shared motion primitives (`components/motion/`, 2 files)
`fade-in.tsx` (`FadeIn`) and `hover-lift.tsx` (`HoverLift`) — used on effectively every section and every card across the entire site.

---

## 6. Hardcoded Content

*(Static pages only — the 5 already-WP-backed pages are excluded here since their content already comes from `lib/wordpress/*`.)*

**Component: `components/home/hero-section.tsx`**
- Contains: sr-only H1 ("Realm of Counselling & Psychological Services — from managing chaos to developing perspective"), full-bleed hero image
- → Home Page

**Component: `components/home/quick-link-grid.tsx`**
- Contains: 7 tile labels + destination hrefs + colors + icons (About, Services*, Thinking Out Loud, Recap Lab, Gallery, Freebie, Recap Recommends) — *Services has no real page, see §4
- → Home Page

**Component: `components/home/services-section.tsx`**
- Contains: Heading "Services"; 3 service cards (Counseling, Special Education, Trainings) — **descriptions are literal leftover placeholder copy** ("2 bedrooms | 2 King beds | Up to 4 guests" — an Airbnb-listing template artifact, flagged with a `TODO` in the source)
- → Home Page

**Component: `components/home/thinking-out-loud-section.tsx` / `thinking-out-loud-card.tsx`**
- Contains: intro heading/body copy; 6 "post" tile labels (Imposter Syndrome, Human Resources System, Catastrophic Thinking, Learning & Development Community, Global News, Knowledge Hub) that all link generically to `/thinking-out-loud` rather than real per-post slugs
- → Home Page

**Component: `components/home/globe-section.tsx` / `globe-polaroids.tsx`**
- Contains: heading; 6 hardcoded location markers (San Francisco, New York, Tokyo, Sydney, Paris, London) using **Unsplash placeholder photo URLs**; a hardcoded link to `/downloads/recap-overview.pdf`
- → Home Page

**Component: `components/home/testimonials-section.tsx` / `testimonial-card.tsx`**
- Contains: heading "Straight from clients"; 3 testimonial cards — **all three share one placeholder Lorem-ipsum-style quote** (flagged `TODO` in source), placeholder names (Lillian Pratt, Nicholas Newark, Kyrie Rivera), stock avatar images, 5-star ratings
- → Home Page

**Component: `components/about/hero-section.tsx`**
- Contains: script label, heading, subtext, "keep scrolling" prompt
- → About Page

**Component: `components/about/our-story-section.tsx`**
- Contains: heading, 2 body paragraphs, 4 stats (10+ Years, 1,200+ Sessions, 40+ Schools, 6 Countries)
- → About Page

**Component: `components/about/timeline.tsx`**
- Contains: heading; 4 milestone entries (2015/2018/2021/2024, each with title + description)
- → About Page

**Component: `components/about/values-section.tsx` / `value-card.tsx`**
- Contains: heading; 4 value entries (Warmth first / Evidence, gently used / Ripple outward / Honest, not perfect), each with title + description + icon
- → About Page

**Component: `components/about/founder-section.tsx` / `pull-quote-card.tsx`**
- Contains: founder name/role (Dr. Reya Rao), photo, 2 bio paragraphs, 1 pull quote, 4 credential lines
- → About Page

**Component: `components/contact/contact-hero.tsx`**
- Contains: eyebrow, heading, subtext
- → Contact Page

**Component: `components/contact/contact-mail-card.tsx`**
- Contains: eyebrow, mailto link (`hello@recap.co`)
- → Contact Page

**Component: `components/contact/note-and-form-section.tsx`**
- Contains: eyebrow, heading, body copy, caption ("every note gets read")
- → Contact Page

**Component: `components/contact/social-card.tsx`**
- Contains: eyebrow, heading, body; 3 social links — **all `href="#"` placeholders** (Instagram, LinkedIn, WhatsApp)
- → Contact Page

**Component: `components/contact/faq-section.tsx`**
- Contains: eyebrow, heading; 4 hardcoded FAQ Q&A pairs
- → Contact Page

**Component: `components/layout/navbar.tsx`**
- Contains: 6 nav links (one, `/services`, is dead)
- → Every Page

**Component: `components/layout/footer.tsx`**
- Contains: tagline, newsletter label/subtext, 5 nav links (`/services` dead again), 3 social/action links (2 are `#` placeholders), bottom bar copyright/legal links (Privacy/Terms both `#`)
- → Every Page

**Component: `components/recap-lab/coming-soon-hero.tsx`**
- Contains: eyebrow, heading, subtext
- → Recap Lab Page

**Component: `components/recap-lab/preview-tiles.tsx`**
- Contains: 3 preview tiles (Assessments, Quizzes, Resources), each title + description
- → Recap Lab Page

**Component: `components/recap-lab/notify-form.tsx`**
- Contains: heading, subtext, button label
- → Recap Lab Page

**Component: `app/error.tsx` / `app/not-found.tsx`**
- Contains: static error/404 copy and button labels
- → Global

**CTA Banner instances (shared component, per-page copy)**
- Contains: 5 separate eyebrow/heading/subtext/button combinations, one per page that uses it (About, Recap Lab, Freebies, Recap Recommends, Thinking Out Loud ×2)
- → About, Recap Lab, Freebies, Recap Recommends, Thinking Out Loud pages

---

## 7. Images

**Local icons (`assets/icons/`, 12 files, all SVG)** — imported as static ES modules:
- In use: `about-logo.svg`, `case-stories-logo.svg`, `freebie-logo.svg`, `recap-lab-logo.svg`, `recap-logo.svg` (brand mark, navbar+footer), `recap-recommends-logo.svg`, `services-logo.svg`, `thinking-out-loud-logo.svg`
- **Unused** (candidates for removal or clarifying intent): `counselling-logo.svg`, `special-edu-logo.svg`, `training-logo.svg`, `rercap-logo.svg` (likely a typo'd duplicate of `recap-logo.svg`)

**Local images (`assets/images/`)**:
- `Recap-Cover-2560x1440-1.png` — homepage hero (`hero-section.tsx`)
- `home/service-counseling.png`, `home/service-special-education.png` (reused as `storyImage` in the homepage Thinking Out Loud teaser), `home/service-trainings.png` — Services section
- `home/testimonial-avatar-1/2/3.png` — testimonial avatars
- `about/founder-photo.png` — founder section

**Backgrounds**: none as separate asset files — backgrounds are CSS gradients defined inline (e.g. About hero's radial gradient, CTA banner's linear gradient).

**Videos**: none stored locally. One `<video>` element exists, in `components/gallery/lightbox.tsx`, rendering a remote `videoUrl` sourced dynamically from WordPress gallery items — no bundled video files anywhere in the repo.

**`public/`**: `downloads/recap-overview.pdf` (linked from the homepage globe section) and `og-image.jpg` (Open Graph/Twitter card image, referenced in `app/layout.tsx`). No favicon/manifest beyond `app/favicon.ico`.

**Image optimization**: 100% `next/image`, 0 raw `<img>` tags anywhere. CMS-sourced images (gallery/freebies/recommendations/blog) are already routed through `next/image`'s `remotePatterns`, gated on `WORDPRESS_MEDIA_HOSTNAME` being set (currently unset).

---

## 8. Data Sources

| Source type | Where |
|---|---|
| Hardcoded arrays/constants | Home (`SERVICES`, testimonial data, globe markers), About (stats, timeline milestones, values), Contact (FAQ array), Recap Lab (preview tiles) — all inline `const` arrays inside their component files |
| JSON files | None found |
| Markdown | Only used for project documentation (`CLAUDE.md`, `README.md`, `SITE_STRUCTURE.md`, `DESIGN_SYSTEM.md`, `WORDPRESS_CMS.md`, `wordpress/README.md`) — none of it is rendered content |
| API (WordPress REST) | 4 of 9 routes: Gallery, Freebies, Recap Recommends, Thinking Out Loud (+ detail page) via `lib/wordpress/*`. No real WP instance connected yet (`WORDPRESS_API_URL` unset) — all render their `EmptyState` currently. |
| Dummy/placeholder data | Testimonials (shared placeholder quote), Services section (leftover Airbnb-template copy), homepage "Thinking Out Loud" teaser (fake post titles linking generically to the blog index), globe markers (Unsplash stock photos), social links (`#` placeholders in Footer/Social Card) |

Everything not listed above (layout chrome, animation config, styling) is plain TSX/Tailwind, not data-driven at all.

---

## 9. Forms

| Form | Fields | Validation | Submission destination |
|---|---|---|---|
| **Contact Form** (`components/contact/contact-form.tsx`) | name (text, required), email (email, required), subject (text, optional), reason (select: session/workshop/school/other, optional), message (textarea, required), follow-up consent (checkbox-style radio, optional) | HTML5 `required`/`type="email"` only — no JS validation library, no pattern matching | **None.** `handleSubmit` only calls `preventDefault()` and flips a local "Sent!" UI state — no `fetch`/API call. Data is discarded. |
| **Newsletter Form** (`components/layout/newsletter-form.tsx`, in Footer) | email (email, required) | HTML5 only | **None.** Clears the field on submit, no API call, no success/error feedback. |
| **Notify Me Form** (`components/recap-lab/notify-form.tsx`) | email (email, required, `aria-label`) | HTML5 only | **None.** Sets local "You're on the list!" state, no API call. |

**No Quote Request or Career form exists.** All 3 existing forms are UI-only stubs with zero backend wiring — this is a gap independent of the WordPress integration, but a natural one to close in the same effort (e.g., a WP REST custom endpoint, or reusing the existing `/api/revalidate`-style Next.js API route pattern to proxy to WP or a mail service).

---

## 10. SEO

| Aspect | Finding |
|---|---|
| Metadata | Root layout (`app/layout.tsx`) sets `metadataBase`, `title.default`/`template` (template is bare `"%s"`, no site-name suffix), `description`, full OpenGraph object, Twitter card. `about` and `contact` pages set their own `title`/`description`. **Home page (`app/page.tsx`) has no `metadata` export at all** — it inherits the root default only. |
| Open Graph | Configured at the root layout level (title, description, url, siteName "Recap", `/og-image.jpg` 1200×630, locale `en_US`, type `website`) and per-post on the blog detail page (`generateMetadata` builds OG image from the post's featured image). Not overridden on About/Contact/Gallery/Freebies/Recommends/Recap Lab — they inherit the root OG image/description. |
| Robots | `app/robots.ts` — allow all, points to `/sitemap.xml`. |
| Sitemap | `app/sitemap.ts` — **only lists `/`, `/about`, `/contact`.** Does not include `/gallery`, `/freebies`, `/recap-recommends`, `/thinking-out-loud`, `/recap-lab`, or any dynamic blog post slugs. This is a real gap once real content exists. |
| Schema/JSON-LD | **None found anywhere in the codebase.** No structured data (Organization, LocalBusiness, Article, BreadcrumbList, etc.). |
| Canonical URLs | Not explicitly set on any page (relies implicitly on `metadataBase` + route path — no page sets `alternates.canonical`). |

---

## 11. Environment Variables

*(Names only, per instructions — no values.)*

- `NEXT_PUBLIC_SITE_URL`
- `WORDPRESS_API_URL`
- `WORDPRESS_REVALIDATE_SECRET`
- `WORDPRESS_MEDIA_HOSTNAME`

All four are declared in `.env.example`; a full-codebase grep for `process.env.` confirmed no other/undocumented env vars are read anywhere.

---

## 12. Deployment

| Aspect | Finding |
|---|---|
| Hosting config files | No `vercel.json`, `netlify.toml`, `Dockerfile`, or `.github/` CI workflows present. |
| Static export | Not configured — `next.config.ts` has no `output: 'export'`; `build`/`start` scripts assume a running Node server. |
| Node server | Implied default (`next start` after `next build --turbopack`). |
| Signals | `.gitignore` has a Vercel-specific ignore section (`.vercel`), suggesting Vercel is the anticipated target, but no actual Vercel project config is committed. |
| `next.config.ts` contents | Sets `poweredByHeader: false`, conditional `images.remotePatterns` (only populated when `WORDPRESS_MEDIA_HOSTNAME` is set, scoped to `/wp-content/uploads/**`), and a security-headers block (`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`). |

---

## 13. Dynamic Features

| Feature | Where |
|---|---|
| Scroll-triggered fade/slide-up animation | `components/motion/fade-in.tsx` (`FadeIn`) — used on virtually every section, every page |
| Hover-lift on cards | `components/motion/hover-lift.tsx` (`HoverLift`) — used on every card type across the site |
| Interactive 3D globe | `components/home/globe-polaroids.tsx` — `cobe`-powered WebGL globe, drag-to-rotate, auto-rotate, polaroid captions anchored to location markers (homepage only) |
| Accordion (FAQ) | `components/contact/faq-section.tsx` — 4-item toggle accordion, `useState` per item, animated chevron |
| Category/type filter tabs | `components/ui/category-tabs.tsx` — URL-query-param driven; used on Gallery (Photos/Videos), Recap Recommends (Books/Music/Research Papers), Thinking Out Loud (WP categories) |
| Search | `components/ui/search-bar.tsx` — debounced (350ms), syncs to `?q=` via the router; used only on the Thinking Out Loud list page |
| Pagination | `components/thinking-out-loud/blog-grid.tsx` — "Load more" link-based pagination (`?page=N+1`), not infinite scroll or numbered pages |
| Lightbox/modal | `components/ui/dialog.tsx` (thin `@base-ui/react` Dialog wrapper) + `components/gallery/lightbox.tsx` (the only consumer) — full-screen image/video viewer with prev/next, keyboard arrow-key nav, `AnimatePresence` crossfade |
| Mobile nav toggle | `components/layout/navbar.tsx` — hamburger menu, `useState`-driven |
| Counters/stat animation | **None** — the About page's stats (10+, 1,200+, etc.) are static text, not animated count-ups, despite looking like they could be |
| Carousel/slider | **None** — no dedicated slider library or component anywhere |

---

## 14. CMS Recommendation

Based on everything above, here's what should become WordPress-editable, organized by content type:

### Pages (content blocks within otherwise-static pages)
- **Home**: hero heading, Services section (heading + 3 service entries), homepage "Thinking Out Loud" teaser tiles (ideally replaced by *real* latest-post data from the already-existing `getPosts()` fetcher instead of separate hardcoded content), Globe section heading + the 6 location markers/captions, Testimonials heading + entries.
- **About**: hero copy, "Our Story" 2 paragraphs + 4 stats, Timeline milestones, Values (4 entries), Founder bio + credentials + pull quote.
- **Contact**: hero copy, mail card, "note" intro copy, FAQ entries, social links.
- **Recap Lab**: coming-soon hero copy, 3 preview tiles (until real Lab Resources content exists, at which point `lib/wordpress/lab.ts` — already written — takes over).

### Custom Post Types (already built, per `wordpress/mu-plugins/recap-headless-bridge.php`)
- `gallery_item`, `freebie`, `recommendation` (+ `recommendation_category` taxonomy), `lab_resource` — no changes needed here.

### New Custom Post Types to consider
- **Testimonials** — small, frequently-updated, naturally repeatable → CPT, not an Options Page field group.
- **Timeline Milestones** — repeatable, dated entries → CPT (or an ACF Repeater field on an Options Page if the timeline will always stay short/rarely reordered).
- **Team/Founders** — currently just one founder, but modeling as a CPT future-proofs multi-team-member growth.

### Global Settings (ACF Options Page)
- Site-wide contact info (email, social links — currently `#` placeholders in Footer/Social Card), Footer tagline/copyright, Services section (3 entries — could be an ACF Repeater on an Options Page since it's small and rarely reordered), Values (4 entries), FAQ (4 entries, or its own small CPT if it'll grow).

### Menus
- Primary nav (Navbar) and Footer nav — both currently hardcoded link arrays; WordPress's native Menus feature (exposed via `wp-json/wp/v2/menu-items` on WP 5.9+, or an ACF Options Page field) would let editors add/reorder/remove links without a deploy — directly fixes the dead `/services` link risk of drifting further out of sync.

### Testimonials, FAQs, Blog, Media
- **Testimonials**: see CPT recommendation above.
- **FAQs**: see Global Settings / CPT note above.
- **Blog**: already fully WordPress-native (`wp/v2/posts`) — no changes needed.
- **Media**: gallery/freebie/recommendation images already flow through WP's media library via ACF image/file fields — no changes needed.

---

## 15. Suggested WordPress Structure

Building on what already exists in `wordpress/mu-plugins/recap-headless-bridge.php`:

**Already registered** (no action needed): `gallery_item`, `freebie`, `recommendation` + `recommendation_category` taxonomy, `lab_resource`.

**New Custom Post Types to add**:
- `testimonial` — fields: `quote` (textarea), `author_name` (text), `author_role` (text, optional), `avatar` (image), `rating` (number, 1–5). REST base `testimonials`.
- `timeline_milestone` — fields: `year` (text/number), `title` (text), `description` (textarea), `display_order` (number). REST base `milestones`.
- `team_member` (optional, only if multi-founder growth is likely) — fields: `name`, `role`, `bio` (WYSIWYG), `photo` (image), `credentials` (repeater of text), `pull_quote` (textarea).

**New Taxonomies**: none required beyond the existing `recommendation_category`.

**New ACF Field Groups (Options Pages)** — one "Site Settings" options page (via `acf_add_options_page()`), with sub-groups:
- *Home Page*: hero heading; 3 `services` repeater rows (title, description, icon, image); globe section heading + `locations` repeater (city, photo, caption); homepage blog-teaser heading/subtext (the teaser tiles themselves ideally pull live from `wp/v2/posts` instead of separate fields).
- *About Page*: hero heading/subtext; "our story" 2 paragraphs; `stats` repeater (number, label); `values` repeater (title, description, icon choice); founder fields (name, role, photo, 2 bio paragraphs, pull quote, `credentials` repeater).
- *Contact Page*: hero heading/subtext; contact email; `faqs` repeater (question, answer); social links (Instagram/LinkedIn/WhatsApp URLs — replacing the current `#` placeholders).
- *Global*: footer tagline, footer legal links (Privacy/Terms URLs), primary nav + footer nav (or use native WP Menus instead — recommended, since Menus are purpose-built for this and editors already know the UI).
- *Recap Lab*: coming-soon hero copy; 3 `preview_tiles` repeater rows (until real Lab Resources exist).

**Menus**: register two native WP menu locations (`primary`, `footer`) via `register_nav_menus()`, exposed over REST via the core `wp/v2/menu` + `wp/v2/menu-item` endpoints (WP 5.9+) or the `wp-api-menus` plugin on older installs.

**Media**: no changes — already handled by ACF image/file fields on the existing CPTs, following the same pattern for any new fields above.

**Reusable Blocks**: not needed — this is a headless setup with no WP theme/block editor front-end rendering, so Gutenberg reusable blocks aren't relevant here; ACF Options Pages + CPTs serve the same "shared content" purpose over REST.

---

## 16. API Mapping

| Page | Section | Suggested WP endpoint |
|---|---|---|
| **Home** | Hero | Options Page → `/wp-json/acf/v3/options/home` (or a custom `register_rest_field` on a `general` options endpoint) |
| | Services | Options Page repeater field (`services`) |
| | Thinking Out Loud teaser | `/wp-json/wp/v2/posts?per_page=6&_embed` (reuse the **already-built** `getPosts()` fetcher instead of new fields) |
| | Globe locations | Options Page repeater field (`locations`) |
| | Testimonials | `/wp-json/wp/v2/testimonials` (new CPT) |
| **About** | Hero, Our Story, Founder | Options Page fields (`about.hero`, `about.our_story`, `about.founder`) |
| | Stats | Options Page repeater (`about.stats`) |
| | Timeline | `/wp-json/wp/v2/milestones` (new CPT) or Options Page repeater if it stays small |
| | Values | Options Page repeater (`about.values`) |
| **Contact** | Hero, mail card, note copy | Options Page fields (`contact.*`) |
| | FAQ | Options Page repeater (`contact.faqs`) |
| | Social links | Options Page fields (`social.instagram`, `social.linkedin`, `social.whatsapp`) |
| | Form submission | New: a Next.js API route (mirroring `app/api/revalidate/route.ts`'s pattern) that either POSTs to a WP custom REST endpoint that emails the site owner, or to a transactional email service — **not** a public WP REST write endpoint, to avoid spam/auth complexity |
| **Recap Lab** | Coming-soon copy, preview tiles | Options Page fields, until real content exists |
| | (future) real Lab content | `/wp-json/wp/v2/lab-resources` — **already fetchable** via `getLabResources()` in `lib/wordpress/lab.ts`, just not wired into the page yet |
| **Gallery** | Items | `/wp-json/wp/v2/gallery` — **already integrated** |
| **Freebies** | Items | `/wp-json/wp/v2/freebies` — **already integrated** |
| **Recap Recommends** | Items + categories | `/wp-json/wp/v2/recommendations` + `/wp-json/wp/v2/recommendation_category` — **already integrated** |
| **Thinking Out Loud** (+ detail) | Posts + categories | `/wp-json/wp/v2/posts` + `/wp-json/wp/v2/categories` — **already integrated** |
| **Navbar / Footer** | Nav links | `/wp-json/wp/v2/menu-items?menus=primary` / `?menus=footer` (native WP Menus, WP 5.9+) |

---

## 17. Components That Need Modification

*(Listed only — not modified, per instructions.)*

- `components/home/hero-section.tsx`
- `components/home/services-section.tsx`
- `components/home/thinking-out-loud-section.tsx`
- `components/home/thinking-out-loud-card.tsx`
- `components/home/globe-section.tsx`
- `components/home/globe-polaroids.tsx`
- `components/home/testimonials-section.tsx`
- `components/home/testimonial-card.tsx`
- `components/about/hero-section.tsx`
- `components/about/our-story-section.tsx`
- `components/about/stat-card.tsx` (consumer of new dynamic data, component itself likely unchanged)
- `components/about/timeline.tsx`
- `components/about/values-section.tsx`
- `components/about/founder-section.tsx`
- `components/contact/contact-hero.tsx`
- `components/contact/contact-mail-card.tsx`
- `components/contact/note-and-form-section.tsx`
- `components/contact/social-card.tsx`
- `components/contact/faq-section.tsx`
- `components/contact/contact-form.tsx` (needs a real submit handler, independent of CMS)
- `components/layout/navbar.tsx`
- `components/layout/footer.tsx`
- `components/layout/newsletter-form.tsx` (needs a real submit handler)
- `components/recap-lab/coming-soon-hero.tsx`
- `components/recap-lab/preview-tiles.tsx`
- `components/recap-lab/notify-form.tsx` (needs a real submit handler)
- `app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/recap-lab/page.tsx` (all need to become `async` Server Components that call new `lib/wordpress/*` fetchers, following the exact pattern already used in `app/gallery/page.tsx` etc.)
- `app/sitemap.ts` (needs to include the WP-backed routes + dynamic post slugs)

---

## 18. Risks

- **Animation + Server Components boundary**: `FadeIn`/`HoverLift` are already `"use client"` wrapper components used purely for presentation, so passing WP-fetched data as `children`/props into them (the same pattern the 4 already-integrated pages use) is low-risk and proven — no new pattern needed.
- **`dangerouslySetInnerHTML`**: `components/thinking-out-loud/post-body.tsx` already renders raw WP HTML this way — precedent exists, but expanding CMS-editable rich text elsewhere (e.g. About's founder bio, if it becomes a WYSIWYG field) should sanitize/scope it the same way (`.wp-content` CSS scoping already exists in `app/globals.css`).
- **Interactive globe with placeholder Unsplash images**: `globe-polaroids.tsx`'s 6 location markers currently hotlink Unsplash URLs directly — if these become CMS-editable, they should be genuine WP media (or licensed images), not a live dependency on an external stock-photo host.
- **Forms have zero backend today**: all 3 forms (Contact, Newsletter, Notify Me) are pure client-side stubs. Wiring them to WordPress means either (a) building custom WP REST write endpoints (more surface area to secure — rate limiting, spam/honeypot, validation) or (b) keeping form submission entirely separate from the "WordPress as read-only content API" model and using a transactional email service / a dedicated Next.js API route instead. This is a design decision, not just an integration task.
- **Sitemap incompleteness**: `app/sitemap.ts` only lists 3 static routes today. Once real CMS content exists (blog posts especially), this needs to dynamically enumerate WP-backed routes/slugs — an easy but easily-forgotten step.
- **Dead links**: `/services` (nav, footer, homepage quick-link) and 4 placeholder `#` social links (Footer, Contact's Social Card) will need real destinations once Menus/Options fields are wired up — otherwise CMS-driven menus will just make broken links *editable* rather than fixed.
- **`WORDPRESS_MEDIA_HOSTNAME` is a hard build-time dependency**: `next.config.ts` reads it at build time for `images.remotePatterns`; if it's ever unset or wrong in a given deploy environment, every WP-hosted image across Gallery/Freebies/Recommends/Blog/any newly-migrated section fails to render — this is already a known sharp edge, worth a deploy-time check/guard.
- **No client component overuse detected**: a scan of the codebase shows judicious `"use client"` usage (only where genuinely interactive: navbar toggle, forms, FAQ accordion, search bar, lightbox, globe) — pages themselves stay Server Components, which is the right shape for adding more `lib/wordpress/*` fetch calls without a rearchitecture.
- **Static export is not configured** (good) — since `next.config.ts` has no `output: 'export'`, ISR/on-demand revalidation (already built) will keep working as new pages are migrated; if someone later flips to static export for hosting reasons, the entire on-demand revalidation design would break and need rethinking.
- **Unused/typo'd assets** (`rercap-logo.svg`, 3 other unused icon SVGs) — low risk, but worth a cleanup pass so nobody mistakes them for the ones actually in use during CMS migration.

---

## 19. Final Summary

**Difficulty: Low–Medium.** The hard part of a headless WordPress integration — the data-fetching architecture, typed client, on-demand revalidation, and the WordPress-side custom-post-type/ACF setup — is **already built and working** for 4 of 9 routes. What remains (Home, About, Contact, Recap Lab's real content) is mechanically similar: new CPTs/Options Page fields on the WP side, new typed fetchers in `lib/wordpress/`, and turning 4 more `page.tsx` files into `async` Server Components — the exact pattern already proven in `app/gallery/page.tsx`.

**Estimated integration time** (assuming the WP backend itself — hosting, ACF, this repo's `wordpress/mu-plugins/recap-headless-bridge.php` — is provisioned separately per `wordpress/README.md`):
- WP-side: register 2–3 new CPTs + 1 Options Page with ~5 sub-groups of fields → **1–2 days** of PHP/ACF work, following the existing plugin's pattern.
- Frontend: 4 new/extended fetcher modules in `lib/wordpress/`, converting 4 pages to async Server Components, wiring real submit handlers for 3 forms → **3–5 days**, mostly mechanical given the established pattern.
- Content migration (typing all the existing hardcoded copy into WordPress) → **1–2 days**, editorial work more than engineering.
- Sitemap/menu/dead-link cleanup → **half a day**.
- **Total: roughly 1–1.5 weeks** for one developer, assuming the WP instance is already reachable.

**Potential blockers**:
1. No real WordPress instance is connected yet (`WORDPRESS_API_URL` unset) — nothing here can be verified end-to-end until one exists.
2. The forms-have-no-backend gap needs a product decision (WP REST write endpoint vs. separate email service) before it can be estimated precisely.
3. If the homepage's Thinking Out Loud teaser and the Globe's location data are meant to be genuinely dynamic (not just "editable defaults"), some product/design decisions are needed on exactly how much editorial control is wanted vs. simplicity.

**Best integration strategy**: Continue the incremental, page-by-page pattern already established — it's working. For each remaining page: (1) add the WP CPT/Options fields, (2) add a typed fetcher to `lib/wordpress/`, (3) convert the page to fetch real data behind the same `EmptyState`-on-failure safety net already used elsewhere, (4) keep the existing on-demand revalidation webhook as the single sync mechanism (no need for a second approach). Treat the 3 forms and the sitemap/dead-link cleanup as a separate, small workstream — they're unrelated to "making content CMS-editable" and shouldn't block that work.
