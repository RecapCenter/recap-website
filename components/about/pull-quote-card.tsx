export function PullQuoteCard({ quote }: { quote: string }) {
  return (
    <div className="rounded-3xl bg-white/70 p-6 shadow-[0_8px_30px_rgba(23,20,15,0.06)]">
      <span className="text-accent-red font-serif text-4xl leading-none">
        &ldquo;
      </span>
      <p className="font-script text-ink mt-1 text-xl leading-snug md:text-2xl">
        {quote}
      </p>
    </div>
  );
}
