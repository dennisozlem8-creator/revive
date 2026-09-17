"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function KidsModeBanner() {
  const { user } = useAuth();

  return (
    <div className="relative z-40 px-4 py-3 text-center" role="status">
      <p className="text-base font-semibold text-[#243056]">Tap a picture to stretch</p>
      {!user && (
        <p className="mt-1 text-sm text-[#5b6685]">
          Ask a grown-up to save your stars.{" "}
          <Link href="/login" className="font-semibold text-[#4d8ef0]">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
