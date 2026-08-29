"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { bodyAreas } from "@/lib/body-areas";
import { useAuth } from "@/components/AuthProvider";
import { t } from "@/lib/i18n";

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
  const { user } = useAuth();
  const locale = user?.language ?? "en";
  const isPatient = user?.role === "patient";

  return (
    <div className="relative min-h-full overflow-hidden rm-glow-patient pb-28 text-foreground">
      <Header />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-6 pb-8">
        <section className="animate-fade-up mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-light">
            Recovery & Mobility
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {t("moveBetter", locale)}
          </h1>
          <p className="mt-4 text-lg text-body">
            {isPatient
              ? "Start today's session from your briefing, or explore a body area for a full assessment."
              : "Select a body area for screening questions, sensor ROM testing, and personalized exercises."}
          </p>
          {isPatient && (
            <div className="mt-8 flex w-full max-w-sm flex-col gap-3 mx-auto">
              <Link href="/briefing" className="rm-btn rm-btn-primary inline-flex w-full">
                {t("goToBriefing", locale)} →
              </Link>
              <Link href="/shop" className="rm-btn rm-btn-brand inline-flex w-full justify-center">
                Shop devices and braces
              </Link>
            </div>
          )}
          {!isPatient && (
            <Link href="/shop" className="rm-btn rm-btn-brand mt-8 inline-flex w-full max-w-sm justify-center">
              Shop devices and braces
            </Link>
          )}
          <Link
            href="/kids"
            className="mt-4 inline-flex w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-fuchsia-500 px-6 py-3 text-base font-black text-white shadow"
          >
            🎮 Kids Quest
          </Link>
        </section>

        <section className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {bodyAreas.map((area, index) => (
            <Link
              key={area.id}
              href={`/${area.id}`}
              style={{ animationDelay: `${index * 80}ms` }}
              className="animate-fade-up rm-card group p-6 transition hover:border-brand/40"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white">
                {areaIcons[area.id]}
              </div>
              <h2 className="mt-5 text-lg font-bold">{area.label}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-body">{area.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-light">
                Start assessment →
              </span>
            </Link>
          ))}
        </section>
      </main>
      {isPatient && <BottomNav />}
    </div>
  );
}
