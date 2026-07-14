import type { RomTest } from "@/lib/assessments";

/** Delay used for simulated Bluetooth pairing across the app. */
export const SIMULATED_CONNECT_MS = 2000;

/** Resolves after a short delay — stand-in for real Web Bluetooth / serial pairing. */
export function simulateDeviceConnect(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_CONNECT_MS));
}

export type DeviceReading = {
  time: number;
  angle: number;
  movementId: string;
};

export type DeviceSession = {
  readings: DeviceReading[];
  peaks: Record<string, number>;
};

function randomNoise() {
  return (Math.random() - 0.5) * 4;
}

export function simulateDevicePeak(test: RomTest, areaId: string): number {
  const mid = (test.normalMin + test.normalMax) / 2;
  const variance = mid * 0.15;
  let value = mid - variance + Math.random() * variance * 2;

  if (test.id === "extension" && areaId === "knee") {
    value = Math.random() > 0.6 ? Math.floor(Math.random() * 8) : 0;
  }

  return Math.max(0, Math.round(value + randomNoise()));
}

export function generateLiveReading(
  elapsed: number,
  test: RomTest,
  targetPeak: number
): number {
  const progress = Math.min(1, elapsed / 2.5);
  const curve = Math.sin(progress * Math.PI);
  const angle = Math.max(0, targetPeak * curve + randomNoise());
  return Math.round(angle);
}

export async function runDeviceRecording(
  tests: RomTest[],
  areaId: string,
  onReading: (reading: DeviceReading, movementIndex: number) => void
): Promise<DeviceSession> {
  const readings: DeviceReading[] = [];
  const peaks: Record<string, number> = {};
  let time = 0;

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const targetPeak = simulateDevicePeak(test, areaId);
    peaks[test.id] = 0;

    for (let tick = 0; tick < 30; tick++) {
      await new Promise((r) => setTimeout(r, 100));
      const elapsed = tick * 0.1;
      const angle = generateLiveReading(elapsed, test, targetPeak);
      peaks[test.id] = Math.max(peaks[test.id], angle);
      const reading = { time, angle, movementId: test.id };
      readings.push(reading);
      onReading(reading, i);
      time += 0.1;
    }

    await new Promise((r) => setTimeout(r, 400));
  }

  return { readings, peaks };
}

export type KidsSensorReading = {
  time: number;
  angle: number;
  emg: number;
  hr: number;
};

export function createKidsSensorReading(
  tick: number,
  targetAngle: number
): KidsSensorReading {
  const cycleLen = 24;
  const phase = tick % cycleLen;
  const rising = phase < 14;
  const progress = rising ? phase / 14 : (cycleLen - phase) / 10;
  const wobble = 0.75 + Math.random() * 0.3;
  const angle = Math.min(
    targetAngle + 8,
    Math.round(targetAngle * progress * wobble)
  );

  return {
    time: tick * 0.1,
    angle,
    emg: Math.round(30 + progress * 50 + Math.random() * 15),
    hr: Math.round(72 + progress * 20 + Math.random() * 8),
  };
}

export function repDetected(
  angle: number,
  targetAngle: number,
  lastRepTick: number,
  currentTick: number
) {
  const cooldownTicks = 12;
  return angle >= targetAngle * 0.88 && currentTick - lastRepTick >= cooldownTicks;
}
