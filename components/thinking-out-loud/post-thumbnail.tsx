import Image from "next/image";

/**
 * The one way a Thinking Out Loud post's featured image is shown anywhere
 * on the site (homepage tiles, the blog grid, related posts). It fills
 * whatever square frame its parent gives it and shows the image whole
 * (object-contain), with a blurred copy of the same image filling any
 * leftover space so a non-square upload never shows bare bands.
 *
 * Ideal upload: square, ~1200×1200px.
 */
export function PostThumbnail({
  url,
  alt = "",
  sizes,
}: {
  url: string | null;
  alt?: string;
  sizes: string;
}) {
  if (!url) return null;

  return (
    <>
      <Image
        src={url}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        className="scale-110 object-cover opacity-60 blur-xl"
      />
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain"
      />
    </>
  );
}
