"use client";

import { useEffect, useRef, useState } from "react";
import type { Exercise } from "@/lib/assessments";
import { getExerciseMedia } from "@/lib/exercise-media";
import { t } from "@/lib/i18n";
import type { MeasureMethod } from "@/lib/users";
import { createRepCounter } from "@/lib/rep-counter";
import { useAuth } from "./AuthProvider";
import { MotionPanel } from "./MotionPanel";
import { useMyoWare } from "./MyoWareProvider";
import { MyoWarePanel } from "./MyoWarePanel";
import { addNotification, sendBrowserNotification } from "@/lib/notifications";

type ExerciseProgramProps = {
  exercises: Exercise[];
  method?: MeasureMethod;
  onComplete: (completedIds: string[], reps: number) => void;
};

type ExerciseAlert = {
  id: string;
  tone: "success" | "tip" | "milestone" | "form";
  message: string;
};

function parseTargetReps(sets: string): number {
  const match = sets.match(/(\d+)\s*reps/i);
  return match ? Number(match[1]) : 10;
}

export function ExerciseProgram({ exercises, method = "camera", onComplete }: ExerciseProgramProps) {
  const { user } = useAuth();
  const muscle = useMyoWare();
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [liveAngle, setLiveAngle] = useState<number | null>(null);
  const [signalSeen, setSignalSeen] = useState(false);
  const [alerts, setAlerts] = useState<ExerciseAlert[]>([]);
  const totals = useRef<Record<string, number>>({});
  const angleCounter = useRef(createRepCounter());
  const effortCounter = useRef(createRepCounter({ minTravel: 18 }));

  const current = exercises[index];
  if (!current) return null;

  const media = getExerciseMedia(current.id, current.name);
  const locale = user?.language ?? "en";
  const progress = ((index + 1) / exercises.length) * 100;
  const targetReps = parseTargetReps(current.sets);

  useEffect(() => {
    setActive(false);
    setReps(0);
    setLiveAngle(null);
    setSignalSeen(false);
    setAlerts([]);
    angleCounter.current.reset();
    effortCounter.current.reset();
  }, [index]);

  useEffect(() => {
    if (!active || method !== "muscle" || !muscle.connected || muscle.emg == null) return;
    setSignalSeen(true);
    if (!effortCounter.current.push(muscle.emg)) return;
    setReps((count) => {
      const updated = count + 1;
      totals.current[current.id] = updated;
      pushAlert("success", `Rep ${updated} counted. Bend and return.`, "success");
      if (updated === targetReps) pushAlert("done", `${current.name} complete.`, "milestone");
      return updated;
    });
  }, [active, method, muscle.connected, muscle.emg, current.id, current.name, targetReps]);

  function onAngle(next: number) {
    setLiveAngle(next);
    if (!active || method === "muscle") return;
    setSignalSeen(true);
    if (!angleCounter.current.push(next)) return;
    setReps((count) => {
      const updated = count + 1;
      totals.current[current.id] = updated;
      pushAlert("success", `Rep ${updated} counted. Bend and return.`, "success");
      if (updated === targetReps) pushAlert("done", `${current.name} complete.`, "milestone");
      return updated;
    });
  }

  function countManualRep() {
    if (signalSeen) return;
    setReps((count) => {
      const updated = count + 1;
      totals.current[current.id] = updated;
      pushAlert("success", `Rep ${updated} counted.`, "success");
      if (updated === targetReps) pushAlert("done", `${current.name} complete.`, "milestone");
      return updated;
    });
  }

  function pushAlert(id: string, message: string, tone: ExerciseAlert["tone"]) {
    setAlerts((prev) => {
      if (prev.some((a) => a.message === message)) return prev;
      return [{ id, tone, message }, ...prev].slice(0, 4);
    });

    if (user && tone === "milestone") {
      addNotification({
        toEmail: user.email,
        role: "patient",
        title: "Exercise milestone",
        message,
      });
      sendBrowserNotification("Revive Motion", message);
    }
  }

  function startExercise() {
    setActive(true);
    pushAlert("start", `Starting ${current.name} — follow the picture and move with your sensor.`, "tip");
  }

  function markDone() {
    const nextCompleted = [...completed, current.id];
    setCompleted(nextCompleted);
    pushAlert("finish", `✓ ${current.name} logged.`, "success");

    const total = Object.values(totals.current).reduce((sum, count) => sum + count, 0);
    if (index < exercises.length - 1) {
      setIndex((i) => i + 1);
    } else {
      if (user) {
        addNotification({
          toEmail: user.email,
          role: "patient",
          title: "All exercises complete",
          message: `You finished all ${exercises.length} exercises in this session!`,
        });
        sendBrowserNotification(
          "Revive Motion",
          `Session complete — all ${exercises.length} exercises done!`
        );
      }
      onComplete(nextCompleted, total);
    }
  }

  const alertStyles: Record<ExerciseAlert["tone"], string> = {
    success: "border-correct/40 bg-correct/15 text-correct",
    tip: "border-brand/40 bg-brand/10 text-brand-light",
    milestone: "border-gold/40 bg-gold/10 text-gold",
    form: "border-alert/40 bg-alert/10 text-alert",
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold text-[#2f4a60]">Follow your exercises</span>
          <span className="font-semibold tabular-nums text-[#1b3348]">
            {index + 1} of {exercises.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#e8f3fb]">
          <div
            className="h-full rounded-full bg-[#3a7d62] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {alerts.length > 0 && (
        <ul className="space-y-2" aria-live="polite">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${alertStyles[alert.tone]}`}
            >
              {alert.message}
            </li>
          ))}
        </ul>
      )}

      <section className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_14px_32px_rgba(27,51,72,0.07)] ring-1 ring-[#4f90c6]/12">
        <div className="flex h-48 items-center justify-center bg-[#f7fbfe]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media.image} alt={current.name} className="h-40 object-contain p-4" />
        </div>
        <div className="p-6">
          <p className="text-sm font-semibold text-[#2f4a60]">Exercise {index + 1}</p>
          <h2 className="rm-serif mt-1 text-2xl font-semibold text-[#1b3348]">{current.name}</h2>
          <p className="mt-3 text-base leading-7 text-[#2f4a60]">{current.description}</p>
          <p className="mt-4 rounded-[1.1rem] bg-[#e8f3fb] px-4 py-3 text-lg font-bold text-[#1b3348]">
            {current.sets}
          </p>

          {active && (
            <div className="mt-4 space-y-3">
              <p className="text-sm leading-6 text-[#2f4a60]">{t("repCycleHint", locale)}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rm-card px-4 py-3 text-center">
                  <p className="text-xs text-muted">{t("reps", locale)}</p>
                  <p className="text-2xl font-bold text-correct">
                    {reps}/{targetReps}
                  </p>
                </div>
                <div className="rm-card px-4 py-3 text-center">
                  <p className="text-xs text-muted">Angle</p>
                  <p className="text-2xl font-bold text-brand-light">{liveAngle != null ? `${liveAngle}°` : "—"}</p>
                </div>
              </div>
              {method === "muscle" ? <MyoWarePanel compact /> : <MotionPanel compact live onAngle={onAngle} />}
            </div>
          )}

          <ol className="mt-5 space-y-2 text-sm text-body">
            <li>1. Get into the position in the picture</li>
            <li>2. Bend and return once for each rep</li>
            <li>3. Tap below when the set is finished</li>
          </ol>

          {!active ? (
            <button type="button" onClick={startExercise} className="rm-btn rm-btn-brand mt-8 w-full">
              Start exercise with sensor
            </button>
          ) : (
            <div className="mt-8 space-y-3">
              {!signalSeen ? (
                <button type="button" onClick={countManualRep} className="rm-btn rm-btn-ghost w-full">
                  {t("countRepBtn", locale)}
                </button>
              ) : null}
              <button type="button" onClick={markDone} className="rm-btn rm-btn-primary w-full">
                {index < exercises.length - 1 ? "Done — next exercise" : "Finish all exercises"}
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {exercises.map((ex, i) => (
          <span
            key={ex.id}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              completed.includes(ex.id)
                ? "bg-correct/20 text-correct"
                : i === index
                  ? "bg-brand/20 text-brand-light"
                  : "bg-surface text-muted"
            }`}
          >
            {completed.includes(ex.id) ? "✓" : i + 1}. {ex.name}
          </span>
        ))}
      </div>
    </div>
  );
}
