<?php
/**
 * Newsletter ("the slow letter") signups and unsubscribes → MailPoet.
 *
 * Unsubscribes come from the website's /unsubscribe page via
 * POST /wp-json/recap/v1/unsubscribe (same secret), which removes the
 * address from the list and saves the reason under "Unsubscribe Reasons".
 * That page is reached through each letter's signed link — the MailPoet
 * shortcode [custom:recap_unsubscribe_url], defined below — and the
 * signature is checked here, so nobody can unsubscribe someone else.
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
 * as subscribed straight away (single opt-in: no confirmation email). For
 * that, MailPoet → Settings → Sign-up Confirmation must also be disabled;
 * otherwise MailPoet leaves new addresses "Unconfirmed" and never mails them.
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
function recap_register_newsletter_routes(): void {
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

	register_rest_route(
		'recap/v1',
		'/unsubscribe',
		array(
			'methods'             => 'POST',
			'callback'            => 'recap_newsletter_unsubscribe',
			'permission_callback' => 'recap_newsletter_permission',
			'args'                => array(
				'email'  => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_email',
					'validate_callback' => static fn ( $value ) => is_email( $value ) !== false,
				),
				'token'  => array(
					'required'          => true,
					'type'              => 'string',
					'validate_callback' => static fn ( $value ) => is_string( $value ) && 1 === preg_match( '/^[a-f0-9]{64}$/', $value ),
				),
				'reason' => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'note'   => array(
					'required'          => false,
					'type'              => 'string',
					'default'           => '',
					'sanitize_callback' => 'sanitize_textarea_field',
				),
			),
		)
	);
}
add_action( 'rest_api_init', 'recap_register_newsletter_routes' );

/**
 * Private "Unsubscribe Reasons" list in wp-admin: one entry per unsubscribe
 * from the website's /unsubscribe page, so the team can see why people
 * leave. Never exposed over REST or on any public page.
 *
 * @return void
 */
function recap_register_unsubscribe_feedback_type(): void {
	register_post_type(
		'newsletter_feedback',
		array(
			'label'           => 'Unsubscribe Reasons',
			'labels'          => array(
				'name'          => 'Unsubscribe Reasons',
				'singular_name' => 'Unsubscribe Reason',
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'show_in_rest'    => false,
			'menu_icon'       => 'dashicons-email-alt',
			'menu_position'   => 26,
			'supports'        => array( 'title', 'editor' ),
			'capability_type' => 'post',
			// Entries are only ever created by the unsubscribe endpoint.
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap'    => true,
		)
	);
}
add_action( 'init', 'recap_register_unsubscribe_feedback_type' );

/** Human-readable labels for the reason codes the frontend sends. */
function recap_unsubscribe_reason_label( string $reason ): string {
	$labels = array(
		'too-many'        => 'I get too many emails',
		'not-relevant'    => "The content isn't relevant to me",
		'never-signed-up' => "I don't remember signing up",
		'taking-a-break'  => "I'm just taking a break",
		'other'           => 'Something else',
	);

	return $labels[ $reason ] ?? $reason;
}

/**
 * Signature for an address's unsubscribe link: HMAC-SHA256 of the
 * lower-cased address. Keyed by RECAP_UNSUBSCRIBE_SECRET if wp-config.php
 * defines one, otherwise by a key derived from RECAP_REVALIDATE_SECRET — so
 * no extra setup is needed, but rotating that secret invalidates the links
 * in letters already sent. Returns '' when neither secret is configured.
 *
 * @param string $email Subscriber address.
 * @return string 64-character hex signature, or ''.
 */
function recap_unsubscribe_token( string $email ): string {
	if ( defined( 'RECAP_UNSUBSCRIBE_SECRET' ) ) {
		$key = RECAP_UNSUBSCRIBE_SECRET;
	} elseif ( defined( 'RECAP_REVALIDATE_SECRET' ) ) {
		$key = hash_hmac( 'sha256', 'recap-unsubscribe-links', RECAP_REVALIDATE_SECRET );
	} else {
		return '';
	}

	return hash_hmac( 'sha256', strtolower( trim( $email ) ), $key );
}

/**
 * The public site's origin (e.g. https://recapcenter.com), taken from
 * RECAP_REVALIDATE_URL so it needs no separate setting.
 *
 * @return string
 */
function recap_public_site_origin(): string {
	if ( defined( 'RECAP_REVALIDATE_URL' ) ) {
		$parts = wp_parse_url( RECAP_REVALIDATE_URL );
		if ( ! empty( $parts['scheme'] ) && ! empty( $parts['host'] ) ) {
			return $parts['scheme'] . '://' . $parts['host'];
		}
	}

	return 'https://recapcenter.com';
}

/**
 * A subscriber's personal unsubscribe link on the public site's branded
 * /unsubscribe page (signed, so it only works for that address).
 *
 * @param string $email Subscriber address.
 * @return string
 */
function recap_unsubscribe_url( string $email ): string {
	$base  = recap_public_site_origin() . '/unsubscribe';
	$token = recap_unsubscribe_token( $email );

	if ( '' === $token ) {
		return $base;
	}

	return $base . '?' . http_build_query(
		array(
			'email' => strtolower( trim( $email ) ),
			'token' => $token,
		)
	);
}

/**
 * MailPoet shortcode [custom:recap_unsubscribe_url] — set it as the URL of
 * the email footer's "Unsubscribe" link. Replaced per recipient when a
 * letter is sent; previews use the logged-in user's address.
 *
 * @param string $shortcode       The shortcode being processed.
 * @param mixed  $newsletter      Newsletter being rendered (unused).
 * @param mixed  $subscriber      Recipient: a SubscriberEntity, an array, or null in previews.
 * @param mixed  $queue           Sending queue (unused).
 * @param mixed  $content         Email content (unused).
 * @param mixed  $wp_user_preview Whether this is a preview (unused).
 * @return string
 */
function recap_mailpoet_unsubscribe_shortcode( $shortcode, $newsletter = null, $subscriber = null, $queue = null, $content = '', $wp_user_preview = false ) {
	if ( '[custom:recap_unsubscribe_url]' !== $shortcode ) {
		return $shortcode;
	}
	unset( $newsletter, $queue, $content, $wp_user_preview );

	$email = '';
	if ( is_object( $subscriber ) && method_exists( $subscriber, 'getEmail' ) ) {
		$email = (string) $subscriber->getEmail();
	} elseif ( is_array( $subscriber ) && ! empty( $subscriber['email'] ) ) {
		$email = (string) $subscriber['email'];
	} elseif ( is_user_logged_in() ) {
		$email = (string) wp_get_current_user()->user_email;
	}

	// Raw (not HTML-escaped): MailPoet's click tracking redirects to this
	// value, and an escaped "&#038;" would break the query string.
	return esc_url_raw( '' !== $email ? recap_unsubscribe_url( $email ) : recap_public_site_origin() . '/unsubscribe' );
}
add_filter( 'mailpoet_newsletter_shortcode', 'recap_mailpoet_unsubscribe_shortcode', 10, 6 );

/**
 * Removes the email from the newsletter list and records why — only with a
 * valid signature from that address's emailed link. Answers the same way
 * whether or not the address was subscribed, so the page can't be used to
 * discover who is on the list.
 *
 * @param WP_REST_Request $request Incoming request.
 * @return WP_REST_Response|WP_Error
 */
function recap_newsletter_unsubscribe( WP_REST_Request $request ) {
	if ( ! class_exists( \MailPoet\API\API::class ) ) {
		return new WP_Error( 'recap_mailpoet_missing', 'MailPoet is not active.', array( 'status' => 503 ) );
	}

	$email  = (string) $request->get_param( 'email' );
	$token  = (string) $request->get_param( 'token' );
	$reason = recap_unsubscribe_reason_label( (string) $request->get_param( 'reason' ) );
	$note   = (string) $request->get_param( 'note' );

	$expected = recap_unsubscribe_token( $email );
	if ( '' === $expected || ! hash_equals( $expected, $token ) ) {
		return new WP_Error( 'recap_invalid_unsubscribe_link', 'This unsubscribe link is not valid.', array( 'status' => 403 ) );
	}

	$was_subscribed = false;

	try {
		$mailpoet = \MailPoet\API\API::MP( 'v1' );
		$list_id  = recap_newsletter_list_id( $mailpoet );

		try {
			$subscriber = $mailpoet->getSubscriber( $email );
			$mailpoet->unsubscribeFromLists( $subscriber['id'], array( $list_id ) );
			$was_subscribed = true;
		} catch ( \Exception $not_subscribed ) {
			// Not a subscriber, or already off the list — nothing to remove.
			unset( $not_subscribed );
		}
	} catch ( \Exception $e ) {
		return new WP_Error( 'recap_unsubscribe_failed', 'Could not unsubscribe right now.', array( 'status' => 500 ) );
	}

	// Only real unsubscribes leave a note, so repeat or bogus submissions
	// can't fill wp-admin with entries.
	if ( $was_subscribed ) {
		wp_insert_post(
			array(
				'post_type'    => 'newsletter_feedback',
				'post_status'  => 'private',
				'post_title'   => sprintf( '%s — %s', $email, $reason ),
				'post_content' => '' !== $note ? $note : '(No extra note.)',
			)
		);
	}

	return new WP_REST_Response( array( 'ok' => true ), 200 );
}

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
			'send_confirmation_email' => false,
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
