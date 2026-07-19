type YouTubePlayerProps = {
  embedUrl: string;
  title: string;
};

/** Embedded player for a YouTube (or Vimeo) URL — only ever mounted while
 * the VideoModal is open, so closing it unmounts (and so fully stops) the
 * iframe rather than merely hiding it. */
export function YouTubePlayer({ embedUrl, title }: YouTubePlayerProps) {
  return (
    <iframe
      src={`${embedUrl}?autoplay=1`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="aspect-video max-h-[70vh] w-full rounded-2xl"
    />
  );
}
