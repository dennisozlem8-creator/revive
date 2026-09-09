type LogoProps = {
  size?: number;
  showText?: boolean;
  stacked?: boolean;
  className?: string;
};

export function Logo({ size = 56, showText = true, stacked = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-4 ${stacked ? "flex-col text-center" : ""} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Revive Motion.Ai"
        width={size}
        height={Math.round(size * 0.935)}
        className="shrink-0 rounded-[1.25rem] object-cover shadow-[0_10px_28px_rgba(27,51,72,0.16)]"
        style={
          stacked
            ? { width: size, height: "auto" }
            : { width: size, height: Math.round(size * 0.935) }
        }
      />
      {showText && (
        <div className={`flex flex-col ${stacked ? "items-center" : ""}`}>
          <span className="text-sm font-medium text-accent-light">
            Physical Therapy Assistance
          </span>
          <span className="mt-1 max-w-sm text-sm leading-snug text-muted">
            Equal recovery for every patient, regardless of income, language, or location
          </span>
        </div>
      )}
    </div>
  );
}
