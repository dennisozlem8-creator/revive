export const GONIOMETER_KEY = "revive-motion-goniometer";

export type LandmarkId = "hip" | "knee" | "ankle";

export type Point = {
  x: number;
  y: number;
};

export type GoniometerMeasurement = {
  id: string;
  userEmail: string;
  date: string;
  exercise: string;
  joint: string;
  angle: number;
  note: string;
  source?: "photo" | "video";
  minAngle?: number;
  range?: number;
  durationSec?: number;
};

export const LANDMARK_ORDER: LandmarkId[] = ["hip", "knee", "ankle"];

export const LANDMARK_LABELS: Record<LandmarkId, string> = {
  hip: "Hip",
  knee: "Knee",
  ankle: "Ankle",
};

export const EXERCISE_OPTIONS = [
  "Seated Knee Flexion",
  "Standing Knee Flexion",
  "Prone Knee Flexion",
  "Heel Slide",
];

export const JOINT_OPTIONS = [
  "Knee (Right)",
  "Knee (Left)",
];

export function nextLandmark(points: Partial<Record<LandmarkId, Point>>): LandmarkId | null {
  return LANDMARK_ORDER.find((id) => !points[id]) ?? null;
}

/** Interior angle at the knee using the hip–knee and ankle–knee vectors. */
export function kneeAngleDegrees(hip: Point, knee: Point, ankle: Point): number {
  const ax = hip.x - knee.x;
  const ay = hip.y - knee.y;
  const bx = ankle.x - knee.x;
  const by = ankle.y - knee.y;
  const magA = Math.hypot(ax, ay);
  const magB = Math.hypot(bx, by);
  if (magA === 0 || magB === 0) return 0;
  const cos = Math.min(1, Math.max(-1, (ax * bx + ay * by) / (magA * magB)));
  return Math.round((Math.acos(cos) * 180) / Math.PI);
}

export function loadMeasurements(userEmail: string): GoniometerMeasurement[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(GONIOMETER_KEY) ?? "[]") as GoniometerMeasurement[];
    return raw
      .filter((row) => row.userEmail === userEmail)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export function saveMeasurement(row: GoniometerMeasurement) {
  const all = (() => {
    try {
      return JSON.parse(localStorage.getItem(GONIOMETER_KEY) ?? "[]") as GoniometerMeasurement[];
    } catch {
      return [];
    }
  })();
  all.push(row);
  localStorage.setItem(GONIOMETER_KEY, JSON.stringify(all));
}

export function deleteMeasurement(id: string) {
  try {
    const all = JSON.parse(localStorage.getItem(GONIOMETER_KEY) ?? "[]") as GoniometerMeasurement[];
    localStorage.setItem(
      GONIOMETER_KEY,
      JSON.stringify(all.filter((row) => row.id !== id))
    );
  } catch {
    /* ignore */
  }
}
