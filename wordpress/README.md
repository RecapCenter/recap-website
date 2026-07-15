# WordPress setup (headless CMS)

This folder holds the WordPress-side code the Next.js frontend depends on. WordPress is used **only** as a content API here — no theme, no public-facing pages, no frontend rendering. Everything the site displays comes from `lib/wordpress/*` in the main app calling WordPress's REST API.

> Upgrading from the single-file version of this plugin? Read [MIGRATION.md](MIGRATION.md) first — it documents every REST response change from this refactor.

## Plugin architecture

The plugin is a thin loader, `mu-plugins/recap-headless-bridge.php`, that requires nine small, single-purpose files from `mu-plugins/recap-headless-bridge/`:

| File | Responsibility |
|---|---|
| `helpers.php` | Shared low-level utilities: the revalidation webhook sender, shared CPT registration defaults, and the taxonomy-term-seeding helper. Loaded first — every other file calls into this one. |
| `post-types.php` | Registers the four custom post types and their image sizes. |
| `taxonomies.php` | Registers the three category taxonomies and seeds their starter terms. |
| `acf-fields.php` | Registers every ACF field group — one function per post type, so each is easy to find and edit independently. Also adds the two "Homepage Settings" fields to native Posts. |
| `homepage-featured.php` | Makes `featured_on_homepage` a queryable REST filter on the native Posts endpoint (see "Homepage featured posts" below). |
| `options-page.php` | Registers the (currently empty) "Site Settings" ACF Options Page — infrastructure for later. |
| `admin-ux.php` | wp-admin cleanup that `supports` alone can't do (currently just hiding the Slug meta box). |
| `rest-api.php` | Adds the `category_names` convenience field to REST responses. |
| `revalidation.php` | Fires the on-demand revalidation webhook on publish/update and on taxonomy term changes. |

Why a subfolder instead of one big file: must-use plugins don't autoload subdirectories (WordPress only scans `.php` files directly inside `mu-plugins/`), so the loader `require_once`s each module explicitly, in dependency order. This keeps every concern in its own file — registering a new field type doesn't mean scrolling through revalidation logic — while still deploying as a single must-use plugin with nothing to "activate."

**Design principle behind every CPT**: `supports` is `['title']` only. Every other piece of content — images, files, descriptions, categories — lives on an ACF field group or a real taxonomy, never a native WordPress meta box. That's what makes each edit screen show exactly the fields relevant to that content type instead of a generic WordPress post editor.

## Custom Post Types

| CPT slug | REST base | Purpose | Taxonomy |
|---|---|---|---|
| `gallery_item` | `gallery` | Photos/videos for `/gallery` | `gallery_category` |
| `freebie` | `freebies` | Downloadable PDFs for `/freebies` | `freebie_category` |
| `recommendation` | `recommendations` | Items for `/recap-recommends` | `recommendation_category` |
| `lab_resource` | `lab-resources` | Not consumed yet — `/recap-lab` is still a static "coming soon" page | — |

Native WordPress **Posts** need no changes — they already power `/thinking-out-loud` as-is and aren't touched by this plugin.

## Taxonomies

| Taxonomy | Attached to | Seeded terms |
|---|---|---|
| `gallery_category` | `gallery_item` | None — add your own under **Gallery Items → Gallery Categories** |
| `freebie_category` | `freebie` | Worksheets, Guides, Templates, Assessments, Checklists, E-books |
| `recommendation_category` | `recommendation` | Books, Podcasts, Music, Research Papers, Videos, Websites, Apps, Courses |

Seeding is idempotent (`taxonomies.php`'s `recap_seed_taxonomy_terms()`) — adding a new term to the list and re-deploying only creates what's missing, it never duplicates or removes terms an editor has already changed.

## ACF field groups

Every field is registered in PHP (`acf-fields.php`), not clicked together in the ACF UI, so the definitions live in version control next to the TypeScript types they mirror (`lib/wordpress/types.ts` in the frontend repo). Requires the free ACF plugin — REST exposure via `show_in_rest` doesn't need ACF PRO.

**Gallery Item Details** (`gallery_item`)
| Field | Type | Notes |
|---|---|---|
| `media_type` | select (Image / Video) | Required; drives conditional logic below |
| `photo` | image | Shown only when Media Type = Image |
| `video_file` | file (mp4/mov/webm) | Shown only when Media Type = Video; optional if using `video_url` instead |
| `video_url` | url | Shown only when Media Type = Video |
| `video_thumbnail` | image | Required when Media Type = Video |
| `caption` | textarea | Optional |
| `display_order` | number | Optional — lower shows first |

**Freebie Details** (`freebie`)
| Field | Type | Notes |
|---|---|---|
| `pdf_file` | file (pdf) | Required |
| `thumbnail` | image | Optional |
| `description` | textarea | Optional |

**Recommendation Details** (`recommendation`)
| Field | Type | Notes |
|---|---|---|
| `image` | image | Required — replaces the native Featured Image box |
| `description` | textarea | Optional |
| `external_link` | url | Required |

**Lab Resource Details** (`lab_resource`)
| Field | Type | Notes |
|---|---|---|
| `resource_type` | select (Assessment / Quiz / Resource) | Required |
| `thumbnail` | image | Optional |
| `resource_file` | file | Optional |
| `description` | textarea | Optional |

**Homepage Settings** (native `post` — Thinking Out Loud)
| Field | Type | Notes |
|---|---|---|
| `featured_on_homepage` | true/false | Default off. When on, this post is eligible for the homepage's "Thinking Out Loud" preview |
| `homepage_display_order` | number | Optional, only shown when Show on Homepage is on. Lower shows first; blank sorts last (by publish date) |

## Homepage featured posts

The homepage never shows "the latest posts" — only posts an editor has explicitly opted in via **Show on Homepage**, ordered by **Homepage Display Order** (ties, and any post left blank, fall back to publish date, newest first). This is deliberate: it decouples "what's newest" (the blog listing page) from "what we want to feature right now" (the homepage), so an old evergreen post can stay featured indefinitely without editing the blog listing at all.

`homepage-featured.php` makes this queryable over REST: `GET /wp-json/wp/v2/posts?featured_on_homepage=true` returns only flagged posts (translated into a `meta_query` under the hood — see the file for how). The frontend's `getFeaturedHomepagePosts()` (`lib/wordpress/posts.ts`) calls this, then sorts the (typically small) result set by `homepage_display_order` in JS rather than asking WordPress to `ORDER BY` a nullable meta column — simpler and avoids NULL-handling edge cases in SQL for a field that's often left blank.

The homepage itself (`components/home/thinking-out-loud-section.tsx`) shows at most 6 featured posts, image + title only (no excerpt/category/date/author — see the component for the full card treatment), each linking straight to its `/thinking-out-loud/[slug]` detail page. It's independent of the full blog listing page, which continues to show every published post regardless of this flag.

## REST endpoints

| Endpoint | Notes |
|---|---|
| `GET /wp-json/wp/v2/gallery` | `?_embed` for `gallery_category` term names via `wp:term` |
| `GET /wp-json/wp/v2/freebies` | `?_embed` for `freebie_category` term names via `wp:term` |
| `GET /wp-json/wp/v2/recommendations` | `?_embed` for `recommendation_category` term names via `wp:term` |
| `GET /wp-json/wp/v2/lab-resources` | Not yet called by the frontend |
| `GET /wp-json/wp/v2/posts?featured_on_homepage=true` | Custom collection filter — see "Homepage featured posts" above |
| `GET /wp-json/wp/v2/posts`, `/categories` | Native — unchanged otherwise |
| `GET /wp-json/wp/v2/gallery_category`, `/freebie_category`, `/recommendation_category` | Taxonomy term lists |
| `POST /api/revalidate` *(on the Next.js side)* | Webhook target — see "On-demand revalidation" below |

Every post response also carries a `category_names` field (plain array of term-name strings) as a convenience alongside the taxonomy's own ID-array property — see `rest-api.php`.

## On-demand revalidation

Unchanged in shape from before this refactor: `revalidation.php` hooks `transition_post_status` (fires on first publish, on later edits to an already-published item, and on unpublish/trash) and `created_term`/`edited_term` for the three category taxonomies, and POSTs to your Next.js site's `/api/revalidate` route. Both hooks now share one HTTP-sending helper, `recap_send_revalidate_webhook()` (`helpers.php`), instead of duplicating the `wp_remote_post()` call.

## Future extension guide

- **Adding a field to an existing CPT**: add an entry to that CPT's `fields` array in the matching `recap_register_*_fields()` function in `acf-fields.php`, then add the matching key to that content type's `WP*Raw` type and `map*()` function in `lib/wordpress/types.ts` / `lib/wordpress/<type>.ts` on the frontend.
- **Adding a new CPT**: add a `register_post_type()` call in `post-types.php` (reuse `recap_cpt_defaults()`), an ACF field group function in `acf-fields.php`, and if it needs its own category, a `register_taxonomy()` call in `taxonomies.php`.
- **Populating Site Settings**: `options-page.php` already registers the options page (menu slug `recap-site-settings`). Add field groups the same way `acf-fields.php` does, but with `'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'recap-site-settings']]]` instead of a post-type location rule. This is the intended home for Contact Details, Social Links, Footer content, and other sitewide settings described in `docs/wordpress-integration-audit.md`.
- **A new taxonomy needs an admin-column/seeded-terms treatment**: follow the `freebie_category`/`recommendation_category` pattern in `taxonomies.php` — register with `show_admin_column => true`, seed via `recap_seed_terms_once()`.

## Setup

### 1. Get a WordPress instance

Any standard WordPress host works, since we only need `wp-json` reachable over HTTPS. Pick whichever matches your ops preference:

- **Managed WP hosting** (WP Engine, Kinsta, Pressable, SiteGround, etc.) — least maintenance, REST API works out of the box.
- **A generic VPS/managed server** with WordPress installed manually (LAMP/LEMP) — more control, more upkeep.
- **Local by Flywheel / DDEV / wp-env** for local development, ngrok/Cloudflare Tunnel to expose it to your Next.js dev server if you need to test the webhook round-trip before deploying either side.

Whichever you choose, note the site's REST base — it's always `https://<your-wp-site>/wp-json/wp/v2`.

### 2. Install required plugins

1. **Advanced Custom Fields** (free version — https://wordpress.org/plugins/advanced-custom-fields/). No PRO license needed; every field type used here (image, file, text, url, select, textarea, number) and REST exposure via `show_in_rest` are all in the free tier.
2. That's it. No separate "ACF to REST API" add-on, no CPT UI plugin — post types, taxonomies, and field groups are all registered in code, not through the admin UI, so they're versioned and reproducible.

### 3. Install the bridge plugin

Copy **both** this repo's `wordpress/mu-plugins/recap-headless-bridge.php` **and** the `wordpress/mu-plugins/recap-headless-bridge/` folder into your WordPress installation's must-use plugins directory, preserving the relative structure:

```
wp-content/mu-plugins/recap-headless-bridge.php
wp-content/mu-plugins/recap-headless-bridge/helpers.php
wp-content/mu-plugins/recap-headless-bridge/post-types.php
wp-content/mu-plugins/recap-headless-bridge/taxonomies.php
wp-content/mu-plugins/recap-headless-bridge/acf-fields.php
wp-content/mu-plugins/recap-headless-bridge/homepage-featured.php
wp-content/mu-plugins/recap-headless-bridge/options-page.php
wp-content/mu-plugins/recap-headless-bridge/admin-ux.php
wp-content/mu-plugins/recap-headless-bridge/rest-api.php
wp-content/mu-plugins/recap-headless-bridge/revalidation.php
```

Must-use plugins load automatically — there's nothing to "activate" in wp-admin. (If `wp-content/mu-plugins/` doesn't exist yet, just create it.)

### 4. Add the revalidation constants

In your WordPress site's `wp-config.php`, add (above the `/* That's all, stop editing! */` line):

```php
define('RECAP_REVALIDATE_URL', 'https://your-nextjs-site.com/api/revalidate');
define('RECAP_REVALIDATE_SECRET', 'generate-a-long-random-string-here');
```

Use a real random value for the secret (e.g. `openssl rand -hex 32`) — it's a shared password between WordPress and the frontend, not meant to be memorable. Keeping it in `wp-config.php` rather than a DB option/settings page keeps it out of wp-admin and out of any database export.

### 5. Configure the Next.js frontend

In the frontend's `.env.local` (copy from `.env.example`):

```
WORDPRESS_API_URL=https://your-wp-site.com/wp-json/wp/v2
WORDPRESS_REVALIDATE_SECRET=<the exact same string from wp-config.php>
WORDPRESS_MEDIA_HOSTNAME=your-wp-site.com
```

`WORDPRESS_MEDIA_HOSTNAME` is whatever domain WordPress actually serves media from — usually the same as your WP site, but different if you've offloaded uploads to S3/a CDN. It's read at **build time** by `next.config.ts`'s `images.remotePatterns`, so redeploy after changing it.

Restart `next dev` (or redeploy) after setting these.

### 6. Verify it end-to-end

1. In wp-admin, confirm you see **Gallery Items**, **Freebies**, **Recommendations**, and **Lab Resources** in the left sidebar (in that order), each showing only its own ACF fields on the edit screen — no Content Editor, Excerpt, Featured Image, Discussion, Author, Custom Fields, Revisions, or Slug boxes.
2. Under **Freebies → Freebie Categories** and **Recommendations → Recommendation Categories**, confirm the starter terms listed above already exist.
3. Create one item of each type (mark it **Published**, with a category where applicable), then visit e.g. `https://your-wp-site.com/wp-json/wp/v2/gallery` in a browser — you should see JSON with an `acf` key containing your field values and a `category_names` array.
4. Visit the frontend's `/gallery`, `/freebies`, `/recap-recommends`, and `/thinking-out-loud` — they should now show real content instead of their empty states.
5. Edit a published item in wp-admin and save — within a few seconds the corresponding frontend page should reflect the change without a redeploy (the `transition_post_status` webhook firing). If it doesn't, check your WP server's outbound HTTP isn't blocked, and that `RECAP_REVALIDATE_URL`/`WORDPRESS_REVALIDATE_SECRET` match exactly on both sides.

## Known gaps to revisit once real content exists

- Recap Lab has no CPT wired into its page yet (`getLabResources()` exists in `lib/wordpress/lab.ts` but is unused) — the page is intentionally still a static "coming soon" until that scope is defined.
- No dedicated Gallery icon asset exists on the frontend yet.
- `gallery_category` has no seeded starter terms — add your own once you know how you want to organize the gallery.
- The frontend doesn't yet render `category`/`category_names` for Freebies or Gallery anywhere in the UI (the data is there — `Freebie.category` in `lib/wordpress/freebies.ts` — just not shown on `FreebieCard` yet).
