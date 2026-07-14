"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PortalShell } from "@/components/PortalShell";
import { StatTile } from "@/components/ui/StatTile";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak } from "@/lib/streak";
import { summarizeCheckIn } from "@/lib/pre-briefing-questions";
import { averagePain } from "@/lib/pain-tracker";
import { t } from "@/lib/i18n";

export default function BriefingPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const locale = user.language ?? "en";
  const prescription = user.ptPrescription;
  const plan = user.dailyPlan;
  const streak = calculateStreak(user);
  const lastRom = user.romHistory?.[user.romHistory.length - 1];
  const lastSession = user.exerciseHistory[user.exerciseHistory.length - 1];
  const dayNum = user.exerciseHistory.length + 1;
  const checkInSummary = user.checkInAnswers
    ? summarizeCheckIn(user.checkInAnswers)
    : null;
  const painAvg = averagePain(user.painHistory ?? [], 7);

  return (
    <PortalShell
      variant="patient"
      maxWidth="lg"
      label={`${t("recoveryDay", locale)} ${dayNum}`}
      title={t("todaysBriefing", locale)}
      subtitle={`Hi ${user.name.split(" ")[0]}`}
      showQuickLinks
    >
      {checkInSummary && (
        <div className="rm-callout">
          <span className="text-correct">✓</span> Check-in ·{" "}
          <span className="text-foreground">{checkInSummary}</span>
        </div>
      )}

      <section className="rm-card-elevated p-5">
        <p className="rm-label text-brand-light">{t("todaysExercise", locale)}</p>
        {plan && plan.exerciseNames.length > 0 ? (
          <>
            <h2 className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">
              Today&apos;s program · {plan.exerciseNames.length} exercises
            </h2>
            <ul className="mt-3 space-y-1.5">
              {plan.exerciseNames.map((name) => (
                <li key={name} className="flex items-center gap-2 text-sm text-body">
                  <span className="text-correct">•</span> {name}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted capitalize">{plan.intensity} session for {user.injuryType}</p>
          </>
        ) : (
          <>
            <h2 className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">
              {prescription?.exerciseName ?? "Resistance Band Extension"}
            </h2>
            <p className="mt-1.5 text-sm text-body">
              {prescription
                ? `${prescription.sets} × ${prescription.reps} reps · ${prescription.holdSeconds}s hold · ${prescription.targetAngle}°`
                : "3 × 10 reps · 12s hold"}
            </p>
          </>
        )}
      </section>

      <div className="grid grid-cols-3 gap-2">
        <StatTile value={`${lastSession?.exerciseIds.length ?? 0}/10`} label={t("lastReps", locale)} />
        <StatTile
          value={`${lastRom?.peakAngle ?? user.baselineRom + 30}°`}
          label={t("romNow", locale)}
          accent="correct"
        />
        <StatTile
          value={painAvg !== null ? `${painAvg}` : streak}
          label={painAvg !== null ? "Pain avg" : t("streak", locale)}
          accent={painAvg !== null ? "orange" : "orange"}
        />
      </div>

      {prescription?.notes && (
        <section className="rounded-xl border border-teal/20 bg-teal/5 px-4 py-3.5">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-teal">
            {t("ptUpdate", locale)}
          </p>
          <p className="mt-1.5 text-sm text-body">{prescription.notes}</p>
        </section>
      )}

      <button
        type="button"
        onClick={() => router.push("/pain-check")}
        className="rm-btn rm-btn-primary rm-btn-lg w-full"
      >
        {t("startSession", locale)}
      </button>

      <div className="grid grid-cols-2 gap-2">
        <Link href="/library" className="rm-btn rm-btn-ghost w-full">
          {t("library", locale)}
        </Link>
        <Link href="/pain-log" className="rm-btn rm-btn-ghost w-full">
          Pain log
        </Link>
      </div>
    </PortalShell>
  );
}
