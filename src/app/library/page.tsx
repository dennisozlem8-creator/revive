"use client";

import { DashIntro, DashShell } from "@/components/clinic/DashKit";
import { useAuth } from "@/components/AuthProvider";
import { getAssessment } from "@/lib/assessments";
import { ExerciseCard } from "@/components/ExerciseCard";
import { t } from "@/lib/i18n";
import { getKidsExerciseImage } from "@/lib/exercise-media";

const injuryToArea: Record<string, string> = {
  knee: "knee",
  ankle: "ankle",
  wrist: "wrist",
  elbow: "other",
  other: "other",
};

export default function LibraryPage() {
  const { user } = useAuth();
  if (!user) return null;

  const locale = user.language ?? "en";
  const areaId = injuryToArea[user.injuryType] ?? "wrist";
  const assessment = getAssessment(areaId);
  const exercises = assessment?.exercises ?? [];

  return (
    <DashShell>
      <DashIntro
        kicker="Library"
        title={t("exerciseLibrary", locale)}
        text={`${user.injuryType} · baseline ${user.baselineRom}° · goal ${user.targetRom}°. Do the prescribed move first.`}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {exercises.length === 0 ? (
          <p className="text-base text-[#2f4a60]">No exercises for this injury yet. Start an assessment from home.</p>
        ) : (
          exercises.map((exercise, i) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={i + 1}
            injuryType={user.injuryType}
            cover={getKidsExerciseImage(exercise.id, exercise.name)}
            badge={
              user.ptPrescription?.exerciseName === exercise.name ? (
                <span className="rounded-full bg-[#3a7d62] px-2.5 py-1 text-xs font-bold text-white">
                  {t("prescribedByPt", locale)}
                </span>
              ) : undefined
            }
          />
        ))
        )}
      </div>
    </DashShell>
  );
}
