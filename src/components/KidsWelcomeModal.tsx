"use client";

import Image from "next/image";
import { markKidsWelcomeSeen } from "@/lib/kids-mode";

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-purple/40 p-6 animate-kids-enter"
      role="dialog"
      aria-labelledby="kids-welcome-title"
    >
      <div className="relative max-w-md text-center">
        <div className="relative overflow-hidden rounded-3xl border-4 border-orange-400 bg-gradient-to-b from-amber-100 via-white to-violet-100 p-8 shadow-[0_14px_0_#fb923c]">
          <p className="text-4xl" aria-hidden>
            🎮⭐🏆🌈
          </p>
          <Image
            src="/kids/welcome-hero.svg"
            alt=""
            width={320}
            height={180}
            className="mx-auto mt-3 h-36 w-auto object-contain"
            priority
          />
          <p className="mt-4 inline-flex rounded-full bg-fuchsia-200 px-4 py-1 text-xs font-black uppercase tracking-widest text-fuchsia-800">
            🎉 Mode activated
          </p>
          <h2 id="kids-welcome-title" className="mt-3 text-3xl font-black text-orange-600">
            Welcome to Kids Quest! 🗺️
          </h2>
          <p className="mt-3 font-bold text-violet-800">
            Complete quests, unlock heroes, and earn XP — all while doing your exercises! ✨
          </p>
          <button
            type="button"
            onClick={handleEnter}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-orange-500 via-fuchsia-500 to-sky-500 py-4 text-lg font-black text-white shadow-[0_6px_0_#c2410c]"
          >
            Let&apos;s go! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
