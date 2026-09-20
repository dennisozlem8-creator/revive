"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DashCard,
  DashHero,
  DashIntro,
  DashRing,
  DashShell,
  DashStat,
} from "@/components/clinic/DashKit";
import { FeedbackBox } from "@/components/ui/FeedbackBox";
import { ExerciseProgram } from "@/components/ExerciseProgram";
import { SessionReport } from "@/components/SessionReport";
import type { SessionSummary } from "@/lib/session-results";
import { useAuth } from "@/components/AuthProvider";
import { getFeedbackState } from "@/lib/feedback";
import { areaIdForInjury, getSessionRecommendations } from "@/lib/session-results";
import { t } from "@/lib/i18n";
import { PeakBarChart, TestLiveCharts } from "@/components/TestLiveCharts";
import { HeartRatePanel } from "@/components/HeartRatePanel";
import { MyoWarePanel } from "@/components/MyoWarePanel";
import { MotionPanel, PhotoMeasureCard } from "@/components/MotionPanel";
import { useHeartRate } from "@/components/HeartRateProvider";
import { useMyoWare } from "@/components/MyoWareProvider";
import { demoFlexAt } from "@/lib/muscle-demo";

type Phase = "recording" | "exercises" | "report";

export default function SessionPage() {
  const { user, saveExerciseHistory, getPreviousExerciseIds } = useAuth();
  const heart = useHeartRate();
  const muscle = useMyoWare();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("recording");
  const [angle, setAngle] = useState(0);
  const [reps, setReps] = useState(0);
  const [emg, setEmg] = useState(42);
  const [hr, setHr] = useState(72);
  const [recording, setRecording] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [wave, setWave] = useState<number[]>(() => Array(24).fill(0));
  const [emgWave, setEmgWave] = useState<number[]>(() => Array(24).fill(6));
  const [hrWave, setHrWave] = useState<number[]>(() => Array(24).fill(70));
  const savedRef = useRef(false);
  const muscleClockRef = useRef(0);

  const locale = user?.language ?? "en";
  const target = user?.ptPrescription?.targetAngle ?? user?.targetRom ?? 90;
  const feedback = getFeedbackState(angle, target);
  const targetReps = user?.ptPrescription?.reps ?? 10;
  const romPct = Math.min(100, Math.round((angle / target) * 100));

  const areaId = user ? areaIdForInjury(user.injuryType) : "wrist";
  const exercises = useMemo(() => {
    if (!user || !summary) return [];
    return getSessionRecommendations(areaId, user, summary.angle, getPreviousExerciseIds(areaId));
  }, [user, areaId, summary, getPreviousExerciseIds]);

  useEffect(() => {
    if (!recording) return;
    const interval = setInterval(() => {
      if (!motionReady) {
        const next = Math.min(target + 5, Math.round(40 + Math.random() * (target - 20)));
        setAngle(next);
        setWave((prev) => [...prev.slice(1), next]);
        if (next >= target * 0.88) {
          setReps((r) => Math.min(targetReps, r + (Math.random() > 0.7 ? 1 : 0)));
        }
      } else {
        setAngle((current) => {
          if (current >= target * 0.88) {
            setReps((r) => Math.min(targetReps, r + (Math.random() > 0.7 ? 1 : 0)));
          }
          return current;
        });
      }
      if (heart.connected && heart.bpm) {
        setHr(heart.bpm);
        setHrWave((prev) => [...prev.slice(1), heart.bpm as number]);
      } else {
        const fake = Math.round(68 + Math.random() * 18);
        setHr(fake);
        setHrWave((prev) => [...prev.slice(1), fake]);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [recording, target, targetReps, heart.connected, heart.bpm, motionReady]);

  useEffect(() => {
    if (!recording) return;
    muscleClockRef.current = performance.now();
    const interval = setInterval(() => {
      if (muscle.connected && muscle.emg != null) {
        setEmg(muscle.emg);
        setEmgWave((prev) => [...prev.slice(1), muscle.emg as number]);
        return;
      }
      const live = demoFlexAt(performance.now() - muscleClockRef.current);
      setEmg(live.effort);
      setEmgWave((prev) => [...prev.slice(1), live.effort]);
    }, 80);
    return () => clearInterval(interval);
  }, [recording, muscle.connected, muscle.emg]);

  useEffect(() => {
    if (phase !== "report" || !user || !summary || exercises.length === 0 || savedRef.current) {
      return;
    }
    saveExerciseHistory(areaId, completedIds.length ? completedIds : exercises.map((e) => e.id), {
      angle: summary.angle,
      reps: summary.reps,
      pain: user.painToday,
    });
    savedRef.current = true;
  }, [phase, user, summary, exercises, completedIds, areaId, saveExerciseHistory]);

  if (!user) return null;

  function finishRecording() {
    setSummary({ angle, reps, emg, hr, target });
    setPhase("exercises");
  }

  if (phase === "exercises" && summary) {
    return (
      <DashShell wide={false}>
        <DashCard className="p-6 text-center">
          <p className="text-sm font-semibold text-[#3a7d62]">ROM test complete</p>
          <p className="rm-serif mt-1 text-5xl font-semibold tabular-nums text-[#1b3348]">{summary.angle}°</p>
          <p className="mt-2 text-base text-[#2f4a60]">Follow each exercise below in order.</p>
        </DashCard>
        <div className="mt-6">
          <ExerciseProgram
            exercises={exercises}
            onComplete={(ids) => {
              setCompletedIds(ids);
              setPhase("report");
            }}
          />
        </div>
      </DashShell>
    );
  }

  if (phase === "report" && summary) {
    return (
      <DashShell wide={false}>
        <SessionReport
          summary={summary}
          exercises={exercises}
          completedIds={completedIds}
          onDone={() => router.push("/briefing")}
        />
      </DashShell>
    );
  }

  return (
    <DashShell>
      <DashIntro
        kicker={t("liveSession", locale)}
        title={user.ptPrescription?.exerciseName ?? "ROM sensor test"}
        text="Photo, MPU-6050 on an Elegoo, wireless muscle, or a heart strap. Same session."
      />
      <div className="mt-5">
        <DashHero
          src="/images/landing-photo-goniometer.png?v=2"
          kicker="01 Measure"
          title={recording ? "Recording now" : "Ready to record"}
          text={
            recording
              ? "Hold the pose. End the test when the peak looks honest."
              : "Open a photo or connect the Elegoo, then start the ROM test."
          }
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashRing value={angle} max={target} label="Live range vs goal" display={`${angle}°`} />
        <DashStat label={t("reps", locale)} value={`${reps}/${targetReps}`} hint="Counted this test" />
        <DashStat
          label={muscle.connected ? "Muscle live" : "Muscle demo"}
          value={muscle.connected && muscle.emg != null ? muscle.emg : emg}
          hint={muscle.connected ? "MyoWare ENV" : "Connect for real numbers"}
        />
        <DashStat
          label={heart.connected ? "Heart live" : "Heart"}
          value={heart.connected && heart.bpm ? heart.bpm : hr}
          hint={heart.connected ? "BPM from strap" : "Pair a strap to go live"}
        />
      </div>

      <div className="mt-6 space-y-4">
        <PhotoMeasureCard />
        <MotionPanel
          compact
          live={recording}
          onConnected={() => setMotionReady(true)}
          onAngle={(next) => {
            setAngle(next);
            setWave((prev) => [...prev.slice(1), next]);
          }}
        />
        <MyoWarePanel />
        <HeartRatePanel compact hideWired />
        <FeedbackBox state={feedback} angle={angle} target={target} locale={locale} />

        <TestLiveCharts
          series={[
            {
              label: motionReady ? "Live angle (MPU-6050)" : "Live angle",
              values: wave,
              unit: "°",
              max: 100,
            },
            {
              label: muscle.connected ? "Muscle effort (MyoWare)" : "Muscle effort (demo)",
              values: muscle.connected && muscle.history.some((v) => v > 0) ? muscle.history : emgWave,
              max: 100,
            },
            {
              label: heart.connected ? "Heart rate (live)" : "Heart rate (demo)",
              values: heart.connected && heart.history.some((v) => v > 0) ? heart.history : hrWave,
              unit: " bpm",
              max: 160,
            },
          ]}
        />

        <PeakBarChart
          title="This test vs your plan"
          bars={[
            { label: motionReady ? "MPU angle" : "Live angle", value: angle, goal: target },
            { label: "Baseline", value: user.baselineRom, goal: target },
            { label: "Goal", value: target },
          ]}
        />

        <DashCard className="px-5 py-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-semibold text-[#2f4a60]">ROM progress</span>
            <span className="font-semibold tabular-nums text-[#1b3348]">{romPct}%</span>
          </div>
          <div className="rm-trajectory">
            <div className="rm-trajectory-fill" style={{ width: `${romPct}%` }} />
          </div>
        </DashCard>

        {!recording ? (
          <button type="button" onClick={() => setRecording(true)} className="rm-btn rm-btn-brand w-full rounded-full">
            {t("startRecording", locale)}
          </button>
        ) : (
          <button type="button" onClick={finishRecording} className="rm-btn rm-btn-primary w-full rounded-full">
            End ROM test and start exercises
          </button>
        )}
      </div>
    </DashShell>
  );
}
