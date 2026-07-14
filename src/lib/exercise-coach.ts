import type { Exercise } from "@/lib/assessments";
import type { User } from "@/lib/users";
import type { FeedbackState } from "@/lib/feedback";

export type ExerciseCoachContext = {
  exercise: Exercise;
  exerciseIndex: number;
  totalExercises: number;
  reps: number;
  targetReps: number;
  angle: number;
  targetAngle: number;
  feedback: FeedbackState;
  active: boolean;
  user: User | null;
  event: "start" | "tick" | "rep" | "feedback" | "complete" | "next";
};

const injuryTips: Record<string, string[]> = {
  ankle: [
    "Keep your heel on the floor during ankle pumps — only move through the front of the foot.",
    "If you feel pinching at the front of the ankle, reduce how far you point your toes.",
  ],
  knee: [
    "Move slowly through the bend — rushing can irritate the joint capsule.",
    "Keep your kneecap aligned over your second toe during the movement.",
  ],
  elbow: [
    "Stop before sharp pain at end range — gentle loading builds strength over time.",
    "Keep your shoulder relaxed so the elbow does the work, not your upper trap.",
  ],
  wrist: [
    "Move within a pain-free arc — small controlled reps beat big painful ones.",
    "Keep your forearm supported on a table if grip exercises feel shaky.",
  ],
};

function tagTip(tags: Exercise["tags"]): string {
  if (tags.includes("gentle")) {
    return "This is a gentle exercise — slow, controlled motion is more important than depth.";
  }
  if (tags.includes("mobility")) {
    return "Focus on smooth end-to-end range. Pause 1–2 seconds at the top of each rep.";
  }
  if (tags.includes("strength")) {
    return "Quality over quantity — stop the set if form breaks down before hitting all reps.";
  }
  if (tags.includes("stability")) {
    return "Engage your core lightly to keep the joint stable through the full rep.";
  }
  return "Breathe out on the effort phase and in on the return.";
}

export function getExerciseRecommendation(ctx: ExerciseCoachContext): string {
  const { exercise, user, reps, targetReps, angle, targetAngle, feedback, event } = ctx;
  const first = user?.name.split(" ")[0] ?? "There";
  const pain = user?.painToday ?? 3;
  const injury = user?.injuryType ?? "knee";
  const tips = injuryTips[injury] ?? injuryTips.knee;

  if (event === "start") {
    const rx = user?.ptPrescription;
    const rxNote = rx
      ? ` Your PT prescribed ${rx.sets}×${rx.reps} with ${rx.holdSeconds}s holds — match that pace.`
      : "";
    return `${first}, starting ${exercise.name}. ${exercise.description}${rxNote}`;
  }

  if (event === "complete") {
    return `Great work on ${exercise.name}! ${ctx.exerciseIndex < ctx.totalExercises - 1 ? "Rest 30–60 seconds, then hydrate before the next exercise." : "Session almost done — finish strong on your last move."}`;
  }

  if (event === "next") {
    return `Moving on — exercise ${ctx.exerciseIndex + 1} of ${ctx.totalExercises}. Take one slow breath before you begin.`;
  }

  if (pain >= 7) {
    return `${first}, your pain is elevated today (${pain}/10). Switch to half range and slower reps. Stop if pain spikes above 6 during this set.`;
  }

  if (feedback === "alert") {
    return `Form alert: reduce range by about 20% and move slower. ${tips[0]}`;
  }

  if (feedback === "almost") {
    return `Almost at target (${angle}° / ${targetAngle}°). Add a small extra bend on the next rep — stay smooth, no bouncing.`;
  }

  if (event === "rep") {
    const remaining = targetReps - reps;
    if (reps === 1) {
      return `Rep 1 logged — nice start. ${tagTip(exercise.tags)}`;
    }
    if (reps === Math.ceil(targetReps / 2)) {
      return `Halfway (${reps}/${targetReps}). ${tips[1] ?? "Keep the same controlled tempo for the second half."}`;
    }
    if (reps >= targetReps) {
      return `Target reps hit! Hold your end position 2 seconds, then tap done when ready.`;
    }
    return `${reps}/${targetReps} reps — ${remaining} to go. ${angle >= targetAngle * 0.85 ? "ROM looks strong — maintain that depth." : "Try to reach a bit more range on the next rep."}`;
  }

  if (feedback === "correct") {
    return `Good form at ${angle}°. ${tagTip(exercise.tags)}`;
  }

  return `${first}, focus on ${exercise.name}: ${exercise.sets}. ${tips[0]}`;
}

export function getNextExercisePreview(
  exercises: Exercise[],
  currentIndex: number
): string | null {
  const next = exercises[currentIndex + 1];
  if (!next) return null;
  return `Up next: ${next.name} — ${next.description}`;
}
