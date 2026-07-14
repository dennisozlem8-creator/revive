"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PortalShell } from "@/components/PortalShell";
import { useAuth } from "@/components/AuthProvider";
import { buildEHRRecord } from "@/lib/ehr";
import { computeOutcomeMetrics } from "@/lib/progress-analytics";
import { generateTreatmentPlan, getCurrentPhase, treatmentPlanProgress } from "@/lib/treatment-plan";
import { t, resolveLocale } from "@/lib/i18n";
import Link from "next/link";

export default function HealthRecordPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"ehr" | "plan" | "analytics">("ehr");

  if (!user || user.role !== "patient") return null;

  const locale = resolveLocale(user);
  const ehr = buildEHRRecord(user);
  const metrics = computeOutcomeMetrics(user);
  const plan = user.treatmentPlan ?? generateTreatmentPlan(user);
  const phase = getCurrentPhase(plan);
  const planNotes = treatmentPlanProgress(user, plan);

  const trendLabel =
    metrics.painTrend === "improving"
      ? t("improving", locale)
      : metrics.painTrend === "worsening"
        ? t("worsening", locale)
        : t("stable", locale);

  return (
    <PortalShell
      variant="patient"
      label={t("healthRecord", locale)}
      title={t("ehrTitle", locale)}
      subtitle={t("ehrSubtitle", locale)}
    >
      <div className="mt-4 flex flex-wrap gap-2">
        {(["ehr", "plan", "analytics"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === id ? "bg-brand text-white" : "bg-surface-elevated text-muted"
            }`}
          >
            {id === "ehr"
              ? t("ehrTitle", locale)
              : id === "plan"
                ? t("treatmentPlan", locale)
                : t("outcomeAnalytics", locale)}
          </button>
        ))}
      </div>

      {tab === "ehr" && (
        <section className="rm-card mt-6 space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="rm-label">{t("diagnosis", locale)}</p>
              <p className="mt-1 text-lg font-semibold">{ehr.diagnosis}</p>
            </div>
            <div>
              <p className="rm-label">ROM</p>
              <p className="mt-1 text-lg font-semibold">
                {ehr.baselineRom}° → {ehr.currentRom}° / {ehr.targetRom}°
              </p>
            </div>
            <div>
              <p className="rm-label">{t("medications", locale)}</p>
              <p className="mt-1 text-base">{ehr.medications}</p>
            </div>
            <div>
              <p className="rm-label">{t("painToday", locale)}</p>
              <p className="mt-1 text-lg font-semibold">
                {ehr.painToday !== null ? `${ehr.painToday}/10` : "—"}
              </p>
            </div>
          </div>
          <div>
            <p className="rm-label">{t("providerNotes", locale)}</p>
            <p className="mt-1 text-base text-body">{ehr.providerNotes}</p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/pain-log" className="rm-btn rm-btn-ghost text-sm">
              {t("painLog", locale)}
            </Link>
            <Link href="/notifications" className="rm-btn rm-btn-ghost text-sm">
              {t("reminders", locale)}
            </Link>
          </div>
        </section>
      )}

      {tab === "plan" && (
        <section className="rm-card mt-6 p-6">
          <p className="rm-label">
            {t("treatmentPlan", locale)} · {locale === "es" ? "Semana" : "Week"} {plan.currentWeek} / {plan.totalWeeks}
          </p>
          <h2 className="mt-2 text-xl font-bold">{phase.focus}</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-base text-body">
            {phase.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
          <p className="rm-label mt-6">{t("treatmentGoals", locale)}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {phase.exercises.map((ex) => (
              <span key={ex} className="rounded-full bg-brand/15 px-3 py-1.5 text-sm font-medium text-brand-light">
                {ex}
              </span>
            ))}
          </div>
          {planNotes.map((note) => (
            <p key={note} className="mt-4 text-sm text-muted">
              {note}
            </p>
          ))}
        </section>
      )}

      {tab === "analytics" && (
        <section className="rm-card mt-6 p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-elevated p-4 text-center">
              <p className="text-3xl font-bold text-brand-light">{metrics.compliancePercent}%</p>
              <p className="mt-1 text-sm text-muted">{t("complianceLabel", locale)}</p>
            </div>
            <div className="rounded-xl bg-surface-elevated p-4 text-center">
              <p className="text-3xl font-bold text-correct">+{metrics.romGain}°</p>
              <p className="mt-1 text-sm text-muted">{t("romGain", locale)}</p>
            </div>
            <div className="rounded-xl bg-surface-elevated p-4 text-center">
              <p className="text-3xl font-bold text-gold">{metrics.sessionsCompleted}</p>
              <p className="mt-1 text-sm text-muted">{t("sessionsTotal", locale)}</p>
            </div>
            <div className="rounded-xl bg-surface-elevated p-4 text-center">
              <p className="text-3xl font-bold text-purple">{metrics.romGoalPercent}%</p>
              <p className="mt-1 text-sm text-muted">ROM goal</p>
            </div>
            <div className="rounded-xl bg-surface-elevated p-4 text-center">
              <p className="text-3xl font-bold text-almost">
                {metrics.avgPain7d !== null ? `${metrics.avgPain7d}/10` : "—"}
              </p>
              <p className="mt-1 text-sm text-muted">{t("avgPain7d", locale)}</p>
            </div>
            <div className="rounded-xl bg-surface-elevated p-4 text-center">
              <p className="text-3xl font-bold text-teal">{trendLabel}</p>
              <p className="mt-1 text-sm text-muted">{t("painTrendLabel", locale)}</p>
            </div>
          </div>
        </section>
      )}
    </PortalShell>
  );
}
