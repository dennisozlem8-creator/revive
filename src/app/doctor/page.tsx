"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { StatTile } from "@/components/ui/StatTile";
import { useAuth } from "@/components/AuthProvider";
import { getNotificationsForUser, markNotificationsRead } from "@/lib/notifications";
import { patientCompliance } from "@/lib/provider-helpers";
import { calculateStreak } from "@/lib/streak";
import type { AppNotification } from "@/lib/notifications";
import { t } from "@/lib/i18n";

export default function DoctorDashboardPage() {
  const { user, getPatientsForDoctor } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const patients = getPatientsForDoctor();
  const locale = user?.language ?? "en";

  useEffect(() => {
    if (user?.role === "doctor") {
      setNotifications(getNotificationsForUser(user.email));
      markNotificationsRead(user.email);
    }
  }, [user]);

  if (user?.role !== "doctor") {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 rm-glow-patient p-6 text-center">
        <p className="text-muted">{t("doctorOnly", locale)}</p>
        <Link href="/login" className="text-brand-light hover:text-brand">
          Sign in
        </Link>
      </div>
    );
  }

  const avgRom =
    patients.length > 0
      ? Math.round(patients.reduce((sum, p) => sum + p.baselineRom + 30, 0) / patients.length)
      : 0;
  const avgCompliance =
    patients.length > 0
      ? Math.round(patients.reduce((sum, p) => sum + patientCompliance(p), 0) / patients.length)
      : 0;

  return (
    <PortalShell
      variant="doctor"
      label={t("doctorPortal", locale)}
      title={t("doctorDashboard", locale)}
      subtitle={t("doctorSubtitle", locale)}
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatTile value={patients.length} label={t("patients", locale)} accent="teal" variant="doctor" />
        <StatTile value={`${avgRom}°`} label={t("avgRom", locale)} accent="correct" variant="doctor" />
        <StatTile value={`${avgCompliance}%`} label={t("compliance", locale)} accent="brand" variant="doctor" />
      </div>

      <section className="rm-panel p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-teal">{t("doctorAction", locale)}</p>
        <h2 className="mt-2 text-xl font-bold text-[var(--doctor-text)]">{t("pushPrescription", locale)}</h2>
        <p className="mt-1 text-sm text-[var(--doctor-muted)]">{t("doctorActionHint", locale)}</p>
        <Link href="/pt-update" className="rm-btn rm-btn-teal mt-4 inline-flex min-h-[3rem] text-sm">
          {t("openPtPortal", locale)} →
        </Link>
      </section>

      <section className="rm-panel overflow-hidden">
        <div className="border-b border-[#e2e8f0] px-5 py-4 sm:px-6">
          <h2 className="text-xl font-bold text-[var(--doctor-text)]">
            {t("clinicalOverview", locale)} ({patients.length})
          </h2>
        </div>
        {patients.length === 0 ? (
          <p className="p-6 text-sm text-[var(--doctor-muted)]">{t("noPatientsDoctor", locale)}</p>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {patients.map((patient) => (
              <article key={patient.email} className="flex flex-wrap gap-4 px-5 py-4 sm:px-6">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[var(--doctor-text)]">{patient.name}</h3>
                  <p className="text-sm text-[var(--doctor-muted)]">{patient.injuryType} · {patient.email}</p>
                  {patient.ptPrescription && (
                    <p className="mt-2 text-xs text-teal">
                      Rx: {patient.ptPrescription.exerciseName} · {patient.ptPrescription.targetAngle}°
                    </p>
                  )}
                  {patient.dailyPlan && (
                    <div className="mt-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2">
                      <p className="text-[0.625rem] font-semibold uppercase tracking-wider text-teal">
                        AI daily plan · {patient.dailyPlan.intensity}
                      </p>
                      <p className="mt-1 text-xs text-[var(--doctor-muted)]">{patient.dailyPlan.rationale}</p>
                      <p className="mt-1 text-xs text-[var(--doctor-text)]">
                        {patient.dailyPlan.exerciseNames.join(" · ")}
                      </p>
                    </div>
                  )}
                  {(patient.painHistory?.length ?? 0) > 0 && (
                    <p className="mt-2 text-xs text-[var(--doctor-muted)]">
                      Pain: {patient.painToday ?? patient.painHistory![patient.painHistory!.length - 1].level}/10
                      {patient.painHistory!.length >= 3 && " · trend logged"}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 text-right text-sm">
                  <div>
                    <p className="text-2xl font-bold text-correct">
                      {patient.romHistory?.[patient.romHistory.length - 1]?.peakAngle ?? patient.baselineRom + 30}°
                    </p>
                    <p className="text-xs text-[var(--doctor-muted)]">{t("romNow", locale)}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand">{patientCompliance(patient)}%</p>
                    <p className="text-xs text-[var(--doctor-muted)]">{t("compliance", locale)}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange">{calculateStreak(patient)}</p>
                    <p className="text-xs text-[var(--doctor-muted)]">{t("streak", locale)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rm-panel p-5 sm:p-6">
        <h2 className="text-xl font-bold text-[var(--doctor-text)]">{t("clinicalAlerts", locale)}</h2>
        <div className="mt-4 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-[var(--doctor-muted)]">{t("noAlerts", locale)}</p>
          ) : (
            notifications.slice(0, 8).map((n) => (
              <div key={n.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
                <p className="font-semibold text-[var(--doctor-text)]">{n.title}</p>
                <p className="mt-1 text-sm text-[var(--doctor-muted)]">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </PortalShell>
  );
}
