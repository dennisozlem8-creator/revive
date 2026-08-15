import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/AuthForm";
import { KidsModeLink } from "@/components/KidsModeLink";
import { ResetAppButton } from "@/components/ResetAppButton";

export default function LoginPage() {
  return (
    <div className="relative min-h-full overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.15),transparent_50%)]"
      />
      <main className="relative z-10 mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
        <div className="mb-10 flex justify-center">
          <Logo size={72} />
        </div>
        <KidsModeLink variant="portal" className="mb-6" />
        <AuthForm mode="login" />
        <ResetAppButton />
        <p className="mt-6 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/register" className="font-medium text-brand-light hover:text-brand">
            Create one
          </Link>
        </p>
      </main>
    </div>
  );
}
