import type { User } from "./users";
import { calculateStreak } from "./streak";
import { averagePain, painTrend } from "./pain-tracker";

export type OutcomeMetrics = {
  compliancePercent: number;
  sessionsCompleted: number;
  romGain: number;
  romGoalPercent: number;
  avgPain7d: number | null;
  painTrend: "improving" | "stable" | "worsening";
  streak: number;
  weeklySessions: number[];
};

function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function patientCompliance(user: User): number {
  const targetDays = Math.min(7, Math.max(3, user.sessionDays));
  const recent = lastNDays(7);
  const completed = recent.filter((d) => user.activityDates.includes(d)).length;
  return Math.min(100, Math.round((completed / targetDays) * 100));
}

export function weeklySessionCounts(user: User): number[] {
  return lastNDays(7).map((d) =>
    user.exerciseHistory.some((s) => s.completedAt.startsWith(d)) ? 1 : 0
  );
}

export function romGain(user: User): number {
  const latest = user.romHistory?.[user.romHistory.length - 1]?.peakAngle ?? user.baselineRom;
  return Math.max(0, latest - user.baselineRom);
}

export function painTrendDirection(user: User): OutcomeMetrics["painTrend"] {
  const trend = painTrend(user.painHistory ?? [], 14);
  const firstHalf = trend.slice(0, 7).filter((d) => d.level > 0);
  const secondHalf = trend.slice(7).filter((d) => d.level > 0);
  if (!firstHalf.length || !secondHalf.length) return "stable";
  const avg1 = firstHalf.reduce((s, d) => s + d.level, 0) / firstHalf.length;
  const avg2 = secondHalf.reduce((s, d) => s + d.level, 0) / secondHalf.length;
  if (avg2 < avg1 - 0.5) return "improving";
  if (avg2 > avg1 + 0.5) return "worsening";
  return "stable";
}

export function computeOutcomeMetrics(user: User): OutcomeMetrics {
  const latestRom = user.romHistory?.[user.romHistory.length - 1]?.peakAngle ?? user.baselineRom;
  return {
    compliancePercent: patientCompliance(user),
    sessionsCompleted: user.exerciseHistory.length,
    romGain: romGain(user),
    romGoalPercent: user.targetRom > 0 ? Math.round((latestRom / user.targetRom) * 100) : 0,
    avgPain7d: averagePain(user.painHistory ?? [], 7),
    painTrend: painTrendDirection(user),
    streak: calculateStreak(user),
    weeklySessions: weeklySessionCounts(user),
  };
}
