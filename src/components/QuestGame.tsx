"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Exercise } from "@/lib/assessments";
import { getExerciseMedia, getKidsExerciseImage } from "@/lib/exercise-media";
import { persistMeasurement } from "@/lib/goniometer";
import { myoWareBrowserHelp } from "@/lib/myoware-sensor";
import { useAuth } from "./AuthProvider";
import {
  createKidsSensorReading,
  simulateDeviceConnect,
} from "@/lib/device-sensor";
import { getFeedbackState } from "@/lib/feedback";
import { KidsIcon } from "./KidsIcon";
import { KidsPhotoCamera } from "./KidsPhotoCamera";
import { SafePicture } from "./SafePicture";
import { useMyoWare } from "./MyoWareProvider";
import type { KidsIconName } from "@/lib/kids-icons";

type MeasureId = "photo" | "motion" | "muscle";

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
  alert: "Match the picture. Do the stretch.",
  idle: "The bots ask. You stretch.",
};

const measures: { id: MeasureId; kicker: string; name: string; line: string; image: string }[] = [
  {
    id: "photo",
    kicker: "Photo Goniometer",
    name: "Photo",
    line: "Match the picture. Do the stretch.",
    image: "/images/landing-hero-photo.webp?v=3",
  },
  {
    id: "motion",
    kicker: "MPU-6050",
    name: "Motion",
    line: "Strap the sensor. The bots count.",
    image: "/images/landing-mpu.png?v=6",
  },
  {
    id: "muscle",
    kicker: "MyoWare 2.0",
    name: "Muscle",
    line: "Flex. The bots count.",
    image: "/images/landing-myoware.png?v=5",
  },
];

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
  const muscle = useMyoWare();
  const [measure, setMeasure] = useState<MeasureId | null>(null);
  const [motionReady, setMotionReady] = useState(false);
  const [motionConnecting, setMotionConnecting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [reps, setReps] = useState(0);
  const [angle, setAngle] = useState(0);
  const [effort, setEffort] = useState(0);
  const peakRef = useRef(0);
  const lastRepAtRef = useRef(0);
  const lastFlexRef = useRef(false);

  const target = media.kidsQuest.reps;
  const done = reps >= target;
  const firstName = user?.name.split(" ")[0] ?? "friend";
  const feedback = getFeedbackState(angle, targetAngle);
  const photoReady = measure === "photo";
  const muscleReady = measure === "muscle" && muscle.connected;
  const ready =
    measure === "photo" ? photoReady : measure === "motion" ? motionReady : muscleReady;

  const countRep = useCallback(
    (nextAngle: number) => {
      if (nextAngle < targetAngle * 0.88) return;
      const now = performance.now();
      if (now - lastRepAtRef.current < 1200) return;
      lastRepAtRef.current = now;
      setReps((r) => {
        const updated = r + 1;
        if (updated >= target) {
          completeQuest(exercise.id, 50);
          onQuestComplete?.(exercise.id);
          setRecording(false);
          if (user && measure === "photo") {
            void persistMeasurement({
              id: crypto.randomUUID(),
              userEmail: user.email,
              date: new Date().toISOString(),
              exercise: exercise.name,
              joint: "Kids Quest",
              angle: peakRef.current || nextAngle,
              note: "Kids Quest photo stretch",
              source: "video",
            });
          }
        }
        return updated;
      });
    },
    [completeQuest, exercise.id, exercise.name, measure, onQuestComplete, target, targetAngle, user]
  );

  useEffect(() => {
    if (!recording || done || measure !== "motion" || !motionReady) return;
    const interval = setInterval(() => {
      const next = createKidsSensorReading(Math.floor(performance.now() / 100), targetAngle);
      setAngle(next.angle);
      peakRef.current = Math.max(peakRef.current, next.angle);
      countRep(next.angle);
    }, 100);
    return () => clearInterval(interval);
  }, [recording, done, measure, motionReady, targetAngle, countRep]);

  useEffect(() => {
    if (!recording || done || measure !== "muscle" || !muscle.connected) return;
    const live = muscle.emg ?? 0;
    setEffort(live);
    const flexed = live >= 12;
    if (flexed && !lastFlexRef.current) {
      countRep(targetAngle);
    }
    lastFlexRef.current = flexed;
  }, [recording, done, measure, muscle.connected, muscle.emg, targetAngle, countRep]);

  function handlePhotoAngle(next: number) {
    setAngle(next);
    peakRef.current = Math.max(peakRef.current, next);
    if (!recording || done) return;
    countRep(next);
  }

  function connectMotion() {
    setMotionConnecting(true);
    simulateDeviceConnect().then(() => {
      setMotionConnecting(false);
      setMotionReady(true);
    });
  }

  function startStretch() {
    lastRepAtRef.current = 0;
    lastFlexRef.current = false;
    peakRef.current = 0;
    setReps(0);
    setRecording(true);
    if (measure === "muscle") muscle.startRecording();
  }

  function speech() {
    if (!measure) return `The bots ask. You stretch, ${firstName}. Pick photo, motion, or muscle.`;
    if (done) return `Great work, ${firstName}. Stretch complete.`;
    if (measure === "photo") {
      if (!recording) return "Stand where the camera can see the stretch.";
      if (feedback === "correct") return `Rep ${reps} counted.`;
      return "Match the picture. Do the stretch.";
    }
    if (measure === "motion") {
      if (motionConnecting) return "Finding the motion sensor.";
      if (!motionReady) return "Connect the MPU-6050 to begin.";
      if (!recording) return `Ready. Do ${exercise.name}.`;
      if (feedback === "correct") return `Rep ${reps} counted.`;
      return "Bend, then stand. The bots count.";
    }
    if (muscle.connecting) return "Looking for MyoWare.";
    if (!muscle.connected) return "Connect MyoWare, then flex.";
    if (!recording) return `Ready. Do ${exercise.name}.`;
    if (effort >= 12) return `Rep ${reps} counted. Keep flexing.`;
    return "Flex. The bots count.";
  }

  const active = measures.find((item) => item.id === measure);

  return (
    <div className="kids-glass overflow-hidden p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <KidsIcon name={avatarIcon} size={56} />
        <p className="text-base font-medium leading-snug text-[#243056] sm:text-lg">{speech()}</p>
      </div>

      {!measure && (
        <div className="mt-5">
          <h3 className="kids-title-ink text-2xl">Ways to measure</h3>
          <p className="mt-1 text-base text-[#5b6685]">Photo, motion, or muscle. Same stretch.</p>
          <div className="mt-4 grid gap-3">
            {measures.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMeasure(item.id)}
                className="kids-zone flex overflow-hidden text-left"
              >
                <SafePicture
                  src={item.image}
                  alt=""
                  width={240}
                  height={160}
                  className={`h-24 w-28 shrink-0 object-cover ${item.id === "muscle" ? "object-contain bg-white p-1" : ""}`}
                />
                <span className="flex flex-1 flex-col justify-center px-4 py-3">
                  <span className="text-sm font-semibold text-[#5b6685]">{item.kicker}</span>
                  <span className="kids-title-ink text-xl leading-tight">{item.name}</span>
                  <span className="mt-0.5 text-sm text-[#5b6685]">{item.line}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {measure && (
        <>
          <button
            type="button"
            onClick={() => {
              setRecording(false);
              setMeasure(null);
              setMotionReady(false);
              setReps(0);
              setAngle(0);
            }}
            className="kids-back mt-4"
          >
            Ways to measure
          </button>

          <h3 className="kids-title-ink mt-4 text-center text-2xl">{media.kidsQuest.title}</h3>
          <p className="mt-1 text-center text-base text-[#5b6685]">{media.kidsQuest.story}</p>

          <div className="mt-5">
            {measure === "photo" ? (
              <KidsPhotoCamera onAngle={handlePhotoAngle} />
            ) : (
              <div className="overflow-hidden rounded-[1.25rem]">
                <SafePicture
                  src={kidsImage}
                  alt={exercise.name}
                  width={800}
                  height={480}
                  className="h-44 w-full object-cover sm:h-52"
                />
              </div>
            )}
          </div>

          {measure === "motion" && (
            <div className="mt-4 flex items-center justify-between rounded-[1.15rem] bg-[#eef5fa] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#5b6685]">MPU-6050</p>
                <p className="text-base text-[#243056]">
                  {motionConnecting
                    ? "Connecting"
                    : motionReady
                      ? recording
                        ? "Live angle"
                        : "Motion sensor ready"
                      : "Strap above and below the joint"}
                </p>
              </div>
              {!motionReady && (
                <button
                  type="button"
                  disabled={motionConnecting}
                  onClick={connectMotion}
                  className="kids-cta rounded-full px-5 py-2.5 text-base disabled:opacity-60"
                >
                  {motionConnecting ? "Connecting" : "Connect"}
                </button>
              )}
            </div>
          )}

          {measure === "muscle" && (
            <div className="mt-4 rounded-[1.15rem] bg-[#eef5fa] px-4 py-3">
              <p className="text-sm font-semibold text-[#5b6685]">MyoWare 2.0</p>
              <p className="mt-0.5 text-base text-[#243056]">
                {muscle.connecting
                  ? "Looking for MyoWare"
                  : muscle.connected
                    ? muscle.emg != null
                      ? `${muscle.deviceName || "MyoWare"} · effort ${muscle.emg}`
                      : "Connected. Flex the muscle under the pads."
                    : "Ask a grown-up to connect Bluetooth or USB."}
              </p>
              {muscle.error && <p className="mt-1 text-sm text-[#5b6685]">{muscle.error}</p>}
              {!muscle.connected && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={muscle.connecting}
                    onClick={() => void muscle.connectBluetooth()}
                    className="kids-cta rounded-full px-4 py-2 text-sm disabled:opacity-60"
                  >
                    Bluetooth
                  </button>
                  <button
                    type="button"
                    disabled={muscle.connecting}
                    onClick={() => void muscle.connectUsb()}
                    className="kids-cta-magic kids-cta rounded-full px-4 py-2 text-sm disabled:opacity-60"
                  >
                    USB
                  </button>
                </div>
              )}
              {!muscle.connected && !muscle.connecting && (
                <p className="mt-2 text-sm text-[#5b6685]">{myoWareBrowserHelp()}</p>
              )}
            </div>
          )}

          {ready && (
            <div className={`mt-5 grid gap-3 text-center ${measure === "muscle" ? "grid-cols-2" : "grid-cols-2"}`}>
              <div className="rounded-[1.15rem] bg-[#eef5fa] py-4">
                <p className="text-3xl font-semibold tabular-nums text-[#243056]">
                  {measure === "muscle" ? effort : angle}{measure === "muscle" ? "" : "°"}
                </p>
                <p className="mt-1 text-sm text-[#5b6685]">
                  {measure === "muscle" ? "Effort" : `Angle · ${targetAngle}°`}
                </p>
              </div>
              <div className="rounded-[1.15rem] bg-[#eef5fa] py-4">
                <p className="text-3xl font-semibold tabular-nums text-[#243056]">
                  {reps}/{target}
                </p>
                <p className="mt-1 text-sm text-[#5b6685]">Reps</p>
              </div>
            </div>
          )}

          {ready && recording && !done && (
            <>
              <p className="mt-4 text-center text-base font-semibold text-[#243056]">
                {measure === "muscle"
                  ? effort >= 12
                    ? "Nice flex. Rep counted."
                    : "Flex. The bots count."
                  : feedbackKidsLabel[feedback]}
              </p>
              <div className="rm-xp-track mt-3 rounded-full">
                <div className="rm-xp-fill rounded-full" style={{ width: `${Math.min(100, (reps / target) * 100)}%` }} />
              </div>
              <p className="mt-3 text-center text-base font-medium text-[#5b6685]">Keep stretching.</p>
            </>
          )}

          {ready && done && (
            <div className="mt-6 text-center">
              <p className="kids-title-ink text-2xl">Stretch. Squat. Score.</p>
              <p className="mt-1 text-base text-[#5b6685]">{media.kidsQuest.reward}. Plus 50 stars.</p>
              <button
                type="button"
                onClick={() => {
                  if (measure === "muscle" && muscle.recording && user) {
                    muscle.stopAndSave(user.email);
                  }
                  onComplete();
                }}
                className="kids-cta mt-4 rounded-full px-8 py-3 text-lg"
              >
                Continue
              </button>
            </div>
          )}

          {ready && !recording && !done && (
            <button type="button" onClick={startStretch} className="kids-cta mt-6 w-full rounded-full py-4 text-xl">
              Start stretching
            </button>
          )}

          {active && (
            <p className="mt-4 text-center text-sm text-[#5b6685]">
              {active.kicker}. {active.line}
            </p>
          )}
        </>
      )}
    </div>
  );
}
