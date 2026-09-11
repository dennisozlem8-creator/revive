type LogoProps = {
  size?: number;
  showText?: boolean;
  stacked?: boolean;
  className?: string;
};

export function Logo({ size = 56, showText = true, stacked = false, className = "" }: LogoProps) {
  const titleSize = stacked ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl";

  return (
    <div className={`flex items-center gap-4 ${stacked ? "flex-col text-center" : ""} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mark.png"
        alt="Revive Motion"
        width={size}
        height={size}
        className="shrink-0 rounded-[1.25rem] object-cover shadow-[0_10px_28px_rgba(27,51,72,0.16)]"
        style={{ width: size, height: size }}
      />
      <div className={`flex flex-col ${stacked ? "items-center lg:items-start" : ""}`}>
        <span className={`${titleSize} font-bold leading-tight tracking-tight text-foreground`}>
          Revive Motion
        </span>
        {showText && (
          <>
            <span className={`mt-2 font-semibold text-brand-light ${stacked ? "text-lg" : "text-sm"}`}>
              Physical Therapy Assistance
            </span>
            <span className={`mt-1 max-w-sm leading-relaxed text-body ${stacked ? "text-base" : "text-sm"}`}>
              Equal recovery for every patient, regardless of income, language, or location
            </span>
          </>
        )}
      </div>
    </div>
  );
}
