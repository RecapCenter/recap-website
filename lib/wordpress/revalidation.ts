export const WP_CONTENT_TAGS = {
  post: "wp:posts",
  gallery_item: "wp:gallery",
  freebie: "wp:freebies",
  recommendation: "wp:recommendations",
  lab_resource: "wp:lab",
  category: "wp:categories",
} as const;

export type WordPressPostType = keyof typeof WP_CONTENT_TAGS;

export function collectionTag(postType: WordPressPostType): string {
  return WP_CONTENT_TAGS[postType];
}

export function itemTag(postType: WordPressPostType, slug: string): string {
  return `${WP_CONTENT_TAGS[postType]}:${slug}`;
}
