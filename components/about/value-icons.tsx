export function SproutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden>
      <path
        d="M20 34V20"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M20 20C20 12 14 9 8 9C8 17 13 20 20 20Z" fill="currentColor" />
      <path
        d="M20 20C20 14 25 11 31 11C31 18 26 20 20 20Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function StarburstIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const x2 = 20 + Math.cos(angle) * 16;
        const y2 = 20 + Math.sin(angle) * 16;
        return (
          <line
            key={i}
            x1="20"
            y1="20"
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export function PetalClusterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden>
      {[-24, -8, 8, 24].map((rot, i) => (
        <ellipse
          key={i}
          cx="20"
          cy="14"
          rx="4"
          ry="12"
          fill="currentColor"
          transform={`rotate(${rot} 20 26)`}
        />
      ))}
    </svg>
  );
}

export function ArchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden>
      <path
        d="M10 32V20C10 12.8 14.5 8 20 8C25.5 8 30 12.8 30 20V32"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
