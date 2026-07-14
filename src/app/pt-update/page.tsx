"use client";

import { useState } from "react";
import Link from "next/link";
import { PortalShell } from "@/components/PortalShell";
import { StatTile } from "@/components/ui/StatTile";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak } from "@/lib/streak";
import { t } from "@/lib/i18n";

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
  const locale = user?.language ?? "en";

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
    <PortalShell
      variant="doctor"
      maxWidth="2xl"
      label={t("ptPortal", locale)}
      title={t("updateExercisePlan", locale)}
      subtitle={t("ptPortalSubtitle", locale)}
    >
      <select
        value={selectedEmail}
        onChange={(e) => {
          setSelectedEmail(e.target.value);
          setSent(false);
        }}
        className="mt-6 w-full rounded-2xl border border-[#cbd5e1] bg-white px-4 py-4 text-base shadow-sm"
      >
        <option value="">{t("selectPatient", locale)}</option>
        {patients.map((p) => (
          <option key={p.email} value={p.email}>
            {p.name}
          </option>
        ))}
      </select>

      {patient && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatTile value="87%" label={t("compliance", locale)} accent="teal" variant="doctor" />
          <StatTile
            value={`${patient.baselineRom + 30}°`}
            label={t("romNow", locale)}
            accent="correct"
            variant="doctor"
          />
          <StatTile
            value={calculateStreak(patient)}
            label={t("streak", locale)}
            accent="orange"
            variant="doctor"
          />
        </div>
      )}

      <div className="mt-6 space-y-4 rounded-2xl border border-[#cbd5e1] bg-white p-6 shadow-sm">
        <input
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-4 text-base"
          placeholder={t("exerciseName", locale)}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: t("sets", locale), value: sets, set: setSets },
            { label: t("reps", locale), value: reps, set: setReps },
            { label: t("holdSeconds", locale), value: hold, set: setHold },
            { label: t("targetAngle", locale), value: angle, set: setAngle },
          ].map((field) => (
            <div key={field.label}>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--caregiver-muted)]">
                {field.label}
              </label>
              <input
                type="number"
                value={field.value}
                onChange={(e) => field.set(Number(e.target.value))}
                className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-3 text-center text-lg font-bold"
              />
            </div>
          ))}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-4 text-base"
          placeholder={t("notesForPatient", locale)}
          rows={3}
        />
        <button type="button" onClick={pushUpdate} className="rm-btn rm-btn-teal w-full">
          {t("pushToPatient", locale)}
        </button>
        {sent && (
          <p className="text-center text-base font-semibold text-teal">{t("planUpdated", locale)}</p>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-[var(--caregiver-muted)]">
        <Link href="/doctor" className="font-medium text-teal hover:underline">
          ← {t("backToDashboard", locale)}
        </Link>
      </p>
    </PortalShell>
  );
}
