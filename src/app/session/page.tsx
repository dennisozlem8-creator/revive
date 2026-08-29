"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { PageHeroImage } from "@/components/PageHeroImage";
import { FeedbackBox } from "@/components/ui/FeedbackBox";
import { StatTile } from "@/components/ui/StatTile";
import { ExerciseProgram } from "@/components/ExerciseProgram";
import { SessionReport } from "@/components/SessionReport";
import type { SessionSummary } from "@/lib/session-results";
import { useAuth } from "@/components/AuthProvider";
import { getFeedbackState } from "@/lib/feedback";
import { areaIdForInjury, getSessionRecommendations } from "@/lib/session-results";
import { t } from "@/lib/i18n";

type Phase = "recording" | "exercises" | "report";

export default function SessionPage() {
  const { user, saveExerciseHistory, getPreviousExerciseIds } = useAuth();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("recording");
  const [angle, setAngle] = useState(0);
  const [reps, setReps] = useState(0);
  const [emg, setEmg] = useState(42);
  const [hr, setHr] = useState(72);
  const [recording, setRecording] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [wave, setWave] = useState<number[]>(() => Array(24).fill(8));
  const savedRef = useRef(false);

  const locale = user?.language ?? "en";
  const target = user?.ptPrescription?.targetAngle ?? user?.targetRom ?? 90;
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
    if (!recording) return;
    const interval = setInterval(() => {
      const next = Math.min(target + 5, Math.round(40 + Math.random() * (target - 20)));
      setAngle(next);
      setEmg(Math.round(35 + Math.random() * 40));
      setHr(Math.round(68 + Math.random() * 18));
      setWave((prev) => [...prev.slice(1), Math.max(12, Math.sin(next * 0.08) * 40 + 50)]);
      if (next >= target * 0.88) {
        setReps((r) => Math.min(targetReps, r + (Math.random() > 0.7 ? 1 : 0)));
      }
    }, 800);
    return () => clearInterval(interval);
  }, [recording, target, targetReps]);

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
      <div className="min-h-full rm-glow-patient pb-28 text-foreground">
        <Header linkHome />
        <main className="mx-auto max-w-2xl px-6 pb-8">
          <section className="rm-card mb-6 border-correct/30 p-5 text-center">
            <p className="text-sm font-semibold text-correct">ROM test complete</p>
            <p className="mt-1 text-3xl font-bold">{summary.angle}°</p>
            <p className="text-sm text-muted">Follow each exercise below in order</p>
          </section>
          <ExerciseProgram
            exercises={exercises}
            onComplete={(ids) => {
              setCompletedIds(ids);
              setPhase("report");
            }}
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (phase === "report" && summary) {
    return (
      <div className="min-h-full rm-glow-patient pb-28 text-foreground">
        <Header linkHome />
        <main className="mx-auto max-w-2xl px-6 pb-8">
          <SessionReport
            summary={summary}
            exercises={exercises}
            completedIds={completedIds}
            onDone={() => router.push("/briefing")}
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-full rm-glow-patient pb-28 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-5xl px-6 pb-8">
        <p className="rm-label">{t("liveSession", locale)}</p>
        <h1 className="rm-title mt-1 text-2xl text-foreground">
          {user.ptPrescription?.exerciseName ?? "ROM sensor test"}
        </h1>

        <PageHeroImage
          src="/images/session-hero.svg"
          alt="Live ROM session"
          className="mt-4"
          height={140}
        />

        <div className="mt-6 space-y-4">
          <FeedbackBox state={feedback} angle={angle} target={target} locale={locale} />

          <div className="rm-card p-4">
            <div className="flex h-28 items-end gap-1">
              {wave.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-brand/30 to-brand-light/80 transition-all duration-300"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="rm-label mt-2 text-center">Live angle waveform</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatTile value={`${reps}/${targetReps}`} label={t("reps", locale)} accent="correct" />
            <StatTile value={emg} label="EMG" accent="purple" />
            <StatTile value={hr} label="BPM" accent="orange" />
          </div>

          <div className="rm-card px-4 py-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted">ROM progress</span>
              <span className="font-semibold text-brand-light">{romPct}%</span>
            </div>
            <div className="rm-trajectory">
              <div className="rm-trajectory-fill" style={{ width: `${romPct}%` }} />
            </div>
          </div>

          {!recording ? (
            <button type="button" onClick={() => setRecording(true)} className="rm-btn rm-btn-brand w-full">
              {t("startRecording", locale)}
            </button>
          ) : (
            <button type="button" onClick={finishRecording} className="rm-btn rm-btn-primary w-full">
              End ROM test & start exercises
            </button>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
