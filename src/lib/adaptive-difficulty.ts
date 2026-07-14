import type { User } from "./users";
import type { Exercise } from "./assessments";
import { patientCompliance } from "./progress-analytics";
import { averagePain } from "./pain-tracker";

export type AdaptiveSettings = {
  targetReps: number;
  targetAngle: number;
  holdSeconds: number;
  intensity: "gentle" | "moderate" | "progressive";
  reason: string;
};

function parseReps(sets: string): number {
  const match = sets.match(/(\d+)\s*reps/i);
  return match ? Number(match[1]) : 10;
}

export function computeAdaptiveSettings(user: User, exercise: Exercise): AdaptiveSettings {
  const baseReps = user.ptPrescription?.reps ?? parseReps(exercise.sets);
  const baseAngle = user.ptPrescription?.targetAngle ?? user.targetRom;
  const baseHold = user.ptPrescription?.holdSeconds ?? 12;
  const pain = user.painToday ?? averagePain(user.painHistory ?? [], 3) ?? 4;
  const compliance = patientCompliance(user);
  const latestRom = user.romHistory?.[user.romHistory.length - 1]?.peakAngle ?? user.baselineRom;
  const romPct = user.targetRom > 0 ? latestRom / user.targetRom : 0.5;

  let targetReps = baseReps;
  let targetAngle = baseAngle;
  let holdSeconds = baseHold;
  let intensity: AdaptiveSettings["intensity"] = "moderate";
  let reason = "Standard prescription for today.";

  if (pain >= 7) {
    targetReps = Math.max(5, Math.round(baseReps * 0.5));
    targetAngle = Math.round(baseAngle * 0.7);
    holdSeconds = Math.max(5, Math.round(baseHold * 0.6));
    intensity = "gentle";
    reason = "High pain today — reduced reps and range for safety.";
  } else if (pain >= 5) {
    targetReps = Math.max(6, Math.round(baseReps * 0.75));
    targetAngle = Math.round(baseAngle * 0.85);
    intensity = "gentle";
    reason = "Moderate pain — slightly easier targets today.";
  } else if (romPct >= 0.85 && compliance >= 70 && pain <= 3) {
    targetReps = Math.min(baseReps + 2, 15);
    targetAngle = Math.min(baseAngle + 5, user.targetRom);
    intensity = "progressive";
    reason = "Strong progress — progressive challenge applied.";
  } else if (compliance < 40) {
    targetReps = Math.max(5, Math.round(baseReps * 0.8));
    intensity = "gentle";
    reason = "Building consistency — shorter set to help you finish.";
  }

  if (user.checkInAnswers?.energy && Number(user.checkInAnswers.energy) <= 2) {
    targetReps = Math.max(5, targetReps - 2);
    reason = "Low energy reported — easier session today.";
  }

  return { targetReps, targetAngle, holdSeconds, intensity, reason };
}
