"use client";

import { useEffect, useState } from "react";
import type { Exercise } from "@/lib/assessments";
import type { FeedbackState } from "@/lib/feedback";
import type { User } from "@/lib/users";
import {
  getExerciseRecommendation,
  getNextExercisePreview,
  type ExerciseCoachContext,
} from "@/lib/exercise-coach";

type ExerciseAICoachProps = {
  exercises: Exercise[];
  exercise: Exercise;
  exerciseIndex: number;
  reps: number;
  targetReps: number;
  angle: number;
  targetAngle: number;
  feedback: FeedbackState;
  active: boolean;
  user: User | null;
  event: ExerciseCoachContext["event"];
};

export function ExerciseAICoach({
  exercises,
  exercise,
  exerciseIndex,
  reps,
  targetReps,
  angle,
  targetAngle,
  feedback,
  active,
  user,
  event,
}: ExerciseAICoachProps) {
  const [recommendation, setRecommendation] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const text = getExerciseRecommendation({
      exercise,
      exerciseIndex,
      totalExercises: exercises.length,
      reps,
      targetReps,
      angle,
      targetAngle,
      feedback,
      active,
      user,
      event,
    });
    setRecommendation(text);
    setHistory((prev) => {
      if (prev[0] === text) return prev;
      return [text, ...prev].slice(0, 3);
    });
  }, [
    event,
    reps,
    angle,
    feedback,
    exercise.id,
    exerciseIndex,
    active,
    exercises.length,
    exercise,
    targetReps,
    targetAngle,
    user,
  ]);

  const upNext = getNextExercisePreview(exercises, exerciseIndex);

  return (
    <section
      className="overflow-hidden rounded-2xl border border-purple/30"
      style={{ background: "var(--ai-panel)" }}
      aria-live="polite"
    >
      <div className="flex items-center gap-3 border-b border-purple/20 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple/20 text-lg">
          ✨
        </span>
        <div>
          <p className="text-sm font-semibold text-purple">RecoverAI Coach</p>
          <p className="text-xs text-muted">Live exercise recommendations</p>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <p className="text-sm leading-relaxed text-foreground">{recommendation}</p>

        {active && upNext && reps >= Math.ceil(targetReps / 2) && (
          <p className="rounded-xl border border-brand/20 bg-brand/10 px-3 py-2 text-xs text-brand-light">
            {upNext}
          </p>
        )}

        {history.length > 1 && (
          <ul className="space-y-1 border-t border-purple/10 pt-3">
            {history.slice(1).map((line, i) => (
              <li key={i} className="text-xs text-muted">
                · {line}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
