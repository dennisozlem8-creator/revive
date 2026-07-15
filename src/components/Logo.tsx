import { BRAND_NAME, BRAND_SUBTITLE } from "@/lib/branding";

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
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
        className="shrink-0 drop-shadow-[0_4px_14px_var(--logo-glow)]"
      >
        <defs>
          <linearGradient id="rm-logo-gradient" x1="18" y1="12" x2="82" y2="88" gradientUnits="userSpaceOnUse">
            <stop stopColor="#84CC16" />
            <stop offset="0.45" stopColor="#4ADE80" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="42" stroke="url(#rm-logo-gradient)" strokeWidth="3.5" strokeDasharray="52 18" strokeLinecap="round" />
        <circle cx="50" cy="8" r="4.5" stroke="url(#rm-logo-gradient)" strokeWidth="2.5" fill="none" />
        <circle cx="86" cy="68" r="4.5" stroke="url(#rm-logo-gradient)" strokeWidth="2.5" fill="none" />
        <circle cx="14" cy="68" r="4.5" stroke="url(#rm-logo-gradient)" strokeWidth="2.5" fill="none" />

        <circle cx="58" cy="34" r="5.5" stroke="url(#rm-logo-gradient)" strokeWidth="3" fill="none" />
        <path d="M58 39.5 L52 52" stroke="url(#rm-logo-gradient)" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 52 L44 66" stroke="url(#rm-logo-gradient)" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 52 L62 66" stroke="url(#rm-logo-gradient)" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 46 L46 38" stroke="url(#rm-logo-gradient)" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 46 L60 40" stroke="url(#rm-logo-gradient)" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className="rm-brand-title">{BRAND_NAME}</span>
          <span className="rm-brand-subtitle">{BRAND_SUBTITLE}</span>
        </div>
      )}
    </div>
  );
}
