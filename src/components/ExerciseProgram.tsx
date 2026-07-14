"use client";

import { useEffect, useRef, useState } from "react";
import type { Exercise } from "@/lib/assessments";
import { getExerciseMedia } from "@/lib/exercise-media";
import { getFeedbackState } from "@/lib/feedback";
import { repDetected } from "@/lib/device-sensor";
import { startSensorStream } from "@/lib/sensor-hub";
import { useAuth } from "./AuthProvider";
import { useSensor } from "./SensorProvider";
import { addNotification, sendBrowserNotification } from "@/lib/notifications";
import { ExerciseAICoach } from "./ExerciseAICoach";
import type { ExerciseCoachContext } from "@/lib/exercise-coach";

type ExerciseProgramProps = {
  exercises: Exercise[];
  onComplete: (completedIds: string[]) => void;
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

export function ExerciseProgram({ exercises, onComplete }: ExerciseProgramProps) {
  const { user } = useAuth();
  const { connected } = useSensor();
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [simAngle, setSimAngle] = useState(0);
  const [alerts, setAlerts] = useState<ExerciseAlert[]>([]);
  const [coachEvent, setCoachEvent] = useState<ExerciseCoachContext["event"]>("tick");
  const milestoneRef = useRef<Set<number>>(new Set());
  const lastFeedbackRef = useRef<string>("idle");
  const lastRepTickRef = useRef(0);
  const tickRef = useRef(0);

  const current = exercises[index];
  if (!current) return null;

  const media = getExerciseMedia(current.id, current.name);
  const progress = ((index + 1) / exercises.length) * 100;
  const targetReps = parseTargetReps(current.sets);
  const targetAngle = user?.targetRom ?? 90;
  const feedback = getFeedbackState(simAngle, targetAngle);

  useEffect(() => {
    setActive(false);
    setReps(0);
    setSimAngle(0);
    setAlerts([]);
    setCoachEvent("next");
    milestoneRef.current = new Set();
    lastFeedbackRef.current = "idle";
  }, [index]);

  useEffect(() => {
    if (!active || !connected) return;

    tickRef.current = 0;
    lastRepTickRef.current = 0;

    const stopStream = startSensorStream(targetAngle, (reading) => {
      tickRef.current += 1;
      setSimAngle(reading.angle);

      if (
        repDetected(reading.angle, targetAngle, lastRepTickRef.current, tickRef.current)
      ) {
        lastRepTickRef.current = tickRef.current;
        setReps((r) => {
          const updated = Math.min(targetReps, r + 1);
          if (updated > r) {
            pushAlert("success", `Rep ${updated} counted — keep that form!`, "success");
            setCoachEvent("rep");
            if (updated === Math.ceil(targetReps / 2)) {
              pushAlert("half", `Halfway there — ${targetReps - updated} reps to go!`, "milestone");
            }
            if (updated === targetReps) {
              pushAlert("done", `${current.name} complete! Great work.`, "milestone");
            }
          }
          return updated;
        });
      }
    }, 900);

    return stopStream;
  }, [active, targetAngle, targetReps, current.name, connected]);

  useEffect(() => {
    if (!active || feedback === "idle" || feedback === lastFeedbackRef.current) return;
    lastFeedbackRef.current = feedback;
    if (feedback === "alert") {
      pushAlert(`form-${Date.now()}`, "Adjust your form — move slowly through the full range.", "form");
      setCoachEvent("feedback");
    } else if (feedback === "almost") {
      pushAlert(`almost-${Date.now()}`, "Almost there — a little more bend!", "tip");
      setCoachEvent("feedback");
    } else if (feedback === "correct") {
      setCoachEvent("tick");
    }
  }, [feedback, active]);

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
    setCoachEvent("start");
    pushAlert("start", `Starting ${current.name} — follow the picture and move with your sensor.`, "tip");
  }

  function markDone() {
    setCoachEvent("complete");
    const nextCompleted = [...completed, current.id];
    setCompleted(nextCompleted);
    pushAlert("finish", `✓ ${current.name} logged.`, "success");

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
      onComplete(nextCompleted);
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
          <span className="rm-label">Follow your exercises</span>
          <span className="font-semibold text-brand-light">
            {index + 1} of {exercises.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
          <div
            className="h-full rounded-full bg-correct transition-all"
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

      <ExerciseAICoach
        exercises={exercises}
        exercise={current}
        exerciseIndex={index}
        reps={reps}
        targetReps={targetReps}
        angle={simAngle}
        targetAngle={targetAngle}
        feedback={feedback}
        active={active}
        user={user}
        event={coachEvent}
      />

      <section className="rm-card-elevated overflow-hidden">
        <div className="flex h-48 items-center justify-center bg-surface-elevated">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media.image} alt={current.name} className="h-40 object-contain p-4" />
        </div>
        <div className="p-6">
          <p className="rm-label text-brand-light">Exercise {index + 1}</p>
          <h2 className="mt-1 text-2xl font-bold">{current.name}</h2>
          <p className="mt-3 text-body leading-7">{current.description}</p>
          <p className="mt-4 rounded-xl bg-brand/10 px-4 py-3 text-lg font-bold text-brand-light">
            {current.sets}
          </p>

          {active && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rm-card px-4 py-3 text-center">
                <p className="text-xs text-muted">Reps</p>
                <p className="text-2xl font-bold text-correct">
                  {reps}/{targetReps}
                </p>
              </div>
              <div className="rm-card px-4 py-3 text-center">
                <p className="text-xs text-muted">Angle</p>
                <p className="text-2xl font-bold text-brand-light">{simAngle}°</p>
              </div>
            </div>
          )}

          <ol className="mt-5 space-y-2 text-sm text-body">
            <li>1. Get into position shown in the picture</li>
            <li>2. Complete all sets and reps at a comfortable pace</li>
            <li>3. Tap below when finished before moving on</li>
          </ol>

          {!active ? (
            <button
              type="button"
              onClick={startExercise}
              disabled={!connected}
              className="rm-btn rm-btn-brand rm-btn-lg mt-6 w-full disabled:opacity-40"
            >
              {connected ? "Start exercise with sensor" : "Connect sensor first"}
            </button>
          ) : (
            <button
              type="button"
              onClick={markDone}
              disabled={reps < Math.min(3, targetReps)}
              className="rm-btn rm-btn-primary rm-btn-lg mt-6 w-full disabled:opacity-40"
            >
              {index < exercises.length - 1 ? "Done — next exercise" : "Finish all exercises"}
            </button>
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
