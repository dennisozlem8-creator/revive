export type MotionPhase = "rest" | "rising" | "peak" | "falling";

/** One rest → extend → peak → return loop, in milliseconds. */
export const DEMO_MOVE_CYCLE_MS = 7000;

export type DemoMotionSample = {
  angle: number;
  phase: MotionPhase;
};

/**
 * Cinematic MPU-style stream: quiet rest, a fast climb, a held peak, then drop.
 * Angle is whole degrees, peaking near 90.
 */
export function demoMotionAt(elapsedMs: number): DemoMotionSample {
  const t = ((elapsedMs % DEMO_MOVE_CYCLE_MS) + DEMO_MOVE_CYCLE_MS) % DEMO_MOVE_CYCLE_MS;
  let angle: number;
  let phase: MotionPhase;

  if (t < 800) {
    phase = "rest";
    angle = 10 + Math.round(Math.sin(t / 90) * 2);
  } else if (t < 2000) {
    phase = "rising";
    const p = (t - 800) / 1200;
    const ease = 1 - (1 - p) * (1 - p) * (1 - p);
    angle = Math.round(12 + ease * 78);
  } else if (t < 4800) {
    phase = "peak";
    angle = 88 + Math.round(Math.sin(t / 70) * 4);
  } else if (t < 6000) {
    phase = "falling";
    const p = (t - 4800) / 1200;
    const ease = p * p;
    angle = Math.round(90 * (1 - ease) + 12 * ease);
  } else {
    phase = "rest";
    angle = 11 + Math.round(Math.sin(t / 80) * 2);
  }

  return { angle: Math.max(0, Math.min(120, angle)), phase };
}
