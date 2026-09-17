"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashCard, DashIntro, DashLoop, DashPhotoLink, DashRing, DashShell, DashStat } from "@/components/clinic/DashKit";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak } from "@/lib/streak";
import { summarizeCheckIn } from "@/lib/pre-briefing-questions";
import { t } from "@/lib/i18n";
import { loadMeasurements } from "@/lib/goniometer";
import { preExerciseSetup, progressSnapshot } from "@/lib/recovery-plan";
import { PhotoFrame } from "@/components/LandingMedia";

export default function BriefingPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const locale = user.language ?? "en";
  const prescription = user.ptPrescription;
  const streak = calculateStreak(user);
  const lastSession = user.exerciseHistory[user.exerciseHistory.length - 1];
  const dayNum = user.exerciseHistory.length + 1;
  const checkInSummary = user.checkInAnswers ? summarizeCheckIn(user.checkInAnswers) : null;
  const todayExercise = prescription?.exerciseName ?? "Heel Slide";
  const setup = preExerciseSetup(todayExercise).slice(0, 4);
  const clips = loadMeasurements(user.email);
  const progress = progressSnapshot(clips, user.targetRom || 100);
  const goal = user.targetRom || 100;

  return (
    <DashShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
        <div>
          <DashIntro
            kicker={`${t("recoveryDay", locale)} ${dayNum}`}
            title={t("todaysBriefing", locale)}
            text={`Hi ${user.name.split(" ")[0]}. Measure first, then do the session.`}
          />
          <DashLoop />
          {checkInSummary ? (
            <p className="mt-4 rounded-[1.15rem] bg-[#e8f3fb] px-4 py-3 text-base text-[#1b3348]">
              Check-in complete · {checkInSummary}
            </p>
          ) : null}
        </div>
        <PhotoFrame
          src="/images/landing-exercise.webp"
          alt=""
          className="min-h-[10rem] rounded-[1.5rem] lg:min-h-[12rem]"
          imgClassName="object-cover object-[center_20%]"
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <DashRing
          value={progress.latestPeak ?? 0}
          max={goal}
          label="Range vs goal"
          display={progress.latestPeak != null ? `${progress.latestPeak}°` : "—"}
        />
        <DashStat label="Last session moves" value={`${lastSession?.exerciseIds.length ?? 0}`} hint="Exercises logged last time" />
        <DashStat label="Streak" value={streak} hint="Days in a row" />
      </div>

      <DashCard className="mt-6 p-5 sm:p-6">
        <p className="text-sm font-semibold text-[#2f4a60]">Today’s exercise</p>
        <h2 className="rm-serif mt-1 text-3xl font-semibold text-[#1b3348]">{todayExercise}</h2>
        <p className="mt-2 text-base text-[#2f4a60]">
          {prescription
            ? `${prescription.sets} × ${prescription.reps} reps · Hold ${prescription.holdSeconds}s · ${prescription.targetAngle}° target`
            : "3 × 10 reps · Hold 12 seconds each"}
        </p>
        {prescription?.notes ? (
          <p className="mt-4 rounded-[1.1rem] bg-[#e8f3fb] px-4 py-3 text-base text-[#1b3348]">
            From your clinician: {prescription.notes}
          </p>
        ) : null}
      </DashCard>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <DashPhotoLink
          href="/goniometer"
          src="/images/landing-photo-goniometer.png?v=1"
          kicker="Measure"
          title="Record today’s clip"
          text={progress.headline}
        />
        <DashPhotoLink
          href="/muscle"
          src="/images/landing-myoware.png?v=5"
          kicker="Muscle"
          title="Connect MyoWare"
          text="Flex after Bluetooth or USB."
          imgClassName="object-contain bg-white p-3"
        />
        <DashPhotoLink
          href="/check-in"
          src="/images/landing-younger-phone.webp?v=1"
          kicker="Check-in"
          title="Log how you feel"
          text="Pain and stiffness stay with the plan."
        />
      </div>

      <DashCard className="mt-6 p-5 sm:p-6">
        <p className="text-sm font-semibold text-[#2f4a60]">Before you exercise</p>
        <h2 className="rm-serif mt-1 text-2xl font-semibold text-[#1b3348]">Do this setup first</h2>
        <ol className="mt-4 space-y-3">
          {setup.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f3fb] text-sm font-bold text-[#1b3348]">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-[#1b3348]">{step.title}</p>
                <p className="mt-0.5 text-sm leading-6 text-[#2f4a60]">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </DashCard>

      <button
        type="button"
        onClick={() => router.push("/pain-check")}
        className="rm-btn rm-btn-brand mt-6 h-12 w-full rounded-full"
      >
        {t("startSession", locale)}
      </button>
      <p className="mt-4 text-center">
        <Link href="/library" className="text-sm font-semibold text-[#1b3348]">
          {t("viewLibrary", locale)} →
        </Link>
      </p>
    </DashShell>
  );
}
