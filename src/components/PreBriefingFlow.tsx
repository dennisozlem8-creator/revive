"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import {
  getPreBriefingQuestions,
  summarizeCheckIn,
  type CheckInAnswers,
} from "@/lib/pre-briefing-questions";
import { todayDateString } from "@/lib/streak";
import { addNotification } from "@/lib/notifications";
import { generateDailyPlan } from "@/lib/daily-plan";

export function PreBriefingFlow() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<CheckInAnswers>({});

  if (!user) return null;

  const questions = getPreBriefingQuestions(user.injuryType);
  const current = questions[index];
  const progress = ((index + 1) / questions.length) * 100;

  function finish(finalAnswers: CheckInAnswers) {
    if (!user) return;
    const today = todayDateString();
    const summary = summarizeCheckIn(finalAnswers);

    const plan = generateDailyPlan({ ...user, checkInAnswers: finalAnswers, lastCheckInDate: today });

    updateUser({
      lastCheckInDate: today,
      checkInAnswers: finalAnswers,
      painToday: undefined,
      dailyPlan: plan,
    });

    if (user.doctorEmail && (summary.includes("swelling") || summary.includes("missed"))) {
      addNotification({
        toEmail: user.doctorEmail,
        role: "doctor",
        title: "Daily check-in note",
        message: `${user.name}: ${summary}. Review before session.`,
      });
    }

    if (user.caregiverEmail && (summary.includes("swelling") || summary.includes("missed") || summary.includes("pain"))) {
      addNotification({
        toEmail: user.caregiverEmail,
        role: "caregiver",
        title: "Check-in update",
        message: `${user.name}: ${summary}. Consider sending encouragement.`,
      });
    }

    router.replace("/briefing");
  }

  function submitAnswer(value: string | number) {
    if (!current) return;
    const next = { ...answers, [current.id]: value };

    if (index < questions.length - 1) {
      setAnswers(next);
      setIndex((i) => i + 1);
    } else {
      finish(next);
    }
  }

  if (!current) return null;

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-surface-elevated">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="rm-label text-brand-light">
        Daily check-in · {index + 1} of {questions.length}
      </p>
      <h1 className="rm-title mt-2 text-2xl text-white">Before your briefing</h1>
      <p className="mt-2 text-body">
        A few quick questions help personalize today&apos;s session.
      </p>

      <section className="rm-card-elevated mt-8 p-6">
        <h2 className="text-xl font-bold leading-snug">{current.text}</h2>

        {current.type === "scale" && (
          <div className="mt-8">
            <input
              type="range"
              min={1}
              max={5}
              value={Number(answers[current.id] ?? 3)}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [current.id]: Number(e.target.value) }))
              }
              className="w-full accent-brand"
            />
            <div className="mt-3 flex justify-between text-sm text-muted">
              <span>1 — Low</span>
              <span className="text-2xl font-bold text-brand-light">
                {answers[current.id] ?? 3}
              </span>
              <span>5 — High</span>
            </div>
            <button
              type="button"
              onClick={() => submitAnswer(Number(answers[current.id] ?? 3))}
              className="rm-btn rm-btn-brand mt-8 w-full"
            >
              Continue
            </button>
          </div>
        )}

        {current.type === "choice" && current.options && (
          <div className="mt-6 space-y-3">
            {current.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => submitAnswer(option)}
                className="rm-card flex min-h-[4rem] w-full items-center px-5 text-left text-base font-semibold transition hover:border-brand hover:bg-brand/10"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </section>

      {index > 0 && (
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          className="mt-6 text-sm font-medium text-brand-light hover:text-brand"
        >
          ← Previous question
        </button>
      )}
    </div>
  );
}
