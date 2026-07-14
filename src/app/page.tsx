"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { QuickLinks } from "@/components/QuickLinks";
import { bodyAreas } from "@/lib/body-areas";
import { useAuth } from "@/components/AuthProvider";
import { t } from "@/lib/i18n";

const areaIcons: Record<string, React.ReactNode> = {
  ankle: (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 20V12l2-4h4l2 4v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  knee: (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 18c2-6 4-9 6-9s4 3 6 9" strokeLinecap="round" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  "lower-back": (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v18M9 6h6M8 12h8M9 18h6" strokeLinecap="round" />
    </svg>
  ),
  wrist: (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 14V8a2 2 0 0 1 4 0v6" strokeLinecap="round" />
    </svg>
  ),
  other: (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.5">
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
    <div className="relative min-h-full overflow-hidden rm-glow-patient rm-page-pad text-foreground">
      <Header />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-5 pb-8 sm:px-6">
        <section className="animate-fade-up mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-light">
            Recovery & Mobility
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("moveBetter", locale)}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-body sm:text-base">
            {isPatient
              ? "Start today's session or pick a body area below."
              : "Pick a body area for screening and exercises."}
          </p>
        </section>

        {isPatient && <QuickLinks variant="patient" />}

        {isPatient && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/briefing" className="rm-btn rm-btn-primary rm-btn-lg inline-flex flex-1 sm:max-w-xs">
              {t("goToBriefing", locale)} →
            </Link>
            <Link href="/shop" className="rm-btn rm-btn-brand inline-flex flex-1 justify-center sm:max-w-xs">
              🛒 Shop
            </Link>
          </div>
        )}

        <section className="mt-8">
          <h2 className="rm-label mb-3">{t("exploreAreas", locale)}</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {bodyAreas.map((area, index) => (
              <Link
                key={area.id}
                href={`/${area.id}`}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-up rm-card group flex items-center gap-4 p-4 transition hover:border-brand/30"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white">
                  {areaIcons[area.id]}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <h3 className="font-semibold">{area.label}</h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted">{area.description}</p>
                </div>
                <span className="text-muted transition group-hover:text-brand-light">→</span>
              </Link>
            ))}
          </div>
        </section>

        <Link
          href="/kids"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-orange/40 bg-orange/10 px-6 py-4 text-base font-bold text-orange transition hover:bg-orange/20"
        >
          🎮 {t("kidsQuest", locale)}
        </Link>
      </main>
      {isPatient && <BottomNav />}
    </div>
  );
}
