"use client";

import { useRouter } from "next/navigation";
import { resetAppData } from "@/lib/app-reset";
import { useAuth } from "./AuthProvider";

type ResetAppButtonProps = {
  variant?: "default" | "quiet";
};

export function ResetAppButton({ variant = "default" }: ResetAppButtonProps) {
  const router = useRouter();
  const { logout } = useAuth();

  function handleReset() {
    const ok = window.confirm(
      "This clears all accounts and saved progress on this device so you can register fresh. Continue?"
    );
    if (!ok) return;
    resetAppData();
    logout();
    router.replace("/register");
    router.refresh();
  }

  if (variant === "quiet") {
    return (
      <button
        type="button"
        onClick={handleReset}
        className="relative z-10 mt-5 w-full text-center text-xs text-muted transition hover:text-foreground"
      >
        Reset this device
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      className="relative z-10 mt-8 min-h-12 w-full rounded-xl border border-alert/30 bg-alert/5 px-4 py-3 text-sm font-medium text-alert transition hover:border-alert/50 hover:bg-alert/10 active:scale-[0.98]"
    >
      Reset app & create new account
    </button>
  );
}
