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
import { generateTreatmentPlan } from "@/lib/treatment-plan";
import { t, resolveLocale } from "@/lib/i18n";
import { localizeQuestion, localizeOptions, optionToEnglish } from "@/lib/i18n-checkin";

export function PreBriefingFlow() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<CheckInAnswers>({});
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const locale = resolveLocale(user);
  const questions = getPreBriefingQuestions(user.injuryType);
  const current = questions[index];
  const progress = ((index + 1) / questions.length) * 100;

  function finish(finalAnswers: CheckInAnswers) {
    if (!user || submitting) return;
    setSubmitting(true);
    const today = todayDateString();
    const summary = summarizeCheckIn(finalAnswers);

    const updatedUser = {
      ...user,
      checkInAnswers: finalAnswers,
      lastCheckInDate: today,
    };
    const plan = generateDailyPlan(updatedUser);
    const treatmentPlan = user.treatmentPlan ?? generateTreatmentPlan(updatedUser);

    updateUser({
      lastCheckInDate: today,
      checkInAnswers: finalAnswers,
      dailyPlan: plan,
      treatmentPlan,
    });

    if (user.doctorEmail && (summary.includes("swelling") || summary.includes("missed") || summary.includes("low energy"))) {
      addNotification({
        toEmail: user.doctorEmail,
        role: "doctor",
        title: locale === "es" ? "Nota del check-in diario" : "Daily check-in note",
        message: `${user.name}: ${summary}.`,
      });
    }

    if (
      user.caregiverEmail &&
      (summary.includes("swelling") ||
        summary.includes("missed") ||
        summary.includes("low energy") ||
        summary.includes("low confidence") ||
        summary.includes("poor sleep"))
    ) {
      addNotification({
        toEmail: user.caregiverEmail,
        role: "caregiver",
        title: locale === "es" ? "Actualización del check-in" : "Check-in update",
        message: `${user.name}: ${summary}.`,
      });
    }

    router.replace("/briefing");
  }

  function submitAnswer(value: string | number) {
    if (!current || submitting) return;
    const stored =
      typeof value === "string" ? optionToEnglish(current.id, value) : value;
    const next = { ...answers, [current.id]: stored };

    if (index < questions.length - 1) {
      setAnswers(next);
      setIndex((i) => i + 1);
    } else {
      finish(next);
    }
  }

  if (!current) return null;

  const displayOptions =
    current.type === "choice" && current.options
      ? localizeOptions(current.id, locale, current.options)
      : [];

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-surface-elevated">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="rm-label text-brand-light">
        {t("dailyCheckIn", locale)} · {index + 1} / {questions.length}
      </p>
      <h1 className="rm-title mt-2 text-white">{t("beforeBriefing", locale)}</h1>
      <p className="mt-2 text-lg text-body">{t("checkInIntro", locale)}</p>

      <section className="rm-card-elevated mt-8 p-6">
        <h2 className="text-xl font-bold leading-snug">{localizeQuestion(current.id, locale)}</h2>

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
            <div className="mt-3 flex justify-between text-base text-muted">
              <span>1 — {t("scaleLow", locale)}</span>
              <span className="text-3xl font-bold text-brand-light">
                {answers[current.id] ?? 3}
              </span>
              <span>5 — {t("scaleHigh", locale)}</span>
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={() => submitAnswer(Number(answers[current.id] ?? 3))}
              className="rm-btn rm-btn-brand mt-8 w-full disabled:opacity-50"
            >
              {submitting ? t("loading", locale) : t("continueBtn", locale)}
            </button>
          </div>
        )}

        {current.type === "choice" && displayOptions.length > 0 && (
          <div className="mt-6 space-y-3">
            {displayOptions.map((option) => (
              <button
                key={option}
                type="button"
                disabled={submitting}
                onClick={() => submitAnswer(option)}
                className="rm-card flex min-h-[4rem] w-full items-center px-5 text-left text-base font-semibold transition hover:border-brand hover:bg-brand/10 disabled:opacity-50"
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
          disabled={submitting}
          onClick={() => setIndex((i) => i - 1)}
          className="mt-6 text-base font-medium text-brand-light hover:text-brand"
        >
          ← {t("previousQuestion", locale)}
        </button>
      )}
    </div>
  );
}
