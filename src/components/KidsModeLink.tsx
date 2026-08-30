"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { KidsIcon } from "./KidsIcon";

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
        className={`block overflow-hidden rounded-[1.75rem] border border-amber-300/80 bg-gradient-to-b from-white via-amber-50 to-sky-50 p-5 text-center shadow-[0_18px_36px_rgba(40,24,8,0.12)] ${className}`}
      >
        <span className="flex justify-center" aria-hidden>
          <KidsIcon name="gamepad" size={56} />
        </span>
        <Image
          src="/kids/welcome-hero.svg"
          alt=""
          width={240}
          height={120}
          className="mx-auto mt-2 h-24 w-auto object-cover sm:h-28"
        />
        <p className="mt-3 inline-flex items-center justify-center gap-2 text-lg font-bold text-amber-900">
          <KidsIcon name="gamepad" size={28} />
          Enter Kids Quest World
        </p>
        <p className="mt-1 text-xs font-bold text-violet-700">
          {user
            ? "Switch to your colorful adventure mode"
            : "Explore quests — sign in later to save progress"}
        </p>
        <span className="mt-3 inline-flex rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-5 py-2 text-sm font-bold text-amber-950 shadow">
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
        <span className="inline-flex items-center gap-2">
          <KidsIcon name="gamepad" size={22} />
          Kids Quest Mode
        </span>
        <span className="text-xs font-medium text-purple">Tap to explore the quest world</span>
      </Link>
    );
  }

  return (
    <Link
      href={KIDS_HREF}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-orange/50 bg-orange/15 px-6 py-3 text-sm font-bold text-orange ${className}`}
    >
      <KidsIcon name="gamepad" size={22} />
      Switch to Kids Quest Mode
    </Link>
  );
}
