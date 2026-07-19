export type WPRendered = {
  rendered: string;
};

export type WPFeaturedMedia = {
  id: number;
  source_url: string;
  alt_text: string;
  media_type: "image" | "file";
  mime_type: string;
  media_details?: {
    width: number;
    height: number;
  };
};

export type WPCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export type WPACFImage = {
  url: string;
  alt: string;
  sizes?: Record<string, string>;
};

export type WPACFFile = {
  url: string;
  filename: string;
  filesize: number;
  mime_type: string;
};

type WPEmbedded = {
  "wp:featuredmedia"?: WPFeaturedMedia[];
  "wp:term"?: WPCategory[][];
};

export type WPPostRaw = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  categories: number[];
  _embedded?: WPEmbedded;
};

export type WPGalleryItemRaw = {
  id: number;
  slug: string;
  title: WPRendered;
  date: string;
  acf: {
    media_type: "photo" | "video";
    photo?: WPACFImage;
    video_file?: WPACFFile;
    video_url?: string;
    video_thumbnail?: WPACFImage;
    caption?: string;
    display_order?: number;
  };
};

export type WPFreebieRaw = {
  id: number;
  slug: string;
  title: WPRendered;
  freebie_category: number[];
  acf: {
    thumbnail?: WPACFImage;
    description?: string;
    pdf_file: WPACFFile;
  };
  _embedded?: WPEmbedded;
};

export type WPRecommendationRaw = {
  id: number;
  slug: string;
  title: WPRendered;
  recommendation_category: number[];
  acf: {
    external_link: string;
    image?: WPACFImage;
    description?: string;
  };
  _embedded?: WPEmbedded;
};

export type WPLabResourceRaw = {
  id: number;
  slug: string;
  title: WPRendered;
  acf: {
    resource_type?: string;
    thumbnail?: WPACFImage;
    resource_file?: WPACFFile;
    description?: string;
  };
};

export type WPReviewRaw = {
  id: number;
  slug: string;
  title: WPRendered;
  date: string;
  acf: {
    rating: number;
    quote: string;
  };
};
