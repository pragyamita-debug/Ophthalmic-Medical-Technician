/** An eye with a lit iris inside a soft ring — the brand mark in the nav and footer. */
export function Logo({ size = 38 }: { size?: number; light?: boolean }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <defs>
        <radialGradient id="iris" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#bfe0ff" />
          <stop offset="0.45" stopColor="#3d8bff" />
          <stop offset="1" stopColor="#0d3b9a" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="rgba(61,139,255,0.35)" />
      <path d="M5 20c4-7 9-10 15-10s11 3 15 10c-4 7-9 10-15 10S9 27 5 20Z" fill="none" stroke="#3d8bff" strokeWidth="2" />
      <circle className="logo__iris" cx="20" cy="20" r="5.5" fill="url(#iris)" />
      <circle cx="22" cy="18" r="1.5" fill="#fff" />
    </svg>
  );
}
