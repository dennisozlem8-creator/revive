"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/components/AuthProvider";
import { getAssessment } from "@/lib/assessments";
import { ExerciseCard } from "@/components/ExerciseCard";
import { t } from "@/lib/i18n";

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
    <div className="min-h-full rm-glow-patient pb-28 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-5xl px-6 pb-8">
        <h1 className="rm-title text-3xl text-white">{t("exerciseLibrary", locale)}</h1>
        <p className="mt-1 capitalize text-body">
          {user.injuryType} · ROM {user.baselineRom}° → {user.targetRom}°
        </p>

        <div className="mt-8 space-y-4">
          {exercises.map((exercise, i) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={i + 1}
              injuryType={user.injuryType}
              badge={
                user.ptPrescription?.exerciseName === exercise.name ? (
                  <span className="rounded-full bg-correct px-2.5 py-1 text-xs font-bold text-white">
                    {t("prescribedByPt", locale)}
                  </span>
                ) : undefined
              }
            />
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
