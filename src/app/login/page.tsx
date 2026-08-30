import { Logo } from "@/components/Logo";
import { GoInScreen } from "@/components/GoInScreen";

export default function LoginPage() {
  return (
    <div className="relative min-h-full overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0" />
      <main className="relative z-10 mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
        <div className="mb-10 flex justify-center">
          <Logo size={72} />
        </div>
        <GoInScreen mode="login" />
      </main>
    </div>
  );
}
