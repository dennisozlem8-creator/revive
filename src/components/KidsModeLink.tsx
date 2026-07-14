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
        className={`animate-pulse rounded-2xl border-2 border-orange/30 bg-orange/5 px-5 py-8 text-center ${className}`}
        aria-busy="true"
        aria-label="Loading Kids Quest"
      >
        <div className="mx-auto h-24 w-48 rounded-lg bg-orange/10" />
        <div className="mx-auto mt-4 h-5 w-40 rounded bg-orange/10" />
      </div>
    );
  }

  const isPortal = variant === "portal";

  if (isPortal) {
    return (
      <Link
        href={KIDS_HREF}
        className={`group relative block overflow-hidden rounded-2xl border-2 border-orange/50 bg-gradient-to-br from-[#0a0520] via-purple/20 to-orange/10 p-1 shadow-[0_0_32px_rgba(139,92,246,0.25)] transition hover:border-orange hover:shadow-[0_0_48px_rgba(245,158,11,0.35)] ${className}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.15),transparent_60%)] opacity-0 transition group-hover:opacity-100" />
        <div className="relative rounded-xl bg-[#0a0520]/90 px-5 py-5 text-center">
          <Image
            src="/kids/welcome-hero.svg"
            alt=""
            width={240}
            height={120}
            className="mx-auto h-20 w-auto object-contain sm:h-24"
          />
          <p className="mt-3 inline-flex items-center gap-2 text-lg font-bold text-orange">
            <span aria-hidden>🎮</span>
            Enter Kids Quest World
          </p>
          <p className="mt-1 text-xs text-muted">
            {user
              ? "Switch to your colorful adventure mode"
              : "Explore quests — sign in later to save progress"}
          </p>
          <span className="mt-3 inline-flex rounded-full bg-gradient-to-r from-orange to-purple px-5 py-2 text-sm font-bold text-white">
            Go to Kids Quest →
          </span>
        </div>
      </Link>
    );
  }

  if (!user) {
    return (
      <Link
        href={KIDS_HREF}
        className={`inline-flex w-full flex-col items-center justify-center gap-1 rounded-full border border-orange/40 bg-orange/10 px-6 py-3.5 text-sm font-bold text-orange transition hover:bg-orange/20 ${className}`}
      >
        <span className="inline-flex items-center gap-2">
          <span aria-hidden>🎮</span>
          Kids Quest Mode
        </span>
        <span className="text-xs font-medium text-muted">Tap to explore the quest world</span>
      </Link>
    );
  }

  return (
    <Link
      href={KIDS_HREF}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full border border-orange/40 bg-orange/10 px-6 py-3.5 text-sm font-bold text-orange transition hover:bg-orange/20 ${className}`}
    >
      <span aria-hidden>🎮</span>
      Switch to Kids Quest Mode
    </Link>
  );
}
