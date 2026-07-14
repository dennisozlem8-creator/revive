/** Validates and smooths BPM readings from MAX30102 / BLE pulse sensors. */

export type HeartRateSource = "max30102" | "estimated" | "simulated" | "none";

const MIN_BPM = 40;
const MAX_BPM = 200;

export function isValidBpm(bpm: number): boolean {
  return Number.isFinite(bpm) && bpm >= MIN_BPM && bpm <= MAX_BPM;
}

export function parseBpmFromBuffer(value: DataView): number | null {
  if (value.byteLength >= 2) {
    const raw = value.getUint16(0, true);
    return isValidBpm(raw) ? raw : null;
  }
  const bpm = value.getUint8(0);
  return isValidBpm(bpm) ? bpm : null;
}

export function parseSpO2FromBuffer(value: DataView): number | null {
  const spo2 = value.byteLength >= 1 ? value.getUint8(0) : 0;
  return spo2 >= 70 && spo2 <= 100 ? spo2 : null;
}

/** Gentle smoothing — rejects single-sample spikes */
export function smoothBpm(previous: number | null, next: number): number {
  if (previous === null) return next;
  if (Math.abs(next - previous) > 25) return previous;
  return Math.round(previous * 0.35 + next * 0.65);
}

export function estimateBpmFromActivity(angle: number, targetAngle: number): number {
  const effort = targetAngle > 0 ? Math.min(1, angle / targetAngle) : 0;
  return Math.round(68 + effort * 22);
}

/** Demo MAX30102-style resting → exertion curve */
export function simulateMax30102Bpm(tick: number, exertion = 0.5): number {
  const base = 72 + Math.sin(tick * 0.08) * 3;
  const load = exertion * (14 + Math.sin(tick * 0.15) * 4);
  return Math.round(Math.min(MAX_BPM, Math.max(MIN_BPM, base + load)));
}
