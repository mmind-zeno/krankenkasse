export default function LogoMark({ className = 'h-10 w-10', title = 'KK-Check Liechtenstein' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
    >
      {/* Äußerer Ring */}
      <circle cx="32" cy="32" r="30" fill="#0b1f4a" />
      {/* Innerer Kreis */}
      <circle cx="32" cy="32" r="23" fill="#eff6ff" />

      {/* Doppeltes K – stilisiert */}
      <g stroke="#0b1f4a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Linkes K */}
        <path d="M20 20v24" />
        <path d="M20 32l8-12" />
        <path d="M20 32l8 12" />

        {/* Rechtes K */}
        <path d="M36 20v24" />
        <path d="M36 32l8-12" />
        <path d="M36 32l8 12" />
      </g>

      {/* Checkmark über den Ks */}
      <path
        d="M22 35l7 7 15-15"
        fill="none"
        stroke="#2563eb"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

