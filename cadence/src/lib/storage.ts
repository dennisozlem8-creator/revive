import type { CheckIn } from "@/lib/types";

const KEY = "cadence.checkins.v1";
const CHANGE = "cadence-history";
const EMPTY: CheckIn[] = [];

let cachedRaw: string | null | undefined;
let cachedItems: CheckIn[] = EMPTY;

function readCheckIns(): CheckIn[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedItems;
    cachedRaw = raw;
    if (!raw) {
      cachedItems = EMPTY;
      return cachedItems;
    }
    const parsed = JSON.parse(raw) as unknown;
    cachedItems = Array.isArray(parsed) ? (parsed as CheckIn[]) : EMPTY;
    return cachedItems;
  } catch {
    cachedRaw = undefined;
    cachedItems = EMPTY;
    return cachedItems;
  }
}

export function loadCheckIns(): CheckIn[] {
  return readCheckIns();
}

export function subscribeCheckIns(onChange: () => void): () => void {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function serverCheckIns(): CheckIn[] {
  return EMPTY;
}

export function saveCheckIn(entry: CheckIn): CheckIn[] {
  const next = [entry, ...readCheckIns().filter((item) => item.id !== entry.id)].slice(0, 60);
  const raw = JSON.stringify(next);
  window.localStorage.setItem(KEY, raw);
  cachedRaw = raw;
  cachedItems = next;
  window.dispatchEvent(new Event(CHANGE));
  return next;
}

export function clearCheckIns(): void {
  window.localStorage.removeItem(KEY);
  cachedRaw = null;
  cachedItems = EMPTY;
  window.dispatchEvent(new Event(CHANGE));
}

/** Recent microphone tones, newest first. Examples and crisis clips do not set the personal baseline. */
export function priorScores(entries: CheckIn[], exceptId?: string): number[] {
  return entries
    .filter(
      (item) =>
        item.id !== exceptId &&
        item.source === "microphone" &&
        !item.crisis &&
        item.status === "ready" &&
        typeof item.score === "number",
    )
    .map((item) => item.score as number);
}
