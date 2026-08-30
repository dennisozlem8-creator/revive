import { Logo } from "@/components/Logo";
import { GoInScreen } from "@/components/GoInScreen";

export default function RegisterPage() {
  return (
    <div className="relative min-h-full overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.15),transparent_50%)]"
      />
      <main className="relative z-10 mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
        <div className="mb-10 flex justify-center">
          <Logo size={72} stacked />
        </div>
        <GoInScreen mode="register" />
      </main>
    </div>
  );
}
