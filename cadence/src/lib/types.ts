export type SampleKind = "settled" | "quieter";

export type CheckInSource = "microphone" | "sample";

export type CheckInStatus = "ready" | "short" | "quiet";

export type ToneBand = "settled" | "mixed" | "quieter" | "heavy";

export type SignalKey = "pace" | "pauses" | "melody" | "words";

export type VoiceFeatures = {
  durationSec: number;
  voicedSec: number;
  pauseRatio: number;
  onsetCount: number;
  onsetsPerVoicedSec: number;
  pitchMedianHz: number | null;
  pitchCv: number | null;
};

export type Signal = {
  key: SignalKey;
  label: string;
  score: number | null;
  detail: string;
};

export type CheckIn = {
  id: string;
  createdAt: string;
  source: CheckInSource;
  status: CheckInStatus;
  score: number | null;
  band: ToneBand | null;
  bandLabel: string | null;
  summary: string;
  comparedToYou: string | null;
  crisis: boolean;
  transcript: string;
  signals: Signal[];
  features: VoiceFeatures;
};
