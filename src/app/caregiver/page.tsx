"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { StatTile } from "@/components/ui/StatTile";
import { useAuth } from "@/components/AuthProvider";
import { getNotificationsForUser, markNotificationsRead } from "@/lib/notifications";
import {
  patientCheckInSummary,
  patientNeedsEncouragement,
} from "@/lib/provider-helpers";
import { calculateStreak } from "@/lib/streak";
import type { AppNotification } from "@/lib/notifications";
import { t } from "@/lib/i18n";

export default function CaregiverDashboardPage() {
  const { user, getPatientsForCaregiver } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const patients = getPatientsForCaregiver();
  const locale = user?.language ?? "en";

  useEffect(() => {
    if (user?.role === "caregiver") {
      setNotifications(getNotificationsForUser(user.email));
      markNotificationsRead(user.email);
    }
  }, [user]);

  if (user?.role !== "caregiver") {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 rm-glow-patient p-6 text-center">
        <p className="text-muted">{t("caregiverOnly", locale)}</p>
        <Link href="/login" className="text-brand-light hover:text-brand">
          Sign in
        </Link>
      </div>
    );
  }

  const needsSupport = patients.filter((p) => patientNeedsEncouragement(p)).length;
  const avgStreak =
    patients.length > 0
      ? Math.round(patients.reduce((sum, p) => sum + calculateStreak(p), 0) / patients.length)
      : 0;

  return (
    <PortalShell
      variant="caregiver"
      label={t("caregiverPortal", locale)}
      title={t("caregiverDashboard", locale)}
      subtitle={t("caregiverSubtitle", locale)}
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatTile value={patients.length} label={t("lovedOnes", locale)} accent="orange" variant="caregiver" />
        <StatTile value={avgStreak} label={t("avgStreak", locale)} accent="correct" variant="caregiver" />
        <StatTile value={needsSupport} label={t("needSupport", locale)} accent="brand" variant="caregiver" />
      </div>

      <section className="rm-panel rm-panel--caregiver p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-orange">{t("caregiverAction", locale)}</p>
        <h2 className="mt-2 text-xl font-bold text-[var(--caregiver-text)]">{t("sendEncouragement", locale)}</h2>
        <p className="mt-1 text-sm text-[var(--caregiver-muted)]">{t("caregiverActionHint", locale)}</p>
        <Link href="/caregiver/support" className="rm-btn rm-btn-warm mt-4 inline-flex min-h-[3rem] text-sm">
          {t("openSupport", locale)} →
        </Link>
      </section>

      <section className="rm-panel rm-panel--caregiver overflow-hidden">
        <div className="border-b border-[#fde8d8] px-5 py-4 sm:px-6">
          <h2 className="text-xl font-bold text-[var(--caregiver-text)]">
            {t("wellbeingOverview", locale)} ({patients.length})
          </h2>
        </div>
        {patients.length === 0 ? (
          <p className="p-6 text-sm text-[var(--caregiver-muted)]">{t("noPatientsCaregiver", locale)}</p>
        ) : (
          <div className="divide-y divide-[#fde8d8]">
            {patients.map((patient) => {
              const needsHelp = patientNeedsEncouragement(patient);
              return (
                <article key={patient.email} className="flex flex-wrap gap-4 px-5 py-4 sm:px-6">
                  <div
                    className="mt-1 h-full w-1 shrink-0 rounded-full"
                    style={{ background: needsHelp ? "var(--almost)" : "var(--correct)" }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[var(--caregiver-text)]">{patient.name}</h3>
                    <p className="text-sm text-[var(--caregiver-muted)]">
                      {t("checkInStatus", locale)}: {patientCheckInSummary(patient)}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        needsHelp ? "bg-almost/15 text-almost" : "bg-correct/15 text-correct"
                      }`}
                    >
                      {needsHelp ? t("needsEncouragement", locale) : t("doingWell", locale)}
                    </span>
                  </div>
                  <div className="flex gap-4 text-right text-sm">
                    <div>
                      <p className="text-2xl font-bold text-orange">{calculateStreak(patient)}</p>
                      <p className="text-xs text-[var(--caregiver-muted)]">{t("streak", locale)}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-almost">{patient.painToday ?? "—"}/10</p>
                      <p className="text-xs text-[var(--caregiver-muted)]">{t("painToday", locale)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rm-panel rm-panel--caregiver p-5 sm:p-6">
        <h2 className="text-xl font-bold text-[var(--caregiver-text)]">{t("supportAlerts", locale)}</h2>
        <div className="mt-4 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-[var(--caregiver-muted)]">{t("noAlerts", locale)}</p>
          ) : (
            notifications.slice(0, 8).map((n) => (
              <div key={n.id} className="rounded-xl border border-[#fde8d8] bg-[#fffaf5] px-4 py-3">
                <p className="font-semibold text-[var(--caregiver-text)]">{n.title}</p>
                <p className="mt-1 text-sm text-[var(--caregiver-muted)]">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </PortalShell>
  );
}
