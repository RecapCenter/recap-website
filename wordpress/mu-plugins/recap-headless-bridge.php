<?php
/**
 * Plugin Name: Recap Headless Bridge
 * Description: Registers the custom post types, taxonomies, and ACF fields
 *              the Recap Next.js frontend consumes over the REST API, and
 *              pings the frontend's on-demand revalidation endpoint on
 *              publish/update. See wordpress/README.md for the full
 *              architecture and wordpress/MIGRATION.md for what changed in
 *              the most recent refactor.
 *
 * This is a thin loader — each concern lives in its own file under
 * recap-headless-bridge/ so the plugin stays easy to navigate as it grows.
 * Must-use plugins don't autoload subdirectories, so this file requires
 * each module explicitly, in dependency order (helpers first, since the
 * others call functions defined there).
 *
 * @package Recap_Headless_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'RECAP_BRIDGE_DIR', __DIR__ . '/includes' );

require_once RECAP_BRIDGE_DIR . '/helpers.php';
require_once RECAP_BRIDGE_DIR . '/post-types.php';
require_once RECAP_BRIDGE_DIR . '/taxonomies.php';
require_once RECAP_BRIDGE_DIR . '/acf-fields.php';
require_once RECAP_BRIDGE_DIR . '/homepage-featured.php';
require_once RECAP_BRIDGE_DIR . '/options-page.php';
require_once RECAP_BRIDGE_DIR . '/admin-ux.php';
require_once RECAP_BRIDGE_DIR . '/rest-api.php';
require_once RECAP_BRIDGE_DIR . '/revalidation.php';
