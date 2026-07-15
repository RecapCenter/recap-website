# Recap Website

Frontend for the Recap counselling, special education, and training practice.
Built with Next.js and Tailwind CSS, matching the design screenshots in
`page_ref/` and the reference PDF (both kept locally, not tracked in git).

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- TypeScript
- Tailwind CSS 4
- shadcn/ui + Radix primitives
- Framer Motion

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the dev server (Turbopack)      |
| `npm run build`        | Production build                      |
| `npm run start`        | Serve the production build            |
| `npm run lint`         | Run ESLint                            |
| `npm run typecheck`    | Run the TypeScript compiler (no emit) |
| `npm run format`       | Format the codebase with Prettier     |
| `npm run format:check` | Check formatting without writing      |

## Environment Variables

See [.env.example](.env.example). `NEXT_PUBLIC_SITE_URL` is required for
correct metadata, Open Graph tags, `robots.txt`, and `sitemap.xml` in
production.

## Project Structure

```
app/            Routes (App Router) — pages, layout, metadata, error/404
components/     UI components, grouped by page (home/about/contact) and
                shared (layout/motion/ui)
lib/            Shared utilities, incl. lib/wordpress/ (WP REST API client)
assets/         Source images/icons imported by components
public/         Static files served as-is (downloads, og-image)
page_ref/       Design reference screenshots (gitignored, local only)
wordpress/      WordPress-side setup (mu-plugin + install guide) — see
                wordpress/README.md
```

## Content Model

See [SITE_STRUCTURE.md](SITE_STRUCTURE.md) for the full page/section
breakdown, [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for visual language, and
[WORDPRESS_CMS.md](WORDPRESS_CMS.md) for the headless WordPress integration
(Home/About/Services/Header/Footer are static; blog, gallery, freebies,
recommendations, and lab content come from WordPress's REST API). For
setting up the actual WordPress backend, see
[wordpress/README.md](wordpress/README.md).
