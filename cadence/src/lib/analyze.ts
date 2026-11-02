import type { VoiceFeatures } from "@/lib/types";

const TARGET_RATE = 16000;

function blank(durationSec: number): VoiceFeatures {
  return {
    durationSec,
    voicedSec: 0,
    pauseRatio: 1,
    onsetCount: 0,
    onsetsPerVoicedSec: 0,
    pitchMedianHz: null,
    pitchCv: null,
  };
}

function downsample(samples: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate <= toRate) return samples;
  const ratio = fromRate / toRate;
  const length = Math.floor(samples.length / ratio);
  const out = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.min(samples.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j++) sum += samples[j];
    out[i] = sum / Math.max(1, end - start);
  }
  return out;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

function coefficientOfVariation(values: number[]): number | null {
  if (values.length < 6) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (mean <= 0) return null;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance) / mean;
}

function estimateF0(frame: Float32Array, sampleRate: number): number | null {
  let energy = 0;
  for (let i = 0; i < frame.length; i++) energy += frame[i] * frame[i];
  if (energy < 1e-4) return null;

  const minLag = Math.floor(sampleRate / 400);
  const maxLag = Math.min(frame.length - 2, Math.floor(sampleRate / 75));
  let bestLag = -1;
  let best = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    const limit = frame.length - lag;
    for (let i = 0; i < limit; i++) sum += frame[i] * frame[i + lag];
    const norm = sum / energy;
    if (norm > best) {
      best = norm;
      bestLag = lag;
    }
  }
  if (bestLag < 0 || best < 0.45) return null;
  return sampleRate / bestLag;
}

export function analyzeSamples(samples: Float32Array, sampleRate: number): VoiceFeatures {
  const durationSec = sampleRate > 0 ? samples.length / sampleRate : 0;
  if (samples.length < 8 || sampleRate <= 0) return blank(durationSec);

  const reduced = downsample(samples, sampleRate, TARGET_RATE);
  const rate = reduced === samples ? sampleRate : TARGET_RATE;
  const centered = new Float32Array(reduced.length);
  let mean = 0;
  for (let i = 0; i < reduced.length; i++) mean += reduced[i];
  mean /= reduced.length;
  for (let i = 0; i < reduced.length; i++) centered[i] = reduced[i] - mean;

  const frame = Math.floor(rate * 0.02);
  const hop = Math.floor(rate * 0.01);
  if (frame < 8 || centered.length < frame) return blank(durationSec);

  const energies: number[] = [];
  for (let start = 0; start + frame <= centered.length; start += hop) {
    let sum = 0;
    for (let i = start; i < start + frame; i++) sum += centered[i] * centered[i];
    energies.push(Math.sqrt(sum / frame));
  }
  if (energies.length === 0) return blank(durationSec);

  const sorted = [...energies].sort((a, b) => a - b);
  const p20 = sorted[Math.floor(sorted.length * 0.2)] ?? 0;
  const p90 = sorted[Math.floor(sorted.length * 0.9)] ?? 0;
  const threshold = Math.max(0.012, p20 * 3, p90 * 0.22);

  let voicedFrames = 0;
  let onsetCount = 0;
  let wasVoiced = false;
  let refractory = 0;
  const refractoryFrames = Math.max(1, Math.round(0.12 / 0.01));
  for (const energy of energies) {
    const voiced = energy >= threshold;
    if (voiced) voicedFrames += 1;
    if (refractory > 0) refractory -= 1;
    if (voiced && !wasVoiced && refractory === 0) {
      onsetCount += 1;
      refractory = refractoryFrames;
    }
    wasVoiced = voiced;
  }

  const voicedSec = (voicedFrames * hop) / rate;
  const pauseRatio = Math.min(1, Math.max(0, 1 - voicedSec / durationSec));

  const pitchWindow = Math.floor(rate * 0.06);
  const pitchHop = Math.floor(rate * 0.03);
  const pitches: number[] = [];
  for (let start = 0; start + pitchWindow <= centered.length; start += pitchHop) {
    let sum = 0;
    for (let i = start; i < start + frame && i < centered.length; i++) sum += centered[i] * centered[i];
    const rms = Math.sqrt(sum / frame);
    if (rms < threshold) continue;
    const slice = centered.subarray(start, start + pitchWindow);
    const f0 = estimateF0(slice, rate);
    if (f0 != null) pitches.push(f0);
  }

  return {
    durationSec,
    voicedSec,
    pauseRatio,
    onsetCount,
    onsetsPerVoicedSec: voicedSec > 0.05 ? onsetCount / voicedSec : 0,
    pitchMedianHz: pitches.length >= 6 ? median(pitches) : null,
    pitchCv: coefficientOfVariation(pitches),
  };
}
