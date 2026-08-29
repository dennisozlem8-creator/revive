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
  close?: () => void;
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
  if (visibilityOf(hip) < 0.2 || visibilityOf(knee) < 0.2 || visibilityOf(ankle) < 0.2) {
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

function waitForMetadata(video: HTMLVideoElement, ms = 8000) {
  if (video.readyState >= 1) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const finish = (ok: boolean) => {
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("error", onError);
      window.clearTimeout(timer);
      if (ok) resolve();
      else reject(new Error("Could not read that video."));
    };
    const onReady = () => finish(true);
    const onError = () => finish(false);
    const timer = window.setTimeout(() => finish(video.readyState >= 1), ms);
    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("error", onError);
  });
}

function prepareVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.autoplay = false;
  video.playsInline = true;
  video.preload = "auto";
  video.setAttribute("playsinline", "true");
  video.setAttribute("webkit-playsinline", "true");
}

/**
 * Play the clip and sample pose on real frames.
 * Seeking MediaRecorder blobs often never fires `seeked`, which used to hang analysis.
 * Uses a fresh VIDEO landmarker so live-camera timestamps cannot poison this pass.
 */
export async function analyzeVideoElement(
  video: HTMLVideoElement,
  preferLeft: boolean,
  onProgress?: (pct: number) => void
): Promise<MovementSample[]> {
  prepareVideo(video);
  // Start playback in the same tap when possible. Waiting for the model first
  // drops the user gesture and Safari then refuses to play.
  void video.play().catch(() => undefined);
  const [landmarker] = await Promise.all([createLandmarker(), waitForMetadata(video)]);
  const samples: MovementSample[] = [];
  let stamp = Math.max(1, Math.floor(performance.now()));
  const started = performance.now();
  const maxMs = 14000;

  const collect = () => {
    const wall = (performance.now() - started) / 1000;
    const time = Number.isFinite(video.currentTime) ? video.currentTime : wall;
    try {
      const sample = detectVideoFrame(
        landmarker,
        video,
        stamp,
        preferLeft,
        Number(time.toFixed(2))
      );
      if (sample) samples.push(sample);
    } catch {
      /* keep going — one bad frame must not stop the clip */
    }
    stamp += 33;
    const duration = video.duration;
    if (Number.isFinite(duration) && duration > 0) {
      onProgress?.(Math.min(99, Math.round((Math.min(time, duration) / duration) * 100)));
    } else {
      onProgress?.(Math.min(99, Math.round((wall / 12) * 100)));
    }
  };

  try {
    if (video.ended || video.paused) {
      try {
        video.currentTime = 0;
      } catch {
        /* some recorded clips cannot seek */
      }
      await video.play().catch(() => undefined);
    }

    await new Promise<void>((resolve) => {
      let raf = 0;
      let last = 0;
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        cancelAnimationFrame(raf);
        window.clearTimeout(limit);
        video.removeEventListener("ended", finish);
        video.removeEventListener("error", finish);
        try {
          video.pause();
        } catch {
          /* ignore */
        }
        resolve();
      };
      const tick = () => {
        const now = performance.now();
        if (now - last >= 90) {
          last = now;
          if (video.readyState >= 2) collect();
        }
        const duration = video.duration;
        if (
          video.ended ||
          (Number.isFinite(duration) && duration > 0 && video.currentTime >= Math.min(duration - 0.04, 12))
        ) {
          collect();
          finish();
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      const limit = window.setTimeout(finish, maxMs);
      video.addEventListener("ended", finish);
      video.addEventListener("error", finish);
      const play = video.play();
      raf = requestAnimationFrame(tick);
      if (play && typeof play.catch === "function") {
        void play.catch(() => undefined);
      }
    });
  } finally {
    try {
      landmarker.close?.();
    } catch {
      /* ignore */
    }
  }

  onProgress?.(100);
  return samples;
}

export async function analyzeVideoUrl(
  url: string,
  preferLeft: boolean,
  onProgress?: (pct: number) => void
): Promise<MovementSample[]> {
  const video = document.createElement("video");
  prepareVideo(video);
  video.src = url;
  video.style.cssText =
    "position:fixed;left:0;top:0;width:240px;height:180px;opacity:0.01;pointer-events:none;z-index:-1";
  document.body.appendChild(video);
  try {
    return await analyzeVideoElement(video, preferLeft, onProgress);
  } finally {
    video.removeAttribute("src");
    video.load();
    video.remove();
  }
}

export type PhotoPoseResult = {
  angle: number;
  hip: Point;
  knee: Point;
  ankle: Point;
};

async function createImageLandmarker() {
  const vision = await import("@mediapipe/tasks-vision");
  const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL);
  const options = {
    baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" as const },
    runningMode: "IMAGE" as const,
    numPoses: 1,
  };
  try {
    return await vision.PoseLandmarker.createFromOptions(fileset, options);
  } catch {
    return vision.PoseLandmarker.createFromOptions(fileset, {
      ...options,
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" },
    });
  }
}

function loadHtmlImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read that photo."));
    image.src = url;
  });
}

export async function analyzeImageUrl(
  imageUrl: string,
  preferLeft: boolean
): Promise<PhotoPoseResult | null> {
  const landmarker = await createImageLandmarker();
  try {
    const image = await loadHtmlImage(imageUrl);
    const result = landmarker.detect(image);
    const sample = sampleFromPose(result.landmarks?.[0], preferLeft, 0);
    if (!sample) return null;
    return {
      angle: sample.angle,
      hip: sample.hip,
      knee: sample.knee,
      ankle: sample.ankle,
    };
  } finally {
    landmarker.close();
  }
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
