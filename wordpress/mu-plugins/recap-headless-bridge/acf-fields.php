<?php
/**
 * ACF field groups.
 *
 * Registered in PHP (not the ACF UI) so field definitions live in version
 * control next to the TypeScript types they mirror
 * (lib/wordpress/types.ts in the frontend repo). Requires the free ACF
 * plugin — REST exposure via `show_in_rest` doesn't need ACF PRO. Each
 * field group's `location` scopes it to exactly one post type, so an
 * editor on any other screen never sees fields that don't apply to it.
 *
 * @package Recap_Headless_Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers every Recap-managed ACF field group.
 *
 * @return void
 */
function recap_register_acf_fields(): void {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	recap_register_gallery_item_fields();
	recap_register_freebie_fields();
	recap_register_recommendation_fields();
	recap_register_lab_resource_fields();
	recap_register_review_fields();
	recap_register_country_photo_fields();
	recap_register_country_fields();
}
add_action( 'acf/init', 'recap_register_acf_fields' );

/**
 * Gallery Items: media only. `media_type` drives conditional logic so an
 * editor only ever sees the image field OR the video fields, never both.
 *
 * @return void
 */
function recap_register_gallery_item_fields(): void {
	acf_add_local_field_group(
		array(
			'key'          => 'group_recap_gallery_item',
			'title'        => 'Gallery Item Details',
			'show_in_rest' => 1,
			'location'     => array(
				array(
					array(
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => 'gallery_item',
					),
				),
			),
			'fields'       => array(
				array(
					'key'           => 'field_recap_gallery_media_type',
					'name'          => 'media_type',
					'label'         => 'Media Type',
					'type'          => 'select',
					'choices'       => array(
						'photo' => 'Image',
						'video' => 'Video',
					),
					'default_value' => 'photo',
					'required'      => 1,
				),
				array(
					'key'               => 'field_recap_gallery_photo',
					'name'              => 'photo',
					'label'             => 'Upload Image',
					'type'              => 'image',
					'return_format'     => 'array',
					'preview_size'      => 'recap_gallery_grid',
					'required'          => 1,
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_recap_gallery_media_type',
								'operator' => '==',
								'value'    => 'photo',
							),
						),
					),
				),
				array(
					'key'               => 'field_recap_gallery_video_file',
					'name'              => 'video_file',
					'label'             => 'Upload Video',
					'type'              => 'file',
					'return_format'     => 'array',
					'mime_types'        => 'mp4,mov,webm',
					'instructions'      => 'Upload a video file, or use the URL field below instead (e.g. a YouTube/Vimeo link) — whichever is easier.',
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_recap_gallery_media_type',
								'operator' => '==',
								'value'    => 'video',
							),
						),
					),
				),
				array(
					'key'               => 'field_recap_gallery_video_url',
					'name'              => 'video_url',
					'label'             => 'Video URL',
					'type'              => 'url',
					'instructions'      => 'Use this instead of an upload for a YouTube/Vimeo/hosted video link.',
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_recap_gallery_media_type',
								'operator' => '==',
								'value'    => 'video',
							),
						),
					),
				),
				array(
					'key'               => 'field_recap_gallery_video_thumbnail',
					'name'              => 'video_thumbnail',
					'label'             => 'Video Thumbnail',
					'type'              => 'image',
					'return_format'     => 'array',
					'preview_size'      => 'recap_gallery_grid',
					'instructions'      => 'Optional — for a YouTube link above, the thumbnail is pulled automatically if left blank.',
					'conditional_logic' => array(
						array(
							array(
								'field'    => 'field_recap_gallery_media_type',
								'operator' => '==',
								'value'    => 'video',
							),
						),
					),
				),
				array(
					'key'          => 'field_recap_gallery_caption',
					'name'         => 'caption',
					'label'        => 'Caption',
					'type'         => 'textarea',
					'rows'         => 2,
					'instructions' => 'Optional.',
				),
				array(
					'key'          => 'field_recap_gallery_display_order',
					'name'         => 'display_order',
					'label'        => 'Display Order',
					'type'         => 'number',
					'instructions' => 'Lower numbers show first. Leave blank to sort by date.',
				),
			),
		)
	);
}

/**
 * Freebies: a downloadable resource manager. Category lives on the
 * `freebie_category` taxonomy (taxonomies.php), not an ACF field.
 *
 * @return void
 */
function recap_register_freebie_fields(): void {
	acf_add_local_field_group(
		array(
			'key'          => 'group_recap_freebie',
			'title'        => 'Freebie Details',
			'show_in_rest' => 1,
			'location'     => array(
				array(
					array(
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => 'freebie',
					),
				),
			),
			'fields'       => array(
				array(
					'key'           => 'field_recap_freebie_pdf_file',
					'name'          => 'pdf_file',
					'label'         => 'PDF Upload',
					'type'          => 'file',
					'return_format' => 'array',
					'mime_types'    => 'pdf',
					'required'      => 1,
				),
				array(
					'key'           => 'field_recap_freebie_thumbnail',
					'name'          => 'thumbnail',
					'label'         => 'Thumbnail',
					'type'          => 'image',
					'return_format' => 'array',
					'preview_size'  => 'recap_freebie_thumb',
					'instructions'  => 'Optional — shown on the freebie card. Square works best (e.g. 1200×1200px); other shapes are cropped to a square.',
				),
				array(
					'key'          => 'field_recap_freebie_description',
					'name'         => 'description',
					'label'        => 'Short Description',
					'type'         => 'textarea',
					'rows'         => 3,
					'instructions' => 'Optional.',
				),
			),
		)
	);
}

/**
 * Recap Recommends. Category lives on the `recommendation_category`
 * taxonomy (taxonomies.php). Image is its own ACF field rather than the
 * native Featured Image box — see wordpress/MIGRATION.md for why, and the
 * matching frontend change in lib/wordpress/recommendations.ts.
 *
 * @return void
 */
function recap_register_recommendation_fields(): void {
	acf_add_local_field_group(
		array(
			'key'          => 'group_recap_recommendation',
			'title'        => 'Recommendation Details',
			'show_in_rest' => 1,
			'location'     => array(
				array(
					array(
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => 'recommendation',
					),
				),
			),
			'fields'       => array(
				array(
					'key'           => 'field_recap_recommendation_image',
					'name'          => 'image',
					'label'         => 'Image',
					'type'          => 'image',
					'return_format' => 'array',
					'preview_size'  => 'recap_recommendation_square',
					'instructions'  => 'Optional for YouTube/Vimeo links — the video\'s own thumbnail is used automatically. Required for everything else.',
				),
				array(
					'key'          => 'field_recap_recommendation_description',
					'name'         => 'description',
					'label'        => 'Short Description',
					'type'         => 'textarea',
					'rows'         => 3,
					'instructions' => 'Optional.',
				),
				array(
					'key'          => 'field_recap_recommendation_external_link',
					'name'         => 'external_link',
					'label'        => 'External Link',
					'type'         => 'url',
					'instructions' => 'Where the "Visit" button sends the reader.',
					'required'     => 1,
				),
			),
		)
	);
}

/**
 * Lab Resources: prepared for future use — Recap Lab's page stays a
 * static "coming soon" until this content type's scope is finalized (see
 * lib/wordpress/lab.ts in the frontend repo).
 *
 * @return void
 */
function recap_register_lab_resource_fields(): void {
	acf_add_local_field_group(
		array(
			'key'          => 'group_recap_lab_resource',
			'title'        => 'Lab Resource Details',
			'show_in_rest' => 1,
			'location'     => array(
				array(
					array(
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => 'lab_resource',
					),
				),
			),
			'fields'       => array(
				array(
					'key'     => 'field_recap_lab_resource_type',
					'name'    => 'resource_type',
					'label'   => 'Type',
					'type'    => 'select',
					'choices' => array(
						'assessment' => 'Assessment',
						'quiz'       => 'Quiz',
						'resource'   => 'Resource',
					),
					'required' => 1,
				),
				array(
					'key'           => 'field_recap_lab_thumbnail',
					'name'          => 'thumbnail',
					'label'         => 'Thumbnail',
					'type'          => 'image',
					'return_format' => 'array',
				),
				array(
					'key'          => 'field_recap_lab_resource_file',
					'name'         => 'resource_file',
					'label'        => 'Upload File',
					'type'         => 'file',
					'return_format' => 'array',
					'instructions' => 'Optional.',
				),
				array(
					'key'          => 'field_recap_lab_description',
					'name'         => 'description',
					'label'        => 'Description',
					'type'         => 'textarea',
					'rows'         => 3,
					'instructions' => 'Optional.',
				),
			),
		)
	);
}

/**
 * Reviews: client testimonials shown in the homepage's "Straight from
 * clients" section. The reviewer's name uses the native Title field (this
 * post type's only native support, per recap_cpt_defaults()) rather than a
 * redundant ACF field.
 *
 * @return void
 */
function recap_register_review_fields(): void {
	acf_add_local_field_group(
		array(
			'key'          => 'group_recap_review',
			'title'        => 'Review Details',
			'show_in_rest' => 1,
			'location'     => array(
				array(
					array(
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => 'review',
					),
				),
			),
			'fields'       => array(
				array(
					'key'          => 'field_recap_review_rating',
					'name'         => 'rating',
					'label'        => 'Rating',
					'type'         => 'number',
					'min'          => 1,
					'max'          => 5,
					'step'         => 1,
					'default_value' => 5,
					'instructions' => '1 to 5 stars.',
					'required'     => 1,
				),
				array(
					'key'          => 'field_recap_review_quote',
					'name'         => 'quote',
					'label'        => 'Review',
					'type'         => 'textarea',
					'rows'         => 4,
					'required'     => 1,
				),
			),
		)
	);
}

/**
 * Around the World photos: photos only (no video), shown on the
 * /around-the-world/<country> page of the Country they're assigned to
 * (the `country` taxonomy box on the same edit screen).
 *
 * @return void
 */
function recap_register_country_photo_fields(): void {
	acf_add_local_field_group(
		array(
			'key'          => 'group_recap_country_photo',
			'title'        => 'Country Photo Details',
			'show_in_rest' => 1,
			'location'     => array(
				array(
					array(
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => 'country_photo',
					),
				),
			),
			'fields'       => array(
				array(
					'key'           => 'field_recap_country_photo_photo',
					'name'          => 'photo',
					'label'         => 'Upload Image',
					'type'          => 'image',
					'return_format' => 'array',
					'preview_size'  => 'recap_gallery_grid',
					'required'      => 1,
					'instructions'  => 'Remember to tick its Country in the Countries box.',
				),
				array(
					'key'          => 'field_recap_country_photo_caption',
					'name'         => 'caption',
					'label'        => 'Caption',
					'type'         => 'textarea',
					'rows'         => 2,
					'instructions' => 'Optional.',
				),
				array(
					'key'          => 'field_recap_country_photo_display_order',
					'name'         => 'display_order',
					'label'        => 'Display Order',
					'type'         => 'number',
					'instructions' => 'Lower numbers show first. Leave blank to sort by date.',
				),
			),
		)
	);
}

/**
 * Country term fields: where the country's pin sits on the homepage globe
 * and which photo its polaroid shows. A country only appears on the globe
 * once it has all three of these plus at least one published photo.
 *
 * @return void
 */
function recap_register_country_fields(): void {
	acf_add_local_field_group(
		array(
			'key'          => 'group_recap_country',
			'title'        => 'Globe Pin',
			'show_in_rest' => 1,
			'location'     => array(
				array(
					array(
						'param'    => 'taxonomy',
						'operator' => '==',
						'value'    => 'country',
					),
				),
			),
			'fields'       => array(
				array(
					'key'          => 'field_recap_country_latitude',
					'name'         => 'latitude',
					'label'        => 'Latitude',
					'type'         => 'number',
					'min'          => -90,
					'max'          => 90,
					'step'         => 'any',
					'required'     => 1,
					'instructions' => 'e.g. 36.2 for Japan. Search "<country> latitude longitude" to find it.',
				),
				array(
					'key'          => 'field_recap_country_longitude',
					'name'         => 'longitude',
					'label'        => 'Longitude',
					'type'         => 'number',
					'min'          => -180,
					'max'          => 180,
					'step'         => 'any',
					'required'     => 1,
					'instructions' => 'e.g. 138.25 for Japan. West of Greenwich is negative.',
				),
				array(
					'key'           => 'field_recap_country_cover_photo',
					'name'          => 'cover_photo',
					'label'         => 'Polaroid Photo',
					'type'          => 'image',
					'return_format' => 'array',
					'preview_size'  => 'recap_gallery_grid',
					'required'      => 1,
					'instructions'  => 'Shown in the polaroid on the homepage globe. Square-ish photos work best.',
				),
			),
		)
	);
}

