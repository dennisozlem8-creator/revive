import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { PageHeroImage } from "./PageHeroImage";
import { QuickLinks } from "./QuickLinks";
import { PageBack } from "./PageBack";

type PortalVariant = "patient" | "doctor" | "caregiver";

type PortalShellProps = {
  variant: PortalVariant;
  label: string;
  title: string;
  subtitle?: string;
  hero?: { src: string; alt: string; height?: number };
  children: React.ReactNode;
  maxWidth?: "lg" | "2xl" | "5xl";
  showNav?: boolean;
  showQuickLinks?: boolean;
  backHref?: string;
  backLabel?: string;
};

const maxWidthClass = {
  lg: "max-w-lg",
  "2xl": "max-w-2xl",
  "5xl": "max-w-5xl",
};

const glowClass: Record<PortalVariant, string> = {
  patient: "rm-glow-patient text-foreground",
  doctor: "rm-glow-doctor text-[var(--doctor-text)]",
  caregiver: "rm-glow-caregiver text-[var(--caregiver-text)]",
};

export function PortalShell({
  variant,
  label,
  title,
  subtitle,
  hero,
  children,
  maxWidth = "5xl",
  showNav = true,
  showQuickLinks = true,
  backHref,
  backLabel,
}: PortalShellProps) {
  const isProvider = variant === "doctor" || variant === "caregiver";

  return (
    <div className={`min-h-full rm-page-pad ${glowClass[variant]}`}>
      <Header linkHome variant={variant === "patient" ? "patient" : variant} />
      <main className={`mx-auto ${maxWidthClass[maxWidth]} px-4 pb-8 sm:px-6`}>
        {backHref && <PageBack href={backHref} label={backLabel} variant={variant} />}
        <div className="animate-fade-up pt-2">
          <p
            className={`text-[0.6875rem] font-semibold uppercase tracking-[0.12em] ${
              variant === "doctor"
                ? "text-teal"
                : variant === "caregiver"
                  ? "text-orange"
                  : "rm-label"
            }`}
          >
            {label}
          </p>
          <h1
            className={`mt-1.5 text-2xl font-semibold tracking-tight sm:text-[1.75rem] ${
              isProvider ? "" : "text-white"
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`mt-1.5 text-sm leading-relaxed ${
                isProvider
                  ? variant === "doctor"
                    ? "text-[var(--doctor-muted)]"
                    : "text-[var(--caregiver-muted)]"
                  : "text-body"
              }`}
            >
              {subtitle}
            </p>
          )}
          {showQuickLinks && <QuickLinks variant={variant} />}
          {hero && (
            <PageHeroImage src={hero.src} alt={hero.alt} className="mt-4" height={hero.height ?? 100} />
          )}
          <div className="rm-stack mt-5">{children}</div>
        </div>
      </main>
      {showNav && <BottomNav variant={variant} />}
    </div>
  );
}
