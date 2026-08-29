"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function KidsModeBanner() {
  const { user } = useAuth();

  return (
    <div
      className="relative z-40 border-b border-[var(--border)] bg-surface px-4 py-1.5 text-center"
      role="status"
    >
      <p className="text-sm font-medium tracking-wide text-foreground">
        Kids Quest
      </p>
      {!user && (
        <p className="mt-1 text-xs text-muted">
          Playing as guest —{" "}
          <Link href="/login" className="font-semibold text-brand-light hover:text-brand">
            sign in
          </Link>{" "}
          or{" "}
          <Link href="/register" className="font-semibold text-brand-light hover:text-brand">
            create an account
          </Link>{" "}
          to save XP and heroes
        </p>
      )}
    </div>
  );
}
