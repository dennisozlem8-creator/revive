"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

const KIDS_HREF = "/kids";

type KidsModeLinkProps = {
  className?: string;
  variant?: "default" | "portal";
};

export function KidsModeLink({ className = "", variant = "default" }: KidsModeLinkProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className={`animate-pulse rounded-xl border border-[var(--border)] bg-surface px-5 py-8 text-center ${className}`}
        aria-busy="true"
        aria-label="Loading Kids Quest"
      >
        <div className="mx-auto h-24 w-48 rounded-lg bg-surface-elevated" />
        <div className="mx-auto mt-4 h-5 w-40 rounded bg-surface-elevated" />
      </div>
    );
  }

  const isPortal = variant === "portal";

  if (isPortal) {
    return (
      <Link
        href={KIDS_HREF}
        className={`block overflow-hidden rounded-xl border border-[var(--border)] bg-surface p-5 text-center transition hover:bg-surface-elevated ${className}`}
      >
        <Image
          src="/kids/welcome-hero.svg"
          alt=""
          width={240}
          height={120}
          className="mx-auto h-20 w-auto object-contain sm:h-24"
        />
        <p className="mt-3 text-base font-semibold text-foreground">Kids Quest</p>
        <p className="mt-1 text-xs text-muted">
          {user
            ? "Open the kids exercise games"
            : "Try the kids games. Sign in later to save progress."}
        </p>
        <span className="mt-3 inline-flex rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-foreground">
          Open Kids Quest
        </span>
      </Link>
    );
  }

  if (!user) {
    return (
      <Link
        href={KIDS_HREF}
        className={`inline-flex w-full flex-col items-center justify-center gap-1 rounded-md border border-[var(--border)] bg-surface px-6 py-3 text-sm font-medium text-foreground transition hover:bg-surface-elevated ${className}`}
      >
        Kids Quest
        <span className="text-xs font-normal text-muted">Open the kids games</span>
      </Link>
    );
  }

  return (
    <Link
      href={KIDS_HREF}
      className={`inline-flex w-full items-center justify-center rounded-md border border-[var(--border)] bg-surface px-6 py-3 text-sm font-medium text-foreground transition hover:bg-surface-elevated ${className}`}
    >
      Switch to Kids Quest
    </Link>
  );
}
