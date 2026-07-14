"use client";

import type { Exercise } from "@/lib/assessments";
import { getExerciseMedia } from "@/lib/exercise-media";

const injuryColors: Record<string, string> = {
  knee: "var(--brand)",
  ankle: "var(--teal)",
  wrist: "var(--purple)",
  elbow: "var(--orange)",
  other: "var(--teal)",
  default: "var(--correct)",
};

type ExerciseCardProps = {
  exercise: Exercise;
  index?: number;
  badge?: React.ReactNode;
  kidsLink?: boolean;
  injuryType?: string;
  showVideo?: boolean;
};

export function ExerciseCard({
  exercise,
  index,
  badge,
  kidsLink,
  injuryType = "default",
  showVideo = true,
}: ExerciseCardProps) {
  const media = getExerciseMedia(exercise.id, exercise.name);
  const stripe = injuryColors[injuryType] ?? injuryColors.default;

  return (
    <article className="rm-card relative flex overflow-hidden">
      <div className="w-1.5 shrink-0" style={{ background: stripe }} />
      <div className="flex flex-1 flex-col sm:flex-row">
        <div className="relative flex h-36 w-full shrink-0 items-center justify-center bg-surface-elevated sm:h-auto sm:w-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media.image} alt={exercise.name} className="h-28 w-auto object-contain p-3" />
          {badge && <div className="absolute right-2 top-2">{badge}</div>}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start gap-3">
            {index !== undefined && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-light">
                {index}
              </span>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold">{exercise.name}</h3>
              <p className="mt-1 rm-body text-sm leading-6">{exercise.description}</p>
              <p className="mt-2 text-sm font-semibold text-brand-light">{exercise.sets}</p>
              {kidsLink && (
                <p className="mt-2 text-xs text-orange">Kids quest: {media.kidsQuest.title}</p>
              )}
            </div>
          </div>
          {showVideo && (
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " physical therapy")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 self-start rounded-full border border-brand/40 px-4 py-2 text-sm font-semibold text-brand-light transition hover:bg-brand/10"
            >
              Watch
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
