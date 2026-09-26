<?php
/**
 * Newsletter ("the slow letter") signups → MailPoet.
 *
 * The Next.js footer form posts to its own /api/newsletter route, which
 * calls this endpoint server-to-server:
 *
 *   POST /wp-json/recap/v1/subscribe   { "email": "…" }
 *   header x-recap-secret: <RECAP_REVALIDATE_SECRET>
 *
 * The shared secret (the same one the revalidation webhook uses — see
 * wordpress/README.md) keeps the endpoint private to the frontend, so
 * nobody can post signups straight at WordPress. Subscribers are added to
 * the MailPoet list named by RECAP_NEWSLETTER_LIST (created on first use)
 * with MailPoet's double opt-in confirmation email.
 *
 * Requires the free MailPoet plugin to be installed and active; responds
 * 503 otherwise.
 *
 * @package Recap_Headless_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const RECAP_NEWSLETTER_LIST = 'The Slow Letter';

/**
 * Registers the subscribe endpoint.
 *
 * @return void
 */
function recap_register_newsletter_route(): void {
	register_rest_route(
		'recap/v1',
		'/subscribe',
		array(
			'methods'             => 'POST',
			'callback'            => 'recap_newsletter_subscribe',
			'permission_callback' => 'recap_newsletter_permission',
			'args'                => array(
				'email' => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_email',
					'validate_callback' => static fn ( $value ) => is_email( $value ) !== false,
				),
			),
		)
	);
}
add_action( 'rest_api_init', 'recap_register_newsletter_route' );

/**
 * Only the Next.js server (which knows the shared secret) may call this.
 *
 * @param WP_REST_Request $request Incoming request.
 * @return bool|WP_Error
 */
function recap_newsletter_permission( WP_REST_Request $request ) {
	if ( ! defined( 'RECAP_REVALIDATE_SECRET' ) ) {
		return new WP_Error( 'recap_not_configured', 'Newsletter endpoint is not configured.', array( 'status' => 503 ) );
	}

	$secret = (string) $request->get_header( 'x-recap-secret' );

	return hash_equals( RECAP_REVALIDATE_SECRET, $secret );
}

/**
 * Returns the id of the Recap newsletter list, creating it on first use.
 *
 * @param object $mailpoet MailPoet v1 API instance.
 * @return string|int
 */
function recap_newsletter_list_id( $mailpoet ) {
	foreach ( $mailpoet->getLists() as $list ) {
		if ( RECAP_NEWSLETTER_LIST === $list['name'] ) {
			return $list['id'];
		}
	}

	$list = $mailpoet->addList(
		array(
			'name'        => RECAP_NEWSLETTER_LIST,
			'description' => 'Signups from the recapcenter.com website footer.',
		)
	);

	return $list['id'];
}

/**
 * Adds (or re-subscribes) the email to the newsletter list. Always answers
 * the same way for new and existing addresses, so the form can't be used to
 * discover who is already subscribed.
 *
 * @param WP_REST_Request $request Incoming request.
 * @return WP_REST_Response|WP_Error
 */
function recap_newsletter_subscribe( WP_REST_Request $request ) {
	if ( ! class_exists( \MailPoet\API\API::class ) ) {
		return new WP_Error( 'recap_mailpoet_missing', 'MailPoet is not active.', array( 'status' => 503 ) );
	}

	$email = $request->get_param( 'email' );

	try {
		$mailpoet = \MailPoet\API\API::MP( 'v1' );
		$list_id  = recap_newsletter_list_id( $mailpoet );
		$options  = array(
			'send_confirmation_email' => true,
			'schedule_welcome_email'  => true,
		);

		try {
			$mailpoet->addSubscriber( array( 'email' => $email ), array( $list_id ), $options );
		} catch ( \Exception $e ) {
			// Already a subscriber (perhaps on another list): add them to this list instead.
			try {
				$mailpoet->subscribeToList( $email, $list_id, $options );
			} catch ( \Exception $already_on_list ) {
				// Already on this list too — nothing to do.
				unset( $already_on_list );
			}
		}
	} catch ( \Exception $e ) {
		return new WP_Error( 'recap_subscribe_failed', 'Could not subscribe right now.', array( 'status' => 500 ) );
	}

	return new WP_REST_Response( array( 'ok' => true ), 200 );
}
