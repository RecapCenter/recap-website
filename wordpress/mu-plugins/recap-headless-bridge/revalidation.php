<?php
/**
 * On-demand revalidation.
 *
 * Notifies the Next.js frontend's POST /api/revalidate whenever a
 * Recap-managed post type crosses in or out of "publish", or a relevant
 * taxonomy term changes, so the corresponding page revalidates within
 * seconds instead of waiting on a time-based refresh. Requires
 * RECAP_REVALIDATE_URL and RECAP_REVALIDATE_SECRET in wp-config.php (see
 * wordpress/README.md) — recap_send_revalidate_webhook() (helpers.php)
 * silently no-ops if either is missing.
 *
 * @package Recap_Headless_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Post types whose publish/update events should ping the frontend.
 * Native `post` (Thinking Out Loud) is included even though this plugin
 * doesn't register it, since the frontend's revalidate route keys its
 * cache tags off the same `postType` values.
 *
 * @return string[]
 */
function recap_revalidate_post_types(): array {
	return array( 'post', 'gallery_item', 'freebie', 'recommendation', 'lab_resource' );
}

/**
 * Fires the webhook when a Recap-managed post transitions into or out of
 * "publish" (covers first publish, later edits while published, and
 * unpublish/trash).
 *
 * @param string  $new_status New post status.
 * @param string  $old_status Previous post status.
 * @param WP_Post $post       The post being transitioned.
 * @return void
 */
function recap_notify_revalidate( string $new_status, string $old_status, WP_Post $post ): void {
	if ( $new_status === $old_status && 'publish' !== $new_status ) {
		return;
	}

	if ( ! in_array( $post->post_type, recap_revalidate_post_types(), true ) ) {
		return;
	}

	if ( 'publish' !== $new_status && 'publish' !== $old_status ) {
		return;
	}

	recap_send_revalidate_webhook(
		array(
			'postType' => $post->post_type,
			'slug'     => $post->post_name,
			'action'   => 'publish' === $new_status ? 'publish' : 'update',
		)
	);
}
add_action( 'transition_post_status', 'recap_notify_revalidate', 10, 3 );

/**
 * Maps a taxonomy slug to the `postType` value the frontend's revalidate
 * route expects, since a taxonomy doesn't have a "post type" of its own —
 * it just needs to invalidate whichever content type's cache tag depends
 * on that taxonomy's term list.
 *
 * @param string $taxonomy Taxonomy slug.
 * @return string|null
 */
function recap_taxonomy_revalidate_post_type( string $taxonomy ): ?string {
	$map = array(
		'category'                 => 'post',
		'recommendation_category'  => 'recommendation',
		'freebie_category'         => 'freebie',
		'gallery_category'         => 'gallery_item',
	);

	return $map[ $taxonomy ] ?? null;
}

/**
 * Fires the webhook when a term in a Recap-managed taxonomy is created or
 * edited (e.g. a new Freebie Category), since the frontend caches
 * category lists under the same tag as the content type they belong to.
 *
 * @param int    $term_id Term ID (unused, but required by the hook signature).
 * @param int    $tt_id   Term taxonomy ID (unused, but required by the hook signature).
 * @param string $taxonomy Taxonomy slug.
 * @return void
 */
function recap_notify_revalidate_term( $term_id, $tt_id, string $taxonomy ): void {
	$post_type = recap_taxonomy_revalidate_post_type( $taxonomy );

	if ( null === $post_type ) {
		return;
	}

	recap_send_revalidate_webhook(
		array(
			'postType' => $post_type,
			'action'   => 'update',
		)
	);
}
add_action( 'created_term', 'recap_notify_revalidate_term', 10, 3 );
add_action( 'edited_term', 'recap_notify_revalidate_term', 10, 3 );
