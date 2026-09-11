import { Logo } from "@/components/Logo";
import { GoInScreen } from "@/components/GoInScreen";

type AuthLandingProps = {
  mode: "login" | "register";
};

export function AuthLanding({ mode }: AuthLandingProps) {
  return (
    <div className="relative min-h-full overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(79,144,198,0.16),transparent_42%)]"
      />
      <main className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center gap-10 px-6 py-12 lg:flex-row lg:items-center lg:gap-16 lg:py-16">
        <section className="flex flex-col items-center text-center lg:w-[44%] lg:items-start lg:text-left">
          <Logo size={112} showText stacked className="lg:items-start lg:text-left" />
          <p className="mt-6 max-w-md text-lg leading-8 text-foreground">
            Guided exercises, a photo goniometer, and a wired heart sensor. Then go in as a
            patient, doctor, caregiver, or start Kids Quest.
          </p>
        </section>
        <section className="w-full max-w-md lg:w-[56%]">
          <GoInScreen mode={mode} />
        </section>
      </main>
    </div>
  );
}
