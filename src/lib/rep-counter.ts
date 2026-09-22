/** A rep is one rise and return, not a single high reading. */

export type RepCounter = {
  push: (value: number, now?: number) => boolean;
  count: () => number;
  reset: () => void;
};

export function createRepCounter(options?: { minTravel?: number; minGapMs?: number }): RepCounter {
  const minTravel = options?.minTravel ?? 12;
  const minGapMs = options?.minGapMs ?? 700;
  let phase: "rise" | "return" = "rise";
  let valley = Number.POSITIVE_INFINITY;
  let peak = Number.NEGATIVE_INFINITY;
  let reps = 0;
  let lastCount = 0;

  return {
    push(value: number, now = Date.now()) {
      if (!Number.isFinite(value)) return false;
      if (phase === "rise") {
        valley = Math.min(valley, value);
        if (value - valley >= minTravel) {
          phase = "return";
          peak = value;
        }
        return false;
      }
      peak = Math.max(peak, value);
      if (peak - value < minTravel) return false;
      phase = "rise";
      valley = value;
      peak = value;
      if (now - lastCount < minGapMs) return false;
      reps += 1;
      lastCount = now;
      return true;
    },
    count: () => reps,
    reset() {
      phase = "rise";
      valley = Number.POSITIVE_INFINITY;
      peak = Number.NEGATIVE_INFINITY;
      reps = 0;
      lastCount = 0;
    },
  };
}

export function countAngleReps(angles: number[], minTravel = 12) {
  const counter = createRepCounter({ minTravel, minGapMs: 0 });
  let reps = 0;
  angles.forEach((angle, index) => {
    if (counter.push(angle, index * 1000)) reps += 1;
  });
  return reps;
}
