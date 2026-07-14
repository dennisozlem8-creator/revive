import type { User } from "./users";

export function todayDateString() {
  return new Date().toISOString().split("T")[0];
}

export function getActivityDates(user: User): string[] {
  const dates = new Set<string>();

  for (const record of user.exerciseHistory) {
    dates.add(record.completedAt.split("T")[0]);
  }

  for (const date of user.activityDates ?? []) {
    dates.add(date);
  }

  return Array.from(dates).sort();
}

export function calculateStreak(user: User): number {
  const dateSet = new Set(getActivityDates(user));
  if (dateSet.size === 0) return 0;

  const today = todayDateString();
  let cursor = new Date();

  if (!dateSet.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dateSet.has(cursor.toISOString().split("T")[0])) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getLongestStreak(user: User): number {
  const dates = getActivityDates(user);
  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

export function logActivityToday(dates: string[] = []): string[] {
  const today = todayDateString();
  if (dates.includes(today)) return dates;
  return [...dates, today];
}
