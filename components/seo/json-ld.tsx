/**
 * Structured data (schema.org JSON-LD) for search engines. Values can come
 * from WordPress, so "<" is escaped: otherwise a title containing
 * "</script>" could break out of the tag and inject HTML.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
