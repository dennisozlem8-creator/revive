import { findCrisis } from "@/lib/crisis";
import type { CheckIn, CheckInSource, Signal, ToneBand, VoiceFeatures } from "@/lib/types";

const POSITIVE = new Set([
  "calm",
  "grateful",
  "hopeful",
  "glad",
  "good",
  "better",
  "okay",
  "ok",
  "fine",
  "love",
  "loved",
  "rested",
  "safe",
  "proud",
  "peaceful",
  "managed",
  "smiled",
  "happy",
  "lighter",
  "enough",
  "relief",
  "relieved",
  "content",
  "steady",
  "kind",
]);

const NEGATIVE = new Set([
  "tired",
  "exhausted",
  "anxious",
  "worried",
  "sad",
  "heavy",
  "lonely",
  "hopeless",
  "overwhelmed",
  "angry",
  "stuck",
  "numb",
  "afraid",
  "empty",
  "stressed",
  "awful",
  "terrible",
  "crying",
  "cried",
  "depressed",
  "depression",
  "miserable",
  "drained",
  "panic",
  "panicked",
  "worthless",
  "helpless",
]);

const BAND_LABEL: Record<ToneBand, string> = {
  settled: "Settled",
  mixed: "Mixed",
  quieter: "Quieter",
  heavy: "Heavy",
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function lerp(value: number, a: number, b: number, from: number, to: number): number {
  const t = (value - a) / (b - a);
  return from + (to - from) * t;
}

function paceScore(rate: number): number {
  if (rate < 1.2) return lerp(rate, 0.4, 1.2, 28, 42);
  if (rate < 2.4) return lerp(rate, 1.2, 2.4, 42, 68);
  if (rate < 3.2) return lerp(rate, 2.4, 3.2, 68, 86);
  if (rate <= 5.4) return 88;
  if (rate <= 7) return lerp(rate, 5.4, 7, 88, 62);
  return 55;
}

function pauseScore(ratio: number): number {
  if (ratio < 0.08) return 60;
  if (ratio < 0.18) return lerp(ratio, 0.08, 0.18, 68, 86);
  if (ratio <= 0.42) return 88;
  if (ratio <= 0.62) return lerp(ratio, 0.42, 0.62, 84, 48);
  if (ratio <= 0.8) return lerp(ratio, 0.62, 0.8, 48, 30);
  return 26;
}

function melodyScore(cv: number | null): number | null {
  if (cv == null) return null;
  if (cv < 0.03) return 36;
  if (cv < 0.06) return lerp(cv, 0.03, 0.06, 36, 58);
  if (cv < 0.09) return lerp(cv, 0.06, 0.09, 58, 82);
  if (cv <= 0.22) return 88;
  if (cv <= 0.4) return lerp(cv, 0.22, 0.4, 84, 60);
  return 54;
}

function tokens(text: string): string[] {
  return text.toLowerCase().match(/[a-z']+/g) ?? [];
}

function wordSignal(transcript: string): Signal {
  const words = tokens(transcript);
  let positive = 0;
  let negative = 0;
  for (const word of words) {
    if (POSITIVE.has(word)) positive += 1;
    if (NEGATIVE.has(word)) negative += 1;
  }
  const hits = positive + negative;
  if (words.length < 4 || hits === 0) {
    return {
      key: "words",
      label: "Words",
      score: null,
      detail:
        words.length === 0
          ? "No transcript, so words were left out of the tone."
          : "Not enough clear word cues, so words were left out of the tone.",
    };
  }
  const ratio = positive / hits;
  return {
    key: "words",
    label: "Words",
    score: 30 + ratio * 55,
    detail: `${words.length} words. ${positive} lighter, ${negative} heavier. Word lists miss context, so this signal stays small.`,
  };
}

export function bandFor(score: number): ToneBand {
  if (score >= 72) return "settled";
  if (score >= 52) return "mixed";
  if (score >= 34) return "quieter";
  return "heavy";
}

export function compareToSelf(score: number, history: number[]): string | null {
  if (history.length < 2) return null;
  const recent = [...history.slice(0, 7)].sort((a, b) => a - b);
  const mid = Math.floor(recent.length / 2);
  const median = recent.length % 2 === 0 ? (recent[mid - 1] + recent[mid]) / 2 : recent[mid];
  const delta = score - median;
  if (delta >= 8) return "Brighter than your recent check-ins.";
  if (delta <= -8) return "Quieter than your recent check-ins.";
  return "Close to your recent check-ins.";
}

function summaryFor(band: ToneBand, lowest: Signal): string {
  const lead = {
    settled: "This clip sounded relatively easy: pace, pauses, and melody sat in a comfortable range.",
    mixed: "This clip sat in the middle, with some ease and some drag.",
    quieter: "This clip sounded slower, flatter, or more paused than easy conversation.",
    heavy: "This clip had a slow or flat quality and long quiet stretches.",
  }[band];
  const soft = lowest.score == null ? "" : ` The softest signal was ${lowest.label.toLowerCase()}.`;
  return `${lead}${soft} ${lowest.detail} One clip reflects how you sounded. It is not a diagnosis.`;
}

function base(input: {
  features: VoiceFeatures;
  transcript: string;
  source: CheckInSource;
  id?: string;
  now?: string;
}): Pick<CheckIn, "id" | "createdAt" | "source" | "transcript" | "features" | "crisis"> {
  return {
    id: input.id ?? crypto.randomUUID(),
    createdAt: input.now ?? new Date().toISOString(),
    source: input.source,
    transcript: input.transcript,
    features: input.features,
    crisis: false,
  };
}

/**
 * Wellness heuristic from pace, pauses, pitch variation, and a small word list.
 * Weights are not a clinical scale and are not validated as a diagnosis.
 */
export function scoreCheckIn(input: {
  features: VoiceFeatures;
  transcript: string;
  history: number[];
  source: CheckInSource;
  id?: string;
  now?: string;
}): CheckIn {
  const shared = base(input);
  if (findCrisis(input.transcript)) {
    return {
      ...shared,
      status: "ready",
      score: null,
      band: null,
      bandLabel: null,
      summary:
        "If you might act on thoughts of suicide or self-harm, contact help now. A tone score is not what helps in this moment.",
      comparedToYou: null,
      crisis: true,
      signals: [],
    };
  }

  if (input.features.durationSec < 3) {
    return {
      ...shared,
      status: "short",
      score: null,
      band: null,
      bandLabel: null,
      summary: "That clip is shorter than three seconds. Say a little more, then stop.",
      comparedToYou: null,
      signals: [],
    };
  }

  if (input.features.voicedSec < 0.8) {
    return {
      ...shared,
      status: "quiet",
      score: null,
      band: null,
      bandLabel: null,
      summary: "Cadence could not hear enough voice in that clip. Move closer and speak a full sentence.",
      comparedToYou: null,
      signals: [],
    };
  }

  const pace: Signal = {
    key: "pace",
    label: "Pace",
    score: paceScore(input.features.onsetsPerVoicedSec),
    detail: `About ${input.features.onsetsPerVoicedSec.toFixed(1)} speech sounds per second of talking.`,
  };
  const pauses: Signal = {
    key: "pauses",
    label: "Pauses",
    score: pauseScore(input.features.pauseRatio),
    detail: `About ${Math.round(input.features.pauseRatio * 100)}% of the clip was quiet.`,
  };
  const melodyValue = melodyScore(input.features.pitchCv);
  const melody: Signal = {
    key: "melody",
    label: "Melody",
    score: melodyValue,
    detail:
      input.features.pitchMedianHz == null || melodyValue == null
        ? "Pitch was too uncertain to use, so melody was left out of the tone."
        : `Pitch moved around a median of ${Math.round(input.features.pitchMedianHz)} Hz.`,
  };
  const words = wordSignal(input.transcript);
  const signals = [pace, pauses, melody, words];
  const weighted = signals.filter((signal) => signal.score != null);
  const weightFor: Record<Signal["key"], number> = {
    pace: 0.34,
    pauses: 0.28,
    melody: 0.28,
    words: 0.1,
  };
  const weightSum = weighted.reduce((sum, signal) => sum + weightFor[signal.key], 0);
  const score = clamp(
    weighted.reduce((sum, signal) => sum + (signal.score as number) * weightFor[signal.key], 0) / weightSum,
  );
  const band = bandFor(score);
  const lowest = weighted.reduce((soft, signal) =>
    (signal.score as number) < (soft.score as number) ? signal : soft,
  );

  return {
    ...shared,
    status: "ready",
    score,
    band,
    bandLabel: BAND_LABEL[band],
    summary: summaryFor(band, lowest),
    comparedToYou: input.source === "microphone" ? compareToSelf(score, input.history) : null,
    signals: signals.map((signal) => ({
      ...signal,
      score: signal.score == null ? null : clamp(signal.score),
    })),
  };
}
