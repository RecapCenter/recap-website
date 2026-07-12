export function PullQuoteCard({ quote }: { quote: string }) {
  return (
    <div className="rounded-3xl bg-white/70 p-6 shadow-[0_8px_30px_rgba(23,20,15,0.06)]">
      <span className="font-serif text-4xl leading-none text-accent-red">&ldquo;</span>
      <p className="mt-1 font-script text-xl leading-snug text-ink md:text-2xl">
        {quote}
      </p>
    </div>
  );
}
