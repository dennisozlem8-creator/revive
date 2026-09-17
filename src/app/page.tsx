"use client";

import Link from "next/link";
import {
  DashCard,
  DashIntro,
  DashLoop,
  DashPhotoLink,
  DashShell,
  DashStat,
} from "@/components/clinic/DashKit";
import { bodyAreas } from "@/lib/body-areas";
import { useAuth } from "@/components/AuthProvider";
import { t, clinicLocale } from "@/lib/i18n";
import { AuthLanding } from "@/components/AuthLanding";
import { DemoBanner } from "@/components/DemoBanner";
import { ReportActions } from "@/components/ReportActions";
import { isCareTeam } from "@/lib/users";
import { KidsQuestPromo, PhotoFrame } from "@/components/LandingMedia";
import { loadMeasurements } from "@/lib/goniometer";
import { doctorWatchLevel, progressSnapshot } from "@/lib/recovery-plan";
import { calculateStreak } from "@/lib/streak";

export default function Home() {
  const { user, loading, getPatientsForDoctor } = useAuth();
  const locale = clinicLocale(user);
  const isPatient = user?.role === "patient";
  const careTeam = isCareTeam(user?.role);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background text-[#2f4a60]">
        Loading your home…
      </div>
    );
  }

  if (!user) {
    return <AuthLanding mode="login" />;
  }

  const firstName = user.name.split(" ")[0];
  const clips = loadMeasurements(user.email);
  const progress = progressSnapshot(clips, user.targetRom || 100, locale);
  const streak = calculateStreak(user);
  const patients = careTeam ? getPatientsForDoctor() : [];
  const caseloadClips = patients.reduce((sum, patient) => sum + loadMeasurements(patient.email).length, 0);
  const attention = patients.filter((patient) => doctorWatchLevel(loadMeasurements(patient.email)).level !== "on-track").length;

  return (
    <DashShell caregiver={careTeam}>
      <DemoBanner locale={locale} />
      <section className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_14px_32px_rgba(27,51,72,0.07)] ring-1 ring-[#4f90c6]/12">
        <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
          <PhotoFrame
            src={careTeam ? "/images/landing-exercise.webp" : "/images/landing-older-phone.webp?v=1"}
            alt=""
            imgClassName="object-[center_18%]"
            className="h-40 sm:h-48 lg:order-2 lg:h-full lg:min-h-[16rem]"
          />
          <div className="p-5 sm:p-7">
            <DashIntro
              kicker="Physical therapy at home"
              title={isPatient ? `Welcome back, ${firstName}.` : t("moveBetter", locale)}
              text={
                isPatient
                  ? "Start with a photo or sensor, then do today’s session. Your clinician sees the same numbers."
                  : careTeam
                    ? "Open a linked patient, review saved clips, and send the next plan."
                    : "Choose a body area for screening, movement tests, and today’s exercises."
              }
            />
            <DashLoop />
            <div className="mt-5 flex flex-col gap-2 sm:max-w-md">
              {isPatient && (
                <>
                  <Link href="/briefing" className="rm-btn rm-btn-brand inline-flex h-12 min-h-0 w-full rounded-full">
                    {t("goToBriefing", locale)}
                  </Link>
                  <ReportActions locale={locale} className="w-full" />
                </>
              )}
              {careTeam && (
                <Link href="/doctor" className="rm-btn rm-btn-brand inline-flex h-12 min-h-0 w-full rounded-full">
                  Open care dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {isPatient && (
        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <DashStat
            label="Latest peak"
            value={progress.latestPeak != null ? `${progress.latestPeak}°` : "—"}
            hint={progress.headline}
          />
          <DashStat label="Streak" value={streak} hint={streak > 0 ? "Days in a row" : "Do a session to start"} />
          <DashStat label="Saved clips" value={clips.length} hint="Photo, motion, or muscle" />
        </section>
      )}

      {careTeam && (
        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <DashStat label="Patients" value={patients.length} hint="Linked to this account" />
          <DashStat label="Need a look" value={attention} hint="Watch or attention flags" />
          <DashStat label="Saved clips" value={caseloadClips} hint="Across the caseload" />
        </section>
      )}

      {isPatient && (
        <section className="mt-6">
          <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">Continue recovery</h2>
          <p className="mt-1 text-base text-[#2f4a60]">Measure, then coach. Pick one way to start.</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <DashPhotoLink
              href="/goniometer"
              src="/images/landing-photo-goniometer.png?v=2"
              kicker="01 Measure"
              title="Photo Goniometer"
              text="Side-view photo or clip. The angle is saved."
            />
            <DashPhotoLink
              href="/muscle"
              src="/images/landing-myoware.png?v=6"
              kicker="02 Muscle"
              title="MyoWare 2.0"
              text="Connect Bluetooth or USB, then flex."
            />
            <DashPhotoLink
              href="/session"
              src="/images/landing-mpu.png?v=8"
              kicker="03 Coach"
              title="Live session"
              text="Run today’s ROM test and exercises."
            />
          </div>
        </section>
      )}

      {careTeam && patients.length > 0 && (
        <DashCard className="mt-6">
          <div className="divide-y divide-[#e8f3fb]">
            {patients.slice(0, 4).map((patient) => {
              const rows = loadMeasurements(patient.email);
              const watch = doctorWatchLevel(rows);
              const snap = progressSnapshot(rows, patient.targetRom || 100);
              return (
                <Link
                  key={patient.email}
                  href={`/doctor/patient?email=${encodeURIComponent(patient.email)}`}
                  className="flex items-center justify-between gap-4 p-5 transition hover:bg-[#f7fbfe] sm:p-6"
                >
                  <div>
                    <p className="rm-serif text-xl font-semibold text-[#1b3348]">{patient.name}</p>
                    <p className="mt-1 text-sm text-[#2f4a60]">
                      {watch.label} · {snap.latestPeak != null ? `${snap.latestPeak}°` : "No clips"} · streak{" "}
                      {calculateStreak(patient)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#1b3348]">Review →</span>
                </Link>
              );
            })}
          </div>
        </DashCard>
      )}

      <section className="mt-8">
        <h2 className="rm-serif text-2xl font-semibold text-[#1b3348]">Start an assessment</h2>
        <p className="mt-1 text-base text-[#2f4a60]">Pick the joint your clinician asked you to work on.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bodyAreas.map((area) => (
            <DashPhotoLink
              key={area.id}
              href={`/${area.id}`}
              src={area.cover}
              kicker="Body area"
              title={area.label}
              text={area.description}
            />
          ))}
        </div>
      </section>

      <KidsQuestPromo
        className="mt-6"
        kicker="Stretch with the bots"
        title="Kids Quest"
        text="The bots ask. You stretch."
        cta={t("kidsQuest", locale)}
      />
    </DashShell>
  );
}
