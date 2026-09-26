import { RECAP_MARK_PATH } from "./recap-mark";

/*
 * Building blocks for the homepage hero artwork. Each layout (laptop,
 * tablet, phone — see hero-layouts.tsx) composes these inside its own SVG,
 * in that layout's own coordinate space. Animation is pure CSS: the
 * `hero-*` classes are defined in app/globals.css and all switch off under
 * prefers-reduced-motion. `p` is a per-layout id prefix: all three SVGs are
 * in the DOM at once (two hidden by CSS), so filter/gradient/path ids must
 * be unique or the hidden layout's definitions would be picked up.
 */

export const GOLD = "#b8863b";
const INK = "#221a14";
const ROSE = "#c4647a";

export const WASH = {
  pink: "#f0b2b0",
  blue: "#bcd5ea",
  sky: "#d4e4f1",
  sage: "#c8d5c9",
  peach: "#f3d3b6",
  beige: "#eedcc2",
} as const;
export type WashColor = keyof typeof WASH;

const delay = (seconds: number) =>
  ({ "--d": `${seconds.toFixed(2)}s` }) as React.CSSProperties;

/** Deterministic pseudo-random sequence, so blob shapes are stable per build. */
function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Smooth closed blob through jittered points on an ellipse (Catmull-Rom → Bézier). */
function blobPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  rot: number,
  n = 7,
) {
  const r = rng(seed);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rot;
    const k = 0.82 + r() * 0.3;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  });
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [-1, 0, 1, 2].map((o) => pts[(i + o + n) % n]);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + "Z";
}

/** Shared filters, gradients and the paper-coloured ground. */
export function HeroDefs({ p, w, h }: { p: string; w: number; h: number }) {
  return (
    <>
      <defs>
        {Object.entries(WASH).map(([key, color]) => (
          <radialGradient
            key={key}
            id={`${p}-g-${key}`}
            cx="50%"
            cy="45%"
            r="60%"
          >
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="75%" stopColor={color} stopOpacity={0.7} />
            <stop offset="100%" stopColor={color} stopOpacity={0.9} />
          </radialGradient>
        ))}
        {/* Roughened, softened edges — what makes flat shapes read as watercolour. */}
        <filter id={`${p}-wc`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009"
            numOctaves={4}
            seed={7}
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale={38}
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation={4.5} />
        </filter>
        <filter id={`${p}-soft`}>
          <feGaussianBlur stdDeviation={1.4} />
        </filter>
        <filter id={`${p}-grain`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={3}
          />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0.08 0" />
        </filter>
      </defs>
      <rect width={w} height={h} fill="#fcf6e8" />
    </>
  );
}

/** Fine paper grain laid over everything. */
export function Grain({ p, w, h }: { p: string; w: number; h: number }) {
  return (
    <rect width={w} height={h} filter={`url(#${p}-grain)`} opacity={0.7} />
  );
}

/** Watercolour wash: lighter centre, pigment pooling at a soft rough rim. */
export function Wash({
  p,
  cx,
  cy,
  rx,
  ry,
  color,
  seed,
  opacity = 0.7,
  rot = 0,
}: {
  p: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  color: WashColor;
  seed: number;
  opacity?: number;
  rot?: number;
}) {
  const d = blobPath(cx, cy, rx, ry, seed, rot);
  return (
    <g className="hero-bloom" style={delay(0.05 + (seed % 5) * 0.12)}>
      <g className="hero-breathe">
        <g filter={`url(#${p}-wc)`} opacity={opacity}>
          <path d={d} fill={`url(#${p}-g-${color})`} />
          <path
            d={d}
            fill="none"
            stroke={WASH[color]}
            strokeWidth={5}
            opacity={0.45}
          />
        </g>
      </g>
    </g>
  );
}

/** A large free-form wash shape (the waves), by explicit path. */
export function Swoop({
  p,
  d,
  color,
  opacity,
  index,
}: {
  p: string;
  d: string;
  color: string;
  opacity: number;
  index: number;
}) {
  return (
    <g className="hero-bloom" style={delay(0.2 + (index % 5) * 0.15)}>
      <path d={d} fill={color} opacity={opacity} filter={`url(#${p}-wc)`} />
    </g>
  );
}

/** Gold line that draws itself in on load. */
export function GoldLine({
  d,
  index,
  width = 2.2,
}: {
  d: string;
  index: number;
  width?: number;
}) {
  return (
    <path
      className="hero-draw"
      pathLength={1}
      style={delay(0.3 + (index % 6) * 0.2)}
      d={d}
      fill="none"
      stroke={GOLD}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

/** Gold spiral, entering from `tail` and winding inward. */
export function Spiral({
  cx,
  cy,
  r0,
  turns,
  tail,
}: {
  cx: number;
  cy: number;
  r0: number;
  turns: number;
  tail: string;
}) {
  const steps = 140;
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const r = r0 * (1 - t) + 4;
    return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
  });
  return (
    <path
      className="hero-draw"
      pathLength={1}
      style={delay(0.9)}
      d={`${tail} L${points.join(" L")}`}
      fill="none"
      stroke={GOLD}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  );
}

/** Paper boat: sails in, then drifts, bobs and rocks with ripples spreading from the hull. */
export function Boat({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g className="hero-sail-in" style={delay(2.2)}>
      <g className="hero-drift">
        <g
          transform={`translate(${x} ${y}) scale(${s})`}
          fill="none"
          stroke={GOLD}
          strokeWidth={2.2 / s}
          strokeLinejoin="round"
        >
          <ellipse
            className="hero-ripple"
            cx={50}
            cy={64}
            rx={34}
            ry={3.2}
            opacity={0.5}
          />
          <ellipse
            className="hero-ripple"
            style={{ animationDelay: "4.8s" }}
            cx={50}
            cy={64}
            rx={34}
            ry={3.2}
            opacity={0.5}
          />
          <g className="hero-bob">
            <path d="M0 42 L100 42 L84 62 L16 62 Z" />
            <path d="M20 42 L50 0 L80 42 M50 0 L50 42 M36 22 L50 42 L64 22" />
          </g>
        </g>
      </g>
    </g>
  );
}

/** Bird silhouette: fades in, glides in a loose loop and flaps its wings. */
export function Bird({
  x,
  y,
  s,
  rot,
  index,
}: {
  x: number;
  y: number;
  s: number;
  rot: number;
  index: number;
}) {
  return (
    <g className="hero-rise" style={delay(2 + (index % 3) * 0.2)}>
      <g className="hero-glide" style={delay(index * 0.9)}>
        <g
          className="hero-flap"
          style={{
            animationDuration: `${(0.7 + (index % 3) * 0.12).toFixed(2)}s`,
            animationDelay: `${((index % 3) * 0.23).toFixed(2)}s`,
          }}
        >
          <path
            transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
            d="M0,0 C10,-9 20,-10 27,-2 C31,-13 45,-17 58,-11 C44,-8 36,-2 30,6 C22,1 12,-2 0,0Z"
            fill="#8ea6ba"
          />
        </g>
      </g>
    </g>
  );
}

/** Small uppercase corner label with a gold rule underneath. */
export function Corner({
  x,
  y,
  lines,
  size,
  gap,
}: {
  x: number;
  y: number;
  lines: string[];
  size: number;
  gap: number;
}) {
  const ruleY = y + (lines.length - 1) * gap + gap * 1.2;
  return (
    <g className="hero-rise" style={delay(1.6)}>
      {lines.map((line, i) => (
        <text
          key={line}
          x={x}
          y={y + i * gap}
          fontSize={size}
          letterSpacing={size * 0.24}
          fill={INK}
          fontWeight={500}
          className="font-serif"
        >
          {line}
        </text>
      ))}
      <line
        x1={x}
        y1={ruleY}
        x2={x + size * 3.6}
        y2={ruleY}
        stroke={GOLD}
        strokeWidth={2}
      />
    </g>
  );
}

/**
 * The seal: gold ring, curved full name, the R mark, RECAP and a small rule.
 * A small layout (the phone) can pass a larger `ringFontSize` with tighter
 * `ringLetterSpacing` so the curved name stays legible within the same arc.
 */
export function Seal({
  p,
  cx,
  cy,
  r,
  ringFontSize = r * 0.103,
  ringLetterSpacing = r * 0.035,
}: {
  p: string;
  cx: number;
  cy: number;
  r: number;
  ringFontSize?: number;
  ringLetterSpacing?: number;
}) {
  const R = r * 1.13;
  const at = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return [cx + Math.cos(a) * R, cy + Math.sin(a) * R] as const;
  };
  const [x0, y0] = at(152);
  const [x1, y1] = at(388);
  const d0 = at(146);
  const d1 = at(394);
  const s = (r * 0.96) / 1024;
  const arcId = `${p}-arc`;
  return (
    <>
      <path
        id={arcId}
        d={`M${x0},${y0} A${R},${R} 0 1 1 ${x1},${y1}`}
        fill="none"
      />
      <g className="hero-fade" style={delay(1.3)}>
        <text
          fontSize={ringFontSize}
          letterSpacing={ringLetterSpacing}
          fill={INK}
          className="font-serif"
        >
          <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
            REALM OF COUNSELLING AND PSYCHOLOGICAL SERVICES
          </textPath>
        </text>
        <circle cx={d0[0]} cy={d0[1]} r={r * 0.018} fill={INK} />
        <circle cx={d1[0]} cy={d1[1]} r={r * 0.018} fill={INK} />
      </g>
      <circle
        className="hero-draw"
        pathLength={1}
        style={delay(0.4)}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={GOLD}
        strokeWidth={r * 0.012}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <g className="hero-rise" style={delay(0.8)}>
        <path
          d={RECAP_MARK_PATH}
          fill={INK}
          transform={`translate(${cx - 512 * s * 1.02} ${cy - r * 0.62}) scale(${s})`}
        />
      </g>
      <g className="hero-rise" style={delay(1.1)}>
        <text
          x={cx + r * 0.08}
          y={cy + r * 0.56}
          textAnchor="middle"
          fontSize={r * 0.225}
          letterSpacing={r * 0.16}
          fill={INK}
          className="font-serif"
        >
          RECAP
        </text>
      </g>
      <line
        className="hero-draw"
        pathLength={1}
        style={delay(1.4)}
        x1={cx - r * 0.14}
        y1={cy + r * 0.8}
        x2={cx + r * 0.14}
        y2={cy + r * 0.8}
        stroke={GOLD}
        strokeWidth={r * 0.012}
      />
    </>
  );
}

/** "perspective." in the tagline's rose italic. */
export function Perspective() {
  return (
    <tspan fontStyle="italic" fill={ROSE}>
      perspective.
    </tspan>
  );
}

/** Tagline lines with a pink brush stroke swept under "perspective.". */
export function Tagline({
  p,
  x,
  y,
  size,
  lines,
  brushX,
  brushY,
  brushW,
}: {
  p: string;
  x: number;
  y: number;
  size: number;
  lines: React.ReactNode[];
  brushX: number;
  brushY: number;
  brushW: number;
}) {
  const bx = (t: number) => brushX + brushW * t;
  return (
    <>
      <g opacity={0.75} filter={`url(#${p}-soft)`}>
        <path
          className="hero-draw"
          pathLength={1}
          style={{ ...delay(2.3), animationDuration: "1s" }}
          d={`M${brushX},${brushY + 8} C${bx(0.3)},${brushY - 6} ${bx(0.7)},${brushY - 4} ${bx(1)},${brushY - 10}`}
          stroke="#f0aea8"
          strokeWidth={size * 0.22}
          fill="none"
          strokeLinecap="round"
        />
        <path
          className="hero-draw"
          pathLength={1}
          style={{ ...delay(2.5), animationDuration: "1s" }}
          d={`M${bx(0.12)},${brushY + 16} C${bx(0.4)},${brushY + 6} ${bx(0.7)},${brushY + 8} ${bx(0.9)},${brushY + 2}`}
          stroke="#f4c2bc"
          strokeWidth={size * 0.12}
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <g className="hero-rise" style={delay(1.8)}>
        {lines.map((line, i) => (
          <text
            key={i}
            x={x}
            y={y + i * size * 1.35}
            textAnchor="middle"
            fontSize={size * 1.06}
            fontWeight={500}
            fill="#1d1611"
            className="font-serif"
          >
            {line}
          </text>
        ))}
      </g>
    </>
  );
}

/** Horizontal band whose top edge is a gentle wave, filled to the bottom. */
export function Band({
  p,
  w,
  h,
  y,
  amp,
  len,
  phase,
  color,
  opacity,
  seed,
}: {
  p: string;
  w: number;
  h: number;
  y: number;
  amp: number;
  len: number;
  phase: number;
  color: string;
  opacity: number;
  seed: number;
}) {
  let d = `M0,${h} L0,${y}`;
  for (let x = 0; x <= w; x += 20) {
    const wave =
      Math.sin(x / len + phase) * amp +
      Math.sin(x / (len * 0.37) + seed) * amp * 0.25;
    d += ` L${x},${(y + wave).toFixed(1)}`;
  }
  return (
    <path
      d={`${d} L${w},${h} Z`}
      fill={color}
      opacity={opacity}
      filter={`url(#${p}-wc)`}
    />
  );
}
