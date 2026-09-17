import Link from "next/link";
import { GoInScreen } from "@/components/GoInScreen";
import { KidsIcon } from "@/components/KidsIcon";
import { LandingHeader } from "@/components/LandingHeader";
import { Logo } from "@/components/Logo";

type AuthLandingProps = {
  mode: "login" | "register";
};

const chips = [
  { label: "Photo Goniometer", className: "border-[#9ec6e0] bg-[#e8f3fb] text-[#1b3348]" },
  { label: "MyoWare 2.0", className: "border-[#9dc4b0] bg-[#e7f1ea] text-[#2a4638]" },
  { label: "Heart sensor", className: "border-[#d4c6b0] bg-[#f3eee6] text-[#4a3d32]" },
  { label: "RecoverAI", className: "border-[#c5bdd8] bg-[#ece7f4] text-[#3a2a58]" },
];

const steps = [
  {
    n: "01",
    title: "Sign in on this device",
    body: "Choose Patient, Clinician, or Caregiver. Create an account once. Your plan stays with this browser until you sign in somewhere else.",
    card: "border-[#9ec6e0] border-l-4 border-l-[#4f90c6] bg-[#e8f3fb]",
    num: "text-[#3d7eb4]",
  },
  {
    n: "02",
    title: "Check in, then measure",
    body: "Answer today’s pain check (1–10). Pain of 7 or more rests you and alerts your care team. Then record motion with the Photo Goniometer — no extra hardware required.",
    card: "border-[#9dc4b0] border-l-4 border-l-[#3a7d62] bg-[#e7f1ea]",
    num: "text-[#3a7d62]",
  },
  {
    n: "03",
    title: "Add sensors if you have them",
    body: "Connect MyoWare 2.0 over Bluetooth or USB for muscle activity, and a heart sensor (USB chip or Bluetooth strap) for live BPM. Skip them and you can still finish today’s dose.",
    card: "border-[#d4c6b0] border-l-4 border-l-[#c47a32] bg-[#f3eee6]",
    num: "text-[#7a6548]",
  },
  {
    n: "04",
    title: "Follow the dose and share progress",
    body: "Open today’s briefing, run the live session, watch ROM / reps / pain / photo charts, and ask RecoverAI. A linked clinician or caregiver can review the same trend.",
    card: "border-[#c5bdd8] border-l-4 border-l-[#6b5ca5] bg-[#ece7f4]",
    num: "text-[#5a4a72]",
  },
];

const sensors = [
  {
    kicker: "Camera — no extra hardware",
    title: "Photo Goniometer",
    body: "Take a side-view photo or a short video of the joint. The coach estimates range of motion, scores form against your last clip, and gives the next sets. If the camera cannot see the leg, mark hip → knee → ankle by hand. Progress tracking only — not a diagnosis.",
    card: "border-[#9ec6e0] border-l-4 border-l-[#4f90c6] bg-[#e8f3fb]",
    kickerClass: "text-[#3d7eb4]",
  },
  {
    kicker: "Muscle — Bluetooth",
    title: "MyoWare 2.0 Wireless",
    body: "The MyoWare Wireless Shield is its own ESP32 board. After the program is loaded, Chrome or Edge connects over Bluetooth (MyoWareSensor1). Do not use the Elegoo Uno for the wireless path.",
    card: "border-[#9dc4b0] border-l-4 border-l-[#3a7d62] bg-[#e7f1ea]",
    kickerClass: "text-[#3a7d62]",
  },
  {
    kicker: "Muscle — USB",
    title: "MyoWare 2.0 Wired",
    body: "Snap the sensor to the muscle (MID / END / REF), wire ENV to an Arduino Uno, then Connect with USB in Chrome or Edge. Flex and watch the muscle signal rise during the live session.",
    card: "border-[#9dc4b0] border-l-4 border-l-[#3a7d62] bg-[#e7f1ea]",
    kickerClass: "text-[#3a7d62]",
  },
  {
    kicker: "Heart — USB",
    title: "MAX30102 pulse sensor",
    body: "A wired heart chip on an Elegoo Uno R3 shows live BPM in the Heart page and during a session. Cover both LEDs with a fingertip. USB sensors need Chrome or Edge on a computer.",
    card: "border-[#d4c6b0] border-l-4 border-l-[#c47a32] bg-[#f3eee6]",
    kickerClass: "text-[#7a6548]",
  },
  {
    kicker: "Heart — Bluetooth strap",
    title: "BLE heart-rate strap",
    body: "Polar H9/H10, Wahoo TICKR, Coospo, Magene, and similar straps share live heart rate with the site. Apple Watch and many Fitbits do not. Joint ROM scan on that path is still a demo.",
    card: "border-[#d4c6b0] border-l-4 border-l-[#c47a32] bg-[#f3eee6]",
    kickerClass: "text-[#7a6548]",
  },
];

const features = [
  {
    title: "Today’s briefing",
    body: "One home screen for today’s exercise, setup steps, streak, and the next clip to record.",
  },
  {
    title: "Daily check-in",
    body: "Pain 1–10 before you work. A score of 7+ blocks the session and alerts a linked clinician or caregiver.",
  },
  {
    title: "Live recovery session",
    body: "Run today’s ROM test and exercises with optional live heart rate and MyoWare muscle signal.",
  },
  {
    title: "Progress charts",
    body: "ROM, reps, pain, and Photo Goniometer history stay on this device so you can see the week, not just today.",
  },
  {
    title: "RecoverAI coach",
    body: "Ask about exercises, pain, ROM, or the rehab plan. Get a simple recovery report you can share.",
  },
  {
    title: "Exercise library",
    body: "Prescribed and body-area exercises with form cues, matched to your injury and target range.",
  },
  {
    title: "Body-area assessments",
    body: "Ankle, knee, lower back, wrist, and other — screening questions, movement tests, and a starting plan.",
  },
  {
    title: "Clinician dashboard",
    body: "Doctors on this device open a linked patient, review movement trend, and see high-pain alerts.",
  },
  {
    title: "Caregiver follow",
    body: "Family members follow progress and get rest-day alerts without taking over the exercises.",
  },
  {
    title: "Reminders",
    body: "Optional daily exercise notifications so the home dose does not disappear from the calendar.",
  },
  {
    title: "English and Spanish",
    body: "Switch language in the header. Equal recovery regardless of income, language, or location.",
  },
  {
    title: "Shop braces & devices",
    body: "Ankle, knee, and back supports that work alongside Revive Motion sensors during rehab.",
  },
];

const benefits = [
  {
    title: "Start with a camera",
    body: "The Photo Goniometer is the default. You can complete a real session today without buying a sensor.",
  },
  {
    title: "Know the next sets",
    body: "Form score and next-dose guidance replace guessing which exercise to repeat at home.",
  },
  {
    title: "Built-in safety stop",
    body: "High pain rests you automatically and notifies the care team instead of pushing through.",
  },
  {
    title: "Clinician in the loop",
    body: "Linked doctors see clips, angles, and alerts on this device so home work matches the plan of care.",
  },
  {
    title: "Kids can play the work",
    body: "Kids Quest turns the same therapy idea into a storybook adventure, separate from the adult clinic.",
  },
  {
    title: "Made to be reachable",
    body: "English or Spanish, patient / clinician / caregiver on one app, with optional hardware — not a requirement.",
  },
];

const audiences = [
  {
    kicker: "Patients",
    title: "A clear home PT loop",
    body: "Onboarding, daily check-in, measurement, today’s briefing, live session, charts, RecoverAI, and the exercise library — in that order, on this device.",
    card: "border-[#9ec6e0] border-l-4 border-l-[#4f90c6] bg-[#e8f3fb]",
    kickerClass: "text-[#3d7eb4]",
  },
  {
    kicker: "Clinicians",
    title: "See linked patients in one place",
    body: "Open a patient, review Photo Goniometer trend, watch high-pain alerts, and keep home sets aligned with the plan of care.",
    card: "border-[#9dc4b0] border-l-4 border-l-[#3a7d62] bg-[#e7f1ea]",
    kickerClass: "text-[#3a7d62]",
  },
  {
    kicker: "Caregivers",
    title: "Follow a family member’s week",
    body: "Stay close to sessions and rest-day alerts without taking over the exercises. Support the person you care for from the same app.",
    card: "border-[#d4c6b0] border-l-4 border-l-[#c47a32] bg-[#f3eee6]",
    kickerClass: "text-[#7a6548]",
  },
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
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_-8%,rgba(79,144,198,0.28),transparent_42%),radial-gradient(circle_at_92%_6%,rgba(58,125,98,0.18),transparent_34%),radial-gradient(circle_at_48%_100%,rgba(232,197,107,0.18),transparent_40%)]"
          />
          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-center lg:gap-16 lg:py-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#9ec6e0] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-light">
                <span className="h-2 w-2 rounded-full bg-[#3a7d62]" />
                Physical Therapy Assistance
              </p>
              <h1 className="rm-serif mt-5 max-w-xl text-[2.35rem] font-semibold leading-[1.12] text-foreground sm:text-5xl lg:text-[3.25rem]">
                Home PT that measures, coaches, and keeps your clinician close.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-body">
                Revive Motion is a recovery assistant for patients, clinicians, and caregivers.
                Check in, measure the joint with a camera or optional sensors, follow today&apos;s
                dose, and share progress — so home therapy is not guesswork.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#go-in"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-base font-semibold text-white shadow-[0_10px_24px_rgba(79,144,198,0.28)] transition hover:bg-brand-light"
                >
                  {cta}
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#9dc4b0] bg-[#e7f1ea] px-6 text-base font-semibold text-[#2a4638] transition hover:border-[#3a7d62]/50"
                >
                  How to use it
                </a>
              </div>
              <ul className="mt-10 grid grid-cols-2 gap-3 text-sm font-medium sm:grid-cols-4">
                {chips.map((chip) => (
                  <li key={chip.label} className={`rounded-2xl border px-3 py-3 text-center ${chip.className}`}>
                    {chip.label}
                  </li>
                ))}
              </ul>
            </div>

            <section id="go-in" className="scroll-mt-28">
              <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_22px_50px_rgba(27,51,72,0.1)] sm:p-8">
                <GoInScreen mode={mode} />
              </div>
            </section>
          </div>
        </section>

        <section className="border-t border-[var(--border)] bg-white">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
            <div>
              <p className="rm-label text-brand-light">What this app is</p>
              <h2 className="rm-serif mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
                A clinic-style loop you can finish at home
              </h2>
              <p className="mt-4 text-base leading-8 text-body">
                Physical therapy only works if the home dose is done well. Revive Motion walks a
                patient through today&apos;s work: pain check, measurement, the prescribed sets, and a
                record your clinician can review. Sensors are optional. The camera is enough to start.
              </p>
            </div>
            <div className="rounded-3xl border border-[#9ec6e0] bg-[#e8f3fb] p-6 sm:p-8">
              <p className="rm-label text-[#3d7eb4]">Who it helps</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-body">
                <li>
                  <span className="font-semibold text-foreground">Patients</span> — know what to do
                  today, how it looked, and what to do next.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Clinicians</span> — see linked
                  patients, movement trend, and high-pain alerts on this device.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Caregivers</span> — follow a family
                  member without taking over the session.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Kids</span> — complete therapy as
                  a storybook quest, separate from the adult clinic.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-28 border-t border-[var(--border)] bg-background">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
            <p className="rm-label text-brand-light">How to use it</p>
            <h2 className="rm-serif mt-2 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
              Four steps from sign-in to today&apos;s session
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-body">
              Built like a clinic visit: identify who is here, check safety, capture motion, then
              act on a clear next dose.
            </p>
            <ol className="mt-10 grid gap-6 md:grid-cols-2">
              {steps.map((step) => (
                <li key={step.n} className={`rounded-3xl border p-6 shadow-[0_10px_28px_rgba(27,51,72,0.05)] ${step.card}`}>
                  <p className={`rm-serif text-2xl font-semibold ${step.num}`}>{step.n}</p>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="sensors" className="scroll-mt-28 border-t border-[var(--border)] bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
            <p className="rm-label text-brand-light">Sensors</p>
            <h2 className="rm-serif mt-2 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
              Every measurement path, named clearly
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-body">
              Start with the camera. Add muscle or heart hardware when you have it. USB and
              Bluetooth sensors need Chrome or Edge on a computer. Safari and iPhone cannot open
              those ports.
            </p>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {sensors.map((item) => (
                <article key={item.title} className={`rounded-3xl border p-7 ${item.card}`}>
                  <p className={`rm-label ${item.kickerClass}`}>{item.kicker}</p>
                  <h3 className="rm-serif mt-3 text-2xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-body">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-28 border-t border-[var(--border)] bg-background">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
            <p className="rm-label text-brand-light">Features</p>
            <h2 className="rm-serif mt-2 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
              Everything in the recovery app
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-body">
              The same product patients use at home is what clinicians and caregivers open to
              follow along.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[0_10px_24px_rgba(27,51,72,0.04)]"
                >
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-body">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className="scroll-mt-28 border-t border-[var(--border)] bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
            <p className="rm-label text-brand-light">Why people use it</p>
            <h2 className="rm-serif mt-2 max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
              Benefits you can feel in a week of home PT
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-[#9ec6e0] bg-[#f7fbfe] p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-body">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="scroll-mt-28 border-t border-[var(--border)] bg-background">
          <div id="for-patients" className="scroll-mt-28" />
          <div id="for-clinicians" className="scroll-mt-28" />
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
            <p className="rm-label text-brand-light">Who it is for</p>
            <h2 className="rm-serif mt-2 max-w-xl text-3xl font-semibold text-foreground sm:text-4xl">
              One home for patients, clinicians, and family
            </h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {audiences.map((item) => (
                <article
                  key={item.kicker}
                  className={`rounded-3xl border p-7 shadow-[0_12px_32px_rgba(27,51,72,0.05)] ${item.card}`}
                >
                  <p className={`rm-label ${item.kickerClass}`}>{item.kicker}</p>
                  <h3 className="rm-serif mt-3 text-2xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-body">{item.body}</p>
                </article>
              ))}
            </div>

            <aside className="rm-glow-kids relative mt-6 overflow-hidden rounded-[1.75rem] p-6 sm:p-8">
              <div className="kids-atmosphere" aria-hidden>
                <span className="kids-star kids-star-1" />
                <span className="kids-star kids-star-2" />
                <span className="kids-star kids-star-4" />
              </div>
              <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="kids-glass max-w-xl p-5 sm:p-6">
                  <p className="rm-kids-type flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#8a4a10]">
                    <KidsIcon name="star" size={18} /> Younger patients
                  </p>
                  <h3 className="rm-kids-type kids-title-ink mt-2 text-3xl sm:text-4xl">Kids Quest</h3>
                  <p className="mt-2 text-sm font-medium leading-7 text-[#3a2a58]">
                    A colorful storybook world so children can complete therapy as an adventure,
                    with kingdoms, quests, and a gold-star path of their own.
                  </p>
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
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-5 py-12 sm:px-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="rm-serif text-3xl font-semibold text-foreground">Ready to start today&apos;s loop?</h2>
              <p className="mt-2 max-w-xl text-sm leading-7 text-body">
                Choose Patient, Clinician, or Caregiver. Kids Quest is its own colorful world.
              </p>
            </div>
            <a
              href="#go-in"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-base font-semibold text-white shadow-[0_10px_24px_rgba(79,144,198,0.28)] transition hover:bg-brand-light"
            >
              {cta}
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo size={44} showText={false} compact />
            <p className="mt-4 max-w-sm text-sm leading-7 text-body">
              Equal recovery for every patient, regardless of income, language, or location.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Navigate</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <a href="#how-it-works" className="hover:text-foreground">
                  How it works
                </a>
              </li>
              <li>
                <a href="#sensors" className="hover:text-foreground">
                  Sensors
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#go-in" className="hover:text-foreground">
                  Go in
                </a>
              </li>
              <li>
                <Link href="/kids" className="hover:text-foreground">
                  Kids Quest
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Care note</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Revive Motion supports home physical therapy. Measurements are for progress tracking.
              The app does not replace a licensed clinician, diagnosis, or emergency care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
