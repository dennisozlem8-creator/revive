"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { bodyAreas } from "@/lib/body-areas";
import { useAuth } from "@/components/AuthProvider";
import { t } from "@/lib/i18n";
import { AuthLanding } from "@/components/AuthLanding";
import { isCareTeam } from "@/lib/users";
import { MpuAnglePhoto, MyoWarePhoto, PhotoFrame } from "@/components/LandingMedia";

const areaIcons: Record<string, ReactNode> = {
  ankle: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 20V12l2-4h4l2 4v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  knee: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 18c2-6 4-9 6-9s4 3 6 9" strokeLinecap="round" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  "lower-back": (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v18M9 6h6M8 12h8M9 18h6" strokeLinecap="round" />
    </svg>
  ),
  wrist: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 14V8a2 2 0 0 1 4 0v6" strokeLinecap="round" />
    </svg>
  ),
  other: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
    </svg>
  ),
};

export default function Home() {
  const { user, loading } = useAuth();
  const locale = user?.language ?? "en";
  const isPatient = user?.role === "patient";

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background text-muted">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthLanding mode="login" />;
  }

  const firstName = user.name.split(" ")[0];

  return (
    <div className="relative min-h-full overflow-hidden rm-glow-patient pb-28 text-foreground">
      <Header linkHome />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-4 pb-6 sm:px-6">
        <section className="overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-white shadow-[0_12px_28px_rgba(27,51,72,0.07)]">
          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(14rem,0.85fr)]">
            <PhotoFrame
              src={isCareTeam(user.role) ? "/images/landing-exercise.webp" : "/images/landing-hero-photo.webp?v=3"}
              alt=""
              className="h-32 sm:h-40 lg:order-2 lg:h-full lg:min-h-[12rem]"
            />
            <div className="p-4 sm:p-5">
              <p className="rm-label text-brand-light">Physical Therapy Assistance</p>
              <h1 className="rm-serif mt-1 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                {isPatient ? `Welcome back, ${firstName}.` : t("moveBetter", locale)}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-body sm:text-base">
                {isPatient
                  ? "Start today's session from your briefing, or open a body area for a full assessment."
                  : isCareTeam(user.role)
                    ? "Open a linked patient from the care dashboard, or screen a body area."
                    : "Choose a body area for screening questions, movement tests, and exercises made for you."}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:max-w-md">
                {isPatient && (
                  <Link href="/briefing" className="rm-btn rm-btn-brand inline-flex h-11 min-h-0 w-full rounded-full">
                    {t("goToBriefing", locale)} →
                  </Link>
                )}
                {isCareTeam(user.role) && (
                  <Link href="/doctor" className="rm-btn rm-btn-brand inline-flex h-11 min-h-0 w-full rounded-full">
                    Open care dashboard →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {isPatient && (
          <section className="mt-5">
            <p className="rm-label text-brand-light">Today&apos;s tools</p>
            <h2 className="rm-serif mt-0.5 text-xl font-semibold sm:text-2xl">Continue recovery</h2>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <Link
                href="/goniometer"
                className="rm-card overflow-hidden p-0 transition hover:border-brand/50 hover:shadow-md"
              >
                <PhotoFrame src="/images/landing-hero-photo.webp?v=3" alt="" className="h-24" />
                <div className="p-3">
                  <p className="rm-label text-brand-light">Measure</p>
                  <h3 className="mt-1 text-base font-semibold">Photo Goniometer</h3>
                  <p className="mt-0.5 text-sm leading-5 text-body">Record a clip and get the next sets.</p>
                </div>
              </Link>
              <Link href="/muscle" className="rm-card overflow-hidden p-0 transition hover:border-brand/50 hover:shadow-md">
                <MyoWarePhoto alt="" className="h-24" />
                <div className="p-3">
                  <p className="rm-label text-brand-light">Sensor</p>
                  <h3 className="mt-1 text-base font-semibold">MyoWare 2.0</h3>
                  <p className="mt-0.5 text-sm leading-5 text-body">Connect the muscle sensor over Bluetooth or USB.</p>
                </div>
              </Link>
              <Link href="/session" className="rm-card overflow-hidden p-0 transition hover:border-brand/50 hover:shadow-md">
                <MpuAnglePhoto alt="" className="h-24" />
                <div className="p-3">
                  <p className="rm-label text-brand-light">Session</p>
                  <h3 className="mt-1 text-base font-semibold">Live recovery</h3>
                  <p className="mt-0.5 text-sm leading-5 text-body">Run today&apos;s ROM test and exercises.</p>
                </div>
              </Link>
            </div>
          </section>
        )}

        <section className="mt-6">
          <p className="rm-label text-brand-light">Body areas</p>
          <h2 className="rm-serif mt-0.5 text-xl font-semibold sm:text-2xl">Start an assessment</h2>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {bodyAreas.map((area) => (
              <Link
                key={area.id}
                href={`/${area.id}`}
                className="rm-card group flex flex-col p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white">
                  {areaIcons[area.id]}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{area.label}</h3>
                <p className="mt-1 flex-1 text-sm leading-5 text-body">{area.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-light">
                  Start assessment →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mt-5 overflow-hidden rounded-[1.25rem]">
          <PhotoFrame src="/images/landing-kids-quest.webp" alt="" className="h-36 sm:h-44" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a1848]/75 via-[#2a1848]/35 to-transparent" />
          <div className="rm-glow-kids absolute inset-0 flex flex-col justify-end gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
            <div className="kids-glass p-3 sm:max-w-xl sm:p-4">
              <p className="rm-kids-type flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8a4a10]">
                Younger patients
              </p>
              <h2 className="rm-kids-type kids-title-ink mt-0.5 text-2xl sm:text-3xl">Kids Quest</h2>
              <p className="mt-1 text-sm font-medium leading-5 text-[#3a2a58]">
                Storybook adventure world for younger patients, with kingdoms, quests, and gold stars.
              </p>
            </div>
            <Link href="/kids" className="kids-cta rm-btn rm-kids-type h-10 min-h-0 rounded-full px-5 text-sm sm:h-11 sm:text-base">
              {t("kidsQuest", locale)}
            </Link>
          </div>
        </section>
      </main>
      {isPatient && <BottomNav />}
    </div>
  );
}
