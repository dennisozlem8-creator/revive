"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { SafePicture } from "./SafePicture";

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
        className={`animate-pulse overflow-hidden rounded-[1.5rem] bg-white px-5 py-8 ${className}`}
        aria-busy="true"
        aria-label="Loading Kids Quest"
      >
        <div className="h-28 w-full rounded-xl bg-[#eef5fa]" />
        <div className="mx-auto mt-4 h-5 w-40 rounded bg-[#eef5fa]" />
      </div>
    );
  }

  const isPortal = variant === "portal";

  if (isPortal) {
    return (
      <Link
        href={KIDS_HREF}
        className={`rm-glow-kids block overflow-hidden rounded-[1.5rem] bg-white text-center shadow-[0_10px_32px_rgba(36,48,86,0.08)] ${className}`}
      >
        <SafePicture
          src="/images/landing-kids-quest.webp?v=5"
          alt=""
          className="h-36 w-full object-cover object-[center_62%] sm:h-40"
        />
        <div className="kids-caption px-5 py-4">
          <p className="text-sm font-semibold text-[#5b6685]">Stretch with the bots</p>
          <p className="kids-wordmark mt-1 text-2xl">Kids Quest</p>
          <p className="mt-1 text-sm text-[#5b6685]">The bots ask. You stretch.</p>
          <span className="kids-cta mt-4 inline-flex rounded-full px-5 py-2.5 text-base">Open</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={KIDS_HREF}
      className={`rm-glow-kids inline-flex w-full items-center justify-between gap-3 overflow-hidden rounded-[1.25rem] bg-white text-left shadow-[0_8px_24px_rgba(36,48,86,0.08)] ${className}`}
    >
      <SafePicture
        src="/kids/icons/kids-bot-hero.webp"
        alt=""
        className="h-16 w-16 object-cover"
      />
      <span className="flex-1 py-3 pr-4">
        <span className="kids-wordmark block text-xl leading-none">Kids Quest</span>
        <span className="mt-1 block text-sm text-[#5b6685]">
          Stretch with the bots
        </span>
      </span>
    </Link>
  );
}
