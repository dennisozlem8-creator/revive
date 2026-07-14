import {
  getAssessment,
  getRecommendedExercises,
  type Exercise,
  type RomValues,
} from "./assessments";
import type { User } from "./users";
import { areaIdForInjury } from "./session-results";
import { averagePain } from "./pain-tracker";
import { todayDateString } from "./streak";

export type DailyPlan = {
  date: string;
  areaId: string;
  exerciseIds: string[];
  exerciseNames: string[];
  intensity: "gentle" | "moderate" | "progressive";
  /** Clinical rationale — shown to doctor only, not patient */
  rationale: string;
  factors: string[];
  generatedAt: string;
};

function derivePainLevel(user: User): number {
  let pain = user.painToday ?? 4;
  if (user.checkInAnswers?.swelling === "Noticeable") pain = Math.max(pain, 6);
  if (user.checkInAnswers?.energy && Number(user.checkInAnswers.energy) <= 2) {
    pain = Math.max(pain, 5);
  }
  const avg = averagePain(user.painHistory ?? [], 7);
  if (avg !== null) pain = Math.round((pain + avg) / 2);
  return pain;
}

function recentRomProgress(user: User): number {
  const last = user.romHistory?.[user.romHistory.length - 1];
  if (!last) return user.baselineRom;
  return last.peakAngle;
}

/** Generates injury-specific daily exercises. Rationale stays hidden from patients. */
export function generateDailyPlan(user: User): DailyPlan {
  const areaId = areaIdForInjury(user.injuryType);
  const assessment = getAssessment(areaId);
  const today = todayDateString();
  const pain = derivePainLevel(user);
  const currentRom = recentRomProgress(user);
  const romPct = user.targetRom > 0 ? currentRom / user.targetRom : 0.5;

  const previousIds = user.exerciseHistory.flatMap((r) => r.exerciseIds);
  const romValues: RomValues = {};
  if (assessment) {
    for (const test of assessment.romTests) {
      romValues[test.id] = Math.round(currentRom * (test.normalMin / user.targetRom));
    }
    if (assessment.romTests[0]) {
      romValues[assessment.romTests[0].id] = currentRom;
    }
  }

  let exercises: Exercise[] = [];
  if (assessment) {
    exercises = getRecommendedExercises(
      areaId,
      { pain },
      romValues,
      previousIds
    );
  }

  if (user.ptPrescription) {
    const rxMatch = assessment?.exercises.find(
      (e) =>
        e.name.toLowerCase().includes(user.ptPrescription!.exerciseName.toLowerCase().slice(0, 8)) ||
        user.ptPrescription!.exerciseName.toLowerCase().includes(e.name.toLowerCase().slice(0, 8))
    );
    if (rxMatch && !exercises.some((e) => e.id === rxMatch.id)) {
      exercises = [rxMatch, ...exercises].slice(0, 3);
    }
  }

  if (exercises.length < 3 && assessment) {
    const ids = new Set(exercises.map((e) => e.id));
    const fill = assessment.exercises.filter((e) => !ids.has(e.id)).slice(0, 3 - exercises.length);
    exercises = [...exercises, ...fill];
  }

  const intensity: DailyPlan["intensity"] =
    pain >= 7 ? "gentle" : pain >= 5 || romPct < 0.5 ? "gentle" : romPct >= 0.85 ? "progressive" : "moderate";

  const factors: string[] = [];
  if (pain >= 6) factors.push(`Elevated pain (${pain}/10)`);
  if (romPct < 0.6) factors.push(`ROM at ${Math.round(romPct * 100)}% of target`);
  if (romPct >= 0.85) factors.push("ROM near goal — progressive load");
  if (user.checkInAnswers?.swelling === "Noticeable") factors.push("Swelling reported");
  if (user.ptPrescription) factors.push(`PT Rx: ${user.ptPrescription.exerciseName}`);
  factors.push(`${user.injuryType} injury protocol`);

  const rationale = [
    `AI plan for ${user.injuryType} recovery (${intensity} intensity).`,
    factors.join(". ") + ".",
    `Selected ${exercises.length} exercises based on ROM ${currentRom}°/${user.targetRom}°,`,
    `pain ${pain}/10, and ${previousIds.length} prior sessions.`,
  ].join(" ");

  return {
    date: today,
    areaId,
    exerciseIds: exercises.map((e) => e.id),
    exerciseNames: exercises.map((e) => e.name),
    intensity,
    rationale,
    factors,
    generatedAt: new Date().toISOString(),
  };
}

export function planExercisesForUser(user: User): Exercise[] {
  const plan = user.dailyPlan;
  const areaId = areaIdForInjury(user.injuryType);
  const assessment = getAssessment(areaId);
  if (!assessment) return [];

  if (plan && plan.date === todayDateString() && plan.exerciseIds.length > 0) {
    const mapped = plan.exerciseIds
      .map((id) => assessment.exercises.find((e) => e.id === id))
      .filter((e): e is Exercise => Boolean(e));
    if (mapped.length > 0) return mapped;
  }

  return assessment.exercises.slice(0, 3);
}

export function isPlanStale(user: User): boolean {
  return !user.dailyPlan || user.dailyPlan.date !== todayDateString();
}
