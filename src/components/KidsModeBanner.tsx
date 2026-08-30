"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { KidsIcon } from "./KidsIcon";

export function KidsModeBanner() {
  const { user } = useAuth();

  return (
    <div className="kids-ribbon relative z-40 px-4 py-2 text-center" role="status">
      <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wide animate-kids-badge-pulse">
        <KidsIcon name="gamepad" size={20} />
        Kids Quest World
        <KidsIcon name="star" size={20} />
      </p>
      {!user && (
        <p className="mt-1 inline-flex flex-wrap items-center justify-center gap-1 text-xs text-indigo-900/70">
          Playing as guest —{" "}
          <Link href="/login" className="font-semibold text-amber-900 hover:underline">
            sign in
          </Link>{" "}
          or{" "}
          <Link href="/register" className="font-semibold text-amber-900 hover:underline">
            create an account
          </Link>{" "}
          to save XP and heroes
          <KidsIcon name="trophy" size={16} />
        </p>
      )}
    </div>
  );
}
