export type PainContext = "check-in" | "pre-session" | "post-session" | "journal";

export type PainEntry = {
  date: string;
  level: number;
  context: PainContext;
  note?: string;
  bodyArea?: string;
};

export function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export function logPainEntry(
  history: PainEntry[],
  entry: Omit<PainEntry, "date"> & { date?: string }
): PainEntry[] {
  const record: PainEntry = {
    date: entry.date ?? new Date().toISOString(),
    level: entry.level,
    context: entry.context,
    note: entry.note,
    bodyArea: entry.bodyArea,
  };
  return [...history, record].slice(-90);
}

export function painEntriesForDate(history: PainEntry[], date = todayDateString()) {
  return history.filter((e) => e.date.startsWith(date));
}

export function averagePain(history: PainEntry[], days = 7): number | null {
  const cutoff = Date.now() - days * 86400000;
  const recent = history.filter((e) => new Date(e.date).getTime() >= cutoff);
  if (recent.length === 0) return null;
  return Math.round((recent.reduce((s, e) => s + e.level, 0) / recent.length) * 10) / 10;
}

export function painTrend(history: PainEntry[], days = 14): { label: string; level: number }[] {
  const result: { label: string; level: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayEntries = history.filter((e) => e.date.startsWith(key));
    const level =
      dayEntries.length > 0
        ? Math.round(dayEntries.reduce((s, e) => s + e.level, 0) / dayEntries.length)
        : 0;
    result.push({
      label: d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1),
      level,
    });
  }
  return result;
}

export function painSpikeDetected(history: PainEntry[], currentLevel: number): boolean {
  const avg = averagePain(history, 7);
  if (avg === null) return currentLevel >= 7;
  return currentLevel >= avg + 3 && currentLevel >= 6;
}
