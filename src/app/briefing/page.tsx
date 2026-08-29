"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { PageHeroImage } from "@/components/PageHeroImage";
import { StatTile } from "@/components/ui/StatTile";
import { useAuth } from "@/components/AuthProvider";
import { calculateStreak } from "@/lib/streak";
import { summarizeCheckIn } from "@/lib/pre-briefing-questions";
import { t } from "@/lib/i18n";

export default function BriefingPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const locale = user.language ?? "en";
  const prescription = user.ptPrescription;
  const streak = calculateStreak(user);
  const lastSession = user.exerciseHistory[user.exerciseHistory.length - 1];
  const dayNum = user.exerciseHistory.length + 1;
  const checkInSummary = user.checkInAnswers
    ? summarizeCheckIn(user.checkInAnswers)
    : null;

  return (
    <div className="min-h-full rm-glow-patient pb-28 text-foreground">
      <Header linkHome />
      <main className="mx-auto max-w-lg px-6 pb-8">
        <p className="rm-label">
          {t("recoveryDay", locale)} {dayNum}
        </p>
        <h1 className="rm-title mt-1 text-3xl text-foreground">{t("todaysBriefing", locale)}</h1>
        <p className="mt-1 text-body">Hi {user.name.split(" ")[0]} — ready when you are.</p>

        <PageHeroImage
          src="/images/briefing-hero.svg"
          alt="Today's recovery briefing"
          className="mt-6"
        />

        {checkInSummary && (
          <p className="mt-3 rounded-xl border border-brand/25 bg-brand/10 px-4 py-3 text-sm text-body">
            Check-in complete · <span className="text-foreground">{checkInSummary}</span>
          </p>
        )}

        <section className="rm-card-elevated mt-8 p-6">
          <p className="rm-label text-brand-light">{t("todaysExercise", locale)}</p>
          <h2 className="mt-2 text-2xl font-bold">
            {prescription?.exerciseName ?? "Resistance Band Extension"}
          </h2>
          <p className="mt-2 rm-body">
            {prescription
              ? `${prescription.sets} × ${prescription.reps} reps · Hold ${prescription.holdSeconds}s · ${prescription.targetAngle}° target`
              : "3 × 10 reps · Hold 12 seconds each"}
          </p>
        </section>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatTile value={`${lastSession?.exerciseIds.length ?? 0}/10`} label={t("lastReps", locale)} />
          <StatTile value={`${user.baselineRom + 30}°`} label={t("romNow", locale)} accent="correct" />
          <StatTile value={streak} label={t("streak", locale)} accent="orange" />
        </div>

        {prescription?.notes && (
          <section className="mt-4 overflow-hidden rounded-xl border border-teal/40 bg-teal/10">
            <div className="border-l-4 border-teal px-5 py-4">
              <p className="text-xs font-bold tracking-wider text-teal">{t("ptUpdate", locale)}</p>
              <p className="mt-2 rm-body text-foreground">{prescription.notes}</p>
            </div>
          </section>
        )}

        <button
          type="button"
          onClick={() => router.push("/pain-check")}
          className="rm-btn rm-btn-primary mt-8 w-full"
        >
          {t("startSession", locale)}
        </button>

        <p className="mt-5 text-center">
          <Link href="/library" className="text-sm font-medium text-brand-light hover:text-brand">
            {t("viewLibrary", locale)} →
          </Link>
        </p>
        <p className="mt-3 text-center">
          <Link href="/goniometer" className="text-sm font-medium text-brand-light hover:text-brand">
            {t("photoGoniometer", locale)} →
          </Link>
        </p>
      </main>
      <BottomNav />
    </div>
  );
}
