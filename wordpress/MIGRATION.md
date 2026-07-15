# Migration notes — plugin refactor

What changed when `recap-headless-bridge.php` was split into modules and the admin experience was cleaned up, and exactly what it means for the frontend and for any WordPress content that already exists.

## Breaking (required a matching frontend change — already applied)

### Recommendation image: Featured Image → ACF `image` field

**Before**: `Recommendation`'s image came from the native Featured Image box, read via `_embedded['wp:featuredmedia'][0].source_url` (required `?_embed=true`).
**After**: Image is its own required ACF field (`acf.image.url`). The `recommendation` post type no longer supports Featured Image at all (`supports` dropped `'thumbnail'`), so `_embedded['wp:featuredmedia']` will never be populated for this post type again.

**Why**: The spec explicitly asked to hide Featured Image for Recommendations and use a dedicated Image field instead, for a cleaner single-panel edit screen.

**Frontend change made**: `lib/wordpress/types.ts` (`WPRecommendationRaw.acf.image`) and `lib/wordpress/recommendations.ts` (`mapRecommendation` now reads `raw.acf.image?.url` instead of `_embedded`) were updated to match. No component changes were needed — `RecommendationCard` already just consumes `Recommendation.imageUrl`.

**If you have existing Recommendation content**: any recommendation published before this change had its image set via Featured Image — that image is **not** automatically copied into the new `image` field. Re-upload/re-select the image on each existing Recommendation post after updating the plugin, or it will render with no image until you do.

## Breaking-if-unaddressed, but zero-risk today (no real content exists yet)

### Excerpt-derived description → dedicated ACF `description` field

**Before**: `Freebie.description` and `LabResource.description` fell back to (`LabResource`) or partially used (`Freebie`) the native `excerpt.rendered` REST field. `Recommendation.description` used **only** `excerpt.rendered`, with no ACF field at all.
**After**: All three post types support an explicit "Short Description" / "Description" ACF `description` textarea field instead, and no longer support the native Excerpt box at all (`supports` dropped `'excerpt'`). Since `'excerpt'` is no longer a supported feature, **the REST API stops returning the `excerpt` property for these three post types entirely** (this is standard WP core REST-schema behavior, not something this plugin does explicitly).

**Why**: The spec asked to hide the Excerpt box for Freebies and Recommendations. Doing that while a mapper still read `raw.excerpt.rendered` would throw at runtime (accessing `.rendered` on an undefined `excerpt`), so a dedicated field was the only safe path — and applying the same fix to Lab Resources keeps all three consistent.

**Frontend change made**: `lib/wordpress/types.ts` removed `excerpt: WPRendered` from `WPFreebieRaw`, `WPRecommendationRaw`, and `WPLabResourceRaw`; the three `map*()` functions now read `raw.acf.description ?? ""` instead.

**Why this is zero-risk right now**: `WORDPRESS_API_URL` isn't set in any environment yet (per `docs/wordpress-integration-audit.md`), so there is no live content anywhere depending on the old excerpt-based behavior. If you *have* since created real WordPress content using the old plugin version, copy each item's Excerpt text into its new Description field before deploying this update.

## Additive (new fields/taxonomies, no existing behavior changes)

- **`freebie_category` taxonomy** (new) — Freebies now categorize via a real taxonomy (Worksheets, Guides, Templates, Assessments, Checklists, E-books, seeded automatically) instead of having no category concept at all. `Freebie.category` was added to the frontend's domain type; `FreebieCard` doesn't render it yet (see README "Known gaps").
- **`gallery_category` taxonomy** (new) — registered and exposed in REST (`show_in_rest: true`, `?_embed` gives term names), but **not yet consumed by the frontend** — no `GalleryItem.category` field was added. This resolves a tension in the original spec (§1 said Gallery should show only Title/Media Type/Media/Caption/Order; §7 separately asked for a Gallery Categories taxonomy to exist). The taxonomy exists and is fully usable in wp-admin and over REST; wiring it into the frontend's `GalleryItem` type is a follow-up, not done here.
- **`category_names` REST field** (new, all three) — a plain array of term-name strings alongside each taxonomy's existing ID-array property, for consumers that don't want to resolve IDs via `_embed`. Purely additive.
- **Freebie thumbnail is now optional** (was required) — relaxes a validation constraint only; `FreebieCard` already guarded for a missing thumbnail, so no frontend change was needed.
- **`recap_terms_seeded` option renamed to `recap_seeded_taxonomies`** (an array, keyed per taxonomy, instead of one flat boolean) — the old option is deleted automatically on first load after upgrading; re-seeding is idempotent either way, so no terms are duplicated or lost.

## Not changed

- Native WordPress **Posts** (Thinking Out Loud) — untouched, as required.
- REST bases (`gallery`, `freebies`, `recommendations`, `lab-resources`) — unchanged.
- ACF field names that already existed (`media_type`, `photo`, `video_file`, `video_url`, `video_thumbnail`, `caption`, `display_order`, `pdf_file`, `external_link`, `resource_type`, `thumbnail`, `resource_file`) — unchanged.
- The revalidation webhook's request shape (`{ postType, slug?, action }`) and the frontend's `/api/revalidate` route — unchanged; no Next.js route changes were needed for this refactor.
- `recommendation_category`'s existing seeded terms (Books, Music, Research Papers) — kept; five more (Podcasts, Videos, Websites, Apps, Courses) were added to the seed list, additively.

## Summary of files touched

**WordPress plugin** (`wordpress/mu-plugins/`): the single `recap-headless-bridge.php` file was split into a thin loader plus 8 files under `recap-headless-bridge/` (`helpers.php`, `post-types.php`, `taxonomies.php`, `acf-fields.php`, `options-page.php`, `admin-ux.php`, `rest-api.php`, `revalidation.php`).

**Frontend** (`lib/wordpress/`): `types.ts`, `freebies.ts`, `recommendations.ts`, `lab.ts` — updated to match the two breaking REST changes above and the new `Freebie.category` field. No changes were needed in `lib/wordpress/client.ts`, `config.ts`, `revalidation.ts`, `posts.ts`, `gallery.ts`, `lib/wordpress/index.ts`, or `app/api/revalidate/route.ts`, or in any `components/` or `app/**/page.tsx` file.

---

## Addendum — homepage featured posts (additive, later change)

A second, later change added two ACF fields to native **Posts** (Thinking Out Loud) — `featured_on_homepage` (true/false) and `homepage_display_order` (number) — plus a new `homepage-featured.php` module making `?featured_on_homepage=true` a queryable REST filter. See `README.md`'s "Homepage featured posts" section for the full behavior.

**Purely additive**: Posts previously had no ACF fields at all (`WPPostRaw` had no `acf` key); this adds one (`acf.featured_on_homepage`, `acf.homepage_display_order`), it doesn't remove or rename anything. Every existing published post simply defaults to `featured_on_homepage: false` until an editor opts it in.

**Frontend**: `lib/wordpress/types.ts` (`WPPostRaw.acf`), `lib/wordpress/posts.ts` (`BlogPost.featuredOnHomepage`/`homepageDisplayOrder`, new `getFeaturedHomepagePosts()`), `components/home/thinking-out-loud-card.tsx` (rewritten — was a solid-color text tile with no image field at all; now shows the post's featured image with the title overlaid), and `components/home/thinking-out-loud-section.tsx` (now an async Server Component fetching real posts instead of six hardcoded tile labels) were all updated. No other page/route was touched, and the blog listing page (`/thinking-out-loud`) and detail pages are entirely unaffected — they still show every published post via the existing `getPosts()`/`getPostBySlug()`, independent of this flag.
