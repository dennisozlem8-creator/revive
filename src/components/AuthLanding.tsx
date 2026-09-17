import Link from "next/link";
import { GoInScreen } from "@/components/GoInScreen";
import { KidsIcon } from "@/components/KidsIcon";
import { LandingHeader } from "@/components/LandingHeader";
import { Logo } from "@/components/Logo";

type AuthLandingProps = {
  mode: "login" | "register";
};

function Picture({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // Native img so SVG schematics always paint (next/image can hide them as alt text).
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}

const solutions = [
  {
    title: "Photo",
    subtitle: "Phone camera. No extra device.",
    points: ["Side-view photo", "Tap hip, knee, ankle", "See the angle"],
    className: "border-[#b7d4c4] bg-[#e7f6ee]",
    titleClass: "text-[#2a7a58]",
    image: "/images/landing-people-photo.svg?v=3",
    alt: "Helper photographing a seated patient from the side.",
  },
  {
    title: "Motion sensor",
    subtitle: "MPU-6050 on the joint.",
    points: ["Live angle", "Hands-free", "During the session"],
    className: "border-[#c5c9e8] bg-[#eef0fb]",
    titleClass: "text-[#4a4f8a]",
    image: "/images/landing-mpu.svg",
    alt: "Motion sensor worn on the knee.",
  },
  {
    title: "Muscle sensor",
    subtitle: "MyoWare 2.0.",
    points: ["Muscle effort", "Flex to see the signal", "Bluetooth or USB"],
    className: "border-[#d0c4e4] bg-[#f3eefc]",
    titleClass: "text-[#5a3d8a]",
    image: "/images/landing-myoware.svg",
    alt: "MyoWare muscle sensor schematic.",
  },
];

const inside = [
  { title: "Briefing", src: "/images/briefing-hero.svg", alt: "Today’s briefing screen" },
  { title: "Session", src: "/images/session-hero.svg", alt: "Live session screen" },
  { title: "Dashboard", src: "/images/dashboard-hero.svg", alt: "Progress dashboard" },
  { title: "Check-in", src: "/images/check-in-hero.svg", alt: "Daily check-in screen" },
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
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_-8%,rgba(79,144,198,0.22),transparent_42%)]"
          />
          <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 lg:py-10">
            <div className="max-w-xl">
              <p className="rm-label text-brand-light">Photo + sensors</p>
              <h1 className="rm-serif mt-2 text-[2.2rem] font-semibold leading-[1.12] text-foreground sm:text-4xl">
                Measure the joint at home.
              </h1>
              <p className="mt-3 text-base text-body">Then follow today&apos;s exercises with your clinician.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#go-in"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 font-semibold text-white"
                >
                  {cta}
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#9dc4b0] bg-[#e7f1ea] px-6 font-semibold text-[#2a4638]"
                >
                  See how
                </a>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-start">
              <div className="overflow-hidden rounded-[1.5rem] border border-[#b7d4e8] bg-white">
                <Picture
                  src="/images/landing-people-photo.svg?v=3"
                  alt="A helper takes a side-view photo. Hip, knee, and ankle are marked. The angle reads 92 degrees."
                  className="h-auto w-full"
                />
              </div>
              <section id="go-in" className="scroll-mt-28">
                <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_22px_50px_rgba(27,51,72,0.1)] sm:p-7">
                  <GoInScreen mode={mode} />
                </div>
              </section>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-28 bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6">
            <h2 className="rm-serif text-3xl font-semibold text-foreground">How it works</h2>
            <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-[#c5d9ea] bg-white">
              <Picture
                src="/images/landing-photo-flow.svg?v=3"
                alt="Photo, three points, angle, save, chart, then today’s exercises."
                className="h-auto w-full"
              />
            </div>
            <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-[#c5d9ea] bg-white">
              <Picture
                src="/images/landing-angle-chart.svg?v=3"
                alt="Marked hip, knee, and ankle with a 92 degree estimate and a rising motion chart."
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        <section id="sensors" className="scroll-mt-28 bg-[#1b3348] py-12 text-white">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
            <h2 className="rm-serif text-3xl font-semibold">Photo and sensors</h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {solutions.map((item) => (
                <article key={item.title} className={`overflow-hidden rounded-[1.5rem] border text-foreground ${item.className}`}>
                  <Picture
                    src={item.image}
                    alt={item.alt}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className={`text-xl font-bold uppercase ${item.titleClass}`}>{item.title}</h3>
                    <p className="mt-1 text-sm font-semibold">{item.subtitle}</p>
                    <ul className="mt-4 space-y-1.5 text-sm">
                      {item.points.map((point) => (
                        <li key={point}>✓ {point}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-28 bg-white py-12">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
            <h2 className="rm-serif text-3xl font-semibold text-foreground">Inside the app</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {inside.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#f7fbfe]">
                  <Picture
                    src={item.src}
                    alt={item.alt}
                    className="h-28 w-full object-cover"
                  />
                  <p className="px-4 py-3 text-sm font-semibold">{item.title}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <p className="rounded-2xl border border-[#9ec6e0] bg-[#e8f3fb] px-4 py-3 font-semibold">Patients</p>
              <p className="rounded-2xl border border-[#9dc4b0] bg-[#e7f1ea] px-4 py-3 font-semibold">Clinicians</p>
              <p className="rounded-2xl border border-[#d4c6b0] bg-[#f3eee6] px-4 py-3 font-semibold">Caregivers</p>
            </div>
            <Link
              href="/kids"
              className="rm-glow-kids mt-6 flex items-center justify-between overflow-hidden rounded-[1.5rem] p-5"
            >
              <span className="rm-kids-type kids-title-ink text-2xl">Kids Quest</span>
              <span className="kids-cta rm-btn h-11 rounded-full px-5 text-sm">
                <KidsIcon name="gamepad" size={20} /> Open
              </span>
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
