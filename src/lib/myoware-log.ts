export const MYOWARE_LOG_KEY = "revive-motion-myoware";

export type MyoWareSample = {
  time: number;
  emg: number;
  env?: number;
};

export type MyoWareRecording = {
  id: string;
  userEmail: string;
  date: string;
  deviceName: string;
  durationSec: number;
  avgEmg: number;
  maxEmg: number;
  samples: MyoWareSample[];
};

export function loadMyoWareRecordings(userEmail: string): MyoWareRecording[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(MYOWARE_LOG_KEY) ?? "[]") as MyoWareRecording[];
    return raw
      .filter((row) => row.userEmail === userEmail)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export function saveMyoWareRecording(row: MyoWareRecording) {
  const all = (() => {
    try {
      return JSON.parse(localStorage.getItem(MYOWARE_LOG_KEY) ?? "[]") as MyoWareRecording[];
    } catch {
      return [];
    }
  })();
  all.push(row);
  localStorage.setItem(MYOWARE_LOG_KEY, JSON.stringify(all));
}

export function deleteMyoWareRecording(id: string) {
  try {
    const all = JSON.parse(localStorage.getItem(MYOWARE_LOG_KEY) ?? "[]") as MyoWareRecording[];
    localStorage.setItem(MYOWARE_LOG_KEY, JSON.stringify(all.filter((row) => row.id !== id)));
  } catch {
    /* ignore */
  }
}

export function summarizeMyoWareSamples(samples: MyoWareSample[]) {
  if (samples.length === 0) return null;
  const values = samples.map((sample) => sample.emg);
  return {
    avgEmg: Math.round(values.reduce((sum, n) => sum + n, 0) / values.length),
    maxEmg: Math.max(...values),
    durationSec: Number((samples[samples.length - 1]?.time ?? 0).toFixed(1)),
  };
}
