import Link from "next/link";
import { GoInScreen } from "@/components/GoInScreen";
import { JointMarks, MpuAnglePhoto, MyoWarePhoto, OverlayCard, PhonePreview, PhotoFrame, PhotoGoniometerPhoto } from "@/components/LandingMedia";
import { LandingHeader } from "@/components/LandingHeader";
import { Logo } from "@/components/Logo";
import { SessionStack } from "@/components/SessionStack";

type AuthLandingProps = {
  mode: "login" | "register";
};

function SectionIntro({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold leading-6 text-[#2f4a60] sm:text-base">{kicker}</p>
      <h2 className="rm-serif mt-1 text-3xl font-semibold leading-tight text-[#1b3348] sm:text-[2.35rem]">{title}</h2>
      <p className="mt-2 max-w-2xl text-base leading-7 text-[#1b3348] sm:text-lg sm:leading-8">{text}</p>
    </div>
  );
}

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
  photo?: boolean;
  mpu?: boolean;
  myoware?: boolean;
}[] = [
  {
    title: "Photo",
    text: "Phone camera. Tap hip, knee, then ankle. A still reading, such as 92 deg, is saved for the clinician.",
    photo: true,
  },
  {
    title: "Motion sensor",
    text: "MPU-6050 straps above and below the joint. Live angle while you move, such as 78 deg.",
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
            <SectionIntro
              kicker="How it works"
              title="Three steps on this device"
              text="Take a photo. Tap the joint. Then do today’s session."
            />
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
            <SectionIntro
              kicker="Choose one way to measure"
              title="Photo, motion, or muscle"
              text="You only need one. Start with a photo if you do not have a sensor."
            />
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
                    item.photo ? (
                      <PhotoGoniometerPhoto className="absolute inset-0 h-full w-full" />
                    ) : item.mpu ? (
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

        <section id="features" className="scroll-mt-20 bg-[#e8f3fb] py-8 lg:py-12">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="overflow-hidden rounded-[2rem] bg-white/80 p-4 shadow-[0_16px_40px_rgba(27,51,72,0.06)] ring-1 ring-[#4f90c6]/12 sm:p-6 lg:p-8">
              <SectionIntro
                kicker="What you use each day"
                title="Inside the app"
                text="Today’s plan, the session, your progress, and check-in."
              />
              <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                <PhonePreview title="Briefing">
                  <div className="flex h-full flex-col">
                    <div className="relative h-[7.5rem] sm:h-40">
                      <PhotoFrame src="/images/landing-exercise.webp" alt="" className="absolute inset-0 h-full w-full" />
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#1b3348]">
                        Today
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-3 py-3">
                      <p className="text-xs font-semibold text-[#2f4a60]">Today&apos;s plan</p>
                      <p className="mt-1 text-base font-semibold leading-snug sm:text-lg">Knee extension</p>
                      <p className="mt-0.5 text-sm text-muted">3 sets · photo first</p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <span className="text-xs font-medium text-muted">Photo Goniometer</span>
                        <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">Start</span>
                      </div>
                    </div>
                  </div>
                </PhonePreview>
                <PhonePreview title="Session">
                  <div className="flex h-full flex-col">
                    <div className="relative h-[7.5rem] sm:h-40">
                      <MpuAnglePhoto alt="" className="absolute inset-0 h-full w-full" imgClassName="object-cover object-[center_20%]" />
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#1b3348]">
                        Live
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-3 py-3">
                      <p className="rm-serif text-3xl font-semibold leading-none">78 deg</p>
                      <p className="mt-1 text-sm text-muted">Live motion, not the still photo</p>
                      <div className="mt-auto flex items-center gap-1.5 pt-3">
                        <span className="h-2 w-2 rounded-full bg-brand" />
                        <span className="h-2 w-2 rounded-full bg-brand" />
                        <span className="h-2 w-2 rounded-full bg-[#d7e8f6]" />
                        <span className="ml-auto text-xs font-medium text-muted">Rep 2 of 3</span>
                      </div>
                    </div>
                  </div>
                </PhonePreview>
                <PhonePreview title="Dashboard">
                  <div className="flex h-full flex-col px-3 py-3">
                    <p className="text-xs font-semibold text-[#2f4a60]">This week</p>
                    <p className="mt-0.5 text-base font-semibold sm:text-lg">Range this week</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#e8f3fb] px-2.5 py-1 text-xs font-semibold text-[#1b3348]">Photo 92 deg</span>
                      <span className="rounded-full bg-[#e7f1ea] px-2.5 py-1 text-xs font-semibold text-[#2a7a58]">Live 78 deg</span>
                    </div>
                    <svg viewBox="0 0 200 90" className="mt-3 w-full flex-1" role="img" aria-label="Range of motion rising across the week">
                      <defs>
                        <linearGradient id="rm-dash-fill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#4f90c6" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#4f90c6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M8,78 L8,70 L40,62 L72,54 L104,40 L136,30 L192,18 L192,78 Z" fill="url(#rm-dash-fill)" />
                      <polyline points="8,70 40,62 72,54 104,40 136,30 192,18" fill="none" stroke="#4f90c6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="192" cy="18" r="4.5" fill="#3a7d62" />
                      <text x="8" y="88" fontSize="8" fill="#4d6478">Mon</text>
                      <text x="168" y="88" fontSize="8" fill="#4d6478">Sun</text>
                    </svg>
                    <p className="mt-2 text-xs text-muted">Shared with the clinician</p>
                  </div>
                </PhonePreview>
                <PhonePreview title="Check-in">
                  <div className="flex h-full flex-col px-3 py-3">
                    <p className="text-xs font-semibold text-[#2f4a60]">Pain</p>
                    <p className="rm-serif mt-0.5 text-3xl font-semibold leading-none">2 / 10</p>
                    <div className="mt-3 flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-7 flex-1 rounded-md ${i < 2 ? "bg-[#c47a32]" : "bg-[#e8f3fb]"}`}
                        />
                      ))}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between rounded-xl bg-[#f7fbfe] px-3 py-2">
                        <span className="text-xs font-medium text-muted">Sleep</span>
                        <span className="text-sm font-semibold">Restful</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-[#f7fbfe] px-3 py-2">
                        <span className="text-xs font-medium text-muted">Stiffness</span>
                        <span className="text-sm font-semibold">Mild</span>
                      </div>
                    </div>
                    <p className="mt-auto pt-3 text-xs text-muted">Logged for today</p>
                  </div>
                </PhonePreview>
              </div>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <OverlayCard
                src="/images/landing-girl-phone.webp?v=1"
                alt="A 7-year-old using Revive Motion on a phone at home."
                kicker="Younger patients"
                title="The same session on a phone"
                text="Open today’s briefing, take the reading, then do the reps. Nothing extra to install."
                href="#go-in"
                imgClassName="object-cover object-[center_62%]"
                className="min-h-[14rem] sm:min-h-[16rem]"
              />
              <Link
                href="/kids"
                className="rm-glow-kids relative block min-h-[14rem] overflow-hidden rounded-[1.5rem] shadow-[0_12px_28px_rgba(36,48,86,0.12)] sm:min-h-[16rem]"
              >
                <PhotoFrame src="/images/landing-kids-quest.webp?v=5" alt="Kids Quest: original quest bots doing physical therapy stretches on a meadow." className="absolute inset-0 h-full w-full" />
                <div className="absolute inset-x-0 bottom-0 kids-caption flex items-end justify-between gap-3 p-4 sm:p-5">
                  <div>
                    <p className="text-sm font-semibold text-[#5b6685]">Stretch with the bots</p>
                    <p className="kids-wordmark mt-1 text-3xl sm:text-4xl">Kids Quest</p>
                    <p className="mt-1 max-w-xs text-base leading-6 text-[#5b6685]">
                      The bots ask. You stretch.
                    </p>
                  </div>
                  <span className="kids-cta h-11 min-h-0 rounded-full px-5 text-lg">Open</span>
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
