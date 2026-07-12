export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <line x1="7.5" y1="10" x2="7.5" y2="16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="7.5" cy="7" r="0.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M11.5 16.5V12.8C11.5 11.3 12.3 10.3 13.6 10.3C14.9 10.3 15.5 11.2 15.5 12.7V16.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="11.5" y1="10.5" x2="11.5" y2="16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
