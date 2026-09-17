export type FlexPhase = "rest" | "rising" | "peak" | "falling";

/** One rest → squeeze → peak → release loop, in milliseconds. */
export const DEMO_FLEX_CYCLE_MS = 6400;

export type DemoFlexSample = {
  effort: number;
  env: number;
  phase: FlexPhase;
};

/**
 * Cinematic MyoWare-style stream: quiet rest, a fast climb, a held peak, then drop.
 * Effort is 0–100. ENV is the raw-looking packet (peaks near 400).
 */
export function demoFlexAt(elapsedMs: number): DemoFlexSample {
  const t = ((elapsedMs % DEMO_FLEX_CYCLE_MS) + DEMO_FLEX_CYCLE_MS) % DEMO_FLEX_CYCLE_MS;
  let effort: number;
  let phase: FlexPhase;

  if (t < 1100) {
    phase = "rest";
    effort = 7 + Math.round(Math.sin(t / 90) * 2);
  } else if (t < 2500) {
    phase = "rising";
    const p = (t - 1100) / 1400;
    const ease = 1 - (1 - p) * (1 - p) * (1 - p);
    effort = Math.round(8 + ease * 86);
  } else if (t < 4000) {
    phase = "peak";
    effort = 92 + Math.round(Math.sin(t / 65) * 5);
  } else if (t < 5200) {
    phase = "falling";
    const p = (t - 4000) / 1200;
    const ease = p * p;
    effort = Math.round(94 * (1 - ease) + 8 * ease);
  } else {
    phase = "rest";
    effort = 6 + Math.round(Math.sin(t / 80) * 2);
  }

  effort = Math.max(0, Math.min(100, effort));
  const env = effort <= 10 ? 12 + effort * 3 : Math.round(28 + effort * 4.05);
  return { effort, env, phase };
}
