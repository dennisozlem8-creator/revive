"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function KidsModeBanner() {
  const { user } = useAuth();

  return (
    <div
      className="relative z-40 border-b-2 border-orange/40 bg-gradient-to-r from-orange/30 via-purple/25 to-sky-300/40 px-4 py-2 text-center"
      role="status"
    >
      <p className="text-sm font-bold tracking-wide text-orange animate-kids-badge-pulse">
        🎮 Kids Quest Mode ⭐
      </p>
      {!user && (
        <p className="mt-1 text-xs text-purple">
          Playing as guest —{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            sign in
          </Link>{" "}
          or{" "}
          <Link href="/register" className="font-semibold text-brand hover:underline">
            create an account
          </Link>{" "}
          to save XP and heroes 🏆
        </p>
      )}
    </div>
  );
}
