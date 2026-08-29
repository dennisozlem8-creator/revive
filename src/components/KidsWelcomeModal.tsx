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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-6"
      role="dialog"
      aria-labelledby="kids-welcome-title"
    >
      <div className="relative max-w-md text-center">
        <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-surface p-8">
          <Image
            src="/kids/welcome-hero.svg"
            alt=""
            width={320}
            height={180}
            className="mx-auto h-36 w-auto object-contain"
            priority
          />
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted">
            Kids Quest
          </p>
          <h2 id="kids-welcome-title" className="mt-2 text-2xl font-semibold text-foreground">
            Welcome
          </h2>
          <p className="mt-3 text-body">
            Complete short exercise games, unlock characters, and earn XP.
          </p>
          <button
            type="button"
            onClick={handleEnter}
            className="rm-btn rm-btn-brand mt-8 w-full"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
