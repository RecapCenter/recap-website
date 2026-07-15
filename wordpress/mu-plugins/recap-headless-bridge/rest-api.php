<?php
/**
 * REST helpers.
 *
 * ACF field groups already expose their fields under the `acf` key
 * automatically (acf-fields.php's `show_in_rest`), and each taxonomy
 * already exposes its term IDs under its own REST property
 * (taxonomies.php's `show_in_rest`). This file adds one small convenience
 * on top of that: a `category_names` field with plain term-name strings,
 * so API consumers don't have to resolve taxonomy term IDs themselves via
 * `_embed`. It's purely additive — it sits alongside, not instead of, each
 * taxonomy's native REST property.
 *
 * @package Recap_Headless_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the `category_names` convenience field for every Recap post
 * type that has a category taxonomy.
 *
 * @return void
 */
function recap_register_rest_fields(): void {
	recap_register_category_names_field( 'gallery_item', 'gallery_category' );
	recap_register_category_names_field( 'freebie', 'freebie_category' );
	recap_register_category_names_field( 'recommendation', 'recommendation_category' );
}
add_action( 'rest_api_init', 'recap_register_rest_fields' );

/**
 * Adds a `category_names` field (array of term-name strings) to a post
 * type's REST response, for the given taxonomy.
 *
 * @param string $post_type Post type slug.
 * @param string $taxonomy  Taxonomy slug attached to that post type.
 * @return void
 */
function recap_register_category_names_field( string $post_type, string $taxonomy ): void {
	register_rest_field(
		$post_type,
		'category_names',
		array(
			'get_callback' => function ( array $post ) use ( $taxonomy ) {
				$terms = get_the_terms( $post['id'], $taxonomy );

				if ( ! is_array( $terms ) ) {
					return array();
				}

				return wp_list_pluck( $terms, 'name' );
			},
			'schema'       => array(
				'type'    => 'array',
				'items'   => array( 'type' => 'string' ),
				'context' => array( 'view', 'edit' ),
			),
		)
	);
}
