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
 * ACF's built-in `show_in_rest` exposure returns the raw stored value for
 * image/file fields (the attachment ID) rather than applying the field's
 * `return_format` setting — that setting only takes effect for `get_field()`
 * calls in PHP, not ACF's own REST serialization. Every image/file field
 * this plugin defines uses `return_format => array` (see acf-fields.php) so
 * the frontend can read `.url` directly, so each one needs its REST value
 * overwritten with the properly formatted array.
 *
 * @return void
 */
function recap_fix_acf_media_fields(): void {
	if ( ! function_exists( 'get_field' ) ) {
		return;
	}

	recap_register_acf_media_fix( 'gallery_item', array( 'photo', 'video_file', 'video_thumbnail' ) );
	recap_register_acf_media_fix( 'freebie', array( 'pdf_file', 'thumbnail' ) );
	recap_register_acf_media_fix( 'recommendation', array( 'image' ) );
	recap_register_acf_media_fix( 'lab_resource', array( 'thumbnail', 'resource_file' ) );
}
add_action( 'rest_api_init', 'recap_fix_acf_media_fields' );

/**
 * Re-formats a post type's image/file ACF fields in its REST response,
 * replacing the raw attachment ID ACF exposes by default with the
 * `return_format => array` value `get_field()` would return.
 *
 * @param string   $post_type Post type slug.
 * @param string[] $fields    ACF field names (image/file type) to reformat.
 * @return void
 */
function recap_register_acf_media_fix( string $post_type, array $fields ): void {
	add_filter(
		"rest_prepare_{$post_type}",
		function ( WP_REST_Response $response, WP_Post $post ) use ( $fields ) {
			if ( ! isset( $response->data['acf'] ) || ! is_array( $response->data['acf'] ) ) {
				return $response;
			}

			foreach ( $fields as $field ) {
				$response->data['acf'][ $field ] = get_field( $field, $post->ID ) ?: null;
			}

			return $response;
		},
		10,
		2
	);
}

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
