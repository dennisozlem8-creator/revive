import Link from "next/link";
import { GoInScreen } from "@/components/GoInScreen";
import { JointMarks, MpuAnglePhoto, MyoWarePhoto, OverlayCard, PhonePreview, PhotoFrame } from "@/components/LandingMedia";
import { LandingHeader } from "@/components/LandingHeader";
import { Logo } from "@/components/Logo";
import { SessionStack } from "@/components/SessionStack";

type AuthLandingProps = {
  mode: "login" | "register";
};

const cycle = [
  { n: "01", word: "Measure", line: "Photo, MPU-6050, or MyoWare on this device.", color: "#9dc4b0" },
  { n: "02", word: "Coach", line: "Follow today’s session after the reading.", color: "#7eb3d9" },
  { n: "03", word: "Report", line: "Angles stay with the care team.", color: "#4f90c6" },
  { n: "04", word: "Improve", line: "The next plan uses what you just recorded.", color: "#3a7d62" },
] as const;

const steps: {
  n: string;
  title: string;
  text: string;
  src?: string;
  alt?: string;
  marks?: boolean;
}[] = [
  {
    n: "01",
    title: "Take a side-view photo",
    text: "A helper photographs the seated joint. Phone camera only.",
    src: "/images/landing-hero-photo.webp?v=3",
    alt: "A helper photographs a seated patient from the side.",
  },
  {
    n: "02",
    title: "Tap hip, knee, ankle",
    text: "The app marks the three points and shows the angle.",
    marks: true,
  },
  {
    n: "03",
    title: "Do today’s session",
    text: "Follow the exercises your clinician set for today.",
    src: "/images/landing-exercise.webp",
    alt: "A patient following a home session on a tablet.",
  },
];

const ways: {
  title: string;
  text: string;
  src?: string;
  alt?: string;
  mpu?: boolean;
  myoware?: boolean;
}[] = [
  {
    title: "Photo",
    text: "Phone camera. Tap hip, knee, then ankle. The angle is saved for the clinician.",
    src: "/images/landing-hero-photo.webp?v=3",
    alt: "Helper photographing a seated patient.",
  },
  {
    title: "Motion sensor",
    text: "MPU-6050 straps above and below the joint. Live angle while you move, such as 92 deg.",
    mpu: true,
  },
  {
    title: "Muscle sensor",
    text: "MyoWare 2.0 pads on the muscle. Flex, then connect with Bluetooth or a USB cable.",
    myoware: true,
  },
];

export function AuthLanding({ mode }: AuthLandingProps) {
  const cta = mode === "login" ? "Sign in" : "Create an account";

  return (
    <div className="min-h-full bg-background text-foreground">
      <a
        href="#go-in"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to sign in
      </a>
      <LandingHeader mode={mode} />

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-28 top-0 h-64 w-64 rounded-full bg-[#4f90c6]/15 blur-3xl" />
          <div className="pointer-events-none absolute right-[-6rem] top-16 h-72 w-72 rounded-full bg-[#9dc4b0]/25 blur-3xl" />

          <div className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-5 sm:px-6 lg:pb-10 lg:pt-8">
            <h1 className="rm-serif max-w-3xl text-[1.85rem] font-semibold leading-[1.08] text-foreground sm:text-4xl lg:text-5xl">
              Physical Therapy Monitoring at Home.
            </h1>
            <p className="mt-2 max-w-xl text-[0.95rem] leading-6 text-body sm:text-base sm:leading-7">
              Photograph the movement, or wear a sensor. Then follow today’s exercises with your clinician.
            </p>
            <div className="mt-3 flex gap-2">
              <a
                href="#go-in"
                className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,144,198,0.28)] transition hover:bg-brand-light sm:h-11 sm:flex-none sm:px-7"
              >
                {cta}
              </a>
              <a
                href="#how-it-works"
                className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-[#9dc4b0] bg-white/80 px-5 text-sm font-semibold text-[#2a4638] transition hover:bg-[#e7f1ea] sm:h-11 sm:flex-none sm:px-7"
              >
                See how
              </a>
            </div>

            <div className="mt-5 grid items-stretch gap-3 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:gap-4">
              <PhotoFrame
                src="/images/landing-older-phone.webp?v=1"
                alt="An older patient using Revive Motion on a phone at home."
                imgClassName="object-[center_18%]"
                className="order-2 min-h-[16rem] self-stretch rounded-[1.25rem] shadow-[0_16px_36px_rgba(27,51,72,0.12)] sm:min-h-[20rem] lg:order-1 lg:min-h-0"
              />
              <section id="go-in" className="order-1 flex scroll-mt-20 lg:order-2">
                <div className="flex h-full w-full flex-col justify-center rounded-[1.25rem] bg-white p-3 shadow-[0_16px_36px_rgba(27,51,72,0.1)] ring-1 ring-[#4f90c6]/15 sm:p-4">
                  <GoInScreen mode={mode} />
                </div>
              </section>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 bg-[#1b3348] text-white">
          <div className="mx-auto grid w-full max-w-6xl items-stretch lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="flex flex-col justify-center px-4 py-10 sm:px-6 lg:sticky lg:top-16 lg:self-start lg:px-8 lg:py-16">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9dc4b0]">Guided on this device</p>
              <h2 className="rm-serif mt-2 text-3xl font-semibold leading-[1.1] sm:text-4xl">
                Sessions you can do at home, with the care team still in the loop.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/80 sm:text-base">
                Photograph the joint, or wear a sensor. Then follow today’s plan. Live angles and effort stay with the clinician — no made-up scores, just what you record.
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
              <a
                href="#go-in"
                className="mt-7 inline-flex h-11 w-fit items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#1b3348] transition hover:bg-[#e8f3fb]"
              >
                {cta}
              </a>
            </div>
            <div className="px-4 pb-10 sm:px-6 lg:px-8 lg:py-10">
              <SessionStack />
            </div>
          </div>
        </section>

        <section className="bg-[#f7fbfe]">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="rm-label text-brand-light">How it works</p>
                <h2 className="rm-serif mt-0.5 text-2xl font-semibold sm:text-3xl">Three steps on this device</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-body sm:text-right">
                Start with a photo if you do not have a sensor. The same session follows either way.
              </p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {steps.map((step) => (
                <OverlayCard
                  key={step.n}
                  kicker={step.n}
                  title={step.title}
                  text={step.text}
                  src={step.src}
                  alt={step.alt}
                  media={
                    step.marks ? <JointMarks className="absolute inset-0 h-full w-full" /> : undefined
                  }
                />
              ))}
            </div>
          </div>
        </section>

        <section id="sensors" className="scroll-mt-20 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="rm-label text-brand-light">Choose one way to measure</p>
                <h2 className="rm-serif mt-0.5 text-2xl font-semibold sm:text-3xl">Photo, motion, or muscle</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-body sm:text-right">
                You do not need all three. Pick the method your clinician asked for, or start with a photo.
              </p>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              {ways.map((item, index) => (
                <OverlayCard
                  key={item.title}
                  kicker={`0${index + 1}`}
                  title={item.title}
                  text={item.text}
                  src={item.src}
                  alt={item.alt}
                  media={
                    item.mpu ? (
                      <MpuAnglePhoto className="absolute inset-0 h-full w-full" />
                    ) : item.myoware ? (
                      <MyoWarePhoto className="absolute inset-0 h-full w-full" />
                    ) : undefined
                  }
                />
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 bg-[#e8f3fb] py-8 lg:py-10">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="rm-label text-brand-light">Your care, connected</p>
                <h2 className="rm-serif mt-0.5 text-2xl font-semibold sm:text-3xl">Inside the app</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-body sm:text-right">
                Briefing, session, dashboard, and check-in stay on this device for the whole care team.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
              <PhonePreview title="Briefing">
                <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
                  <PhotoFrame src="/images/landing-exercise.webp" alt="" className="h-[4.75rem] sm:h-24" />
                  <div className="px-2.5 py-2 sm:px-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-light">Today</p>
                    <p className="text-sm font-semibold leading-snug sm:text-base">Knee extension</p>
                    <p className="text-xs text-muted sm:text-sm">3 sets · photo first</p>
                  </div>
                </div>
              </PhonePreview>
              <PhonePreview title="Session">
                <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
                  <MpuAnglePhoto alt="" className="h-[4.75rem] sm:h-24" />
                  <div className="px-2.5 py-2 sm:px-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-light">Live</p>
                    <p className="rm-serif text-xl font-semibold leading-none sm:text-2xl">92 deg</p>
                    <p className="mt-0.5 text-xs text-muted sm:text-sm">Hold, then the next rep</p>
                  </div>
                </div>
              </PhonePreview>
              <PhonePreview title="Dashboard">
                <div className="flex h-full flex-col rounded-xl bg-white px-2.5 py-2 sm:px-3 sm:py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-light">Trend</p>
                  <p className="text-sm font-semibold leading-snug sm:text-base">Range this week</p>
                  <svg viewBox="0 0 160 70" className="mt-1 min-h-[3.25rem] w-full flex-1">
                    <polyline points="8,58 40,50 72,42 104,28 150,16" fill="none" stroke="#4f90c6" strokeWidth="4" />
                    <circle cx="150" cy="16" r="4" fill="#3a7d62" />
                  </svg>
                  <p className="mt-1 text-xs text-muted sm:text-sm">Shared with the clinician</p>
                </div>
              </PhonePreview>
              <PhonePreview title="Check-in">
                <div className="flex h-full flex-col rounded-xl bg-white px-2.5 py-2 sm:px-3 sm:py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-light">Pain</p>
                  <p className="rm-serif text-xl font-semibold leading-none sm:text-2xl">2 / 10</p>
                  <div className="mt-2 flex flex-1 items-center gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-5 flex-1 rounded-md sm:h-6 ${i < 2 ? "bg-[#c47a32]" : "bg-[#e8f3fb]"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted sm:text-sm">Logged for today</p>
                </div>
              </PhonePreview>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <OverlayCard
                src="/images/landing-younger-phone.webp?v=1"
                alt="A younger patient following a session on a phone."
                kicker="Younger adults"
                title="The same session on a phone"
                text="Open today’s briefing, take the reading, then do the reps. Nothing extra to install."
                href="#go-in"
                className="min-h-[14rem] sm:min-h-[16rem]"
              />
              <Link
                href="/kids"
                className="rm-glow-kids relative block min-h-[14rem] overflow-hidden rounded-[1.35rem] shadow-[0_12px_24px_rgba(40,24,8,0.14)] sm:min-h-[16rem]"
              >
                <PhotoFrame src="/images/landing-kids-quest.webp" alt="Kids Quest adventure world." className="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a1848]/80 via-[#2a1848]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                  <div>
                    <p className="rm-kids-type text-[11px] font-bold uppercase tracking-[0.16em] text-amber-200">Younger patients</p>
                    <p className="rm-kids-type mt-0.5 text-2xl text-amber-50 drop-shadow sm:text-3xl">Kids Quest</p>
                    <p className="mt-1 text-sm font-medium text-amber-100/90">Storybook world. No sign-in.</p>
                  </div>
                  <span className="kids-cta rm-btn rm-kids-type h-9 min-h-0 rounded-full px-4 text-sm">Open</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

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
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
            <a href="#sensors" className="hover:text-foreground">
              Photo & sensors
            </a>
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <Link href="/kids" className="hover:text-foreground">
              Kids Quest
            </Link>
          </div>
          <a href="#go-in" className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white">
            {cta}
          </a>
        </div>
      </footer>
    </div>
  );
}
