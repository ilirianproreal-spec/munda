export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M24 3.5 41.5 13.75v20.5L24 44.5 6.5 34.25v-20.5L24 3.5Z"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.4"
      />
      <path
        d="M24 3.5v15M24 18.5 41.5 13.75M24 18.5 6.5 13.75"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1"
      />
      <path
        d="M15.5 13.5 24 22m9-8.5L24 22m0-12.5V22"
        stroke="#00e5ff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="22" r="3.2" fill="#00e5ff" />
      <circle cx="24" cy="22" r="6.5" stroke="#00e5ff" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="15.5" cy="13.5" r="1.5" fill="#00e5ff" />
      <circle cx="33" cy="13.5" r="1.5" fill="#00e5ff" />
      <circle cx="24" cy="9.5" r="1.5" fill="#00e5ff" />
    </svg>
  );
}
