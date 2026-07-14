import Link from "next/link";

type CaregiverPortalHintProps = {
  variant?: "default" | "compact";
};

export function CaregiverPortalHint({ variant = "default" }: CaregiverPortalHintProps) {
  if (variant === "compact") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/doctor"
          className="group rounded-xl border border-teal/25 bg-teal/5 p-4 transition hover:border-teal/40 hover:bg-teal/10"
        >
          <span className="text-lg" aria-hidden>
            🩺
          </span>
          <p className="mt-2 text-sm font-semibold text-teal">Doctor</p>
          <p className="mt-0.5 text-xs text-muted">Clinical dashboard</p>
        </Link>
        <Link
          href="/caregiver"
          className="group rounded-xl border border-orange/25 bg-orange/5 p-4 transition hover:border-orange/40 hover:bg-orange/10"
        >
          <span className="text-lg" aria-hidden>
            💛
          </span>
          <p className="mt-2 text-sm font-semibold text-orange">Caregiver</p>
          <p className="mt-0.5 text-xs text-muted">Family support</p>
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
