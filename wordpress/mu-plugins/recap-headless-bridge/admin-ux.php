<?php
/**
 * Admin UX cleanup that register_post_type()'s `supports` array can't
 * fully cover on its own.
 *
 * Dropping 'editor', 'excerpt', 'thumbnail', 'comments', 'trackbacks',
 * 'author', 'custom-fields', and 'revisions' from `supports`
 * (helpers.php's recap_cpt_defaults()) already removes the Content Editor,
 * Excerpt, Featured Image, Discussion, Author, Custom Fields, and
 * Revisions meta boxes for every Recap-managed post type. The one box
 * that doesn't reliably follow `supports` is the Slug panel, handled
 * explicitly below.
 *
 * @package Recap_Headless_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Post types this plugin manages — reused by admin-ux.php and
 * rest-api.php so the list only lives in one place.
 *
 * @return string[]
 */
function recap_managed_post_types(): array {
	return array( 'gallery_item', 'freebie', 'recommendation', 'lab_resource' );
}

/**
 * Removes the native Slug meta box from every Recap-managed post type's
 * edit screen — slugs still exist and still work (REST/permalinks are
 * unaffected), editors just never need to think about them.
 *
 * @return void
 */
function recap_remove_slug_meta_boxes(): void {
	foreach ( recap_managed_post_types() as $post_type ) {
		remove_meta_box( 'slugdiv', $post_type, 'normal' );
	}
}
add_action( 'add_meta_boxes', 'recap_remove_slug_meta_boxes', 20 );
