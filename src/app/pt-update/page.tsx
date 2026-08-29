"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { StatTile } from "@/components/ui/StatTile";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak } from "@/lib/streak";

export default function PTUpdatePage() {
  const { user, getPatientsForDoctor, setPatientPrescription } = useAuth();
  const [selectedEmail, setSelectedEmail] = useState("");
  const [exerciseName, setExerciseName] = useState("Resistance Band Extension");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [hold, setHold] = useState(12);
  const [angle, setAngle] = useState(90);
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  const patients = getPatientsForDoctor();
  const patient = patients.find((p) => p.email === selectedEmail);

  if (user?.role !== "doctor") {
    return (
      <div className="flex min-h-full items-center justify-center rm-glow-patient">
        <Link href="/" className="text-brand-light">
          Go home
        </Link>
      </div>
    );
  }

  function pushUpdate() {
    if (!selectedEmail) return;
    setPatientPrescription(selectedEmail, {
      exerciseName,
      sets,
      reps,
      holdSeconds: hold,
      targetAngle: angle,
      notes,
      updatedAt: new Date().toISOString(),
    });
    setSent(true);
  }

  return (
    <div className="min-h-full rm-glow-patient pb-24 text-foreground">
      <Header linkHome variant="caregiver" />
      <main className="mx-auto max-w-2xl px-6 pb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-teal">PT Portal</p>
        <h1 className="rm-title mt-1 text-3xl text-foreground">Update Exercise Plan</h1>
        <p className="mt-1 text-body">Push a new prescription to your patient&apos;s briefing.</p>

        <select
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
          className="rm-card mt-6 w-full px-4 py-4 text-base"
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.email} value={p.email}>
              {p.name}
            </option>
          ))}
        </select>

        {patient && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            <StatTile value="87%" label="Compliance" accent="brand" />
            <StatTile value={`${patient.baselineRom + 30}°`} label="ROM" accent="correct" />
            <StatTile value={calculateStreak(patient)} label="Streak" accent="orange" />
          </div>
        )}

        <div className="rm-card-elevated mt-6 space-y-4 p-6">
          <input
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-background px-4 py-4 text-base"
            placeholder="Exercise name"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Sets", value: sets, set: setSets },
              { label: "Reps", value: reps, set: setReps },
              { label: "Hold (s)", value: hold, set: setHold },
              { label: "Angle°", value: angle, set: setAngle },
            ].map((field) => (
              <div key={field.label}>
                <label className="rm-label mb-1 block">{field.label}</label>
                <input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.set(Number(e.target.value))}
                  className="w-full rounded-xl border border-[var(--border)] bg-background px-3 py-3 text-center text-lg font-bold"
                />
              </div>
            ))}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-background px-4 py-4 text-base"
            placeholder="Notes for patient"
            rows={3}
          />
          <button type="button" onClick={pushUpdate} className="rm-btn rm-btn-teal w-full">
            Push Update to Patient
          </button>
          {sent && (
            <p className="text-center text-base font-semibold text-teal">
              Plan updated! Patient sees this on next briefing.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
