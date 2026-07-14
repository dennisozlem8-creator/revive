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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0520]/95 p-6 backdrop-blur-sm animate-kids-enter"
      role="dialog"
      aria-labelledby="kids-welcome-title"
    >
      <div className="relative max-w-md text-center">
        <div className="pointer-events-none absolute -inset-8 rounded-full bg-purple/20 blur-3xl" />
        <div className="relative overflow-hidden rounded-3xl border-2 border-orange/50 bg-[#0a0520] p-8 shadow-[0_0_60px_rgba(139,92,246,0.4)]">
          <Image
            src="/kids/welcome-hero.svg"
            alt=""
            width={320}
            height={180}
            className="mx-auto h-36 w-auto object-contain"
            priority
          />
          <p className="mt-4 inline-flex rounded-full border border-purple/50 bg-purple/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-purple">
            Mode activated
          </p>
          <h2 id="kids-welcome-title" className="mt-4 text-3xl font-bold text-orange">
            Welcome to Kids Quest!
          </h2>
          <p className="mt-3 text-body">
            You&apos;ve entered a colorful adventure world. Complete quests, unlock heroes, and
            earn XP — all while doing your exercises!
          </p>
          <button
            type="button"
            onClick={handleEnter}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-orange via-gold to-purple py-4 text-lg font-bold text-white shadow-[0_0_24px_rgba(245,158,11,0.4)] transition hover:scale-[1.02]"
          >
            Let&apos;s go! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
