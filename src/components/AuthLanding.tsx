import Link from "next/link";
import { GoInScreen } from "@/components/GoInScreen";
import { JointMarks, MpuAnglePhoto, PhonePreview, PhotoFrame, RomChart } from "@/components/LandingMedia";
import { LandingHeader } from "@/components/LandingHeader";
import { Logo } from "@/components/Logo";

type AuthLandingProps = {
  mode: "login" | "register";
};

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
    src: "/images/landing-myoware.png",
    alt: "MyoWare muscle sensor with electrode pads on an upper arm.",
    className: "border-[#d0c4e4] bg-[#f3eefc]",
    titleClass: "text-[#5a3d8a]",
    fit: "contain" as const,
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
          <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 lg:py-12">
            <div className="max-w-2xl">
              <p className="rm-label text-brand-light">Photo + sensors</p>
              <h1 className="rm-serif mt-2 text-[2.4rem] font-semibold leading-[1.08] text-foreground sm:text-5xl">
                Measure the joint at home.
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-8 text-body">
                Photograph the movement, or wear a sensor. Then follow today’s exercises with your clinician.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#go-in"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 font-semibold text-white shadow-sm"
                >
                  {cta}
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#9dc4b0] bg-[#e7f1ea] px-7 font-semibold text-[#2a4638]"
                >
                  See how
                </a>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-start">
              <PhotoFrame
                src="/images/landing-hero-photo.webp?v=3"
                alt="A helper photographs a seated patient from the side in a living room."
                className="aspect-[16/9] rounded-[1.75rem] border border-[#b7d4e8] shadow-[0_22px_50px_rgba(27,51,72,0.1)]"
              />
              <section id="go-in" className="scroll-mt-28">
                <div className="h-full rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_22px_50px_rgba(27,51,72,0.1)] sm:p-7">
                  <GoInScreen mode={mode} />
                </div>
              </section>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-28 bg-[#f7fbfe]">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6">
            <p className="rm-label text-brand-light">Three steps</p>
            <h2 className="rm-serif mt-1 text-3xl font-semibold sm:text-4xl">How it works</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {steps.map((step) => (
                <article key={step.n} className="overflow-hidden rounded-[1.5rem] border border-[#c5d9ea] bg-[#f7fbfe]">
                  <PhotoFrame src={step.src} alt={step.alt} className="h-56" />
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-light">Step {step.n}</p>
                    <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-body">{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
              <JointMarks className="min-h-[16rem] rounded-[1.5rem] border border-[#c5d9ea]" />
              <RomChart />
            </div>
          </div>
        </section>

        <section id="sensors" className="scroll-mt-28 bg-[#e8f3fb] py-14">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
            <p className="rm-label text-brand-light">Choose one way to measure</p>
            <h2 className="rm-serif mt-1 text-3xl font-semibold sm:text-4xl">Photo, motion, or muscle</h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-body">
              You do not need all three. Pick the method your clinician asked for, or start with a photo.
            </p>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {ways.map((item) => (
                <article key={item.title} className={`overflow-hidden rounded-[1.5rem] border ${item.className}`}>
                  {"mpu" in item && item.mpu ? (
                    <MpuAnglePhoto className="aspect-[4/3] min-h-[16rem] sm:min-h-[18rem]" />
                  ) : (
                    <PhotoFrame src={item.src} alt={item.alt} fit={item.fit} className="aspect-[4/3] min-h-[16rem] sm:min-h-[18rem]" />
                  )}
                  <div className="p-5 sm:p-6">
                    <h3 className={`text-xl font-bold uppercase ${item.titleClass}`}>{item.title}</h3>
                    <p className="mt-1 text-sm font-semibold">{item.device}</p>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-body">
                      {item.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span aria-hidden className="mt-0.5 font-semibold text-brand-light">
                            •
                          </span>
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

        <section id="features" className="scroll-mt-28 bg-white py-14">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
            <p className="rm-label text-brand-light">For the whole care team</p>
            <h2 className="rm-serif mt-1 text-3xl font-semibold sm:text-4xl">Inside the app</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <p className="rounded-2xl border border-[#9ec6e0] bg-[#e8f3fb] px-4 py-3 font-semibold">Patients</p>
              <p className="rounded-2xl border border-[#9dc4b0] bg-[#e7f1ea] px-4 py-3 font-semibold">Clinicians</p>
              <p className="rounded-2xl border border-[#d4c6b0] bg-[#f3eee6] px-4 py-3 font-semibold">Caregivers</p>
            </div>
            <Link
              href="/kids"
              className="rm-glow-kids relative mt-8 block overflow-hidden rounded-[1.75rem] shadow-[0_18px_36px_rgba(40,24,8,0.16)]"
            >
              <PhotoFrame src="/images/landing-kids-quest.webp" alt="Kids Quest adventure world." className="h-44 sm:h-56" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a1848]/70 via-[#2a1848]/25 to-transparent" />
              <div className="absolute inset-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                <div>
                  <p className="rm-kids-type text-sm font-bold uppercase tracking-[0.16em] text-amber-200">Younger patients</p>
                  <p className="rm-kids-type mt-1 text-3xl text-amber-50 drop-shadow">Kids Quest</p>
                </div>
                <span className="kids-cta rm-btn rm-kids-type h-11 rounded-full px-5 text-sm">Open</span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-8 sm:px-6">
          <Logo size={40} showText={false} compact />
          <a href="#go-in" className="font-semibold text-brand-light">
            {cta}
          </a>
        </div>
      </footer>
    </div>
  );
}
