export function PostBody({ html }: { html: string }) {
  return (
    <div
      className="wp-content mx-auto max-w-2xl px-6 py-12"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
