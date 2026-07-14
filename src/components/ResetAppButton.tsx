"use client";

import { useRouter } from "next/navigation";
import { resetAppData } from "@/lib/app-reset";
import { useAuth } from "./AuthProvider";

type ResetAppButtonProps = {
  className?: string;
  subtle?: boolean;
};

export function ResetAppButton({ className = "", subtle }: ResetAppButtonProps) {
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

  return (
    <button
      type="button"
      onClick={handleReset}
      className={
        subtle
          ? `relative z-10 w-full text-center text-xs text-muted underline-offset-2 transition hover:text-foreground hover:underline ${className}`
          : `relative z-10 min-h-12 w-full rounded-xl border border-alert/30 bg-alert/5 px-4 py-3 text-sm font-medium text-alert transition hover:border-alert/50 hover:bg-alert/10 active:scale-[0.98] ${className}`
      }
    >
      {subtle ? "Reset app data" : "Reset app & create new account"}
    </button>
  );
}
