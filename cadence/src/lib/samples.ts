import type { SampleKind } from "@/lib/types";

function addBurst(
  out: Float32Array,
  sampleRate: number,
  startSec: number,
  f0: number,
  dur: number,
) {
  const start = Math.floor(startSec * sampleRate);
  const n = Math.floor(dur * sampleRate);
  for (let i = 0; i < n; i++) {
    const at = start + i;
    if (at >= out.length) break;
    const t = i / sampleRate;
    const env = Math.sin(Math.PI * (i / n));
    const sample =
      Math.sin(2 * Math.PI * f0 * t) +
      0.4 * Math.sin(2 * Math.PI * f0 * 2 * t) +
      0.15 * Math.sin(2 * Math.PI * f0 * 3 * t);
    out[at] += 0.35 * env * sample;
  }
}

/** Synthetic speech-like tones for the example buttons and tests. Not a recording of a person. */
export function synthesizeSpeech(kind: SampleKind, sampleRate = 16000): Float32Array {
  const duration = kind === "settled" ? 8 : 10;
  const out = new Float32Array(Math.floor(duration * sampleRate));

  if (kind === "settled") {
    const pitches = [150, 210, 165, 240, 155, 220, 175, 250, 160, 200, 145, 230];
    let index = 0;
    for (let phrase = 0; phrase < 4; phrase++) {
      const phraseStart = 0.25 + phrase * 1.95;
      for (let syllable = 0; syllable < 6; syllable++) {
        addBurst(out, sampleRate, phraseStart + syllable * 0.28, pitches[index % pitches.length], 0.2);
        index += 1;
      }
    }
    return out;
  }

  for (const time of [0.3, 1.7, 3.1, 4.6, 6.2, 7.8, 9.2]) {
    addBurst(out, sampleRate, time, 128, 0.5);
  }
  return out;
}
