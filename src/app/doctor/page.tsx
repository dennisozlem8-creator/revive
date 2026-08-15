"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { getNotificationsForUser, markNotificationsRead } from "@/lib/notifications";
import { calculateStreak } from "@/lib/streak";
import { useEffect, useState } from "react";
import type { AppNotification } from "@/lib/notifications";

export default function DoctorDashboardPage() {
  const { user, getPatientsForDoctor } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const patients = getPatientsForDoctor();

  useEffect(() => {
    if (user?.role === "doctor") {
      setNotifications(getNotificationsForUser(user.email));
      markNotificationsRead(user.email);
    }
  }, [user]);

  if (user?.role !== "doctor") {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 rm-glow-patient p-6 text-center">
        <p className="text-muted">This page is for doctors only.</p>
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
        <p className="text-xs font-bold uppercase tracking-widest text-teal">Caregiver Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--caregiver-text)]">Your Patients</h1>
        <p className="mt-2 text-[var(--caregiver-muted)]">
          Monitor recovery, streaks, and daily alerts.
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
                const onTrack = calculateStreak(patient) >= 2;
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
                            onTrack ? "bg-correct/15 text-correct" : "bg-almost/15 text-almost"
                          }`}
                        >
                          {onTrack ? "ON TRACK" : "NEEDS ATTENTION"}
                        </span>
                      </div>
                      <div className="flex gap-4 text-right text-sm">
                        <div>
                          <p className="text-2xl font-bold text-orange">{calculateStreak(patient)}</p>
                          <p className="text-xs text-[var(--caregiver-muted)]">Streak</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-correct">{patient.baselineRom + 30}°</p>
                          <p className="text-xs text-[var(--caregiver-muted)]">ROM</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-brand">{patient.exerciseHistory.length}</p>
                          <p className="text-xs text-[var(--caregiver-muted)]">Sessions</p>
                        </div>
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
