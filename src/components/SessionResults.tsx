"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { ExerciseCard } from "./ExerciseCard";
import { QuestGame } from "./QuestGame";
import { StatTile } from "./ui/StatTile";
import { areaIdForInjury, getSessionRecommendations } from "@/lib/session-results";
import type { Exercise } from "@/lib/assessments";
import { getExerciseMedia } from "@/lib/exercise-media";

export type SessionSummary = {
  angle: number;
  reps: number;
  emg: number;
  hr: number;
  target: number;
};

type SessionResultsProps = {
  summary: SessionSummary;
  onDone: () => void;
};

export function SessionResults({ summary, onDone }: SessionResultsProps) {
  const { user, saveExerciseHistory, getPreviousExerciseIds } = useAuth();
  const [questExercise, setQuestExercise] = useState<Exercise | null>(null);
  const savedRef = useRef(false);

  const areaId = user ? areaIdForInjury(user.injuryType) : "wrist";

  const exercises = useMemo(() => {
    if (!user) return [];
    return getSessionRecommendations(
      areaId,
      user,
      summary.angle,
      getPreviousExerciseIds(areaId)
    );
  }, [user, areaId, summary.angle, getPreviousExerciseIds]);

  useEffect(() => {
    if (!user || exercises.length === 0 || savedRef.current) return;
    saveExerciseHistory(
      areaId,
      exercises.map((e) => e.id),
      { angle: summary.angle, reps: summary.reps, pain: user.painToday }
    );
    savedRef.current = true;
  }, [user, exercises, areaId, summary, saveExerciseHistory]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="rm-card-elevated border-correct/30 p-6 text-center">
        <p className="text-4xl">🎉</p>
        <h2 className="rm-title mt-2 text-2xl text-white">Session complete!</h2>
        <p className="mt-2 text-body">
          Based on your recording, here are your personalized exercises.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatTile value={`${summary.angle}°`} label="Peak ROM" accent="correct" />
          <StatTile value={summary.reps} label="Reps" accent="brand" />
          <StatTile value={`${summary.emg}%`} label="EMG" accent="purple" />
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Your exercises</h3>
        <Link
          href="/kids"
          className="rounded-full border border-orange/40 bg-orange/10 px-4 py-2 text-sm font-bold text-orange"
        >
          🎮 Full quest map
        </Link>
      </div>

      {questExercise ? (
        <section>
          <button
            type="button"
            onClick={() => setQuestExercise(null)}
            className="mb-4 text-sm font-medium text-brand-light"
          >
            ← Back to exercises
          </button>
          <QuestGame
            exercise={questExercise}
            targetAngle={user.targetRom}
            onComplete={() => setQuestExercise(null)}
          />
        </section>
      ) : (
        <div className="space-y-5">
          {exercises.map((exercise, i) => {
            const media = getExerciseMedia(exercise.id, exercise.name);
            const questDone = user.questProgress[exercise.id];
            return (
              <div key={exercise.id} className="overflow-hidden rounded-xl border border-[var(--border)]">
                <ExerciseCard
                  exercise={exercise}
                  index={i + 1}
                  injuryType={user.injuryType}
                />
                <div className="border-t border-[var(--border)] bg-surface-elevated/50 px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-orange">🎮 {media.kidsQuest.title}</p>
                      <p className="text-xs text-muted">{media.kidsQuest.story}</p>
                      {questDone && (
                        <p className="mt-1 text-xs font-semibold text-correct">Badge earned!</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuestExercise(exercise)}
                      className="rounded-full bg-gradient-to-r from-orange to-gold px-5 py-3 text-sm font-bold text-[var(--kids-bg)] transition hover:opacity-90"
                    >
                      {questDone ? "Play again" : "Start quest"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button type="button" onClick={onDone} className="rm-btn rm-btn-brand w-full">
        Back to briefing
      </button>
    </div>
  );
}
