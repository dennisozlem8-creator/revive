"use client";

import { markKidsWelcomeSeen } from "@/lib/kids-mode";
import { SafePicture } from "./SafePicture";

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#243056]/40 p-5 backdrop-blur-md animate-kids-enter"
      role="dialog"
      aria-labelledby="kids-welcome-title"
    >
      <div className="relative w-full max-w-md text-center">
        <div className="kids-glass overflow-hidden p-0">
          <SafePicture
            src="/kids/quest-hq.webp?v=2"
            alt="Quest bots at Kids Quest headquarters."
            width={640}
            height={360}
            className="h-48 w-full object-cover object-[center_72%] sm:h-56"
          />
          <div className="px-7 pb-8 pt-5">
            <p className="text-sm font-semibold text-[#5b6685]">Stretch with the bots</p>
            <h2 id="kids-welcome-title" className="kids-title-ink mt-2 text-4xl">
              Kids Quest
            </h2>
            <p className="mt-3 text-base text-[#5b6685]">
              The bots ask. You stretch. Pick a world. Start a stretch.
            </p>
            <button
              type="button"
              onClick={handleEnter}
              className="kids-cta mt-6 inline-flex w-full items-center justify-center rounded-full py-3.5 text-xl"
            >
              Start stretching
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
