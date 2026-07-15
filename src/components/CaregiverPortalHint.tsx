import Link from "next/link";

type CaregiverPortalHintProps = {
  variant?: "default" | "compact";
};

export function CaregiverPortalHint({ variant = "default" }: CaregiverPortalHintProps) {
  if (variant === "compact") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Link href="/doctor" className="rm-portal-tile rm-portal-tile--doctor">
          <span className="rm-portal-tile-icon" aria-hidden>
            🩺
          </span>
          <p className="rm-portal-tile-title text-teal">Doctor</p>
          <p className="rm-portal-tile-desc">Clinical dashboard</p>
        </Link>
        <Link href="/caregiver" className="rm-portal-tile rm-portal-tile--caregiver">
          <span className="rm-portal-tile-icon" aria-hidden>
            💛
          </span>
          <p className="rm-portal-tile-title text-orange">Caregiver</p>
          <p className="rm-portal-tile-desc">Family support</p>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="rounded-xl border border-[var(--doctor-border)] bg-white p-4">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-teal">Doctor</p>
        <p className="mt-1 text-xs text-muted">Prescriptions, ROM, clinical alerts</p>
        <div className="mt-3 flex gap-2">
          <Link href="/doctor" className="rm-btn rm-btn-teal min-h-[2.5rem] flex-1 text-xs">
            Dashboard
          </Link>
          <Link
            href="/pt-update"
            className="flex flex-1 items-center justify-center rounded-lg border border-[var(--doctor-border)] text-xs font-medium text-[var(--doctor-muted)] hover:bg-slate-50"
          >
            PT Portal
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--caregiver-border)] bg-white p-4">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-orange">Caregiver</p>
        <p className="mt-1 text-xs text-muted">Wellbeing, streaks, encouragement</p>
        <div className="mt-3 flex gap-2">
          <Link href="/caregiver" className="rm-btn rm-btn-warm min-h-[2.5rem] flex-1 text-xs">
            Home
          </Link>
          <Link
            href="/caregiver/support"
            className="flex flex-1 items-center justify-center rounded-lg border border-[var(--caregiver-border)] text-xs font-medium text-[var(--caregiver-muted)] hover:bg-orange-50"
          >
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
