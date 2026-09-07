"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { GoniometerProgressChart } from "@/components/GoniometerProgressChart";
import { ProgressInsight } from "@/components/ProgressInsight";
import { loadMeasurements } from "@/lib/goniometer";
import { doctorWatchLevel } from "@/lib/recovery-plan";
import { isCareTeam } from "@/lib/users";

function PatientMovementView() {
  const { user, getPatientsForDoctor } = useAuth();
  const params = useSearchParams();
  const email = (params.get("email") ?? "").toLowerCase();
  const patient = getPatientsForDoctor().find((row) => row.email.toLowerCase() === email);
  const rows = useMemo(() => (email ? loadMeasurements(email) : []), [email]);
  const watch = doctorWatchLevel(rows);
  const goal = patient?.targetRom || 100;

  if (!isCareTeam(user?.role)) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <Link href="/" className="text-brand-light">Go home</Link>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-full rm-glow-caregiver p-6">
        <Header linkHome variant="caregiver" />
        <p className="mt-8 text-center text-sm text-[var(--caregiver-muted)]">Patient not found.</p>
        <p className="mt-4 text-center">
          <Link href="/doctor" className="text-brand-light">Back to patients</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full rm-glow-caregiver pb-16">
      <Header linkHome variant="caregiver" />
      <main className="mx-auto max-w-3xl px-6 pb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-teal">Movement review</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--caregiver-text)]">{patient.name}</h1>
        <p className="mt-1 text-sm text-[var(--caregiver-muted)]">{patient.email}</p>
        <p className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
          watch.level === "on-track" ? "bg-correct/15 text-correct" : "bg-almost/15 text-almost"
        }`}>
          {watch.label}
        </p>
        <p className="mt-3 text-sm text-body">{watch.detail}</p>

        <div className="mt-6 space-y-4">
          <ProgressInsight rows={rows} goal={goal} />
          <section className="rm-card p-5">
            <h2 className="font-semibold">Peak angle over time</h2>
            <div className="mt-4">
              <GoniometerProgressChart measurements={rows} goal={goal} />
            </div>
          </section>
          <section className="rm-card p-5">
            <h2 className="font-semibold">Saved clips</h2>
            {rows.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No Photo Goniometer clips yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {rows.slice().reverse().map((row) => (
                  <li key={row.id} className="rounded-xl border border-[var(--border)] bg-background px-4 py-3 text-sm">
                    <p className="font-medium">
                      {row.angle}° · {row.exercise}
                      {row.formScore != null ? ` · form ${row.formScore}` : ""}
                      {row.source === "video" ? " · video" : " · photo"}
                    </p>
                    <p className="text-muted">
                      {new Date(row.date).toLocaleString()}
                      {row.minAngle != null ? ` · min ${row.minAngle}°` : ""}
                      {row.range != null ? ` · range ${row.range}°` : ""}
                    </p>
                    {row.nextAction && <p className="mt-1 text-body">{row.nextAction}</p>}
                    {row.flags && row.flags.length > 0 && (
                      <p className="mt-1 text-xs text-almost">Flags: {row.flags.join(", ")}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/pt-update" className="rm-btn rm-btn-teal flex-1 text-center">
            Push exercise update
          </Link>
          <Link href="/doctor" className="rm-btn rm-btn-ghost flex-1 text-center">
            All patients
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function DoctorPatientPage() {
  return (
    <Suspense fallback={<div className="flex min-h-full items-center justify-center text-muted">Loading patient…</div>}>
      <PatientMovementView />
    </Suspense>
  );
}
