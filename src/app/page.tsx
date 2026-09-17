"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { bodyAreas } from "@/lib/body-areas";
import { useAuth } from "@/components/AuthProvider";
import { t } from "@/lib/i18n";
import { AuthLanding } from "@/components/AuthLanding";
import { isCareTeam } from "@/lib/users";

const areaIcons: Record<string, React.ReactNode> = {
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

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-6 pb-8">
        <section className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_16px_40px_rgba(27,51,72,0.07)] sm:p-8">
          <p className="rm-label text-brand-light">Physical Therapy Assistance</p>
          <h1 className="rm-serif mt-2 text-[2rem] font-semibold leading-tight text-foreground sm:text-4xl">
            {isPatient ? `Welcome back, ${firstName}.` : t("moveBetter", locale)}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-body">
            {isPatient
              ? "Start today's session from your briefing, or open a body area for a full assessment."
              : isCareTeam(user.role)
                ? "Open a linked patient from the care dashboard, or screen a body area."
                : "Choose a body area for screening questions, movement tests, and exercises made for you."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:max-w-md">
            {isPatient && (
              <Link href="/briefing" className="rm-btn rm-btn-brand inline-flex w-full rounded-full">
                {t("goToBriefing", locale)} →
              </Link>
            )}
            {isCareTeam(user.role) && (
              <Link href="/doctor" className="rm-btn rm-btn-brand inline-flex w-full rounded-full">
                Open care dashboard →
              </Link>
            )}
          </div>
        </section>

        {isPatient && (
          <section className="mt-8">
            <p className="rm-label text-brand-light">Today&apos;s tools</p>
            <h2 className="rm-serif mt-1 text-2xl font-semibold">Continue recovery</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href="/goniometer"
                className="rm-card p-5 transition hover:border-brand/50 hover:shadow-md"
              >
                <p className="rm-label text-brand-light">Measure</p>
                <h3 className="mt-2 text-lg font-semibold">Photo Goniometer</h3>
                <p className="mt-1 text-sm leading-6 text-body">Record a clip and get the next sets.</p>
              </Link>
              <Link href="/muscle" className="rm-card p-5 transition hover:border-brand/50 hover:shadow-md">
                <p className="rm-label text-brand-light">Sensor</p>
                <h3 className="mt-2 text-lg font-semibold">MyoWare 2.0</h3>
                <p className="mt-1 text-sm leading-6 text-body">Connect the muscle sensor over Bluetooth or USB.</p>
              </Link>
              <Link href="/session" className="rm-card p-5 transition hover:border-brand/50 hover:shadow-md">
                <p className="rm-label text-brand-light">Session</p>
                <h3 className="mt-2 text-lg font-semibold">Live recovery</h3>
                <p className="mt-1 text-sm leading-6 text-body">Run today&apos;s ROM test and exercises.</p>
              </Link>
            </div>
          </section>
        )}

        <section className="mt-10">
          <p className="rm-label text-brand-light">Body areas</p>
          <h2 className="rm-serif mt-1 text-2xl font-semibold">Start an assessment</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bodyAreas.map((area) => (
              <Link
                key={area.id}
                href={`/${area.id}`}
                className="rm-card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white">
                  {areaIcons[area.id]}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">{area.label}</h3>
                <p className="mt-2 flex-1 text-base leading-7 text-body">{area.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-base font-semibold text-brand-light">
                  Start assessment →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-[var(--border)] bg-white p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="rm-label text-brand-light">Younger patients</p>
            <h2 className="rm-serif mt-1 text-2xl font-semibold text-foreground">Kids Quest</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-body">
              Storybook adventure world for younger patients, kept separate from the adult clinic.
            </p>
          </div>
          <Link
            href="/kids"
            className="mt-4 inline-flex h-12 items-center justify-center rounded-full border border-[var(--border)] px-6 text-sm font-semibold text-brand-light transition hover:border-brand/40 sm:mt-0"
          >
            {t("kidsQuest", locale)}
          </Link>
        </section>
      </main>
      {isPatient && <BottomNav />}
    </div>
  );
}
