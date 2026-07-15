<?php
/**
 * Shared low-level helpers used across the plugin's other modules.
 *
 * @package Recap_Headless_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Whether the revalidation webhook is configured (both wp-config.php
 * constants present). Every caller that wants to notify the frontend
 * should check this first rather than duplicating the defined() checks.
 *
 * @return bool
 */
function recap_revalidate_is_configured(): bool {
	return defined( 'RECAP_REVALIDATE_URL' ) && defined( 'RECAP_REVALIDATE_SECRET' );
}

/**
 * Fire-and-forget POST to the Next.js revalidate endpoint. Centralizes the
 * wp_remote_post() call so the post-status and term-change hooks in
 * revalidation.php don't each duplicate the request shape.
 *
 * @param array $payload JSON-serializable body for the request.
 * @return void
 */
function recap_send_revalidate_webhook( array $payload ): void {
	if ( ! recap_revalidate_is_configured() ) {
		return;
	}

	wp_remote_post(
		RECAP_REVALIDATE_URL,
		array(
			'timeout'  => 3,
			'blocking' => false,
			'headers'  => array(
				'Content-Type'               => 'application/json',
				'x-recap-revalidate-secret'  => RECAP_REVALIDATE_SECRET,
			),
			'body'     => wp_json_encode( $payload ),
		)
	);
}

/**
 * Shared register_post_type() args for every headless CPT this plugin
 * defines. All four post types have the same posture: editable in
 * wp-admin, reachable over REST, invisible on any public WordPress-rendered
 * front end (Next.js is the site's only front end, so `public` stays
 * false). `supports` is deliberately just `title` — every other field an
 * editor sees comes from an ACF field group (acf-fields.php), not a native
 * meta box, so each screen only shows what's actually relevant to that
 * content type. Individual CPTs merge in their own labels/rest_base/icon.
 *
 * @return array<string, mixed>
 */
function recap_cpt_defaults(): array {
	return array(
		'public'             => false,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'show_in_rest'       => true,
		'publicly_queryable' => true,
		'supports'           => array( 'title' ),
	);
}

/**
 * Seed a taxonomy's starter terms once per taxonomy, tracked in a single
 * option so re-running (e.g. after adding a new term to the list) only
 * creates what's missing rather than re-checking everything from scratch.
 * term_exists() still guards each individual insert, so this is safe to
 * call repeatedly even without the option cache.
 *
 * @param string   $taxonomy Registered taxonomy slug.
 * @param string[] $terms    Term names to ensure exist.
 * @return void
 */
function recap_seed_terms_once( string $taxonomy, array $terms ): void {
	$seeded = get_option( 'recap_seeded_taxonomies', array() );

	if ( ! empty( $seeded[ $taxonomy ] ) ) {
		return;
	}

	foreach ( $terms as $term ) {
		if ( ! term_exists( $term, $taxonomy ) ) {
			wp_insert_term( $term, $taxonomy );
		}
	}

	$seeded[ $taxonomy ] = true;
	update_option( 'recap_seeded_taxonomies', $seeded );
}
