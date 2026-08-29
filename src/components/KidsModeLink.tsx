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
        className={`animate-pulse rounded-2xl border-2 border-orange/40 bg-orange/10 px-5 py-8 text-center ${className}`}
        aria-busy="true"
        aria-label="Loading Kids Quest"
      >
        <div className="mx-auto h-24 w-48 rounded-lg bg-orange/20" />
        <div className="mx-auto mt-4 h-5 w-40 rounded bg-orange/20" />
      </div>
    );
  }

  const isPortal = variant === "portal";

  if (isPortal) {
    return (
      <Link
        href={KIDS_HREF}
        className={`block overflow-hidden rounded-2xl border-2 border-orange/60 bg-gradient-to-br from-amber-100 via-violet-100 to-sky-100 p-5 text-center ${className}`}
      >
        <p className="text-3xl" aria-hidden>
          🎮
        </p>
        <Image
          src="/kids/welcome-hero.svg"
          alt=""
          width={240}
          height={120}
          className="mx-auto mt-2 h-20 w-auto object-contain sm:h-24"
        />
        <p className="mt-3 text-lg font-black text-orange-600">🎮 Enter Kids Quest World</p>
        <p className="mt-1 text-xs font-bold text-violet-700">
          {user
            ? "Switch to your colorful adventure mode"
            : "Explore quests — sign in later to save progress"}
        </p>
        <span className="mt-3 inline-flex rounded-full bg-gradient-to-r from-orange to-purple px-5 py-2 text-sm font-bold text-white">
          Go to Kids Quest →
        </span>
      </Link>
    );
  }

  if (!user) {
    return (
      <Link
        href={KIDS_HREF}
        className={`inline-flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-orange/50 bg-orange/15 px-6 py-3 text-sm font-bold text-orange ${className}`}
      >
        <span>🎮 Kids Quest Mode</span>
        <span className="text-xs font-medium text-purple">Tap to explore the quest world</span>
      </Link>
    );
  }

  return (
    <Link
      href={KIDS_HREF}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-orange/50 bg-orange/15 px-6 py-3 text-sm font-bold text-orange ${className}`}
    >
      🎮 Switch to Kids Quest Mode
    </Link>
  );
}
