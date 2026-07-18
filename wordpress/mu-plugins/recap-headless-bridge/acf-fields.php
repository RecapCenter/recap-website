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
					'instructions'  => 'Optional — shown on the freebie card.',
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
					'required'      => 1,
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

