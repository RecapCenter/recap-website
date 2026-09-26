<?php
/**
 * Taxonomies.
 *
 * Categorization for Gallery, Freebies, and Recap Recommends is modeled as
 * a real WordPress taxonomy rather than a plain ACF text field, so terms
 * are manageable, reusable, filterable, and exposed over REST the same way
 * WordPress's native `category` taxonomy already is for Posts.
 *
 * @package Recap_Headless_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the four Recap-managed taxonomies. Each uses the standard
 * WordPress checkbox meta box on its post type's edit screen (no custom
 * ACF taxonomy field) — a well-understood, zero-surprise pattern editors
 * already recognize from Posts/Categories.
 *
 * @return void
 */
function recap_register_taxonomies(): void {
	register_taxonomy(
		'gallery_category',
		'gallery_item',
		array(
			'label'             => 'Gallery Categories',
			'hierarchical'      => false,
			'show_ui'           => true,
			'show_in_rest'      => true,
			'rest_base'         => 'gallery_category',
			'show_admin_column' => true,
		)
	);

	register_taxonomy(
		'freebie_category',
		'freebie',
		array(
			'label'             => 'Freebie Categories',
			'hierarchical'      => false,
			'show_ui'           => true,
			'show_in_rest'      => true,
			'rest_base'         => 'freebie_category',
			'show_admin_column' => true,
		)
	);

	register_taxonomy(
		'recommendation_category',
		'recommendation',
		array(
			'label'             => 'Recommendation Categories',
			'hierarchical'      => false,
			'show_ui'           => true,
			'show_in_rest'      => true,
			'rest_base'         => 'recommendation_category',
			'show_admin_column' => true,
		)
	);

	// Each term is one pin on the homepage globe and one
	// /around-the-world/<slug> page. Its coordinates and polaroid cover
	// photo are ACF term fields (acf-fields.php). Hierarchical only so
	// wp-admin shows a pick-from-list checkbox box instead of a free-text
	// tag field — countries are never nested.
	register_taxonomy(
		'country',
		'country_photo',
		array(
			'label'             => 'Countries',
			'labels'            => array(
				'name'          => 'Countries',
				'singular_name' => 'Country',
				'add_new_item'  => 'Add New Country',
			),
			'hierarchical'      => true,
			'show_ui'           => true,
			'show_in_rest'      => true,
			'rest_base'         => 'countries',
			'show_admin_column' => true,
		)
	);
}
add_action( 'init', 'recap_register_taxonomies' );

/**
 * Seeds each taxonomy's known starter terms. Safe to run on every request
 * — recap_seed_terms_once() (helpers.php) short-circuits per taxonomy once
 * seeded, and term_exists() guards each individual term regardless.
 *
 * `gallery_category` is intentionally left unseeded — no default terms
 * were specified for it; add them in wp-admin under Gallery Items ›
 * Gallery Categories as needed.
 *
 * @return void
 */
function recap_seed_taxonomy_terms(): void {
	recap_seed_terms_once(
		'freebie_category',
		array( 'Worksheets', 'Guides', 'Templates', 'Assessments', 'Checklists', 'E-books' )
	);

	recap_seed_terms_once(
		'recommendation_category',
		array( 'Books', 'Podcasts', 'Music', 'Research Papers', 'Videos', 'Websites', 'Apps', 'Courses' )
	);

	// One-time cleanup of the pre-refactor option name this replaces.
	if ( get_option( 'recap_terms_seeded' ) ) {
		delete_option( 'recap_terms_seeded' );
	}
}
add_action( 'init', 'recap_seed_taxonomy_terms', 20 );
