import Link from "next/link";
import { GoInScreen } from "@/components/GoInScreen";
import { KidsIcon } from "@/components/KidsIcon";
import { LandingHeader } from "@/components/LandingHeader";
import { Logo } from "@/components/Logo";

type AuthLandingProps = {
  mode: "login" | "register";
};

const steps = [
  {
    n: "01",
    title: "Sign in on this device",
    body: "Choose patient, clinician, or caregiver. Your plan and progress stay with this browser until you sign in on another device.",
    card: "border-[#9ec6e0] border-l-4 border-l-[#4f90c6] bg-[#e8f3fb]",
    num: "text-[#3d7eb4]",
  },
  {
    n: "02",
    title: "Measure today’s motion",
    body: "Use the photo goniometer for joint range, or connect a MyoWare sensor when you have one. No extra hardware is required to start.",
    card: "border-[#9dc4b0] border-l-4 border-l-[#3a7d62] bg-[#e7f1ea]",
    num: "text-[#3a7d62]",
  },
  {
    n: "03",
    title: "Follow the dose, share progress",
    body: "Complete the sets your session recommends, then keep a linked doctor or caregiver in the loop from the care dashboard.",
    card: "border-[#d4c6b0] border-l-4 border-l-[#c47a32] bg-[#f3eee6]",
    num: "text-[#7a6548]",
  },
];

const audiences = [
  {
    id: "for-patients",
    kicker: "Patients",
    title: "Clinic-guided recovery at home",
    body: "Open today’s briefing, record a clip, and get the next sets without guessing. Body-area assessments cover ankle, knee, lower back, wrist, and more.",
    card: "border-[#9ec6e0] border-l-4 border-l-[#4f90c6] bg-[#e8f3fb]",
    kickerClass: "text-[#3d7eb4]",
  },
  {
    id: "for-clinicians",
    kicker: "Clinicians",
    title: "See linked patients in one place",
    body: "Doctors on this device can open a patient, review movement trends, and keep home work aligned with the plan of care.",
    card: "border-[#9dc4b0] border-l-4 border-l-[#3a7d62] bg-[#e7f1ea]",
    kickerClass: "text-[#3a7d62]",
  },
  {
    id: "for-caregivers",
    kicker: "Caregivers",
    title: "Follow a family member’s week",
    body: "Stay close to sessions and progress without taking over the exercises. Support the person you care for from the same app.",
    card: "border-[#d4c6b0] border-l-4 border-l-[#c47a32] bg-[#f3eee6]",
    kickerClass: "text-[#7a6548]",
  },
];

const chips = [
  { label: "Photo range of motion", className: "border-[#9ec6e0] bg-[#e8f3fb] text-[#1b3348]" },
  { label: "Optional muscle sensor", className: "border-[#9dc4b0] bg-[#e7f1ea] text-[#2a4638]" },
  { label: "Care team dashboard", className: "border-[#d4c6b0] bg-[#f3eee6] text-[#4a3d32]" },
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
          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-center lg:gap-16 lg:py-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#9ec6e0] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-light">
                <span className="h-2 w-2 rounded-full bg-[#3a7d62]" />
                Physical Therapy Assistance
              </p>
              <h1 className="rm-serif mt-5 max-w-xl text-[2.35rem] font-semibold leading-[1.12] text-foreground sm:text-5xl lg:text-[3.35rem]">
                Move better.{" "}
                <span className="inline-block text-brand">Feel stronger.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-body">
                Home physical therapy with a calm clinic workflow: measure the joint, follow
                today&apos;s dose, and keep your care team with you.
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
                  How it works
                </a>
              </div>
              <ul className="mt-10 grid grid-cols-1 gap-3 text-sm font-medium sm:grid-cols-3">
                {chips.map((chip) => (
                  <li key={chip.label} className={`rounded-2xl border px-4 py-3 ${chip.className}`}>
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

        <section id="how-it-works" className="scroll-mt-28 border-t border-[var(--border)] bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
            <p className="rm-label text-brand-light">Care pathway</p>
            <h2 className="rm-serif mt-2 max-w-xl text-3xl font-semibold text-foreground sm:text-4xl">
              Three steps from sign-in to today&apos;s session
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-body">
              Built like a clinic visit: identify who is here, capture motion, then act on a
              clear next dose.
            </p>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
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
                  key={item.id}
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
              Revive Motion supports home physical therapy. It does not replace a licensed
              clinician, diagnosis, or emergency care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
