import Image from "next/image";
import Link from "next/link";
import { GoInScreen } from "@/components/GoInScreen";
import { KidsIcon } from "@/components/KidsIcon";
import { LandingHeader } from "@/components/LandingHeader";
import { Logo } from "@/components/Logo";

type AuthLandingProps = {
  mode: "login" | "register";
};

const photoFlow = ["Take photo", "Mark 3 points", "Get the angle", "Save", "See progress"];

const solutions = [
  {
    title: "Photo",
    subtitle: "Phone camera — no hardware",
    line: "A helper takes one side-view photo. Tap hip, knee, ankle. Revive Motion returns the joint angle.",
    points: ["No device to buy", "Works on a phone", "Free to start"],
    className: "border-[#b7d4c4] bg-[#e7f6ee]",
    titleClass: "text-[#2a7a58]",
    iconBg: "bg-white text-[#2a7a58]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 8h4l2-2h4l2 2h4v11H4V8z" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
  },
  {
    title: "MPU-6050",
    subtitle: "Motion sensor (IMU)",
    line: "Wearable angle during a live session — hands-free, so the joint can move while you watch the reading.",
    points: ["Continuous angle", "Hands-free in session", "Pairs with today’s dose"],
    className: "border-[#c5c9e8] bg-[#eef0fb]",
    titleClass: "text-[#4a4f8a]",
    iconBg: "bg-white text-[#4a4f8a]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 6v-2M12 20v-2M6 12H4M20 12h-2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "MyoWare",
    subtitle: "MyoWare 2.0 muscle sensor",
    line: "Surface EMG — the harder the patient flexes, the higher the output. Muscle effort, not just angle.",
    points: ["Surface EMG", "Muscle effort & fatigue", "Bluetooth or USB"],
    className: "border-[#d0c4e4] bg-[#f3eefc]",
    titleClass: "text-[#5a3d8a]",
    iconBg: "bg-white text-[#5a3d8a]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 12h3l2-6 3 12 2-6h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const features = [
  { title: "Today’s briefing", line: "Today’s exercise in one place" },
  { title: "Pain check-in", line: "7+ rests you and alerts care" },
  { title: "Live session", line: "ROM test plus optional sensors" },
  { title: "Charts", line: "ROM, reps, pain, photo" },
  { title: "RecoverAI", line: "Ask the coach, get a report" },
  { title: "Exercise library", line: "Form cues for your injury" },
  { title: "Assessments", line: "Ankle, knee, back, wrist" },
  { title: "Care dashboard", line: "Clinicians see linked patients" },
];

export function AuthLanding({ mode }: AuthLandingProps) {
  const cta = mode === "login" ? "Go in" : "Create an account";

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
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_-8%,rgba(79,144,198,0.28),transparent_42%),radial-gradient(circle_at_92%_6%,rgba(58,125,98,0.18),transparent_34%)]"
          />
          <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-center lg:py-14">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#9ec6e0] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-light">
                Photo + sensors
              </p>
              <h1 className="rm-serif mt-4 max-w-lg text-[2.25rem] font-semibold leading-[1.12] text-foreground sm:text-5xl">
                See the joint. Coach the set. Share the week.
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-8 text-body">
                Revive Motion is home PT: a photo for the angle, sensors when you have them, and a
                plan your clinician can follow.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#go-in"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-base font-semibold text-white"
                >
                  {cta}
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#9dc4b0] bg-[#e7f1ea] px-6 text-base font-semibold text-[#2a4638]"
                >
                  How it works
                </a>
              </div>
              <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#b7d4e8]">
                <Image
                  src="/images/landing-people-photo.svg"
                  alt="A helper photographs a seated patient from the side to capture knee angle."
                  width={720}
                  height={280}
                  className="h-auto w-full"
                  priority
                  unoptimized
                />
              </div>
            </div>

            <section id="go-in" className="scroll-mt-28">
              <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_22px_50px_rgba(27,51,72,0.1)] sm:p-8">
                <GoInScreen mode={mode} />
              </div>
            </section>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-28 bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="rm-label text-brand-light">How the photo works</p>
                <h2 className="rm-serif mt-2 max-w-xl text-3xl font-semibold text-foreground">
                  Take a side view. Tap three points. See the angle.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-body">
                A helper photographs the joint. You mark hip, knee, and ankle. Revive Motion
                estimates the angle and graphs it over time.
              </p>
            </div>

            <ol className="mt-8 flex flex-wrap items-center gap-2">
              {photoFlow.map((label, index) => (
                <li key={label} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#9ec6e0] bg-[#e8f3fb] px-4 py-2 text-sm font-semibold text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs text-white">
                      {index + 1}
                    </span>
                    {label}
                  </span>
                  {index < photoFlow.length - 1 && (
                    <span aria-hidden className="hidden text-brand sm:inline">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#c5d9ea] bg-[#f7fbfe]">
              <Image
                src="/images/landing-angle-chart.svg"
                alt="Hip, knee, and ankle marked on a side-view photo, with a 92 degree estimate and a rising range-of-motion chart."
                width={560}
                height={220}
                className="h-auto w-full"
                unoptimized
              />
            </div>
          </div>
        </section>

        <section id="sensors" className="scroll-mt-28 border-t border-[var(--border)] bg-[#1b3348] text-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Photo and sensors</p>
            <h2 className="rm-serif mt-2 text-3xl font-semibold sm:text-4xl">Our three solutions</h2>
            <p className="mt-2 text-sm text-white/75">
              Photo, MPU-6050, and MyoWare — three ways Revive Motion captures recovery.
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {solutions.map((item) => (
                <article key={item.title} className={`rounded-[1.75rem] border p-7 text-foreground ${item.className}`}>
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <h3 className={`mt-5 text-2xl font-bold uppercase tracking-wide ${item.titleClass}`}>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold">{item.subtitle}</p>
                  <p className="mt-3 text-sm leading-6 text-body">{item.line}</p>
                  <ul className="mt-5 space-y-2 border-t border-black/10 pt-4 text-sm font-medium">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <span className={`${item.titleClass}`}>✓</span> {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <p className="mt-5 text-sm text-white/65">
              Also: a heart sensor (USB chip or Bluetooth strap) can show live BPM in a session.
              USB and Bluetooth need Chrome or Edge on a computer.
            </p>
          </div>
        </section>

        <section id="features" className="scroll-mt-28 bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6">
            <p className="rm-label text-brand-light">Inside the app</p>
            <h2 className="rm-serif mt-2 text-3xl font-semibold text-foreground">What you get after you measure</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {features.map((item) => (
                <article key={item.title} className="rounded-2xl border border-[var(--border)] bg-[#f7fbfe] px-4 py-4">
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{item.line}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <article className="rounded-3xl border border-[#9ec6e0] bg-[#e8f3fb] p-5">
                <h3 className="font-semibold">Patients</h3>
                <p className="mt-1 text-sm">Know what to do today.</p>
              </article>
              <article className="rounded-3xl border border-[#9dc4b0] bg-[#e7f1ea] p-5">
                <h3 className="font-semibold">Clinicians</h3>
                <p className="mt-1 text-sm">See progress and alerts.</p>
              </article>
              <article className="rounded-3xl border border-[#d4c6b0] bg-[#f3eee6] p-5">
                <h3 className="font-semibold">Caregivers</h3>
                <p className="mt-1 text-sm">Follow a family member.</p>
              </article>
            </div>

            <aside className="rm-glow-kids relative mt-6 overflow-hidden rounded-[1.75rem] p-6 sm:p-8">
              <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="kids-glass max-w-xl p-5">
                  <p className="rm-kids-type flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#8a4a10]">
                    <KidsIcon name="star" size={18} /> Kids
                  </p>
                  <h3 className="rm-kids-type kids-title-ink mt-2 text-3xl">Kids Quest</h3>
                  <p className="mt-2 text-sm font-medium text-[#3a2a58]">Therapy as a storybook adventure.</p>
                </div>
                <Link href="/kids" className="kids-cta rm-btn rm-kids-type relative z-10 h-12 shrink-0 rounded-full px-6 text-base">
                  <span className="inline-flex items-center gap-2">
                    <KidsIcon name="gamepad" size={22} /> Open Kids Quest
                  </span>
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-t border-[var(--border)] bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-5 px-5 py-10 sm:flex-row sm:items-center sm:px-6">
            <h2 className="rm-serif text-2xl font-semibold text-foreground sm:text-3xl">Start today&apos;s loop.</h2>
            <a
              href="#go-in"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-base font-semibold text-white"
            >
              {cta}
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:justify-between sm:px-6">
          <div>
            <Logo size={40} showText={false} compact />
            <p className="mt-3 max-w-sm text-sm text-muted">
              Equal recovery for every patient, regardless of income, language, or location.
            </p>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Angles are for progress tracking, not a diagnosis. This app does not replace a clinician
            or emergency care.
          </p>
        </div>
      </footer>
    </div>
  );
}
