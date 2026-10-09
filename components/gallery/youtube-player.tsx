type YouTubePlayerProps = {
  embedUrl: string;
  title: string;
};

/** Embedded player for a YouTube (or Vimeo) URL — only ever mounted while
 * the VideoModal is open, so closing it unmounts (and so fully stops) the
 * iframe rather than merely hiding it. */
export function YouTubePlayer({ embedUrl, title }: YouTubePlayerProps) {
  // Vimeo embed URLs already carry a query (?dnt=1), so add autoplay
  // properly rather than appending a second "?".
  const src = new URL(embedUrl);
  src.searchParams.set("autoplay", "1");

  return (
    <iframe
      src={src.toString()}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="aspect-video max-h-[70vh] w-full rounded-2xl"
    />
  );
}
