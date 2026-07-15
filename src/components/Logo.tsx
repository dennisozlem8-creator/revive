type LogoProps = {
  size?: number;
  showText?: boolean;
  className?: string;
};

export function Logo({ size = 56, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
        className="shrink-0 drop-shadow-[0_4px_12px_rgba(37,99,235,0.35)]"
      >
        <defs>
          <linearGradient id="rm-bg" x1="8" y1="4" x2="40" y2="44">
            <stop stopColor="#1D4ED8" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="rm-arc" x1="12" y1="12" x2="36" y2="36">
            <stop stopColor="#93C5FD" />
            <stop offset="1" stopColor="#60A5FA" />
          </linearGradient>
        </defs>

        <rect width="48" height="48" rx="14" fill="url(#rm-bg)" />

        <path
          d="M34 14a14 14 0 0 0-20 0"
          stroke="url(#rm-arc)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M14 34a14 14 0 0 0 20 0"
          stroke="url(#rm-arc)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        <circle cx="24" cy="22" r="4" fill="#DBEAFE" />
        <path
          d="M24 26v6"
          stroke="#EFF6FF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M18 34c2-4 4-6 6-6s4 2 6 6"
          stroke="#EFF6FF"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 26l-5-4M24 26l5-4"
          stroke="#BFDBFE"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <circle cx="34" cy="34" r="3" fill="#60A5FA" />
        <circle cx="34" cy="34" r="1.2" fill="#EFF6FF" />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className="rm-brand-title">Revive Motion</span>
          <span className="rm-brand-subtitle">Physical therapy assistant</span>
        </div>
      )}
    </div>
  );
}
