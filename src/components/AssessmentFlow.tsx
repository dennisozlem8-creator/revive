"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getAssessment,
  getRecommendedExercises,
  type AssessmentAnswers,
  type RomValues,
} from "@/lib/assessments";
import type { DeviceSession } from "@/lib/device-sensor";
import { useAuth } from "./AuthProvider";
import { DeviceRecording } from "./DeviceRecording";
import { RomChart } from "./RomChart";
import { ExerciseProgram } from "./ExerciseProgram";
import { SessionReport } from "./SessionReport";
import type { SessionSummary } from "./SessionResults";

type Step = "intro" | "questions" | "test-tile" | "recording" | "exercises" | "report";

type AssessmentFlowProps = {
  areaId: string;
  areaLabel: string;
};

export function AssessmentFlow({ areaId, areaLabel }: AssessmentFlowProps) {
  const assessment = getAssessment(areaId);
  const { user, getPreviousExerciseIds, saveExerciseHistory } = useAuth();
  const [step, setStep] = useState<Step>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [romValues, setRomValues] = useState<RomValues>({});
  const [deviceSession, setDeviceSession] = useState<DeviceSession | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const savedRef = useRef(false);

  const previousExerciseIds = getPreviousExerciseIds(areaId);

  const exercises = useMemo(
    () =>
      getRecommendedExercises(areaId, answers, romValues, previousExerciseIds),
    [areaId, answers, romValues, previousExerciseIds]
  );

  const sessionSummary: SessionSummary | null = useMemo(() => {
    if (!deviceSession || !user) return null;
    const peak = Math.max(0, ...Object.values(romValues));
    return {
      angle: peak,
      reps: exercises.length * 10,
      emg: 72,
      hr: 78,
      target: user.targetRom,
    };
  }, [deviceSession, romValues, user, exercises.length]);

  useEffect(() => {
    if (step !== "report" || exercises.length === 0 || savedRef.current) return;
    saveExerciseHistory(
      areaId,
      completedIds.length ? completedIds : exercises.map((e) => e.id)
    );
    savedRef.current = true;
  }, [step, areaId, exercises, completedIds, saveExerciseHistory]);

  if (!assessment) return null;

  const currentQuestion = assessment.questions[questionIndex];
  const stepOrder: Step[] = ["intro", "questions", "test-tile", "recording", "exercises", "report"];
  const stepIndex = stepOrder.indexOf(step);

  function handleAnswer(value: string | number) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

    if (questionIndex < assessment.questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setStep("test-tile");
    }
  }

  function handleDeviceComplete(session: DeviceSession) {
    setDeviceSession(session);
    setRomValues(session.peaks);
    setStep("exercises");
  }

  function restart() {
    setStep("intro");
    setQuestionIndex(0);
    setAnswers({});
    setRomValues({});
    setDeviceSession(null);
    setCompletedIds([]);
    savedRef.current = false;
  }

  return (
    <div className="mt-10 space-y-6">
      <div className="flex gap-2">
        {stepOrder.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition ${
              stepIndex >= i ? "bg-brand" : "bg-surface"
            }`}
          />
        ))}
      </div>

      {step === "intro" && (
        <section className="rounded-2xl border border-[var(--border)] bg-surface p-8">
          <h2 className="text-2xl font-semibold">Physical therapy assessment</h2>
          <p className="mt-3 leading-7 text-muted">{assessment.intro}</p>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            <li>• {assessment.questions.length} screening questions</li>
            <li>• Wearable sensor ROM test with live charts</li>
            <li>• Guided exercises with pictures after ROM test</li>
            <li>• Session report when you finish</li>
          </ul>
          <button
            type="button"
            onClick={() => setStep("questions")}
            className="mt-8 inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-medium text-white transition hover:bg-brand-light"
          >
            Begin assessment
          </button>
        </section>
      )}

      {step === "questions" && currentQuestion && (
        <section className="rounded-2xl border border-[var(--border)] bg-surface p-8">
          <p className="text-sm font-medium text-brand-light">
            Question {questionIndex + 1} of {assessment.questions.length}
          </p>
          <h2 className="mt-3 text-xl font-semibold">{currentQuestion.text}</h2>

          {currentQuestion.type === "scale" && (
            <div className="mt-8">
              <input
                type="range"
                min={0}
                max={10}
                value={Number(answers[currentQuestion.id] ?? 5)}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: Number(e.target.value),
                  }))
                }
                className="w-full accent-brand"
              />
              <div className="mt-2 flex justify-between text-sm text-muted">
                <span>0 — No pain</span>
                <span className="text-lg font-semibold text-foreground">
                  {answers[currentQuestion.id] ?? 5}
                </span>
                <span>10 — Worst</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleAnswer(Number(answers[currentQuestion.id] ?? 5))
                }
                className="mt-6 inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-medium text-white transition hover:bg-brand-light"
              >
                Next
              </button>
            </div>
          )}

          {currentQuestion.type === "choice" && currentQuestion.options && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswer(option)}
                  className="rounded-xl border border-[var(--border)] bg-background px-4 py-3 text-left text-sm transition hover:border-brand/50 hover:bg-brand-soft"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {step === "test-tile" && (
        <section className="rounded-2xl border border-[var(--border)] bg-surface p-8 text-center">
          <h2 className="text-2xl font-semibold">Ready for your ROM test</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            Questions complete. Wear your Revive Motion sensor and tap below to
            record range of motion data.
          </p>
          <button
            type="button"
            onClick={() => setStep("recording")}
            className="group mx-auto mt-10 flex w-full max-w-sm flex-col items-center rounded-2xl border-2 border-brand/40 bg-brand/10 p-8 transition hover:border-brand hover:bg-brand/20"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/20 text-brand transition group-hover:bg-brand group-hover:text-white">
              <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden>
                <rect x="14" y="8" width="20" height="32" rx="6" fill="currentColor" />
                <circle cx="24" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span className="mt-5 text-lg font-semibold">Start ROM sensor test</span>
            <span className="mt-2 text-sm text-muted">
              Wear device · Record movement · View charts
            </span>
          </button>
        </section>
      )}

      {step === "recording" && (
        <DeviceRecording
          tests={assessment.romTests}
          areaId={areaId}
          onComplete={handleDeviceComplete}
        />
      )}

      {step === "exercises" && deviceSession && (
        <div className="space-y-6">
          <section className="rm-card border-correct/30 p-5 text-center">
            <p className="text-sm font-semibold text-correct">ROM test complete — {areaLabel}</p>
            <div className="mt-4">
              <RomChart tests={assessment.romTests} values={romValues} areaId={areaId} />
            </div>
          </section>
          <ExerciseProgram
            exercises={exercises}
            onComplete={(ids) => {
              setCompletedIds(ids);
              setStep("report");
            }}
          />
        </div>
      )}

      {step === "report" && deviceSession && sessionSummary && (
        <div className="space-y-6">
          <SessionReport
            summary={sessionSummary}
            exercises={exercises}
            completedIds={completedIds}
            onDone={restart}
          />
        </div>
      )}
    </div>
  );
}
