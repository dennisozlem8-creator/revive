import type { User } from "./users";
import { computeOutcomeMetrics } from "./progress-analytics";
import { generateTreatmentPlan, getCurrentPhase } from "./treatment-plan";
import { averagePain } from "./pain-tracker";
import { todayDateString } from "./streak";

export type EHRRecord = {
  patientId: string;
  patientName: string;
  dateOfRecord: string;
  injuryType: string;
  diagnosis: string;
  baselineRom: number;
  targetRom: number;
  currentRom: number;
  painToday: number | null;
  avgPain7d: number | null;
  medications: string;
  allergies: string;
  treatmentPhase: string;
  treatmentGoals: string[];
  sessionsTotal: number;
  compliancePercent: number;
  lastCheckIn: string | null;
  checkInSummary: string;
  providerNotes: string;
  vitals: { hr: number | null; emg: number | null };
};

export function buildEHRRecord(user: User): EHRRecord {
  const metrics = computeOutcomeMetrics(user);
  const plan = user.treatmentPlan ?? generateTreatmentPlan(user);
  const phase = getCurrentPhase(plan);
  const latestRom = user.romHistory?.[user.romHistory.length - 1];

  const injuryLabels: Record<string, string> = {
    knee: "Knee rehabilitation",
    ankle: "Ankle sprain recovery",
    elbow: "Elbow tendinopathy rehab",
    wrist: "Wrist overuse recovery",
    other: "Musculoskeletal rehabilitation",
  };

  return {
    patientId: user.email,
    patientName: user.name,
    dateOfRecord: todayDateString(),
    injuryType: user.injuryType,
    diagnosis: injuryLabels[user.injuryType] ?? injuryLabels.other,
    baselineRom: user.baselineRom,
    targetRom: user.targetRom,
    currentRom: latestRom?.peakAngle ?? user.baselineRom,
    painToday: user.painToday ?? null,
    avgPain7d: averagePain(user.painHistory ?? [], 7),
    medications: String(user.checkInAnswers?.medication ?? "Not recorded"),
    allergies: "None reported",
    treatmentPhase: `Week ${plan.currentWeek}: ${phase.focus}`,
    treatmentGoals: phase.goals,
    sessionsTotal: metrics.sessionsCompleted,
    compliancePercent: metrics.compliancePercent,
    lastCheckIn: user.lastCheckInDate ?? null,
    checkInSummary: user.checkInAnswers
      ? Object.entries(user.checkInAnswers)
          .slice(0, 4)
          .map(([k, v]) => `${k}: ${v}`)
          .join("; ")
      : "No check-in today",
    providerNotes: user.ptPrescription?.notes ?? "No provider notes on file.",
    vitals: {
      hr: latestRom?.hr ?? null,
      emg: latestRom?.emg ?? null,
    },
  };
}
