/** Simulated live ROM session tick — auto-stops when movement is judged complete. */

export type RomRecordingSnapshot = {
  tick: number;
  angle: number;
  peakAngle: number;
  decliningTicks: number;
  reps: number;
  lastRepTick: number;
  emg: number;
  hr: number;
};

export type RomRecordingStep = RomRecordingSnapshot & {
  shouldStop: boolean;
  stopReason: string | null;
};

export const ROM_TICK_MS = 800;

export function initialRomSnapshot(): RomRecordingSnapshot {
  return {
    tick: 0,
    angle: 0,
    peakAngle: 0,
    decliningTicks: 0,
    reps: 0,
    lastRepTick: -99,
    emg: 42,
    hr: 72,
  };
}

export function nextRomSnapshot(
  prev: RomRecordingSnapshot,
  targetAngle: number,
  targetReps: number
): RomRecordingStep {
  const tick = prev.tick + 1;

  const riseTicks = 10;
  const holdTicks = 4;
  const fallTicks = 6;
  const cycle = riseTicks + holdTicks + fallTicks;
  const phase = tick % cycle;

  let progress: number;
  if (phase < riseTicks) {
    progress = (phase + 1) / riseTicks;
  } else if (phase < riseTicks + holdTicks) {
    progress = 1;
  } else {
    const fallPhase = phase - riseTicks - holdTicks;
    progress = Math.max(0, 1 - (fallPhase + 1) / fallTicks);
  }

  const noise = (Math.random() - 0.5) * 6;
  const angle = Math.max(
    0,
    Math.round(targetAngle * progress * (0.82 + Math.random() * 0.18) + noise)
  );
  const peakAngle = Math.max(prev.peakAngle, angle);

  const declining = angle < prev.angle - 2;
  const decliningTicks = declining
    ? prev.decliningTicks + 1
    : angle >= peakAngle * 0.95
      ? prev.decliningTicks
      : 0;

  let reps = prev.reps;
  let lastRepTick = prev.lastRepTick;
  const repCooldown = Math.max(3, Math.round(3000 / ROM_TICK_MS));
  if (angle >= targetAngle * 0.88 && tick - lastRepTick >= repCooldown) {
    reps = Math.min(targetReps, reps + 1);
    lastRepTick = tick;
  }

  const emg = Math.round(35 + progress * 35 + Math.random() * 15);
  const hr = Math.round(68 + progress * 18 + Math.random() * 10);

  const peakedEnough = peakAngle >= targetAngle * 0.78;
  const movementComplete = peakedEnough && decliningTicks >= 3;
  const repsComplete = reps >= targetReps && peakedEnough;
  const timeout = tick >= 40;

  const shouldStop = movementComplete || repsComplete || timeout;
  const stopReason = movementComplete
    ? "Movement complete — peak ROM captured"
    : repsComplete
      ? "Target reps reached"
      : timeout
        ? "Recording window complete"
        : null;

  return {
    tick,
    angle,
    peakAngle,
    decliningTicks,
    reps,
    lastRepTick,
    emg,
    hr,
    shouldStop,
    stopReason,
  };
}
