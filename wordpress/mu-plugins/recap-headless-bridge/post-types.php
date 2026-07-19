<?php
/**
 * Custom post type registration.
 *
 * Only "Posts" (Thinking Out Loud) is native to WordPress and is
 * intentionally left untouched by this plugin. Gallery, Freebies, Recap
 * Recommends, Recap Lab, and Reviews each get their own post type here so
 * editors get a dedicated wp-admin screen carrying only the fields
 * relevant to that content type (see helpers.php's recap_cpt_defaults()
 * and acf-fields.php for where those fields actually come from).
 *
 * @package Recap_Headless_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the five Recap-managed post types.
 *
 * @return void
 */
function recap_register_post_types(): void {
	register_post_type(
		'gallery_item',
		array_merge(
			recap_cpt_defaults(),
			array(
				'label'        => 'Gallery Items',
				'labels'       => array(
					'name'         => 'Gallery Items',
					'singular_name' => 'Gallery Item',
					'add_new_item' => 'Add New Gallery Item',
				),
				'rest_base'    => 'gallery',
				'menu_icon'    => 'dashicons-format-gallery',
				'menu_position' => 20,
				'taxonomies'   => array( 'gallery_category' ),
			)
		)
	);

	register_post_type(
		'freebie',
		array_merge(
			recap_cpt_defaults(),
			array(
				'label'        => 'Freebies',
				'labels'       => array(
					'name'         => 'Freebies',
					'singular_name' => 'Freebie',
					'add_new_item' => 'Add New Freebie',
				),
				'rest_base'    => 'freebies',
				'menu_icon'    => 'dashicons-media-document',
				'menu_position' => 21,
				'taxonomies'   => array( 'freebie_category' ),
			)
		)
	);

	register_post_type(
		'recommendation',
		array_merge(
			recap_cpt_defaults(),
			array(
				'label'        => 'Recommendations',
				'labels'       => array(
					'name'         => 'Recommendations',
					'singular_name' => 'Recommendation',
					'add_new_item' => 'Add New Recommendation',
				),
				'rest_base'    => 'recommendations',
				'menu_icon'    => 'dashicons-star-filled',
				'menu_position' => 22,
				'taxonomies'   => array( 'recommendation_category' ),
			)
		)
	);

	register_post_type(
		'lab_resource',
		array_merge(
			recap_cpt_defaults(),
			array(
				'label'        => 'Lab Resources',
				'labels'       => array(
					'name'         => 'Lab Resources',
					'singular_name' => 'Lab Resource',
					'add_new_item' => 'Add New Lab Resource',
				),
				'rest_base'    => 'lab-resources',
				'menu_icon'    => 'dashicons-lightbulb',
				'menu_position' => 23,
			)
		)
	);

	register_post_type(
		'review',
		array_merge(
			recap_cpt_defaults(),
			array(
				'label'        => 'Reviews',
				'labels'       => array(
					'name'         => 'Reviews',
					'singular_name' => 'Review',
					'add_new_item' => 'Add New Review',
				),
				'rest_base'    => 'reviews',
				'menu_icon'    => 'dashicons-format-quote',
				'menu_position' => 24,
			)
		)
	);
}
add_action( 'init', 'recap_register_post_types' );

/**
 * Right-sized image crops matching the frontend's actual grid/lightbox
 * display dimensions (see components/gallery, components/freebies,
 * components/recap-recommends in the frontend repo), so next/image isn't
 * downloading and resizing full-resolution originals for a 640px tile.
 *
 * @return void
 */
function recap_register_image_sizes(): void {
	add_image_size( 'recap_gallery_grid', 640, 640, true );
	add_image_size( 'recap_gallery_lightbox', 1600, 1600, false );
	add_image_size( 'recap_freebie_thumb', 600, 800, true );
	add_image_size( 'recap_recommendation_square', 640, 640, true );
}
add_action( 'after_setup_theme', 'recap_register_image_sizes' );
