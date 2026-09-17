"use client";

import Link from "next/link";
import {
  DashCard,
  DashEmpty,
  DashHeat,
  DashIntro,
  DashLoop,
  DashPhotoLink,
  DashRing,
  DashShell,
  DashStat,
} from "@/components/clinic/DashKit";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak, getActivityDates, getLongestStreak, lastDaysActive } from "@/lib/streak";
import { ProgressInsight } from "@/components/ProgressInsight";
import { loadMeasurements } from "@/lib/goniometer";
import { preExerciseSetup, progressSnapshot } from "@/lib/recovery-plan";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user || user.role !== "patient") {
    return (
      <div className="flex min-h-full items-center justify-center bg-background p-6">
        <Link href="/" className="font-semibold text-[#1b3348]">
          Go home
        </Link>
      </div>
    );
  }

  const streak = calculateStreak(user);
  const longestStreak = getLongestStreak(user);
  const totalActiveDays = getActivityDates(user).length;
  const questsDone = Object.values(user.questProgress).filter(Boolean).length;
  const clips = loadMeasurements(user.email);
  const progress = progressSnapshot(clips, user.targetRom || 100);
  const todayExercise = user.ptPrescription?.exerciseName ?? "Heel Slide";
  const setup = preExerciseSetup(todayExercise).slice(0, 3);
  const heat = lastDaysActive(user, 28);
  const goal = user.targetRom || 100;

  return (
    <DashShell>
      <DashIntro
        kicker="Your dashboard"
        title={`Today’s plan: ${todayExercise}`}
        text="Measure, follow the setup, then do the sets. That loop is what your clinician can read."
        action={
          <Link href="/briefing" className="rm-btn rm-btn-brand h-11 min-h-0 rounded-full px-6">
            Start briefing
          </Link>
        }
      />
      <DashLoop />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashRing
          value={progress.latestPeak ?? 0}
          max={goal}
          label="Range vs goal"
          display={progress.latestPeak != null ? `${progress.latestPeak}°` : "—"}
        />
        <DashStat label="Current streak" value={streak} hint={streak > 0 ? "Keep going today" : "Complete a session to start"} />
        <DashStat label="Longest streak" value={longestStreak} hint="Best run so far" />
        <DashStat label="Active days" value={totalActiveDays} hint={`${clips.length} saved clips`} />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <DashPhotoLink
          href="/goniometer"
          src="/images/landing-photo-goniometer.png?v=2"
          kicker="01 Measure"
          title="Photo Goniometer"
          text="Take the side-view photo first."
        />
        <DashPhotoLink
          href="/session"
          src="/images/landing-mpu.png?v=7"
          kicker="02 Coach"
          title="Live session"
          text="Follow today’s ROM test."
        />
        <DashPhotoLink
          href="/charts"
          src="/images/landing-exercise.webp"
          kicker="03 Report"
          title="Progress charts"
          text="Show the trend, not a guess."
        />
      </div>

      <div className="mt-6">
        <ProgressInsight rows={clips} goal={goal} />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <DashCard className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-[#2f4a60]">Before you record</p>
          <h2 className="rm-serif mt-1 text-2xl font-semibold text-[#1b3348]">Set up · Record · Do the sets</h2>
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
        <DashCard className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-[#2f4a60]">Last 28 days</p>
          <h2 className="rm-serif mt-1 text-2xl font-semibold text-[#1b3348]">Active days</h2>
          <p className="mt-2 text-sm text-[#2f4a60]">Green means a session or clip was saved that day.</p>
          <div className="mt-4">
            <DashHeat days={heat} />
          </div>
        </DashCard>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <DashCard>
          {user.exerciseHistory.length === 0 ? (
            <DashEmpty
              title="No sessions yet"
              text="Finish today’s briefing to put the first assessment on this board."
              href="/briefing"
              action="Open briefing"
            />
          ) : (
            <div className="p-5 sm:p-6">
              <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">Recent sessions</h2>
              <ul className="mt-4 space-y-2">
                {user.exerciseHistory
                  .slice(-5)
                  .reverse()
                  .map((record, i) => (
                    <li key={`${record.completedAt}-${i}`} className="rounded-[1.1rem] bg-[#f7fbfe] px-4 py-3">
                      <p className="font-semibold capitalize text-[#1b3348]">{record.areaId.replace("-", " ")}</p>
                      <p className="text-sm text-[#2f4a60]">{new Date(record.completedAt).toLocaleDateString()}</p>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </DashCard>
        <DashCard className="p-5 sm:p-6">
          <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">Kids Quest</h2>
          <p className="mt-2 text-base text-[#2f4a60]">
            {questsDone} stretch{questsDone !== 1 ? "es" : ""} done. Stars stay on this device.
          </p>
          <Link href="/kids" className="kids-cta mt-5 inline-flex h-11 min-h-0 rounded-full px-5 text-base">
            Continue Kids Quest
          </Link>
        </DashCard>
      </div>
    </DashShell>
  );
}
