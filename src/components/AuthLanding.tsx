import { Logo } from "@/components/Logo";
import { GoInScreen } from "@/components/GoInScreen";

type AuthLandingProps = {
  mode: "login" | "register";
};

const features = [
  {
    title: "Photo Goniometer",
    detail: "Record a side-view clip. Get a form score and the next sets to do.",
  },
  {
    title: "Muscle sensor",
    detail: "Connect MyoWare 2.0 over Bluetooth or USB and see live effort.",
  },
  {
    title: "Kids Quest",
    detail: "A storybook exercise world for younger patients.",
  },
];

export function AuthLanding({ mode }: AuthLandingProps) {
  return (
    <div className="relative min-h-full overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_-10%,rgba(79,144,198,0.22),transparent_38%),radial-gradient(circle_at_92%_8%,rgba(58,125,98,0.12),transparent_32%)]"
      />
      <main className="relative z-10 mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center gap-10 px-6 py-10 lg:flex-row lg:items-center lg:gap-16 lg:py-16">
        <section className="flex flex-col items-center text-center lg:w-[48%] lg:items-start lg:text-left">
          <Logo size={96} showText stacked className="lg:items-start lg:text-left" />
          <h1 className="mt-8 max-w-lg text-[2.1rem] font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl">
            Move better. Feel stronger.
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-8 text-body">
            Physical therapy assistance at home. Measure the joint, follow today&apos;s dose, and
            keep your clinician in the loop.
          </p>
          <ul className="mt-8 hidden w-full max-w-lg space-y-4 text-left sm:block">
            {features.map((item) => (
              <li key={item.title} className="rounded-2xl border border-[var(--border)] bg-white/80 px-5 py-4">
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-body">{item.detail}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-[0_18px_40px_rgba(27,51,72,0.08)] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/landing-hero.svg"
              alt="Today’s plan, photo angle, and muscle effort"
              width={800}
              height={280}
              className="h-auto w-full"
            />
          </div>
        </section>
        <section className="w-full max-w-md lg:w-[44%]">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[0_22px_50px_rgba(27,51,72,0.1)] sm:p-8">
            <p className="rm-label">Start here</p>
            <h2 className="mt-1 text-2xl font-bold text-foreground">
              {mode === "login" ? "Go in" : "Create an account"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {mode === "login"
                ? "Choose who you are on this device, then sign in."
                : "Choose who you are, then create an account on this device."}
            </p>
            <div className="mt-6">
              <GoInScreen mode={mode} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
