<?php
/**
 * "Site Settings" ACF Options Page — infrastructure only.
 *
 * No field groups are attached yet. This exists purely so a future pass
 * can add Contact Details / Social Links / Footer / Global Settings
 * without first having to wire up the options page itself. See
 * wordpress/README.md's "Future extension guide" for how to add fields
 * here later.
 *
 * @package Recap_Headless_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the (currently empty) Site Settings options page.
 *
 * @return void
 */
function recap_register_options_page(): void {
	if ( ! function_exists( 'acf_add_options_page' ) ) {
		return;
	}

	acf_add_options_page(
		array(
			'page_title'   => 'Site Settings',
			'menu_title'   => 'Site Settings',
			'menu_slug'    => 'recap-site-settings',
			'capability'   => 'manage_options',
			'icon_url'     => 'dashicons-admin-settings',
			'position'     => 60,
			'show_in_rest' => true,
			'redirect'     => false,
		)
	);
}
add_action( 'acf/init', 'recap_register_options_page' );
