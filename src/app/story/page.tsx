"use client";

import { useState } from "react";
import Link from "next/link";
import { ExerciseFigure } from "@/components/ExerciseFigure";
import { LandingHeader } from "@/components/LandingHeader";
import { TryDemoButton } from "@/components/TryDemoButton";
import { useClinicLocale } from "@/components/useClinicLocale";
import { t, tf, type CopyKey } from "@/lib/i18n";

const steps = [
  { kicker: "story1Kicker", title: "story1Title", text: "story1Text" },
  { kicker: "story2Kicker", title: "story2Title", text: "story2Text" },
  { kicker: "story3Kicker", title: "story3Title", text: "story3Text" },
  { kicker: "story4Kicker", title: "story4Title", text: "story4Text" },
] as const satisfies readonly { kicker: CopyKey; title: CopyKey; text: CopyKey }[];

export default function PatientStoryPage() {
  const { locale } = useClinicLocale();
  const [step, setStep] = useState(0);
  const copy = steps[step];

  return (
    <div className="min-h-full bg-[#e8f3fb] text-[#1b3348]">
      <LandingHeader mode="login" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4f90c6]">{t("storyKicker", locale)}</p>
        <h1 className="rm-serif mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{t("storyTitle", locale)}</h1>
        <p className="mt-2 text-sm font-semibold text-[#2f4a60]">{tf("storyProgress", locale, { n: step + 1 })}</p>
        <div className="mt-3 flex gap-2" aria-hidden>
          {steps.map((item, index) => (
            <span key={item.kicker} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-[#4f90c6]" : "bg-white"}`} />
          ))}
        </div>

        <article className="mt-5 overflow-hidden rounded-[1.5rem] bg-white shadow-[0_16px_36px_rgba(27,51,72,0.08)] ring-1 ring-[#4f90c6]/12">
          <StoryVisual step={step} locale={locale} title={t(copy.title, locale)} />
          <div className="p-5 sm:p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4f90c6]">{t(copy.kicker, locale)}</p>
            <h2 className="rm-serif mt-2 text-3xl font-semibold leading-tight">{t(copy.title, locale)}</h2>
            <p className="mt-3 text-base leading-7 text-[#2f4a60]">{t(copy.text, locale)}</p>
            {step === 3 ? (
              <p className="mt-4 inline-flex rounded-full bg-[#e8f3fb] px-3 py-1.5 text-sm font-semibold text-[#1b3348]">
                {t("storyRange", locale)}
              </p>
            ) : null}
          </div>
        </article>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
            className="inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold text-[#1b3348] disabled:opacity-40"
          >
            {t("storyBack", locale)}
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((value) => Math.min(3, value + 1))}
              className="inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-bold text-white"
            >
              {t("storyNext", locale)}
            </button>
          ) : (
            <TryDemoButton
              role="doctor"
              className="inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-bold text-white"
            />
          )}
        </div>
        <p className="mt-4 text-sm text-[#2f4a60]">{t("storySpanish", locale)}</p>
        <p className="mt-2">
          <Link href="/" className="text-sm font-semibold text-[#1b3348]">
            {t("storyHome", locale)}
          </Link>
        </p>
      </main>
    </div>
  );
}

function StoryVisual({ step, locale, title }: { step: number; locale: "en" | "es"; title: string }) {
  if (step === 0) {
    return (
      <div className="grid bg-[#f4f9fc] sm:grid-cols-[14rem_1fr]">
        <ExerciseFigure id="heel-slides" title={title} className="h-44 w-full sm:h-full" />
        <div className="flex flex-col justify-center p-5">
          <p className="text-sm font-semibold text-[#4f90c6]">Jordan Rivera</p>
          <p className="rm-serif mt-1 text-2xl font-semibold">{t("storyMoveName", locale)}</p>
          <p className="mt-1 text-sm text-[#2f4a60]">{t("storyDose", locale)}</p>
        </div>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="relative h-52 bg-[#d7e8f4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/landing-photo-goniometer.png?v=2" alt="" className="h-full w-full object-cover object-center" />
        <p className="absolute bottom-4 left-4 rounded-2xl bg-white px-4 py-2 text-3xl font-semibold text-[#1b3348] shadow">92°</p>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="bg-[#1b3348] px-6 py-8 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">{t("storyPassportLabel", locale)}</p>
        <p className="rm-serif mt-2 text-6xl font-semibold leading-none">76</p>
        <p className="mt-2 text-sm text-white/75">{t("storyPassportNote", locale)}</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
          <span className="block h-full w-[76%] rounded-full bg-[#7eb3d9]" />
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-px bg-[#d7e8f4] sm:grid-cols-2">
      <div className="bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#4f90c6]">{t("storyPatient", locale)}</p>
        <p className="mt-1 font-semibold">Jordan Rivera</p>
        <p className="rm-serif mt-2 text-5xl font-semibold">76</p>
      </div>
      <div className="bg-[#f4f9fc] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#4f90c6]">{t("storyClinicRole", locale)}</p>
        <p className="mt-1 font-semibold">Sam Ortiz, DPT</p>
        <p className="rm-serif mt-2 text-3xl font-semibold">80° → 92°</p>
        <p className="text-sm text-[#2f4a60]">{t("storyGoal", locale)}</p>
      </div>
    </div>
  );
}
