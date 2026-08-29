import { kneeAngleDegrees, type Point } from "./goniometer";

export type MovementSample = {
  time: number;
  angle: number;
  hip: Point;
  knee: Point;
  ankle: Point;
};

export type MovementSummary = {
  peak: number;
  min: number;
  range: number;
  duration: number;
};

type PoseLandmark = {
  x: number;
  y: number;
  visibility?: number;
};

type PoseLandmarkerLike = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestamp: number
  ) => { landmarks?: PoseLandmark[][] };
};

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task";

const LEFT = { hip: 23, knee: 25, ankle: 27 };
const RIGHT = { hip: 24, knee: 26, ankle: 28 };

let landmarkerPromise: Promise<PoseLandmarkerLike> | null = null;

export function summarizeMovement(samples: MovementSample[]): MovementSummary | null {
  if (samples.length === 0) return null;
  const angles = samples.map((sample) => sample.angle);
  return {
    peak: Math.max(...angles),
    min: Math.min(...angles),
    range: Math.max(...angles) - Math.min(...angles),
    duration: samples[samples.length - 1]?.time ?? 0,
  };
}

export async function getPoseLandmarker(): Promise<PoseLandmarkerLike> {
  if (!landmarkerPromise) {
    landmarkerPromise = createLandmarker().catch((error) => {
      landmarkerPromise = null;
      throw error;
    });
  }
  return landmarkerPromise;
}

async function createLandmarker(): Promise<PoseLandmarkerLike> {
  const vision = await import("@mediapipe/tasks-vision");
  const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL);
  try {
    return await vision.PoseLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
      runningMode: "VIDEO",
      numPoses: 1,
    });
  } catch {
    return vision.PoseLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" },
      runningMode: "VIDEO",
      numPoses: 1,
    });
  }
}

function visibilityOf(landmark?: PoseLandmark) {
  return landmark?.visibility ?? 0;
}

export function sampleFromPose(
  landmarks: PoseLandmark[] | undefined,
  preferLeft: boolean,
  time: number
): MovementSample | null {
  if (!landmarks || landmarks.length < 29) return null;
  const first = preferLeft ? LEFT : RIGHT;
  const second = preferLeft ? RIGHT : LEFT;
  const pick =
    visibilityOf(landmarks[first.hip]) +
      visibilityOf(landmarks[first.knee]) +
      visibilityOf(landmarks[first.ankle]) >=
    visibilityOf(landmarks[second.hip]) +
      visibilityOf(landmarks[second.knee]) +
      visibilityOf(landmarks[second.ankle])
      ? first
      : second;

  const hip = landmarks[pick.hip];
  const knee = landmarks[pick.knee];
  const ankle = landmarks[pick.ankle];
  if (!hip || !knee || !ankle) return null;
  if (visibilityOf(hip) < 0.35 || visibilityOf(knee) < 0.35 || visibilityOf(ankle) < 0.35) {
    return null;
  }

  const hipPoint = { x: hip.x, y: hip.y };
  const kneePoint = { x: knee.x, y: knee.y };
  const anklePoint = { x: ankle.x, y: ankle.y };
  return {
    time,
    angle: kneeAngleDegrees(hipPoint, kneePoint, anklePoint),
    hip: hipPoint,
    knee: kneePoint,
    ankle: anklePoint,
  };
}

export function detectVideoFrame(
  landmarker: PoseLandmarkerLike,
  video: HTMLVideoElement,
  timestamp: number,
  preferLeft: boolean,
  time: number
): MovementSample | null {
  const result = landmarker.detectForVideo(video, timestamp);
  return sampleFromPose(result.landmarks?.[0], preferLeft, time);
}

function waitForSeek(video: HTMLVideoElement) {
  return new Promise<void>((resolve) => {
    const done = () => {
      video.removeEventListener("seeked", done);
      resolve();
    };
    video.addEventListener("seeked", done);
  });
}

export async function analyzeVideoUrl(
  url: string,
  preferLeft: boolean,
  onProgress?: (pct: number) => void
): Promise<MovementSample[]> {
  const landmarker = await getPoseLandmarker();
  const video = document.createElement("video");
  video.src = url;
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error("Could not read that video."));
  });

  const duration = Math.min(video.duration || 0, 15);
  if (!Number.isFinite(duration) || duration < 0.4) {
    throw new Error("That video is too short. Record a few seconds of movement.");
  }

  const step = 1 / 8;
  const samples: MovementSample[] = [];
  let stamp = 1;
  for (let t = 0; t <= duration; t += step) {
    video.currentTime = t;
    await waitForSeek(video);
    try {
      const sample = detectVideoFrame(landmarker, video, stamp, preferLeft, Number(t.toFixed(2)));
      if (sample) samples.push(sample);
    } catch {
      /* skip a frame the tracker cannot read */
    }
    stamp += 16;
    onProgress?.(Math.round((t / duration) * 100));
  }
  onProgress?.(100);
  return samples;
}

export function pickRecorderMime() {
  const types = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];
  return types.find((type) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type));
}
