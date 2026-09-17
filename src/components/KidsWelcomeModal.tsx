"use client";

import { markKidsWelcomeSeen } from "@/lib/kids-mode";
import { KidsIcon } from "./KidsIcon";
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c1840]/55 p-5 backdrop-blur-md animate-kids-enter"
      role="dialog"
      aria-labelledby="kids-welcome-title"
    >
      <div className="relative w-full max-w-lg text-center">
        <div className="kids-glass relative overflow-hidden p-0">
          <div className="relative">
            <SafePicture
              src="/kids/quest-hq.webp?v=1"
              alt="Colorful quest bots at Kids Quest HQ."
              width={640}
              height={360}
              className="h-44 w-full object-cover object-[center_72%] sm:h-56"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fffde8] via-transparent to-transparent" />
            <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2" aria-hidden>
              <KidsIcon name="star" size={28} />
              <KidsIcon name="gamepad" size={32} />
              <KidsIcon name="trophy" size={28} />
            </div>
          </div>
          <div className="px-7 pb-8 pt-2">
            <p className="inline-flex items-center gap-1 rounded-full border-2 border-white bg-[#ffe14a] px-4 py-2 text-base font-extrabold text-[#1a1a6a] shadow-[0_0_0_3px_#ff4fa3]">
              <KidsIcon name="party" size={18} />
              Time to stretch
            </p>
            <h2
              id="kids-welcome-title"
              className="kids-title-ink mt-4 text-4xl sm:text-5xl"
            >
              Kids Quest
            </h2>
            <p className="mt-3 text-xl font-bold text-[#1a1a6a]">
              The bots ask. You stretch.
            </p>
            <button
              type="button"
              onClick={handleEnter}
              className="kids-cta mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-2xl"
            >
              Let&apos;s stretch!
              <KidsIcon name="rocket" size={26} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
