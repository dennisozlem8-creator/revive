"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Exercise } from "@/lib/assessments";
import { getExerciseMedia, getKidsExerciseImage } from "@/lib/exercise-media";
import { useAuth } from "./AuthProvider";
import {
  createKidsSensorReading,
  repDetected,
  simulateDeviceConnect,
  type KidsSensorReading,
} from "@/lib/device-sensor";
import { getFeedbackState } from "@/lib/feedback";
import { SensorHelp } from "./SensorHelp";

type QuestGameProps = {
  exercise: Exercise;
  onComplete: () => void;
  onQuestComplete?: (questId: string) => void;
  targetAngle?: number;
  avatarEmoji?: string;
};

const feedbackKidsLabel = {
  correct: "CORRECT FORM! Rep counted!",
  almost: "ALMOST THERE! Push a little more!",
  alert: "ADJUST FORM — follow the picture!",
  idle: "Wear your sensor and start moving!",
};

export function QuestGame({
  exercise,
  onComplete,
  onQuestComplete,
  targetAngle = 90,
  avatarEmoji = "🦸",
}: QuestGameProps) {
  const media = getExerciseMedia(exercise.id, exercise.name);
  const kidsImage = getKidsExerciseImage(exercise.id, exercise.name);
  const { user, completeQuest } = useAuth();
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [reps, setReps] = useState(0);
  const [reading, setReading] = useState<KidsSensorReading | null>(null);
  const [wave, setWave] = useState<number[]>(() => Array(20).fill(8));
  const [celebrate, setCelebrate] = useState(false);
  const tickRef = useRef(0);
  const lastRepTickRef = useRef(-99);

  const target = media.kidsQuest.reps;
  const done = reps >= target;
  const firstName = user?.name.split(" ")[0] ?? "Hero";
  const feedback = getFeedbackState(reading?.angle ?? 0, targetAngle);

  useEffect(() => {
    if (!recording || done) return;

    const interval = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;
      const next = createKidsSensorReading(tick, targetAngle);
      setReading(next);
      setWave((prev) => [...prev.slice(1), Math.max(10, (next.angle / targetAngle) * 80)]);

      if (
        repDetected(next.angle, targetAngle, lastRepTickRef.current, tick)
      ) {
        lastRepTickRef.current = tick;
        setReps((r) => {
          const updated = r + 1;
          if (updated >= target) {
            completeQuest(exercise.id, 50);
            onQuestComplete?.(exercise.id);
            setCelebrate(true);
            setRecording(false);
          }
          return updated;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [recording, done, targetAngle, target, exercise.id, completeQuest, onQuestComplete]);

  function handleConnect() {
    setConnecting(true);
    simulateDeviceConnect().then(() => {
      setConnecting(false);
      setConnected(true);
    });
  }

  function speech() {
    if (done) return `Amazing ${firstName}! Quest complete!`;
    if (!connected) return `Connect your Revive Motion sensor to begin, ${firstName}!`;
    if (connecting) return `Searching for your sensor, ${firstName}… almost there!`;
    if (!recording) return `Sensor ready! Do the ${exercise.name} movement.`;
    if (feedback === "correct") return `Great form ${firstName}! Rep ${reps} counted!`;
    if (feedback === "almost") return `So close ${firstName}! A little more bend!`;
    if (reps > target / 2) return `Keep going ${firstName}! ${target - reps} reps left!`;
    return `Move with the sensor ${firstName} — reps count automatically!`;
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-purple/40 rm-glow-kids p-6">
      <div className="flex items-start gap-4">
        <span className="text-6xl">{avatarEmoji}</span>
        <div className="relative flex-1 rounded-2xl border-2 border-orange/50 bg-white/95 px-4 py-3 text-[var(--caregiver-text)]">
          <p className="text-sm font-medium">{speech()}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-xl border border-purple/30 bg-surface/80 p-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${
            connected ? "bg-brand/25" : connecting ? "bg-brand/15" : "bg-surface-elevated"
          }`}
        >
          <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden>
            <rect
              x="14"
              y="8"
              width="20"
              height="32"
              rx="6"
              fill={connected ? "#2563EB" : connecting ? "#1D4ED8" : "#334155"}
            />
            {(connected || connecting) && (
              <circle
                cx="24"
                cy="20"
                r="6"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                className="animate-pulse-soft"
              />
            )}
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-bold text-foreground">
            {connecting
              ? "Connecting sensor…"
              : connected
                ? recording
                  ? "Sensor recording"
                  : "Sensor connected"
                : "Sensor offline"}
          </p>
          <p className="text-xs text-muted">
            {connecting
              ? "Demo pairing — takes about 2 seconds"
              : connected
                ? recording
                  ? "Move your joint — reps count when form is correct"
                  : "Green light on — ready to quest"
                : "Tap Connect to pair the demo sensor"}
          </p>
        </div>
        {!connected && (
          <button
            type="button"
            disabled={connecting}
            onClick={handleConnect}
            className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {connecting ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Connecting
              </span>
            ) : (
              "Connect"
            )}
          </button>
        )}
      </div>

      {!connected && (
        <div className="mt-3">
          <SensorHelp variant="kids" />
        </div>
      )}

      <div className="relative mx-auto mt-5 flex h-44 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border border-purple/30 bg-surface-elevated/80">
        <Image
          src={kidsImage}
          alt={exercise.name}
          width={400}
          height={300}
          className="h-full w-full object-cover p-2"
        />
        {celebrate && (
          <span className="absolute inset-0 flex items-center justify-center text-6xl animate-pulse-soft">
            ✨
          </span>
        )}
      </div>

      <h3 className="mt-4 text-center text-2xl font-bold text-orange">{media.kidsQuest.title}</h3>
      <p className="mt-1 text-center text-body">{media.kidsQuest.story}</p>

      {connected && (
        <>
          <div className={`rm-feedback rm-feedback--${feedback} mt-5 min-h-[7rem]`}>
            <p className="relative z-10 text-xs font-bold uppercase tracking-widest">
              {feedbackKidsLabel[feedback]}
            </p>
            <p className="relative z-10 mt-2 text-5xl font-bold tabular-nums">
              {reading?.angle ?? 0}°
            </p>
            <p className="relative z-10 mt-1 text-sm">Target {targetAngle}°</p>
          </div>

          <div className="mt-3 flex h-16 items-end gap-1 rounded-xl bg-surface/60 p-2">
            {wave.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-purple/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-lg bg-surface/80 py-2">
              <p className="font-bold text-purple">{reading?.emg ?? "—"}</p>
              <p className="text-xs text-muted">EMG</p>
            </div>
            <div className="rounded-lg bg-surface/80 py-2">
              <p className="font-bold text-orange">{reading?.hr ?? "—"}</p>
              <p className="text-xs text-muted">BPM</p>
            </div>
            <div className="rounded-lg bg-surface/80 py-2">
              <p className="font-bold text-gold">
                {reps}/{target}
              </p>
              <p className="text-xs text-muted">Reps</p>
            </div>
          </div>

          <div className="rm-xp-track mt-4">
            <div
              className="rm-xp-fill"
              style={{ width: `${Math.min(100, (reps / target) * 100)}%` }}
            />
          </div>
        </>
      )}

      {!connected ? null : done ? (
        <div className="mt-6 rounded-2xl border border-correct/40 bg-correct/15 p-5 text-center">
          <p className="text-4xl">{media.kidsQuest.reward}</p>
          <p className="mt-2 text-lg font-bold text-correct">Quest complete! +50 XP</p>
          <button
            type="button"
            onClick={onComplete}
            className="mt-4 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white"
          >
            Continue
          </button>
        </div>
      ) : !recording ? (
        <button
          type="button"
          onClick={() => {
            tickRef.current = 0;
            lastRepTickRef.current = -99;
            setRecording(true);
          }}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-purple to-brand py-5 text-lg font-bold text-white"
        >
          Start sensor quest
        </button>
      ) : (
        <p className="mt-4 text-center text-sm font-semibold text-brand-light animate-pulse-soft">
          📡 Sensor active — do the exercise movement!
        </p>
      )}
    </div>
  );
}
