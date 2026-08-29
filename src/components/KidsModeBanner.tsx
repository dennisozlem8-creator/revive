"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { KidsIcon } from "./KidsIcon";

export function KidsModeBanner() {
  const { user } = useAuth();

  return (
    <div
      className="relative z-40 border-b-2 border-orange/40 bg-gradient-to-r from-orange/30 via-purple/25 to-sky-300/40 px-4 py-2 text-center"
      role="status"
    >
      <p className="inline-flex items-center justify-center gap-2 text-sm font-bold tracking-wide text-orange animate-kids-badge-pulse">
        <KidsIcon name="gamepad" size={22} />
        Kids Quest Mode
        <KidsIcon name="star" size={22} />
      </p>
      {!user && (
        <p className="mt-1 inline-flex flex-wrap items-center justify-center gap-1 text-xs text-purple">
          Playing as guest —{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            sign in
          </Link>{" "}
          or{" "}
          <Link href="/register" className="font-semibold text-brand hover:underline">
            create an account
          </Link>{" "}
          to save XP and heroes
          <KidsIcon name="trophy" size={16} />
        </p>
      )}
    </div>
  );
}
