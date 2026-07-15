<?php
/**
 * Homepage "Thinking Out Loud" featured posts.
 *
 * Lets the frontend ask the native Posts REST endpoint for only the posts
 * an editor has flagged via the "Show on Homepage" ACF field, with
 * `GET /wp/v2/posts?featured_on_homepage=true`. Final ordering (by
 * `homepage_display_order`, falling back to publish date) happens on the
 * frontend — see lib/wordpress/posts.ts's getFeaturedHomepagePosts() —
 * since that field is optional/nullable and sorting a small, curated list
 * in JS avoids a NULL-handling ORDER BY on a meta column.
 *
 * @package Recap_Headless_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers `featured_on_homepage` as a documented, validated REST
 * collection parameter for the Posts endpoint (so it appears in the
 * endpoint's schema rather than being a silent/undocumented query param).
 *
 * @param array        $query_params Existing collection params.
 * @param WP_Post_Type $post_type    The post type being registered for.
 * @return array
 */
function recap_add_featured_on_homepage_param( array $query_params, WP_Post_Type $post_type ): array {
	if ( 'post' !== $post_type->name ) {
		return $query_params;
	}

	$query_params['featured_on_homepage'] = array(
		'description' => 'Limit results to posts flagged for the homepage "Thinking Out Loud" section.',
		'type'        => 'boolean',
	);

	return $query_params;
}
add_filter( 'rest_post_collection_params', 'recap_add_featured_on_homepage_param', 10, 2 );

/**
 * Translates `?featured_on_homepage=true` into a meta_query against the
 * ACF true/false field of the same name — ACF stores true/false fields as
 * ordinary post meta ('1' for true), so this is a standard meta_query, not
 * anything ACF-specific.
 *
 * @param array           $args    WP_Query args being built for this request.
 * @param WP_REST_Request $request The incoming REST request.
 * @return array
 */
function recap_filter_posts_by_featured_on_homepage( array $args, WP_REST_Request $request ): array {
	if ( ! $request->get_param( 'featured_on_homepage' ) ) {
		return $args;
	}

	$args['meta_query'] = array(
		array(
			'key'     => 'featured_on_homepage',
			'value'   => '1',
			'compare' => '=',
		),
	);

	return $args;
}
add_filter( 'rest_post_query', 'recap_filter_posts_by_featured_on_homepage', 10, 2 );
