import type { User } from "./users";
import {
  getAssessment,
  getRecommendedExercises,
  type AssessmentAnswers,
  type Exercise,
  type RomValues,
} from "./assessments";
import { planExercisesForUser } from "./daily-plan";

const injuryToArea: Record<string, string> = {
  knee: "knee",
  ankle: "ankle",
  wrist: "wrist",
  elbow: "other",
  other: "other",
};

export function areaIdForInjury(injuryType: string) {
  return injuryToArea[injuryType] ?? "wrist";
}

export function getSessionRecommendations(
  areaId: string,
  user: Pick<User, "painToday" | "checkInAnswers" | "baselineRom" | "targetRom" | "dailyPlan" | "exerciseHistory" | "injuryType" | "ptPrescription" | "painHistory" | "romHistory">,
  sessionAngle: number,
  previousExerciseIds: string[] = []
): Exercise[] {
  const fromPlan = planExercisesForUser(user as User);
  if (fromPlan.length >= 3) return fromPlan;

  const assessment = getAssessment(areaId);
  if (!assessment) return fromPlan;

  let pain = user.painToday ?? 4;
  if (user.checkInAnswers?.swelling === "Noticeable") pain = Math.max(pain, 6);
  if (user.checkInAnswers?.energy && Number(user.checkInAnswers.energy) <= 2) {
    pain = Math.max(pain, 5);
  }

  const answers: AssessmentAnswers = { pain };
  const romValues: RomValues = {};

  for (const test of assessment.romTests) {
    const progress = sessionAngle / user.targetRom;
    romValues[test.id] = Math.round(test.normalMin * progress + sessionAngle * 0.3);
  }

  if (assessment.romTests[0]) {
    romValues[assessment.romTests[0].id] = sessionAngle;
  }

  const recommended = getRecommendedExercises(
    areaId,
    answers,
    romValues,
    previousExerciseIds
  );

  if (recommended.length >= 3) return recommended;

  const ids = new Set(recommended.map((e) => e.id));
  const fill = assessment.exercises.filter((e) => !ids.has(e.id)).slice(0, 3 - recommended.length);
  return [...recommended, ...fill];
}
