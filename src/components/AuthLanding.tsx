"use client";

import Link from "next/link";
import { GoInScreen } from "@/components/GoInScreen";
import { ImpactBand } from "@/components/ImpactBand";
import { PassportBand } from "@/components/PassportBand";
import { MpuAnglePhoto, MyoWarePhoto, OverlayCard, PhonePreview, PhotoFrame, PhotoGoniometerPhoto } from "@/components/LandingMedia";
import { LandingHeader } from "@/components/LandingHeader";
import { Logo } from "@/components/Logo";
import { SessionStack } from "@/components/SessionStack";
import { TryDemoButton } from "@/components/TryDemoButton";
import { useClinicLocale } from "@/components/useClinicLocale";
import { SectionKicker } from "@/components/SectionKicker";
import { t, tf } from "@/lib/i18n";

type AuthLandingProps = {
  mode: "login" | "register";
};

function SectionIntro({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl">
      <SectionKicker>{kicker}</SectionKicker>
      <h2 className="rm-serif mt-4 text-3xl font-semibold leading-tight text-[#1b3348] sm:text-[2.35rem]">{title}</h2>
      <p className="mt-2 max-w-2xl text-base leading-7 text-[#1b3348] sm:text-lg sm:leading-8">{text}</p>
    </div>
  );
}

export function AuthLanding({ mode }: AuthLandingProps) {
  const { locale } = useClinicLocale();
  const primaryCta = mode === "login" ? t("createAccount", locale) : t("signIn", locale);
  const primaryHref = mode === "login" ? "/register" : "/login";
  const cycle = [
    { n: "01", word: t("measure", locale), line: t("cycleMeasure", locale), color: "#9dc4b0" },
    { n: "02", word: t("coach", locale), line: t("cycleCoach", locale), color: "#7eb3d9" },
    { n: "03", word: t("reportWord", locale), line: t("cycleReport", locale), color: "#4f90c6" },
    { n: "04", word: t("improve", locale), line: t("cycleImprove", locale), color: "#3a7d62" },
  ] as const;
  const ways = [
    {
      title: t("wayPhotoTitle", locale),
      text: t("wayPhotoText", locale),
      photo: true,
    },
    {
      title: t("wayMotionTitle", locale),
      text: t("wayMotionText", locale),
      mpu: true,
    },
    {
      title: t("wayMuscleTitle", locale),
      text: t("wayMuscleText", locale),
      myoware: true,
    },
  ];

  return (
    <div className="min-h-full overflow-x-clip bg-background text-foreground">
      <a
        href="#go-in"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        {t("skipToSignIn", locale)}
      </a>
      <LandingHeader mode={mode} />

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-28 top-0 h-64 w-64 rounded-full bg-[#4f90c6]/15 blur-3xl" />
          <div className="pointer-events-none absolute right-[-6rem] top-16 h-72 w-72 rounded-full bg-[#9dc4b0]/25 blur-3xl" />

          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-4 pb-8 pt-5 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:pb-10 lg:pt-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#1b3348] px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-white">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#7eb3d9]" />
                {t("heroKicker", locale)}
              </p>
              <h1 className="rm-serif mt-4 max-w-3xl text-[1.85rem] font-semibold leading-[1.08] text-foreground sm:text-4xl lg:text-5xl">
                {t("heroTitle", locale)}
              </h1>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-6 text-body sm:text-base sm:leading-7">
                {t("heroText", locale)}
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link
                  href={primaryHref}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-base font-bold text-white shadow-[0_12px_28px_rgba(79,144,198,0.34)] transition hover:-translate-y-0.5 hover:bg-brand-light"
                >
                  {primaryCta}
                  <span aria-hidden className="ml-2">→</span>
                </Link>
                <TryDemoButton className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[#4f90c6] bg-white px-5 text-sm font-bold text-[#1b3348] transition hover:bg-[#e8f3fb]" />
                <TryDemoButton
                  role="doctor"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#9dc4b0] bg-white px-5 text-sm font-bold text-[#2a4638] transition hover:bg-[#e7f1ea]"
                />
              </div>
            </div>
            <div className="relative">
              <PhotoFrame
                src="/images/landing-older-phone.webp?v=1"
                alt={t("sameSessionPhone", locale)}
                imgClassName="object-[center_18%]"
                className="min-h-[18rem] rounded-[1.35rem] shadow-[0_16px_36px_rgba(27,51,72,0.12)] sm:min-h-[24rem]"
              />
              <div className="absolute bottom-4 right-4 w-40 rounded-2xl bg-white/95 p-3 shadow-[0_12px_28px_rgba(27,51,72,0.16)] ring-1 ring-white">
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[#3d7eb4]">{t("previewPassport", locale)}</p>
                <p className="rm-serif text-4xl font-semibold leading-none text-[#1b3348]">{t("previewPassportScore", locale)}</p>
                <p className="mt-1 text-[0.7rem] font-semibold text-[#2f4a60]">{t("previewSharedClinician", locale)}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e8f3fb]">
                  <span className="block h-full w-[76%] rounded-full bg-[#4f90c6]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {mode === "register" && (
          <div className="mx-auto w-full max-w-xl px-4 pb-8 sm:px-6">
            <section id="go-in" className="scroll-mt-20 rounded-[1.25rem] bg-white p-3 shadow-[0_16px_36px_rgba(27,51,72,0.1)] ring-1 ring-[#4f90c6]/15 sm:p-4">
              <GoInScreen mode={mode} />
            </section>
          </div>
        )}

        <ImpactBand locale={locale} />

        <PassportBand locale={locale} />

        <section id="how-it-works" className="scroll-mt-20 bg-[#1b3348] text-white">
          <div className="mx-auto grid w-full max-w-6xl items-start lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="flex flex-col justify-center px-4 py-10 sm:px-6 lg:sticky lg:top-20 lg:self-start lg:px-8 lg:py-16">
              <SectionKicker tone="dark">{t("guidedOnDevice", locale)}</SectionKicker>
              <h2 className="rm-serif mt-4 text-3xl font-semibold leading-[1.1] sm:text-4xl">
                {t("sessionsAtHome", locale)}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/80 sm:text-base">
                {t("sessionsAtHomeText", locale)}
              </p>
              <ol className="relative mt-6 space-y-4 border-l border-white/20 pl-5" aria-label="Measure, Coach, Report, Improve">
                {cycle.map((item) => (
                  <li key={item.word} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[1.54rem] top-1.5 h-3 w-3 rounded-full ring-4 ring-[#1b3348]"
                      style={{ background: item.color }}
                    />
                    <p className="text-sm font-semibold">{item.word}</p>
                    <p className="text-sm leading-5 text-white/70">{item.line}</p>
                  </li>
                ))}
              </ol>
              <Link
                href={primaryHref}
                className="mt-7 inline-flex h-11 w-fit items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#1b3348] transition hover:bg-[#e8f3fb]"
              >
                {primaryCta}
              </Link>
            </div>
            <div className="px-4 pb-10 sm:px-6 lg:px-8 lg:py-10">
              <SessionStack locale={locale} />
            </div>
          </div>
        </section>

        <section id="sensors" className="scroll-mt-20 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
            <SectionIntro
              kicker={t("chooseOneWay", locale)}
              title={t("photoMotionMuscle", locale)}
              text={t("oneSensorEnough", locale)}
            />
            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              {ways.map((item, index) => (
                <OverlayCard
                  key={item.title}
                  kicker={`0${index + 1}`}
                  title={item.title}
                  text={item.text}
                  media={
                    item.photo ? (
                      <PhotoGoniometerPhoto className="absolute inset-0 h-full w-full" />
                    ) : item.mpu ? (
                      <MpuAnglePhoto className="absolute inset-0 h-full w-full" />
                    ) : (
                      <MyoWarePhoto className="absolute inset-0 h-full w-full" />
                    )
                  }
                />
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 bg-[#e8f3fb] py-8 lg:py-12">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="overflow-hidden rounded-[2rem] bg-white/80 p-4 shadow-[0_16px_40px_rgba(27,51,72,0.06)] ring-1 ring-[#4f90c6]/12 sm:p-6 lg:p-8">
              <SectionIntro
                kicker={t("whatYouUse", locale)}
                title={t("insideTheApp", locale)}
                text={t("insideTheAppText", locale)}
              />
              <p className="mt-3 text-sm font-bold text-[#3d7eb4] lg:hidden">{t("slideSideways", locale)}</p>
              <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
                <div className="w-[78%] shrink-0 snap-start lg:w-auto">
                  <p className="text-xs font-extrabold text-[#4f90c6]">01</p>
                  <p className="text-base font-bold text-[#1b3348]">{t("screenQ1", locale)}</p>
                  <p className="mb-3 text-sm leading-5 text-[#2f4a60]">{t("screenA1", locale)}</p>
                <PhonePreview title={t("previewBriefing", locale)}>
                  <div className="flex h-full flex-col">
                    <div className="relative h-[7.5rem] sm:h-40">
                      <PhotoFrame src="/images/landing-exercise.webp" alt="" className="absolute inset-0 h-full w-full" />
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#1b3348]">
                        {t("previewToday", locale)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-3 py-3">
                      <p className="text-xs font-semibold text-[#2f4a60]">{t("todaysPrescription", locale)}</p>
                      <p className="mt-1 text-base font-semibold leading-snug sm:text-lg">{t("previewKneeExtension", locale)}</p>
                      <p className="mt-0.5 text-sm text-muted">{t("previewSetsPhoto", locale)}</p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <span className="text-xs font-medium text-muted">{t("photoGoniometer", locale)}</span>
                        <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">{t("previewStart", locale)}</span>
                      </div>
                    </div>
                  </div>
                </PhonePreview>
                </div>
                <div className="w-[78%] shrink-0 snap-start lg:w-auto">
                  <p className="text-xs font-extrabold text-[#4f90c6]">02</p>
                  <p className="text-base font-bold text-[#1b3348]">{t("screenQ2", locale)}</p>
                  <p className="mb-3 text-sm leading-5 text-[#2f4a60]">{t("screenA2", locale)}</p>
                <PhonePreview title={t("previewSession", locale)}>
                  <div className="flex h-full flex-col">
                    <div className="relative h-[7.5rem] sm:h-40">
                      <MpuAnglePhoto alt="" className="absolute inset-0 h-full w-full" imgClassName="object-cover object-[left_40%]" />
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#1b3348]">
                        {t("previewLive", locale)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-3 py-3">
                      <p className="rm-serif text-3xl font-semibold leading-none">78 deg</p>
                      <p className="mt-1 text-sm text-muted">{t("previewLiveMotion", locale)}</p>
                      <div className="mt-auto flex items-center gap-1.5 pt-3">
                        <span className="h-2 w-2 rounded-full bg-brand" />
                        <span className="h-2 w-2 rounded-full bg-brand" />
                        <span className="h-2 w-2 rounded-full bg-[#d7e8f6]" />
                        <span className="ml-auto text-xs font-medium text-muted">{tf("previewRepOf", locale, { n: 2, total: 3 })}</span>
                      </div>
                    </div>
                  </div>
                </PhonePreview>
                </div>
                <div className="w-[78%] shrink-0 snap-start lg:w-auto">
                  <p className="text-xs font-extrabold text-[#4f90c6]">03</p>
                  <p className="text-base font-bold text-[#1b3348]">{t("screenQ3", locale)}</p>
                  <p className="mb-3 text-sm leading-5 text-[#2f4a60]">{t("screenA3", locale)}</p>
                  <PhonePreview title={t("previewPassport", locale)}>
                    <div className="flex h-full flex-col px-3 py-3 sm:px-4 sm:py-4">
                      <p className="text-xs font-semibold text-[#2f4a60]">{t("previewThisWeek", locale)}</p>
                      <p className="mt-0.5 text-base font-semibold sm:text-lg">{t("previewPassport", locale)}</p>
                      <p className="rm-serif mt-3 text-4xl font-semibold leading-none tabular-nums sm:text-5xl">{t("previewPassportScore", locale)}</p>
                      <p className="mt-1 text-sm text-muted">{t("passportOf100", locale)}</p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8f3fb]">
                        <span className="block h-full w-[76%] rounded-full bg-[#4f90c6]" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#1b3348]">{t("previewVelocity", locale)}</p>
                      <p className="mt-auto pt-3 text-xs text-muted">{t("previewSharedClinician", locale)}</p>
                    </div>
                  </PhonePreview>
                </div>
                <div className="w-[78%] shrink-0 snap-start lg:w-auto">
                  <p className="text-xs font-extrabold text-[#4f90c6]">04</p>
                  <p className="text-base font-bold text-[#1b3348]">{t("screenQ4", locale)}</p>
                  <p className="mb-3 text-sm leading-5 text-[#2f4a60]">{t("screenA4", locale)}</p>
                  <PhonePreview title={t("reportWord", locale)}>
                    <div className="flex h-full flex-col px-3 py-3">
                      <p className="text-xs font-semibold text-[#2f4a60]">{t("screenQ4", locale)}</p>
                      <p className="rm-serif mt-1 text-4xl font-semibold leading-none">{t("previewPassportScore", locale)}</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between rounded-xl bg-[#f7fbfe] px-3 py-2">
                          <span className="text-xs font-medium text-muted">{t("previewKneeExtension", locale)}</span>
                          <span className="text-sm font-semibold">78 deg</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-[#f7fbfe] px-3 py-2">
                          <span className="text-xs font-medium text-muted">{t("pain", locale)}</span>
                          <span className="text-sm font-semibold">2 / 10</span>
                        </div>
                      </div>
                      <p className="mt-auto pt-3 text-xs font-bold text-[#3a7d62]">{t("previewSharedClinician", locale)}</p>
                    </div>
                  </PhonePreview>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-12">
            <div>
              <SectionKicker>{t("youngerPatients", locale)}</SectionKicker>
              <h2 className="rm-serif mt-4 text-3xl font-semibold leading-tight text-[#1b3348] sm:text-[2.35rem]">
                {t("kidsBandTitle", locale)}
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-[#2f4a60]">{t("kidsBandText", locale)}</p>
              <Link href="/kids" className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[#f5c84a] px-6 text-sm font-bold text-[#243056]">
                {t("open", locale)} {t("kidsQuest", locale)}
              </Link>
            </div>
            <PhotoFrame
              src="/images/landing-kids-quest.webp?v=5"
              alt={t("kidsQuest", locale)}
              imgClassName="object-cover object-[center_70%]"
              className="min-h-[16rem] rounded-[1.5rem] shadow-[0_16px_36px_rgba(36,48,86,0.12)]"
            />
          </div>
        </section>
      </main>

      <section className="bg-[#1b3348] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="rm-serif text-3xl font-semibold leading-tight">{t("closeLoopTitle", locale)}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/80 sm:text-base">{t("closeLoopText", locale)}</p>
          </div>
          <Link
            href={primaryHref}
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-base font-bold text-white shadow-[0_12px_28px_rgba(79,144,198,0.34)]"
          >
            {primaryCta}
            <span aria-hidden className="ml-2">→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] bg-[#f7fbfe]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={36} showText={false} compact />
              <span className="font-semibold tracking-tight">Revive Motion</span>
            </div>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-light">
              Measure : Coach : Report : Improve
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-medium text-muted">
            <a href="#passport" className="hover:text-foreground">
              {t("passportNav", locale)}
            </a>
            <a href="#impact" className="hover:text-foreground">
              {t("impactNav", locale)}
            </a>
            <a href="#how-it-works" className="hover:text-foreground">
              {t("howItWorks", locale)}
            </a>
            <a href="#sensors" className="hover:text-foreground">
              {t("photoAndSensors", locale)}
            </a>
            <a href="#features" className="hover:text-foreground">
              {t("features", locale)}
            </a>
            <Link href="/kids" className="hover:text-foreground">
              {t("kidsQuest", locale)}
            </Link>
          </div>
          <Link href={primaryHref} className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-bold text-white">
            {primaryCta}
          </Link>
        </div>
      </footer>

      {mode === "login" && (
        <div className="bg-[#f7fbfe]">
          <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6">
            <section id="go-in" className="scroll-mt-20 rounded-[1.25rem] bg-white p-3 shadow-[0_16px_36px_rgba(27,51,72,0.1)] ring-1 ring-[#4f90c6]/15 sm:p-4">
              <GoInScreen mode={mode} />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
