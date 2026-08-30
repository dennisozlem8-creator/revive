type LogoProps = {
  size?: number;
  showText?: boolean;
  stacked?: boolean;
  className?: string;
};

export function Logo({ size = 56, showText = true, stacked = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-4 ${stacked ? "flex-col text-center" : ""} ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect width="48" height="48" rx="10" fill="#3d5a73" />

        <path
          d="M34 14a14 14 0 0 0-20 0"
          stroke="#c5d0da"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M14 34a14 14 0 0 0 20 0"
          stroke="#c5d0da"
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

        <circle cx="34" cy="34" r="3" fill="#8b9aab" />
        <circle cx="34" cy="34" r="1.2" fill="#EFF6FF" />
      </svg>
      {showText && (
        <div className={`flex flex-col ${stacked ? "items-center" : ""}`}>
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            Revive Motion
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent-light">
            Physical Therapy Assistance
          </span>
          <span className="mt-1 text-sm text-muted">
            Equal recovery for every patient
          </span>
        </div>
      )}
    </div>
  );
}
