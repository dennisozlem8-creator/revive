import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/AuthForm";
import { KidsModeLink } from "@/components/KidsModeLink";
import { ResetAppButton } from "@/components/ResetAppButton";
import { CaregiverPortalHint } from "@/components/CaregiverPortalHint";

export default function LoginPage() {
  return (
    <div className="rm-auth-page text-foreground">
      <main className="relative z-10 mx-auto flex min-h-full w-full max-w-[420px] flex-col justify-center px-5 py-12 sm:px-6">
        <header className="animate-fade-up mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-brand/10">
            <Logo size={44} />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">Revive Motion</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Guided recovery · ROM tracking · daily exercises
          </p>
        </header>

        <div className="animate-fade-up rm-auth-shell p-6 sm:p-7" style={{ animationDelay: "0.05s" }}>
          <AuthForm mode="login" hideHeader />
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          New here?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-light underline-offset-4 hover:text-white hover:underline"
          >
            Create an account
          </Link>
        </p>

        <div className="rm-auth-divider my-7">Provider access</div>

        <CaregiverPortalHint variant="compact" />

        <div className="mt-6">
          <KidsModeLink variant="portal" className="opacity-95" />
        </div>

        <ResetAppButton className="mt-6" subtle />
      </main>
    </div>
  );
}
