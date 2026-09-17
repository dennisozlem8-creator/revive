import Link from "next/link";
import { GoInScreen } from "@/components/GoInScreen";
import { KidsIcon } from "@/components/KidsIcon";
import { LandingHeader } from "@/components/LandingHeader";
import { Logo } from "@/components/Logo";

type AuthLandingProps = {
  mode: "login" | "register";
};

function Glyph({
  children,
  className = "h-7 w-7",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      {children}
    </svg>
  );
}

const steps = [
  {
    n: "1",
    title: "Sign in",
    line: "Patient, clinician, or caregiver.",
    className: "border-[#9ec6e0] bg-[#e8f3fb] text-[#1b3348]",
    icon: (
      <Glyph>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" strokeLinecap="round" />
      </Glyph>
    ),
  },
  {
    n: "2",
    title: "Check pain",
    line: "1–10. A 7+ means rest today.",
    className: "border-[#9dc4b0] bg-[#e7f1ea] text-[#2a4638]",
    icon: (
      <Glyph>
        <path d="M12 21s-7-4.4-7-10a7 7 0 0 1 14 0c0 5.6-7 10-7 10z" strokeLinecap="round" />
      </Glyph>
    ),
  },
  {
    n: "3",
    title: "Measure",
    line: "Camera first. Sensors if you have them.",
    className: "border-[#d4c6b0] bg-[#f3eee6] text-[#4a3d32]",
    icon: (
      <Glyph>
        <path d="M4 8h4l2-2h4l2 2h4v11H4V8z" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3" />
      </Glyph>
    ),
  },
  {
    n: "4",
    title: "Do today’s sets",
    line: "Briefing, session, charts, RecoverAI.",
    className: "border-[#c5bdd8] bg-[#ece7f4] text-[#3a2a58]",
    icon: (
      <Glyph>
        <path d="M7 7h10v12H7z" strokeLinejoin="round" />
        <path d="M9 4h6M9 11h6M9 15h4" strokeLinecap="round" />
      </Glyph>
    ),
  },
];

const sensors = [
  {
    title: "Photo Goniometer",
    tag: "Camera",
    line: "Photo or short video. Get the angle, form score, and next sets.",
    className: "border-[#9ec6e0] bg-[#e8f3fb]",
    iconClass: "bg-[#4f90c6] text-white",
    icon: (
      <Glyph className="h-8 w-8">
        <path d="M4 8h4l2-2h4l2 2h4v11H4V8z" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3" />
      </Glyph>
    ),
  },
  {
    title: "MyoWare 2.0",
    tag: "Muscle",
    line: "Wireless Bluetooth Shield, or wired USB. Skip it if you only have a camera.",
    className: "border-[#9dc4b0] bg-[#e7f1ea]",
    iconClass: "bg-[#3a7d62] text-white",
    icon: (
      <Glyph className="h-8 w-8">
        <path d="M4 12h3l2-6 3 12 2-6h6" strokeLinecap="round" strokeLinejoin="round" />
      </Glyph>
    ),
  },
  {
    title: "Heart sensor",
    tag: "BPM",
    line: "USB pulse chip or a Bluetooth strap. Live heart rate in the session.",
    className: "border-[#d4c6b0] bg-[#f3eee6]",
    iconClass: "bg-[#c47a32] text-white",
    icon: (
      <Glyph className="h-8 w-8">
        <path
          d="M12 20s-7-4.3-7-10a4.2 4.2 0 0 1 7-3 4.2 4.2 0 0 1 7 3c0 5.7-7 10-7 10z"
          strokeLinejoin="round"
        />
      </Glyph>
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
  { title: "Caregiver view", line: "Follow without taking over" },
  { title: "Reminders", line: "Daily dose notifications" },
  { title: "EN / ES", line: "English or Spanish" },
  { title: "Shop", line: "Braces and recovery devices" },
];

const roles = [
  {
    title: "Patients",
    line: "Know what to do today.",
    className: "border-[#9ec6e0] bg-[#e8f3fb]",
  },
  {
    title: "Clinicians",
    line: "See progress and alerts.",
    className: "border-[#9dc4b0] bg-[#e7f1ea]",
  },
  {
    title: "Caregivers",
    line: "Follow a family member.",
    className: "border-[#d4c6b0] bg-[#f3eee6]",
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
          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-center lg:gap-14 lg:py-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#9ec6e0] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-light">
                <span className="h-2 w-2 rounded-full bg-[#3a7d62]" />
                Physical Therapy Assistance
              </p>
              <h1 className="rm-serif mt-5 max-w-lg text-[2.35rem] font-semibold leading-[1.12] text-foreground sm:text-5xl">
                Home PT you can see.
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-8 text-body">
                Check in. Measure the joint. Do today&apos;s sets. Share with your clinician.
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
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#9dc4b0] bg-[#e7f1ea] px-6 text-base font-semibold text-[#2a4638]"
                >
                  How it works
                </a>
              </div>
            </div>

            <section id="go-in" className="scroll-mt-28">
              <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_22px_50px_rgba(27,51,72,0.1)] sm:p-8">
                <GoInScreen mode={mode} />
              </div>
            </section>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-28 border-t border-[var(--border)] bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6">
            <p className="rm-label text-brand-light">How it works</p>
            <h2 className="rm-serif mt-2 text-3xl font-semibold text-foreground">Four steps. That is the app.</h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <li key={step.n} className={`rounded-3xl border p-5 ${step.className}`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80">
                    {step.icon}
                  </div>
                  <p className="rm-serif mt-4 text-2xl font-semibold">{step.n}</p>
                  <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 opacity-90">{step.line}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="sensors" className="scroll-mt-28 border-t border-[var(--border)] bg-background">
          <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6">
            <p className="rm-label text-brand-light">Measure with</p>
            <h2 className="rm-serif mt-2 text-3xl font-semibold text-foreground">Camera first. Sensors optional.</h2>
            <p className="mt-2 text-sm text-muted">USB and Bluetooth need Chrome or Edge on a computer.</p>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {sensors.map((item) => (
                <article key={item.title} className={`rounded-3xl border p-6 ${item.className}`}>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconClass}`}>
                    {item.icon}
                  </div>
                  <p className="rm-label mt-5">{item.tag}</p>
                  <h3 className="mt-1 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-body">{item.line}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-28 border-t border-[var(--border)] bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6">
            <p className="rm-label text-brand-light">Inside the app</p>
            <h2 className="rm-serif mt-2 text-3xl font-semibold text-foreground">What you get</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {features.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[#f7fbfe] px-4 py-4"
                >
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{item.line}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="scroll-mt-28 border-t border-[var(--border)] bg-background">
          <div id="for-patients" className="scroll-mt-28" />
          <div id="for-clinicians" className="scroll-mt-28" />
          <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6">
            <p className="rm-label text-brand-light">Who it is for</p>
            <h2 className="rm-serif mt-2 text-3xl font-semibold text-foreground">One app. Three roles.</h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {roles.map((item) => (
                <article key={item.title} className={`rounded-3xl border p-6 ${item.className}`}>
                  <h3 className="rm-serif text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6">{item.line}</p>
                </article>
              ))}
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
            For progress tracking only. Not a diagnosis, and not a replacement for a clinician or emergency care.
          </p>
        </div>
      </footer>
    </div>
  );
}
