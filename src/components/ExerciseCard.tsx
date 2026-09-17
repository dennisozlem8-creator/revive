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
  cover?: string;
};

export function ExerciseCard({
  exercise,
  index,
  badge,
  kidsLink,
  injuryType = "default",
  showVideo = true,
  cover,
}: ExerciseCardProps) {
  const media = getExerciseMedia(exercise.id, exercise.name);
  const stripe = injuryColors[injuryType] ?? injuryColors.default;
  const photo = cover ?? media.kidsImage ?? media.image;

  return (
    <article className="overflow-hidden rounded-[1.35rem] bg-white shadow-[0_12px_28px_rgba(27,51,72,0.06)] ring-1 ring-[#4f90c6]/12">
      <div className="relative h-36 w-full bg-[#e8f3fb] sm:h-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" className="h-full w-full object-cover" />
        {badge && <div className="absolute right-3 top-3">{badge}</div>}
        <span className="absolute left-0 top-0 h-full w-1.5" style={{ background: stripe }} />
      </div>
      <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start gap-3">
            {index !== undefined && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f3fb] text-sm font-bold text-[#1b3348]">
                {index}
              </span>
            )}
            <div className="flex-1">
              <h3 className="rm-serif text-xl font-semibold text-[#1b3348]">{exercise.name}</h3>
              <p className="mt-1 text-sm leading-6 text-[#2f4a60]">{exercise.description}</p>
              <p className="mt-2 text-sm font-semibold text-[#1b3348]">{exercise.sets}</p>
              {kidsLink && (
                <p className="mt-2 text-sm text-[#2f4a60]">Kids quest: {media.kidsQuest.title}</p>
              )}
            </div>
          </div>
          {showVideo && (
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " physical therapy")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 self-start rounded-full border border-[#4f90c6]/40 px-4 py-2 text-sm font-semibold text-[#1b3348] transition hover:bg-[#e8f3fb]"
            >
              Watch
            </a>
          )}
      </div>
    </article>
  );
}
