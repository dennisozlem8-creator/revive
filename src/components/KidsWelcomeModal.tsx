"use client";

import Image from "next/image";
import { markKidsWelcomeSeen } from "@/lib/kids-mode";
import { KidsIcon } from "./KidsIcon";

type KidsWelcomeModalProps = {
  onDismiss: () => void;
};

export function KidsWelcomeModal({ onDismiss }: KidsWelcomeModalProps) {
  function handleEnter() {
    markKidsWelcomeSeen();
    onDismiss();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c1840]/55 p-5 backdrop-blur-md animate-kids-enter"
      role="dialog"
      aria-labelledby="kids-welcome-title"
    >
      <div className="relative w-full max-w-lg text-center">
        <div className="kids-glass relative overflow-hidden p-0">
          <div className="relative">
            <Image
              src="/kids/welcome-hero.svg"
              alt=""
              width={640}
              height={360}
              className="h-44 w-full object-cover sm:h-56"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fff8ea] via-transparent to-transparent" />
            <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2" aria-hidden>
              <KidsIcon name="star" size={28} />
              <KidsIcon name="gamepad" size={32} />
              <KidsIcon name="trophy" size={28} />
            </div>
          </div>
          <div className="px-7 pb-8 pt-2">
            <p className="inline-flex items-center gap-1 rounded-full border border-amber-300/80 bg-amber-50 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-800">
              <KidsIcon name="party" size={16} />
              Adventure unlocked
            </p>
            <h2
              id="kids-welcome-title"
              className="kids-title-ink mt-3 text-3xl sm:text-4xl"
            >
              Welcome to Kids Quest
            </h2>
            <p className="mt-3 font-medium text-indigo-900/80">
              Cross the kingdoms, unlock heroes, and earn XP — all while doing your exercises.
            </p>
            <button
              type="button"
              onClick={handleEnter}
              className="kids-cta mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg"
            >
              Begin the journey
              <KidsIcon name="rocket" size={26} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
