import type { GoniometerMeasurement } from "./goniometer";
import type { MovementCoachReport } from "./movement-coach";

export type SetupStep = {
  title: string;
  detail: string;
  why: string;
};

export type ActionStep = {
  do: string;
  why: string;
};

export type ProgressSnapshot = {
  sessions: number;
  firstPeak: number | null;
  latestPeak: number | null;
  latestForm: number | null;
  change: number | null;
  daysSinceLast: number | null;
  weeklyCount: number;
  onTrack: boolean;
  headline: string;
};

const SHARED_SETUP: SetupStep[] = [
  {
    title: "Set the camera first",
    detail: "Place the phone or laptop 4–6 feet to the side, at knee height. The whole hip, knee, and ankle must stay in the picture.",
    why: "The coach can only score what it can see. A side view is how we get a true angle.",
  },
  {
    title: "Clear the joint",
    detail: "Roll shorts or a gown above the knee. Take off a bulky brace for the clip if your clinician said that is safe.",
    why: "Fabric hides the knee crease and makes the angle jump.",
  },
  {
    title: "Warm up for 60 seconds",
    detail: "Do 4 easy, small reps of this same exercise before you tap Record. No bouncing.",
    why: "A cold first rep looks stiff and under-measures your real range.",
  },
  {
    title: "Stop rule",
    detail: "If pain is sharp, new, or above 6 out of 10, stop. Save the clip only if the motion felt like your usual work.",
    why: "Pushing through sharp pain does not speed recovery and it confuses the trend.",
  },
];

const EXERCISE_SETUP: Record<string, SetupStep[]> = {
  "Seated Knee Flexion": [
    {
      title: "Sit tall on a firm chair",
      detail: "Feet flat. Hold the seat with both hands. Slide one foot back under the chair when you record.",
      why: "A soft couch lets the hip drop, so the number is not a true knee bend.",
    },
    {
      title: "Keep the thigh quiet",
      detail: "The working thigh stays on the chair. Only the lower leg moves.",
      why: "If the hip lifts, the coach will flag compensation.",
    },
  ],
  "Standing Knee Flexion": [
    {
      title: "Hold a counter or chair",
      detail: "Stand on the other leg. Bend the working heel toward your seat, then lower for a count of 3.",
      why: "A support stops trunk lean, which the coach reads as a form problem.",
    },
    {
      title: "Thighs stay lined up",
      detail: "Do not hike the hip to fake more bend. Stop when the pelvis wants to tip.",
      why: "Hip hiking inflates the clip and hides true knee motion.",
    },
  ],
  "Prone Knee Flexion": [
    {
      title: "Lie on your stomach on a firm bed",
      detail: "Camera at the side of the bed. Hip bones stay on the mattress while the heel bends up.",
      why: "If the hip lifts, the coach cannot tell knee motion from back motion.",
    },
  ],
  "Heel Slide": [
    {
      title: "Lie on your back",
      detail: "Put a towel under the heel so it slides. Camera at the side of the bed, not at the foot.",
      why: "A foot-on view hides the angle. A towel keeps the motion smooth so the graph is readable.",
    },
    {
      title: "Kneecap toward the ceiling",
      detail: "Do not let the knee fall in or out as the heel slides in.",
      why: "Side drift looks like a smaller, jumpy range to the coach.",
    },
  ],
};

export function preExerciseSetup(exercise: string): SetupStep[] {
  return [...SHARED_SETUP, ...(EXERCISE_SETUP[exercise] ?? EXERCISE_SETUP["Heel Slide"])];
}

export function progressSnapshot(
  rows: GoniometerMeasurement[],
  goal: number
): ProgressSnapshot {
  const ordered = rows.slice().sort((a, b) => a.date.localeCompare(b.date));
  const first = ordered[0];
  const latest = ordered[ordered.length - 1];
  const firstPeak = first?.angle ?? null;
  const latestPeak = latest?.angle ?? null;
  const change =
    firstPeak != null && latestPeak != null ? latestPeak - firstPeak : null;
  const latestForm = latest?.formScore ?? null;
  const daysSinceLast = latest
    ? Math.floor((Date.now() - new Date(latest.date).getTime()) / 86_400_000)
    : null;
  const weekAgo = Date.now() - 7 * 86_400_000;
  const weeklyCount = ordered.filter((row) => new Date(row.date).getTime() >= weekAgo).length;
  const onTrack =
    (change != null && change >= 0 && (daysSinceLast ?? 99) <= 3) ||
    (weeklyCount >= 3 && (latestForm ?? 60) >= 60);

  let headline = "Save a side-view clip so we can start a real trend.";
  if (latestPeak != null && change != null && ordered.length >= 2) {
    if (change > 0) {
      headline = `Peak is up ${change}° since the first saved clip (${firstPeak}° → ${latestPeak}°). Goal is ${goal}°.`;
    } else if (change < 0) {
      headline = `Peak is ${Math.abs(change)}° lower than the first clip. Hold the last good form and do not chase a bigger number today.`;
    } else {
      headline = `Peak is holding at ${latestPeak}°. Repeat the same setup so the next change is real.`;
    }
  } else if (latestPeak != null) {
    headline = `First saved peak is ${latestPeak}°. Record again in 1–2 days with the same camera setup.`;
  }

  return {
    sessions: ordered.length,
    firstPeak,
    latestPeak,
    latestForm,
    change,
    daysSinceLast,
    weeklyCount,
    onTrack,
    headline,
  };
}

export function nextSessionActions(
  report: MovementCoachReport,
  history: GoniometerMeasurement[],
  exercise: string,
  goal: number
): ActionStep[] {
  const progress = progressSnapshot(history, goal);
  const unusual = report.findings.some((finding) => finding.severity === "unusual");
  const jerky = report.findings.some((finding) => finding.id === "jerky" || finding.id === "wobble");
  const limited = report.findings.some((finding) => finding.id === "limited-flexion" || finding.id === "limited-extension");
  const hip = report.findings.some((finding) => finding.id === "hip-hike" || finding.id === "trunk-lean");
  const actions: ActionStep[] = [];

  if (report.trackingQuality !== "good") {
    actions.push({
      do: "Before the next clip: move the camera back until hip, knee, and ankle stay in view the whole time. Record 8 seconds.",
      why: "Poor tracking makes the angle jump and hides real progress.",
    });
  }

  if (jerky || unusual) {
    actions.push({
      do: `Next session: 2 sets of 6 slow ${exercise.toLowerCase()} reps. Count 3 seconds in and 3 seconds out. No bounce.`,
      why: "Jumpy motion usually means the joint is guarding. Slow reps rebuild control first.",
    });
  } else if (limited) {
    actions.push({
      do: `Next session: 3 sets of 8 ${exercise.toLowerCase()} reps. Pause 1 second at the end range you can do without sharp pain.`,
      why: "A short hold at the end range is how range increases across days, not in one clip.",
    });
  } else {
    actions.push({
      do: `Next session: 3 sets of 10 ${exercise.toLowerCase()} reps, same camera spot as today.`,
      why: "Matching the setup lets your clinician trust the trend.",
    });
  }

  if (hip) {
    actions.push({
      do: "Hold a chair or keep the pelvis on the bed. If the hip lifts, reduce the bend by a few degrees.",
      why: "Hip help inflates the number and slows true knee recovery.",
    });
  }

  if (progress.latestPeak != null && progress.latestPeak + 12 < goal && !unusual) {
    actions.push({
      do: `Aim for about ${Math.min(goal, progress.latestPeak + 5)}° on the next video — only 5° more than today, not the full goal.`,
      why: "Small daily gains stick. Jumping for the goal in one session usually breaks form.",
    });
  }

  if ((progress.daysSinceLast ?? 0) >= 3) {
    actions.push({
      do: "Measure again tomorrow, even if you only do one clean set.",
      why: "Gaps longer than 3 days make it hard for your doctor to see if you are improving.",
    });
  }

  actions.push({
    do: "Save this clip, then do the prescribed sets. Come back and record one more clip at the end of the session.",
    why: "A before-and-after pair on the same day shows whether the work changed the joint.",
  });

  return actions.slice(0, 5);
}

export function doctorWatchLevel(rows: GoniometerMeasurement[]) {
  const progress = progressSnapshot(rows, 120);
  const latest = rows.slice().sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const flags = latest?.flags ?? [];
  if (flags.includes("wobble") || flags.includes("jerky") || (latest?.formScore ?? 100) < 45) {
    return {
      level: "attention" as const,
      label: "Needs attention",
      detail: latest?.nextAction || "Latest clip had form problems. Review the video notes.",
    };
  }
  if (progress.daysSinceLast != null && progress.daysSinceLast >= 4) {
    return {
      level: "attention" as const,
      label: "Needs attention",
      detail: `No movement clip in ${progress.daysSinceLast} days.`,
    };
  }
  if (progress.onTrack) {
    return {
      level: "on-track" as const,
      label: "On track",
      detail: progress.headline,
    };
  }
  return {
    level: "watch" as const,
    label: "Watch",
    detail: progress.headline,
  };
}
