"use client";

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
import { KidsIcon } from "./KidsIcon";
import { SafePicture } from "./SafePicture";
import type { KidsIconName } from "@/lib/kids-icons";

type QuestGameProps = {
  exercise: Exercise;
  onComplete: () => void;
  onQuestComplete?: (questId: string) => void;
  targetAngle?: number;
  avatarIcon?: KidsIconName;
};

const feedbackKidsLabel = {
  correct: "Nice form. Rep counted.",
  almost: "A little more bend.",
  alert: "Match the picture.",
  idle: "Connect, then start.",
};

export function QuestGame({
  exercise,
  onComplete,
  onQuestComplete,
  targetAngle = 90,
  avatarIcon = "hero",
}: QuestGameProps) {
  const media = getExerciseMedia(exercise.id, exercise.name);
  const kidsImage = getKidsExerciseImage(exercise.id, exercise.name);
  const { user, completeQuest } = useAuth();
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [reps, setReps] = useState(0);
  const [reading, setReading] = useState<KidsSensorReading | null>(null);
  const tickRef = useRef(0);
  const lastRepTickRef = useRef(-99);

  const target = media.kidsQuest.reps;
  const done = reps >= target;
  const firstName = user?.name.split(" ")[0] ?? "friend";
  const feedback = getFeedbackState(reading?.angle ?? 0, targetAngle);

  useEffect(() => {
    if (!recording || done) return;

    const interval = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;
      const next = createKidsSensorReading(tick, targetAngle);
      setReading(next);

      if (repDetected(next.angle, targetAngle, lastRepTickRef.current, tick)) {
        lastRepTickRef.current = tick;
        setReps((r) => {
          const updated = r + 1;
          if (updated >= target) {
            completeQuest(exercise.id, 50);
            onQuestComplete?.(exercise.id);
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
    if (done) return `Great work, ${firstName}. Stretch complete.`;
    if (!connected) return `${firstName}, connect to begin this stretch.`;
    if (connecting) return "Finding the practice sensor…";
    if (!recording) return `Ready. Do ${exercise.name}.`;
    if (feedback === "correct") return `Rep ${reps} counted.`;
    if (feedback === "almost") return "A little more bend.";
    if (reps > target / 2) return `${target - reps} left.`;
    return "Move with the picture.";
  }

  return (
    <div className="kids-glass overflow-hidden p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <KidsIcon name={avatarIcon} size={56} />
        <p className="text-base font-medium leading-snug text-[#243056] sm:text-lg">{speech()}</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.25rem]">
        <SafePicture
          src={kidsImage}
          alt={exercise.name}
          width={800}
          height={480}
          className="h-44 w-full object-cover sm:h-52"
        />
      </div>

      <h3 className="kids-title-ink mt-4 text-center text-2xl">{media.kidsQuest.title}</h3>
      <p className="mt-1 text-center text-base text-[#5b6685]">{media.kidsQuest.story}</p>

      <div className="mt-5 flex items-center justify-between rounded-[1.15rem] bg-[#eef5fa] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[#5b6685]">
            {connecting ? "Connecting" : connected ? (recording ? "Moving" : "Ready") : "Practice sensor"}
          </p>
          <p className="text-base text-[#243056]">
            {connecting
              ? "Just a moment"
              : connected
                ? recording
                  ? "Bend, then stand"
                  : "Start when you are ready"
                : "No hardware needed"}
          </p>
        </div>
        {!connected && (
          <button
            type="button"
            disabled={connecting}
            onClick={handleConnect}
            className="kids-cta rounded-full px-5 py-2.5 text-base disabled:opacity-60"
          >
            {connecting ? "Connecting" : "Connect"}
          </button>
        )}
      </div>

      {connected && (
        <div className="mt-5 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-[1.15rem] bg-[#eef5fa] py-4">
            <p className="text-3xl font-semibold tabular-nums text-[#243056]">{reading?.angle ?? 0}°</p>
            <p className="mt-1 text-sm text-[#5b6685]">Angle · {targetAngle}°</p>
          </div>
          <div className="rounded-[1.15rem] bg-[#eef5fa] py-4">
            <p className="text-3xl font-semibold tabular-nums text-[#243056]">
              {reps}/{target}
            </p>
            <p className="mt-1 text-sm text-[#5b6685]">Reps</p>
          </div>
        </div>
      )}

      {connected && recording && (
        <>
          <p className="mt-4 text-center text-base font-semibold text-[#243056]">
            {feedbackKidsLabel[feedback]}
          </p>
          <div className="rm-xp-track mt-3 rounded-full">
            <div className="rm-xp-fill rounded-full" style={{ width: `${Math.min(100, (reps / target) * 100)}%` }} />
          </div>
        </>
      )}

      {!connected ? null : done ? (
        <div className="mt-6 text-center">
          <p className="kids-title-ink text-2xl">{media.kidsQuest.reward}</p>
          <p className="mt-1 text-base text-[#5b6685]">Complete. Plus 50 stars.</p>
          <button type="button" onClick={onComplete} className="kids-cta mt-4 rounded-full px-8 py-3 text-lg">
            Continue
          </button>
        </div>
      ) : !recording ? (
        connected && (
          <button
            type="button"
            onClick={() => {
              tickRef.current = 0;
              lastRepTickRef.current = -99;
              setRecording(true);
            }}
            className="kids-cta mt-6 w-full rounded-full py-4 text-xl"
          >
            Start
          </button>
        )
      ) : (
        <p className="mt-4 text-center text-base font-medium text-[#5b6685]">Keep stretching.</p>
      )}
    </div>
  );
}
