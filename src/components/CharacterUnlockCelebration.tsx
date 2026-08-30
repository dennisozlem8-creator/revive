"use client";

import { useEffect } from "react";
import { getCharacterById } from "@/lib/kids-characters";
import { KidsIcon } from "./KidsIcon";

type CharacterUnlockCelebrationProps = {
  characterIds: string[];
  onDismiss: () => void;
};

export function CharacterUnlockCelebration({
  characterIds,
  onDismiss,
}: CharacterUnlockCelebrationProps) {
  const character = characterIds[0] ? getCharacterById(characterIds[0]) : null;

  useEffect(() => {
    if (!character) return;
    const timer = setTimeout(onDismiss, 4500);
    return () => clearTimeout(timer);
  }, [character, onDismiss]);

  if (!character) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c1840]/60 p-6 backdrop-blur-md animate-fade-up"
      onClick={onDismiss}
      role="dialog"
      aria-label="New hero unlocked"
    >
      <div
        className="kids-glass max-w-sm p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800">
          <KidsIcon name="party" size={22} />
          New hero
        </p>
        <span className="mt-5 flex justify-center drop-shadow-[0_8px_18px_rgba(180,100,20,0.35)]">
          <KidsIcon name={character.avatar} size={104} />
        </span>
        <h3 className="kids-title-ink mt-4 text-3xl">{character.name}</h3>
        <p className="mt-1 font-medium text-indigo-900/75">{character.trait}</p>
        {characterIds.length > 1 && (
          <p className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold text-amber-800">
            +{characterIds.length - 1} more unlocked!
            <KidsIcon name="star" size={18} />
          </p>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="kids-cta mt-6 rounded-full px-8 py-3 text-sm"
        >
          <span className="inline-flex items-center justify-center gap-2">
            Awesome
            <KidsIcon name="rocket" size={20} />
          </span>
        </button>
      </div>
    </div>
  );
}
