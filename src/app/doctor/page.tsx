"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { getNotificationsForUser, markNotificationsRead } from "@/lib/notifications";
import { calculateStreak } from "@/lib/streak";
import { useEffect, useState } from "react";
import { isCareTeam } from "@/lib/users";
import type { AppNotification } from "@/lib/notifications";
import { loadMeasurements } from "@/lib/goniometer";
import { doctorWatchLevel, progressSnapshot } from "@/lib/recovery-plan";

export default function DoctorDashboardPage() {
  const { user, getPatientsForDoctor } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const patients = getPatientsForDoctor();

  useEffect(() => {
    if (isCareTeam(user?.role)) {
      setNotifications(getNotificationsForUser(user.email));
      markNotificationsRead(user.email);
    }
  }, [user]);

  if (!isCareTeam(user?.role)) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 rm-glow-patient p-6 text-center">
        <p className="text-muted">This page is for doctors and caregivers.</p>
        <Link href="/" className="text-brand-light hover:text-brand">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-full rm-glow-caregiver pb-24">
      <Header linkHome variant="caregiver" />
      <main className="mx-auto max-w-5xl px-6 pb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-teal">
          {user?.role === "caregiver" ? "Caregiver Dashboard" : "Doctor Dashboard"}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--caregiver-text)]">Your Patients</h1>
        <p className="mt-2 text-[var(--caregiver-muted)]">
          Monitor movement clips, form scores, and whether range is improving.
        </p>

        <Link
          href="/pt-update"
          className="rm-btn rm-btn-teal mt-6 inline-flex max-w-xs text-base"
        >
          Push exercise update →
        </Link>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#cbd5e1] bg-white shadow-sm">
          <div className="border-b border-[#e2e8f0] px-6 py-4">
            <h2 className="text-xl font-bold text-[var(--caregiver-text)]">
              Patients ({patients.length})
            </h2>
          </div>
          {patients.length === 0 ? (
            <p className="p-6 text-sm text-[var(--caregiver-muted)]">
              No patients linked yet.
            </p>
          ) : (
            <div className="divide-y divide-[#e2e8f0]">
              {patients.map((patient) => {
                const clips = loadMeasurements(patient.email);
                const watch = doctorWatchLevel(clips);
                const progress = progressSnapshot(clips, patient.targetRom || 100);
                const onTrack = watch.level === "on-track" && calculateStreak(patient) >= 1;
                return (
                  <article key={patient.email} className="flex gap-4 px-6 py-4">
                    <div
                      className="mt-1 w-1 shrink-0 rounded-full"
                      style={{ background: onTrack ? "var(--correct)" : "var(--almost)" }}
                    />
                    <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-[var(--caregiver-text)]">{patient.name}</h3>
                        <p className="text-sm text-[var(--caregiver-muted)]">{patient.email}</p>
                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                            watch.level === "on-track" ? "bg-correct/15 text-correct" : "bg-almost/15 text-almost"
                          }`}
                        >
                          {watch.label.toUpperCase()}
                        </span>
                        <p className="mt-2 max-w-md text-sm text-[var(--caregiver-muted)]">{watch.detail}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3 text-right text-sm">
                        <div className="flex gap-4">
                          <div>
                            <p className="text-2xl font-bold text-orange">{calculateStreak(patient)}</p>
                            <p className="text-xs text-[var(--caregiver-muted)]">Streak</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-correct">
                              {progress.latestPeak != null ? `${progress.latestPeak}°` : "—"}
                            </p>
                            <p className="text-xs text-[var(--caregiver-muted)]">Latest peak</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-brand">{clips.length}</p>
                            <p className="text-xs text-[var(--caregiver-muted)]">Clips</p>
                          </div>
                        </div>
                        <Link
                          href={`/doctor/patient?email=${encodeURIComponent(patient.email)}`}
                          className="text-sm font-semibold text-brand-light hover:text-brand"
                        >
                          Review movement →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#cbd5e1] bg-white shadow-sm p-6">
          <h2 className="text-xl font-bold text-[var(--caregiver-text)]">Daily notifications</h2>
          <div className="mt-4 space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-[var(--caregiver-muted)]">No notifications yet.</p>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div key={n.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
                  <p className="font-semibold text-[var(--caregiver-text)]">{n.title}</p>
                  <p className="mt-1 text-sm text-[var(--caregiver-muted)]">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
