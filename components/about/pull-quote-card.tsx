export function PullQuoteCard({
  quote,
  attribution,
}: {
  quote: string;
  attribution?: string;
}) {
  return (
    <figure className="m-0 rounded-3xl bg-white p-7 shadow-[0_10px_30px_rgba(42,32,25,0.07)] md:p-8">
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
