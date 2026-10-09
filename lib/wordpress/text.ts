/**
 * WordPress returns titles and excerpts as HTML: entities like &#8211; and
 * &hellip; plus tags. Fine inside dangerouslySetInnerHTML, but metadata
 * (page titles, descriptions, share cards, structured data) needs plain
 * text, or search results show the raw codes.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

export function decodeEntities(value: string): string {
  return value.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
    (match, code: string) => {
      if (code[0] === "#") {
        const point =
          code[1].toLowerCase() === "x"
            ? parseInt(code.slice(2), 16)
            : parseInt(code.slice(1), 10);
        return Number.isFinite(point) ? String.fromCodePoint(point) : match;
      }
      return NAMED_ENTITIES[code.toLowerCase()] ?? match;
    },
  );
}

/** HTML → plain text: tags removed, entities decoded, whitespace collapsed. */
export function htmlToText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Search-result-sized description: WordPress's "[…]" read-more marker
 * dropped, cut at a word boundary to at most `max` characters.
 */
export function toDescription(html: string, max = 155): string {
  const text = htmlToText(html)
    .replace(/\s*\[…\]\s*$/, "")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const atWord = cut
    .slice(0, cut.lastIndexOf(" "))
    .replace(/[\s,;:.–—-]+$/, "");
  return `${atWord || cut}…`;
}
