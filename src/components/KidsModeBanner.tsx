"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { KidsIcon } from "./KidsIcon";

export function KidsModeBanner() {
  const { user } = useAuth();

  return (
    <div className="kids-ribbon relative z-40 px-4 py-3 text-center" role="status">
      <p className="inline-flex items-center justify-center gap-2 text-xl font-extrabold text-[#1a1a6a]">
        <KidsIcon name="gamepad" size={24} />
        Tap a picture to stretch
        <KidsIcon name="star" size={24} />
      </p>
      {!user && (
        <p className="mt-1 text-lg font-bold text-[#1a1a6a]">
          Ask a grown-up to save your stars.{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
