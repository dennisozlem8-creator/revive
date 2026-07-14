"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { PageBack } from "@/components/PageBack";
import { StepProgress } from "@/components/StepProgress";
import { FeedbackBox } from "@/components/ui/FeedbackBox";
import { StatTile } from "@/components/ui/StatTile";
import { ExerciseProgram } from "@/components/ExerciseProgram";
import { SessionReport } from "@/components/SessionReport";
import { DeviceConnectFlow } from "@/components/DeviceConnectFlow";
import { SensorStatus } from "@/components/SensorStatus";
import type { SessionSummary } from "@/components/SessionResults";
import { useAuth } from "@/components/AuthProvider";
import { useSensor } from "@/components/SensorProvider";
import { getFeedbackState } from "@/lib/feedback";
import { areaIdForInjury, getSessionRecommendations } from "@/lib/session-results";
import {
  applyReadingToRom,
  startSensorStream,
} from "@/lib/sensor-hub";
import {
  initialRomSnapshot,
  ROM_TICK_MS,
  type RomRecordingSnapshot,
} from "@/lib/rom-session";
import { t } from "@/lib/i18n";

type Phase = "recording" | "exercises" | "report";

const sessionSteps = (locale: "en" | "es") => [
  { id: "recording", label: t("stepRom", locale) },
  { id: "exercises", label: t("stepExercises", locale) },
  { id: "report", label: t("stepReport", locale) },
];

function SessionLayout({
  phase,
  locale,
  children,
}: {
  phase: Phase;
  locale: "en" | "es";
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full rm-glow-patient rm-page-pad text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-2xl px-5 pb-8 sm:px-6">
        <PageBack href="/briefing" label={t("back", locale)} />
        <StepProgress steps={sessionSteps(locale)} current={phase} />
        <div className="mt-6 space-y-4">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}

export default function SessionPage() {
  const { user, saveExerciseHistory, getPreviousExerciseIds } = useAuth();
  const { connected, connection: sensorConn } = useSensor();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("recording");
  const [snapshot, setSnapshot] = useState<RomRecordingSnapshot>(initialRomSnapshot);
  const [recording, setRecording] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [stopReason, setStopReason] = useState<string | null>(null);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [wave, setWave] = useState<number[]>(() => Array(24).fill(8));
  const savedRef = useRef(false);

  const locale = user?.language ?? "en";
  const target = user?.ptPrescription?.targetAngle ?? user?.targetRom ?? 90;
  const { angle, reps, peakAngle, emg, hr } = snapshot;
  const feedback = getFeedbackState(angle, target);
  const targetReps = user?.ptPrescription?.reps ?? 10;
  const romPct = Math.min(100, Math.round((angle / target) * 100));

  const areaId = user ? areaIdForInjury(user.injuryType) : "wrist";
  const exercises = useMemo(() => {
    if (!user || !summary) return [];
    return getSessionRecommendations(
      areaId,
      user,
      summary.angle,
      getPreviousExerciseIds(areaId)
    );
  }, [user, areaId, summary, getPreviousExerciseIds]);

  useEffect(() => {
    if (!recording || stopping || !connected) return;

    const stopStream = startSensorStream(target, (reading) => {
      setSnapshot((prev) => {
        const step = applyReadingToRom(prev, reading, target, targetReps);
        setWave((w) => [...w.slice(1), Math.max(12, Math.sin(step.angle * 0.08) * 40 + 50)]);

        if (step.shouldStop && step.stopReason) {
          setStopping(true);
          setStopReason(step.stopReason);
          setRecording(false);
          window.setTimeout(() => {
            setSummary({
              angle: step.peakAngle,
              reps: step.reps,
              emg: step.emg,
              hr: step.hr,
              target,
            });
            setPhase("exercises");
            setStopping(false);
          }, 1200);
        }

        return step;
      });
    }, ROM_TICK_MS);

    return stopStream;
  }, [recording, stopping, target, targetReps, connected]);

  useEffect(() => {
    if (phase !== "report" || !user || !summary || exercises.length === 0 || savedRef.current) {
      return;
    }
    saveExerciseHistory(areaId, completedIds.length ? completedIds : exercises.map((e) => e.id), {
      angle: summary.angle,
      reps: summary.reps,
      pain: user.painToday,
      emg: summary.emg,
      hr: summary.hr,
    });
    savedRef.current = true;
  }, [phase, user, summary, exercises, completedIds, areaId, saveExerciseHistory]);

  if (!user) return null;

  function startRecording() {
    setSnapshot(initialRomSnapshot());
    setStopReason(null);
    setStopping(false);
    setRecording(true);
  }

  if (phase === "exercises" && summary) {
    return (
      <SessionLayout phase="exercises" locale={locale}>
        <section className="rm-card border-correct/30 p-5 text-center">
          <p className="text-sm font-semibold text-correct">{t("romTestComplete", locale)}</p>
          <p className="mt-1 text-3xl font-bold">{summary.angle}°</p>
          <p className="text-sm text-muted">{t("followExercises", locale)}</p>
        </section>
        <ExerciseProgram
          exercises={exercises}
          onComplete={(ids) => {
            setCompletedIds(ids);
            setPhase("report");
          }}
        />
      </SessionLayout>
    );
  }

  if (phase === "report" && summary) {
    return (
      <SessionLayout phase="report" locale={locale}>
        <SessionReport
          summary={summary}
          exercises={exercises}
          completedIds={completedIds}
          onDone={() => router.push("/briefing")}
        />
      </SessionLayout>
    );
  }

  return (
    <SessionLayout phase="recording" locale={locale}>
      <SensorStatus />

      {!connected && (
        <section className="rm-panel p-4">
          <p className="mb-3 text-sm text-body">Connect a sensor to capture live ROM measurements.</p>
          <DeviceConnectFlow onConnected={() => {}} compact />
        </section>
      )}

      <div>
        <p className="rm-label">{t("liveSession", locale)}</p>
        <h1 className="rm-title mt-1 text-xl text-white sm:text-2xl">
          {user.ptPrescription?.exerciseName ?? "ROM sensor test"}
        </h1>
      </div>

      <FeedbackBox state={feedback} angle={angle} target={target} locale={locale} />

      <div className="rm-card p-4">
        <div className="flex h-24 items-end gap-1 sm:h-28">
          {wave.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-brand/30 to-brand-light/80 transition-all duration-300"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <p className="rm-label mt-2 text-center">{t("liveWaveform", locale)}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatTile value={`${reps}/${targetReps}`} label={t("reps", locale)} accent="correct" />
        <StatTile value={emg} label="EMG" accent="purple" />
        <StatTile
          value={hr}
          label={sensorConn?.hasHeartRate ? "BPM · pulse" : "BPM"}
          accent="orange"
        />
      </div>

      <div className="rm-card px-4 py-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-muted">{t("romProgress", locale)}</span>
          <span className="font-semibold text-brand-light">{romPct}%</span>
        </div>
        <div className="rm-trajectory">
          <div className="rm-trajectory-fill" style={{ width: `${romPct}%` }} />
        </div>
        {recording && (
          <p className="mt-3 text-center text-xs text-muted">
            {t("peakCaptured", locale)}: <strong className="text-brand-light">{peakAngle}°</strong>
          </p>
        )}
      </div>

      {stopping ? (
        <div className="rm-card border-correct/40 bg-correct/10 px-4 py-5 text-center">
          <p className="text-sm font-semibold text-correct">{t("romAutoStopping", locale)}</p>
          <p className="mt-1 text-sm text-muted">{stopReason}</p>
        </div>
      ) : !recording ? (
        <button
          type="button"
          onClick={startRecording}
          disabled={!connected}
          className="rm-btn rm-btn-brand rm-btn-lg w-full disabled:opacity-40"
        >
          {connected ? t("startRecording", locale) : "Connect sensor first"}
        </button>
      ) : (
        <div className="rm-card border-brand/30 bg-brand/10 px-4 py-5 text-center">
          <p className="text-sm font-semibold text-brand-light">{t("romAutoMode", locale)}</p>
          <p className="mt-1 text-sm text-muted">{t("romAutoHint", locale)}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-brand" />
          </div>
        </div>
      )}
    </SessionLayout>
  );
}
