"use client";

import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { TabRow } from "@/components/ui/TabRow";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak } from "@/lib/streak";
import { painTrend, averagePain } from "@/lib/pain-tracker";
import { t } from "@/lib/i18n";

type ChartTab = "rom" | "reps" | "pain";

export default function ChartsPage() {
  const { user, getPatientsForDoctor, getPatientsForCaregiver } = useAuth();
  const [tab, setTab] = useState<ChartTab>("rom");

  if (!user) return null;

  const locale = user.language ?? "en";
  const isDoctor = user.role === "doctor";
  const isCaregiver = user.role === "caregiver";
  const isProvider = isDoctor || isCaregiver;
  const patients = isDoctor ? getPatientsForDoctor() : isCaregiver ? getPatientsForCaregiver() : [];
  const sessions = user.exerciseHistory;
  const romValues = isProvider
    ? patients.map((p) => p.romHistory?.[p.romHistory.length - 1]?.peakAngle ?? p.baselineRom + 30)
    : (user.romHistory ?? []).map((r) => r.peakAngle);
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const targetRom = isProvider
    ? patients.length
      ? Math.round(patients.reduce((s, p) => s + p.targetRom, 0) / patients.length)
      : 90
    : user.targetRom;

  const shellVariant = isDoctor ? "doctor" : isCaregiver ? "caregiver" : "patient";
  const providerCard = isProvider
    ? `rounded-2xl border bg-white shadow-sm p-6 ${
        isDoctor ? "border-[#bae6fd]" : "border-[#fcd9bd]"
      }`
    : "rm-card p-6";

  return (
    <PortalShell
      variant={shellVariant}
      label={isProvider ? (isDoctor ? t("doctorPortal", locale) : t("caregiverPortal", locale)) : t("progressCharts", locale)}
      title={t("progressCharts", locale)}
      subtitle={
        isDoctor
          ? `${patients.length} ${t("patients", locale).toLowerCase()} · ${t("doctorChartsHint", locale)}`
          : isCaregiver
            ? `${patients.length} ${t("lovedOnes", locale).toLowerCase()} · ${t("caregiverChartsHint", locale)}`
            : `${sessions.length} sessions · ${calculateStreak(user)} day streak`
      }
    >
      <div className="mt-6">
        <TabRow
          tabs={[
            { id: "rom" as const, label: t("romTab", locale) },
            { id: "reps" as const, label: t("repsTab", locale) },
            { id: "pain" as const, label: t("painTab", locale) },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === "rom" && (
        <section className={`mt-6 ${providerCard}`}>
          <h2 className="font-semibold">
            {isDoctor
              ? t("patientRomOverview", locale)
              : isCaregiver
                ? t("lovedOneProgress", locale)
                : "ROM Recovery"}
          </h2>
          <div className="relative mt-6 flex h-48 items-end gap-2">
            {romValues.length === 0 ? (
              <p className={isProvider ? (isDoctor ? "text-[var(--doctor-muted)]" : "text-[var(--caregiver-muted)]") : "rm-body"}>
                {isProvider ? t("noPatientRom", locale) : "Complete a session to see your ROM chart."}
              </p>
            ) : (
              <>
                <div
                  className="pointer-events-none absolute inset-x-0 border-t border-dashed border-correct/60"
                  style={{ bottom: `${(targetRom / (targetRom + 10)) * 100}%` }}
                />
                <span
                  className="pointer-events-none absolute right-0 text-xs text-correct"
                  style={{ bottom: `${(targetRom / (targetRom + 10)) * 100 + 2}%` }}
                >
                  Goal {targetRom}°
                </span>
                {romValues.map((value, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-brand to-brand-light"
                      style={{ height: `${Math.min(100, (value / targetRom) * 100)}%` }}
                    />
                    <span className={`text-xs ${isProvider ? (isDoctor ? "text-[var(--doctor-muted)]" : "text-[var(--caregiver-muted)]") : "text-muted"}`}>
                      {isProvider ? patients[i]?.name.split(" ")[0] ?? `P${i + 1}` : `S${i + 1}`}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      )}

      {tab === "reps" && (
        <>
          <section className={`mt-6 ${providerCard}`}>
            <h2 className="font-semibold">
              {isDoctor ? t("patientCompliance", locale) : isCaregiver ? t("streakProgress", locale) : "Weekly Reps"}
            </h2>
            <div className="mt-6 flex h-40 items-end gap-3">
              {(isProvider ? patients : weekDays.map((day) => ({ day }))).map((item, i) => {
                const met = isProvider
                  ? calculateStreak(patients[i]) >= 2
                  : i < user.activityDates.length;
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: met ? `${60 + i * 5}%` : "12%",
                        backgroundColor: met ? "var(--correct)" : "var(--surface-elevated)",
                      }}
                    />
                    <span className={`text-xs ${isProvider ? (isDoctor ? "text-[var(--doctor-muted)]" : "text-[var(--caregiver-muted)]") : "text-muted"}`}>
                      {isProvider
                        ? patients[i]?.name.split(" ")[0] ?? `P${i + 1}`
                        : (item as { day: string }).day}
                    </span>
                  </div>
                );
              })}
              {isProvider && patients.length === 0 && (
                <p className={`text-sm ${isDoctor ? "text-[var(--doctor-muted)]" : "text-[var(--caregiver-muted)]"}`}>
                  {t("noPatients", locale)}
                </p>
              )}
            </div>
          </section>
          {!isProvider && (
            <section className="rm-card mt-6 p-6">
              <h2 className="font-semibold">4-Week Compliance</h2>
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {Array.from({ length: 28 }, (_, i) => {
                  const active = i < user.activityDates.length;
                  const partial = i === user.activityDates.length;
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-md"
                      style={{
                        backgroundColor: active
                          ? "rgba(16,185,129,0.85)"
                          : partial
                            ? "rgba(245,158,11,0.6)"
                            : "#1a2f4a",
                      }}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      {tab === "pain" && (
        <section className={`mt-6 ${providerCard}`}>
          <h2 className="font-semibold">
            {isProvider ? t("patientPainAlerts", locale) : "Pain Trend"}
          </h2>
          {isProvider ? (
            <div className="mt-4 space-y-3">
              {patients.length === 0 ? (
                <p className="text-sm text-[var(--caregiver-muted)]">{t("noPatients", locale)}</p>
              ) : (
                patients.map((p) => (
                  <div
                    key={p.email}
                    className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3"
                  >
                    <span className="font-medium">{p.name}</span>
                    <span
                      className={`font-bold ${(p.painToday ?? 0) >= 7 ? "text-alert" : "text-correct"}`}
                    >
                      {(p.painToday ?? "—")}/10
                    </span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              <p className="mt-2 rm-body">
                Today: <strong className="text-foreground">{user.painToday ?? "—"}/10</strong>
                {averagePain(user.painHistory ?? [], 7) !== null && (
                  <> · 7-day avg <strong>{averagePain(user.painHistory ?? [], 7)}</strong></>
                )}
              </p>
              <div className="mt-6 flex h-32 items-end gap-2">
                {painTrend(user.painHistory ?? [], 14).map((d, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-alert/80 to-almost/60"
                      style={{
                        height: d.level > 0 ? `${Math.max(8, (d.level / 10) * 100)}%` : "4px",
                      }}
                    />
                    <span className="text-xs text-muted">{d.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted">From your pain log and session check-ins</p>
            </>
          )}
        </section>
      )}
    </PortalShell>
  );
}
