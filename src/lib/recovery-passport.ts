import type { GoniometerMeasurement } from "./goniometer";

export type RecoveryPassport = {
  score: number | null;
  velocityDegPerWeek: number | null;
  consistency: number;
  rangeTowardGoal: number | null;
  weeklyCount: number;
  expectedWeekly: number;
  sessions: number;
  firstPeak: number | null;
  latestPeak: number | null;
  change: number | null;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function recoveryPassport(
  rows: GoniometerMeasurement[],
  opts: { goal: number; sessionDays?: number }
): RecoveryPassport {
  const ordered = rows.slice().sort((a, b) => a.date.localeCompare(b.date));
  const expectedWeekly = Math.max(1, opts.sessionDays || 3);
  const weekAgo = Date.now() - 7 * 86_400_000;
  const weeklyCount = ordered.filter((row) => new Date(row.date).getTime() >= weekAgo).length;
  const consistency = clamp((weeklyCount / expectedWeekly) * 100);

  if (ordered.length === 0) {
    return {
      score: null,
      velocityDegPerWeek: null,
      consistency: 0,
      rangeTowardGoal: null,
      weeklyCount: 0,
      expectedWeekly,
      sessions: 0,
      firstPeak: null,
      latestPeak: null,
      change: null,
    };
  }

  const firstPeak = ordered[0].angle;
  const latestPeak = ordered[ordered.length - 1].angle;
  const change = latestPeak - firstPeak;
  const spanDays = Math.max(
    1,
    (new Date(ordered[ordered.length - 1].date).getTime() - new Date(ordered[0].date).getTime()) / 86_400_000
  );
  const velocityDegPerWeek = ordered.length >= 2 ? change / Math.max(1, spanDays / 7) : null;
  const goalSpan = opts.goal - firstPeak;
  const rangeTowardGoal =
    ordered.length < 2
      ? null
      : goalSpan <= 0
        ? latestPeak >= opts.goal
          ? 100
          : 50
        : clamp(((latestPeak - firstPeak) / goalSpan) * 100);

  const velocityScore = velocityDegPerWeek == null ? 40 : clamp(50 + velocityDegPerWeek * 6);
  const score =
    ordered.length < 2
      ? Math.round(consistency * 0.7 + 12)
      : Math.round(consistency * 0.4 + (rangeTowardGoal ?? 0) * 0.35 + velocityScore * 0.25);

  return {
    score: clamp(Math.round(score)),
    velocityDegPerWeek: velocityDegPerWeek == null ? null : Math.round(velocityDegPerWeek * 10) / 10,
    consistency: Math.round(consistency),
    rangeTowardGoal: rangeTowardGoal == null ? null : Math.round(rangeTowardGoal),
    weeklyCount,
    expectedWeekly,
    sessions: ordered.length,
    firstPeak,
    latestPeak,
    change,
  };
}
