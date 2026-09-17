import Link from "next/link";
import { GoInScreen } from "@/components/GoInScreen";
import { JointMarks, MpuAnglePhoto, MyoWarePhoto, PhonePreview, PhotoFrame, RomChart } from "@/components/LandingMedia";
import { LandingHeader } from "@/components/LandingHeader";
import { Logo } from "@/components/Logo";

type AuthLandingProps = {
  mode: "login" | "register";
};

const cycle = [
  { n: "01", word: "Measure", line: "Photo, MPU-6050, or MyoWare on this device." },
  { n: "02", word: "Coach", line: "Follow today’s session after you take the reading." },
  { n: "03", word: "Report", line: "Angles and effort stay with the care team." },
  { n: "04", word: "Improve", line: "The next plan uses what you just recorded." },
] as const;

const steps = [
  {
    n: "1",
    title: "Take a side-view photo",
    text: "A helper photographs the seated joint. Phone camera only.",
    src: "/images/landing-hero-photo.webp?v=3",
    alt: "A helper photographs a seated patient from the side.",
  },
  {
    n: "2",
    title: "Tap hip, knee, ankle",
    text: "The app marks the three points and shows the angle.",
    src: "/images/landing-leg-marks.webp",
    alt: "Side view of a seated knee ready to mark.",
  },
  {
    n: "3",
    title: "Do today’s session",
    text: "Follow the exercises your clinician set for today.",
    src: "/images/landing-exercise.webp",
    alt: "A patient following a home session on a tablet.",
  },
];

const ways = [
  {
    title: "Photo",
    device: "Phone camera. No extra device.",
    points: [
      "A helper takes one side-view photo of the seated joint.",
      "Tap hip, then knee, then ankle on the photo.",
      "The app shows the joint angle right away.",
      "That number is saved for the clinician.",
    ],
    src: "/images/landing-hero-photo.webp?v=3",
    alt: "Helper photographing a seated patient.",
    className: "border-[#b7d4c4] bg-[#e7f6ee]",
    titleClass: "text-[#2a7a58]",
    fit: "cover" as const,
  },
  {
    title: "Motion sensor",
    device: "MPU-6050 straps on the joint.",
    points: [
      "Strap one sensor above the joint and one below it.",
      "Do the session as usual. No helper needs to take photos.",
      "The app shows a live angle while you move, such as 92 deg.",
      "Hold that position, then do the next rep.",
    ],
    src: "/images/landing-mpu.png?v=4",
    alt: "Revive Motion MPU-6050 straps with a live 92 degree elbow angle.",
    className: "border-[#c5c9e8] bg-[#eef0fb]",
    titleClass: "text-[#4a4f8a]",
    fit: "contain" as const,
    mpu: true,
  },
  {
    title: "Muscle sensor",
    device: "MyoWare 2.0 pads on the muscle.",
    points: [
      "Place the pads on the muscle you are working.",
      "Flex. The line on screen rises when the muscle works harder.",
      "Connect with Bluetooth or a USB cable.",
      "The clinician can see how hard the muscle worked.",
    ],
    src: "/images/landing-myoware.png?v=5",
    alt: "MyoWare muscle sensor with electrode pads on an upper arm.",
    className: "border-[#d0c4e4] bg-[#f3eefc]",
    titleClass: "text-[#5a3d8a]",
    fit: "contain" as const,
    myoware: true,
  },
];

function CycleStrip({ className = "" }: { className?: string }) {
  return (
    <ol
      className={`grid grid-cols-2 gap-3 lg:grid-cols-4 ${className}`}
      aria-label="Measure, Coach, Report, Improve"
    >
      {cycle.map((item) => (
        <li
          key={item.word}
          className="rounded-2xl bg-white/80 px-4 py-4 shadow-[0_8px_24px_rgba(27,51,72,0.05)] ring-1 ring-[#4f90c6]/12"
        >
          <p className="text-[11px] font-bold tracking-[0.18em] text-brand-light">{item.n}</p>
          <p className="rm-serif mt-1 text-xl font-semibold text-foreground">{item.word}</p>
          <p className="mt-1.5 text-sm leading-6 text-muted">{item.line}</p>
        </li>
      ))}
    </ol>
  );
}

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
          <div className="pointer-events-none absolute -left-28 top-0 h-80 w-80 rounded-full bg-[#4f90c6]/15 blur-3xl" />
          <div className="pointer-events-none absolute right-[-6rem] top-24 h-96 w-96 rounded-full bg-[#9dc4b0]/25 blur-3xl" />

          <div className="relative mx-auto w-full max-w-6xl px-5 pb-8 pt-10 sm:px-6 lg:pb-10 lg:pt-16">
            <h1 className="rm-serif max-w-3xl text-[2.6rem] font-semibold leading-[1.06] text-foreground sm:text-6xl">
              Physical Therapy Monitoring at Home.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-body sm:text-xl sm:leading-9">
              Photograph the movement, or wear a sensor. Then follow today’s exercises with your clinician.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#go-in"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 font-semibold text-white shadow-[0_10px_24px_rgba(79,144,198,0.28)] transition hover:bg-brand-light"
              >
                {cta}
              </a>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#9dc4b0] bg-white/80 px-8 font-semibold text-[#2a4638] transition hover:bg-[#e7f1ea]"
              >
                See how
              </a>
            </div>
            <CycleStrip className="mt-10" />
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6 lg:pb-24">
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
              <PhotoFrame
                src="/images/landing-hero-photo.webp?v=3"
                alt="A helper photographs a seated patient from the side in a living room."
                className="aspect-[16/9] rounded-[2rem] shadow-[0_28px_60px_rgba(27,51,72,0.14)]"
              />
              <section id="go-in" className="scroll-mt-28">
                <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_56px_rgba(27,51,72,0.12)] ring-1 ring-[#4f90c6]/15 sm:p-7">
                  <GoInScreen mode={mode} />
                </div>
              </section>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-28 bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
            <div className="max-w-2xl">
              <p className="rm-label text-brand-light">How it works</p>
              <h2 className="rm-serif mt-2 text-4xl font-semibold sm:text-5xl">Three steps on this device</h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-body">
                Start with a photo if you do not have a sensor. The same session follows either way.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <article
                  key={step.n}
                  className="overflow-hidden rounded-[2rem] bg-[#f7fbfe] shadow-[0_16px_40px_rgba(27,51,72,0.06)] ring-1 ring-[#4f90c6]/10"
                >
                  <div className="relative">
                    <PhotoFrame src={step.src} alt={step.alt} className="h-56 sm:h-64" />
                    <span className="rm-serif absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg font-semibold text-foreground shadow-sm">
                      {step.n}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-body">{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
              <JointMarks className="min-h-[18rem] rounded-[2rem] ring-1 ring-[#4f90c6]/10" />
              <RomChart className="rounded-[2rem] shadow-[0_16px_40px_rgba(27,51,72,0.06)]" />
            </div>
          </div>
        </section>

        <section id="sensors" className="scroll-mt-28 bg-[#e8f3fb]">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
            <div className="max-w-2xl">
              <p className="rm-label text-brand-light">Choose one way to measure</p>
              <h2 className="rm-serif mt-2 text-4xl font-semibold sm:text-5xl">Photo, motion, or muscle</h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-body">
                You do not need all three. Pick the method your clinician asked for, or start with a photo.
              </p>
            </div>
            <div className="mt-14 space-y-16 lg:space-y-20">
              {ways.map((item, index) => (
                <article
                  key={item.title}
                  className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    {"mpu" in item && item.mpu ? (
                      <MpuAnglePhoto className="aspect-[4/3] min-h-[17rem] rounded-[2rem] shadow-[0_20px_48px_rgba(27,51,72,0.1)] ring-1 ring-[#4f90c6]/12 sm:min-h-[20rem]" />
                    ) : "myoware" in item && item.myoware ? (
                      <MyoWarePhoto className="aspect-[4/3] min-h-[17rem] rounded-[2rem] shadow-[0_20px_48px_rgba(27,51,72,0.1)] ring-1 ring-[#4f90c6]/12 sm:min-h-[20rem]" />
                    ) : (
                      <PhotoFrame
                        src={item.src}
                        alt={item.alt}
                        fit={item.fit}
                        className="aspect-[4/3] min-h-[17rem] rounded-[2rem] shadow-[0_20px_48px_rgba(27,51,72,0.1)] ring-1 ring-[#4f90c6]/12 sm:min-h-[20rem]"
                      />
                    )}
                  </div>
                  <div className={`rounded-[2rem] p-6 sm:p-8 ${item.className} ring-1 ring-black/5`}>
                    <p className="text-[11px] font-bold tracking-[0.18em] text-brand-light">0{index + 1}</p>
                    <h3 className={`mt-2 text-2xl font-bold uppercase tracking-tight ${item.titleClass}`}>{item.title}</h3>
                    <p className="mt-1 text-base font-semibold">{item.device}</p>
                    <ul className="mt-5 space-y-3 text-[0.95rem] leading-7 text-body">
                      {item.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-28 bg-white py-20 lg:py-24">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
            <div className="max-w-2xl">
              <p className="rm-label text-brand-light">Your care, connected</p>
              <h2 className="rm-serif mt-2 text-4xl font-semibold sm:text-5xl">Inside the app</h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-body">
                Briefing, session, dashboard, and check-in stay on this device for the whole care team.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <PhonePreview title="Briefing">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
                  <PhotoFrame src="/images/landing-exercise.webp" alt="" className="h-28" />
                  <div className="p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-light">Today</p>
                    <p className="mt-1 font-semibold">Knee extension</p>
                    <p className="mt-1 text-sm text-muted">3 sets · photo first</p>
                  </div>
                </div>
              </PhonePreview>
              <PhonePreview title="Session">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
                  <MpuAnglePhoto alt="" className="h-36" />
                  <div className="p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-light">Live</p>
                    <p className="rm-serif mt-1 text-3xl font-semibold">92 deg</p>
                    <p className="mt-1 text-sm text-muted">Hold, then the next rep</p>
                  </div>
                </div>
              </PhonePreview>
              <PhonePreview title="Dashboard">
                <div className="flex h-full flex-col rounded-2xl bg-white p-3 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-light">Trend</p>
                  <p className="mt-1 font-semibold">Range this week</p>
                  <svg viewBox="0 0 160 70" className="mt-4 h-20 w-full">
                    <polyline points="8,58 40,50 72,42 104,28 150,16" fill="none" stroke="#4f90c6" strokeWidth="4" />
                    <circle cx="150" cy="16" r="4" fill="#3a7d62" />
                  </svg>
                  <p className="mt-auto text-sm text-muted">Shared with the clinician</p>
                </div>
              </PhonePreview>
              <PhonePreview title="Check-in">
                <div className="flex h-full flex-col rounded-2xl bg-white p-3 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-light">Pain</p>
                  <p className="rm-serif mt-1 text-3xl font-semibold">2 / 10</p>
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-8 flex-1 rounded-md ${i < 2 ? "bg-[#c47a32]" : "bg-[#e8f3fb]"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-auto text-sm text-muted">Logged for today</p>
                </div>
              </PhonePreview>
            </div>
            <Link
              href="/kids"
              className="rm-glow-kids relative mt-12 block overflow-hidden rounded-[2rem] shadow-[0_18px_36px_rgba(40,24,8,0.16)]"
            >
              <PhotoFrame src="/images/landing-kids-quest.webp" alt="Kids Quest adventure world." className="h-48 sm:h-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a1848]/70 via-[#2a1848]/20 to-transparent" />
              <div className="absolute inset-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                <div>
                  <p className="rm-kids-type text-sm font-bold uppercase tracking-[0.16em] text-amber-200">Younger patients</p>
                  <p className="rm-kids-type mt-1 text-3xl text-amber-50 drop-shadow sm:text-4xl">Kids Quest</p>
                </div>
                <span className="kids-cta rm-btn rm-kids-type h-11 rounded-full px-5 text-sm">Open</span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[#f7fbfe]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={40} showText={false} compact />
              <span className="font-semibold tracking-tight">Revive Motion</span>
            </div>
            <p className="mt-3 text-sm font-semibold tracking-[0.14em] text-brand-light uppercase">
              Measure : Coach : Report : Improve
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted">
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
          <a href="#go-in" className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 font-semibold text-white">
            {cta}
          </a>
        </div>
      </footer>
    </div>
  );
}
