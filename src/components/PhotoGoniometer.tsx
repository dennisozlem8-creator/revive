"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  EXERCISE_OPTIONS,
  JOINT_OPTIONS,
  LANDMARK_LABELS,
  LANDMARK_ORDER,
  type LandmarkId,
  type Point,
  deleteMeasurement,
  kneeAngleDegrees,
  loadMeasurements,
  nextLandmark,
  saveMeasurement,
  type GoniometerMeasurement,
} from "@/lib/goniometer";
import { GoniometerProgressChart } from "./GoniometerProgressChart";

type Step = "upload" | "mark" | "review";

const DOT_COLOR: Record<LandmarkId, string> = {
  hip: "#60a5fa",
  knee: "#10b981",
  ankle: "#f59e0b",
};

function contentBox(img: HTMLImageElement) {
  const rect = img.getBoundingClientRect();
  const scale = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
  const width = img.naturalWidth * scale;
  const height = img.naturalHeight * scale;
  return {
    left: rect.left + (rect.width - width) / 2,
    top: rect.top + (rect.height - height) / 2,
    width,
    height,
  };
}

export function PhotoGoniometer({
  userEmail,
  goal,
}: {
  userEmail: string;
  goal: number;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [overlay, setOverlay] = useState({ left: 0, top: 0, width: 100, height: 100 });
  const [step, setStep] = useState<Step>("upload");
  const [liveCamera, setLiveCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [points, setPoints] = useState<Partial<Record<LandmarkId, Point>>>({});
  const [exercise, setExercise] = useState(EXERCISE_OPTIONS[0]);
  const [joint, setJoint] = useState(JOINT_OPTIONS[0]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [rows, setRows] = useState<GoniometerMeasurement[]>([]);

  useEffect(() => {
    setRows(loadMeasurements(userEmail));
  }, [userEmail]);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (!liveCamera || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    void videoRef.current.play();
  }, [liveCamera]);

  useEffect(() => {
    const onResize = () => syncOverlay();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [photoUrl]);

  function syncOverlay() {
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!img || !wrap || !img.naturalWidth) return;
    const wr = wrap.getBoundingClientRect();
    const box = contentBox(img);
    setOverlay({
      left: ((box.left - wr.left) / wr.width) * 100,
      top: ((box.top - wr.top) / wr.height) * 100,
      width: (box.width / wr.width) * 100,
      height: (box.height / wr.height) * 100,
    });
  }

  const pending = nextLandmark(points);
  const angle =
    points.hip && points.knee && points.ankle
      ? kneeAngleDegrees(points.hip, points.knee, points.ankle)
      : null;

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setLiveCamera(false);
  }

  async function startCamera() {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("This browser cannot open a live camera. Use Use phone camera app below.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setLiveCamera(true);
    } catch {
      setCameraError(
        "Camera permission was blocked. Tap Allow, or use Use phone camera app."
      );
    }
  }

  function snapPhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      onFile(new File([blob], "camera.jpg", { type: "image/jpeg" }));
      stopCamera();
    }, "image/jpeg", 0.92);
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(jpeg|png)$/i.test(file.type) && !file.type.startsWith("image/")) {
      return;
    }
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setPoints({});
    setSaved(false);
    setStep("upload");
  }

  function handleClick(event: React.MouseEvent<HTMLImageElement>) {
    if (!pending || !imgRef.current) return;
    const box = contentBox(imgRef.current);
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    if (x < 0 || y < 0 || x > 1 || y > 1) return;
    setPoints((prev) => ({ ...prev, [pending]: { x, y } }));
  }

  function saveResult() {
    if (angle == null) return;
    const row: GoniometerMeasurement = {
      id: crypto.randomUUID(),
      userEmail,
      date: new Date().toISOString(),
      exercise,
      joint,
      angle,
      note: note.trim(),
    };
    saveMeasurement(row);
    setRows(loadMeasurements(userEmail));
    setSaved(true);
  }

  const filtered = useMemo(
    () => rows.filter((row) => row.joint === joint),
    [rows, joint]
  );

  return (
    <div className="space-y-6">
      {step === "upload" && (
        <section className="rm-card p-6">
          <p className="rm-label">Step 1</p>
          <h2 className="mt-1 text-xl font-bold">Take a side-view photo</h2>
          <p className="mt-2 rm-body">
            Tap Open live camera to see the lens in this page. On a phone you can also tap
            Use phone camera app to open the real Camera app. Allow access if asked.
          </p>

          {liveCamera ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-h-80 w-full object-contain"
              />
              <div className="flex gap-3 p-3">
                <button type="button" className="rm-btn rm-btn-primary flex-1" onClick={snapPhoto}>
                  Take picture
                </button>
                <button type="button" className="rm-btn rm-btn-ghost flex-1" onClick={stopCamera}>
                  Close camera
                </button>
              </div>
            </div>
          ) : photoUrl ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt="Uploaded side-view photo" className="max-h-80 w-full object-contain" />
            </div>
          ) : (
            <div className="mt-5 flex h-40 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-background text-sm text-muted">
              Camera preview will show here
            </div>
          )}

          {cameraError && (
            <p className="mt-3 text-sm text-alert">{cameraError}</p>
          )}

          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              className="rm-btn rm-btn-brand w-full"
              onClick={() => void startCamera()}
            >
              Open live camera
            </button>
            <label className="rm-btn rm-btn-primary w-full cursor-pointer">
              Use phone camera app
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => {
                  onFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              className="rm-btn rm-btn-ghost w-full"
              onClick={() => fileRef.current?.click()}
            >
              Choose photo from files
            </button>
          </div>

          {photoUrl && (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rm-btn rm-btn-ghost flex-1"
                onClick={() => {
                  if (photoUrl) URL.revokeObjectURL(photoUrl);
                  setPhotoUrl(null);
                  setPoints({});
                }}
              >
                Retake
              </button>
              <button
                type="button"
                className="rm-btn rm-btn-primary flex-1"
                onClick={() => setStep("mark")}
              >
                Continue
              </button>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </section>
      )}

      {step === "mark" && photoUrl && (
        <section className="rm-card p-6">
          <p className="rm-label">Step 2</p>
          <h2 className="mt-1 text-xl font-bold">Mark hip, then knee, then ankle</h2>
          <p className="mt-2 rm-body">
            {pending
              ? `Tap the ${LANDMARK_LABELS[pending].toLowerCase()} next.`
              : "All three points are set. Confirm to calculate the angle."}
          </p>

          <ol className="mt-4 flex flex-wrap gap-2">
            {LANDMARK_ORDER.map((id) => (
              <li
                key={id}
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  points[id]
                    ? "bg-correct/15 text-correct"
                    : pending === id
                      ? "bg-brand/20 text-brand-light"
                      : "bg-background text-muted"
                }`}
              >
                {LANDMARK_LABELS[id]}
              </li>
            ))}
          </ol>

          <div
            ref={wrapRef}
            className="relative mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-background"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={photoUrl}
              alt="Mark hip, knee, and ankle"
              className="max-h-[28rem] w-full cursor-crosshair object-contain"
              onClick={handleClick}
              onLoad={syncOverlay}
            />
            <svg
              className="pointer-events-none absolute"
              style={{
                left: `${overlay.left}%`,
                top: `${overlay.top}%`,
                width: `${overlay.width}%`,
                height: `${overlay.height}%`,
              }}
            >
              {points.hip && points.knee && (
                <line
                  x1={`${points.hip.x * 100}%`}
                  y1={`${points.hip.y * 100}%`}
                  x2={`${points.knee.x * 100}%`}
                  y2={`${points.knee.y * 100}%`}
                  stroke="#60a5fa"
                  strokeWidth="3"
                />
              )}
              {points.knee && points.ankle && (
                <line
                  x1={`${points.knee.x * 100}%`}
                  y1={`${points.knee.y * 100}%`}
                  x2={`${points.ankle.x * 100}%`}
                  y2={`${points.ankle.y * 100}%`}
                  stroke="#f59e0b"
                  strokeWidth="3"
                />
              )}
              {LANDMARK_ORDER.map(
                (id) =>
                  points[id] && (
                    <g key={id}>
                      <circle
                        cx={`${points[id]!.x * 100}%`}
                        cy={`${points[id]!.y * 100}%`}
                        r="8"
                        fill={DOT_COLOR[id]}
                      />
                    </g>
                  )
              )}
            </svg>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rm-btn rm-btn-ghost flex-1"
              onClick={() => setPoints({})}
            >
              Reset points
            </button>
            <button
              type="button"
              className="rm-btn rm-btn-primary flex-1 disabled:opacity-40"
              disabled={angle == null}
              onClick={() => setStep("review")}
            >
              Confirm
            </button>
          </div>
        </section>
      )}

      {step === "review" && angle != null && (
        <section className="rm-card p-6">
          <p className="rm-label">Step 3</p>
          <h2 className="mt-1 text-xl font-bold">Estimated knee angle</h2>
          <p className="rm-display mt-4 text-correct">{angle}°</p>
          <p className="mt-2 text-sm text-muted">
            Estimated from your three landmarks. For progress tracking, not a medical diagnosis.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="rm-label">Exercise</span>
              <select
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-background px-3 py-3"
              >
                {EXERCISE_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="rm-label">Joint</span>
              <select
                value={joint}
                onChange={(e) => setJoint(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-background px-3 py-3"
              >
                {JOINT_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-4 block text-sm">
            <span className="rm-label">Note (optional)</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Pain, swelling, or how it felt"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-background px-3 py-3"
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rm-btn rm-btn-ghost flex-1"
              onClick={() => setStep("mark")}
            >
              Edit points
            </button>
            <button
              type="button"
              className="rm-btn rm-btn-primary flex-1 disabled:opacity-40"
              disabled={saved}
              onClick={saveResult}
            >
              {saved ? "Saved" : "Save result"}
            </button>
          </div>
          <button
            type="button"
            className="rm-btn rm-btn-ghost mt-3 w-full"
            onClick={() => {
              if (photoUrl) URL.revokeObjectURL(photoUrl);
              setPhotoUrl(null);
              setPoints({});
              setNote("");
              setSaved(false);
              setStep("upload");
            }}
          >
            New photo
          </button>
        </section>
      )}

      <section className="rm-card p-6">
        <h2 className="font-semibold">Progress graph</h2>
        <p className="mt-1 text-sm text-muted">
          {joint} · one point per saved session · dashed line is your goal
        </p>
        <div className="mt-4">
          <GoniometerProgressChart measurements={filtered} goal={goal} />
        </div>
        {filtered.length > 0 && (
          <ul className="mt-4 space-y-2">
            {filtered
              .slice()
              .reverse()
              .map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-background px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {row.angle}° · {row.exercise}
                    </p>
                    <p className="text-muted">
                      {new Date(row.date).toLocaleString()}
                      {row.note ? ` · ${row.note}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-alert hover:underline"
                    onClick={() => {
                      deleteMeasurement(row.id);
                      setRows(loadMeasurements(userEmail));
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}
