export const HEART_LOG_KEY = "revive-motion-heart";

export type HeartSample = {
  time: number;
  bpm: number;
  raw?: number;
};

export type HeartRecording = {
  id: string;
  userEmail: string;
  date: string;
  source: "bluetooth" | "usb";
  deviceName: string;
  durationSec: number;
  avgBpm: number;
  minBpm: number;
  maxBpm: number;
  samples: HeartSample[];
};

export function loadHeartRecordings(userEmail: string): HeartRecording[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(HEART_LOG_KEY) ?? "[]") as HeartRecording[];
    return raw
      .filter((row) => row.userEmail === userEmail)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export function saveHeartRecording(row: HeartRecording) {
  const all = (() => {
    try {
      return JSON.parse(localStorage.getItem(HEART_LOG_KEY) ?? "[]") as HeartRecording[];
    } catch {
      return [];
    }
  })();
  all.push(row);
  localStorage.setItem(HEART_LOG_KEY, JSON.stringify(all));
}

export function deleteHeartRecording(id: string) {
  try {
    const all = JSON.parse(localStorage.getItem(HEART_LOG_KEY) ?? "[]") as HeartRecording[];
    localStorage.setItem(HEART_LOG_KEY, JSON.stringify(all.filter((row) => row.id !== id)));
  } catch {
    /* ignore */
  }
}

export function summarizeHeartSamples(samples: HeartSample[]) {
  if (samples.length === 0) return null;
  const bpms = samples.map((sample) => sample.bpm);
  return {
    avgBpm: Math.round(bpms.reduce((sum, n) => sum + n, 0) / bpms.length),
    minBpm: Math.min(...bpms),
    maxBpm: Math.max(...bpms),
    durationSec: Number((samples[samples.length - 1]?.time ?? 0).toFixed(1)),
  };
}
