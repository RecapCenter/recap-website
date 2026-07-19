type UploadedVideoPlayerProps = {
  src: string;
  title: string;
};

/** HTML5 player for a self-hosted video file — only ever mounted while the
 * VideoModal is open, so closing it unmounts (and so fully stops) playback. */
export function UploadedVideoPlayer({ src, title }: UploadedVideoPlayerProps) {
  return (
    <video
      src={src}
      controls
      autoPlay
      aria-label={title}
      className="max-h-[70vh] max-w-full rounded-2xl"
    />
  );
}
