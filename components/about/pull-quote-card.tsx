export function PullQuoteCard({
  quote,
  attribution,
}: {
  quote: string;
  attribution?: string;
}) {
  return (
    <figure className="rounded-3xl bg-white/70 p-6 shadow-[0_8px_30px_rgba(23,20,15,0.06)]">
      <span className="text-accent-red font-serif text-4xl leading-none">
        &ldquo;
      </span>
      <blockquote className="font-script text-ink mt-1 text-xl leading-snug whitespace-pre-line md:text-2xl">
        {quote}
      </blockquote>
      {attribution && (
        <figcaption className="text-body-gray mt-3 text-sm">
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}
