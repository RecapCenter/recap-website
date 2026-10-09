/**
 * Generates the site's favicon and app icons from the Recap "R" mark —
 * the same vector the homepage hero draws (components/home/hero/recap-mark.ts)
 * and the shape of the navbar logo (assets/icons/recap-logo.webp), in the
 * navbar logo's ink colour. Run after changing the mark:
 *
 *   node scripts/generate-icons.mjs
 *
 * Outputs (Next.js picks up the app/ files by file-name convention):
 *   app/favicon.ico      16/32/48px, transparent — legacy fallback
 *   app/icon.svg         vector, turns cream in dark mode — modern browsers
 *   app/apple-icon.png   180px on cream — iOS home screen (iOS fills
 *                        transparency with black, so it needs a background)
 *   public/icon-192.png  } on cream, mark inside the maskable safe zone —
 *   public/icon-512.png  } Android home screen, via app/manifest.ts
 */
import fs from "node:fs";
import sharp from "sharp";

const INK = "#232122"; // sampled from assets/icons/recap-logo.webp
const CREAM = "#fbf4ec"; // --cream in app/globals.css

const source = fs.readFileSync("components/home/hero/recap-mark.ts", "utf8");
const MARK_PATH = source.match(/"(M[^"]+)"/)[1];

// The mark's bounding box inside its 1024×1024 drawing space.
const MARK = { x: 38, y: 63, w: 970, h: 890 };

/** Square SVG with the mark centred, `scale` = mark width / icon width. */
function iconSvg({ size, scale, background, darkModeFill }) {
  const w = MARK.w / scale;
  const x = MARK.x - (w - MARK.w) / 2;
  const y = MARK.y - (w - MARK.h) / 2;
  const style = darkModeFill
    ? `<style>@media (prefers-color-scheme: dark){path{fill:${darkModeFill}}}</style>`
    : "";
  const bg = background
    ? `<rect x="${x}" y="${y}" width="${w}" height="${w}" fill="${background}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${w}"${size ? ` width="${size}" height="${size}"` : ""}>${style}${bg}<path d="${MARK_PATH}" fill="${INK}"/></svg>`;
}

const png = (svg) => sharp(Buffer.from(svg)).png().toBuffer();

/** ICO container holding PNG images (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, entry);
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2); // palette colours
    header.writeUInt8(0, entry + 3); // reserved
    header.writeUInt16LE(1, entry + 4); // colour planes
    header.writeUInt16LE(32, entry + 6); // bits per pixel
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

// Small tab icons: the mark nearly fills the square so it stays legible.
const favicons = await Promise.all(
  [16, 32, 48].map(async (size) => ({
    size,
    data: await png(iconSvg({ size, scale: 0.92 })),
  })),
);
fs.writeFileSync("app/favicon.ico", ico(favicons));

fs.writeFileSync(
  "app/icon.svg",
  iconSvg({ scale: 0.92, darkModeFill: CREAM }) + "\n",
);

fs.writeFileSync(
  "app/apple-icon.png",
  await png(iconSvg({ size: 180, scale: 0.62, background: CREAM })),
);

// 0.56 keeps the whole mark inside Android's maskable safe zone (a circle
// 80% of the icon's width), so launchers can crop to any shape.
for (const size of [192, 512]) {
  fs.writeFileSync(
    `public/icon-${size}.png`,
    await png(iconSvg({ size, scale: 0.56, background: CREAM })),
  );
}

console.log("Icons written.");
