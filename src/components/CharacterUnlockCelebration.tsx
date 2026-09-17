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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#243056]/40 p-6 backdrop-blur-md animate-fade-up"
      onClick={onDismiss}
      role="dialog"
      aria-label="New quest bot unlocked"
    >
      <div className="kids-glass max-w-sm p-8 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm font-semibold text-[#5b6685]">New bot</p>
        <span className="mt-5 flex justify-center">
          <KidsIcon name={character.avatar} size={104} />
        </span>
        <h3 className="kids-title-ink mt-4 text-3xl">{character.name}</h3>
        <p className="mt-1 text-base text-[#5b6685]">{character.trait}</p>
        {characterIds.length > 1 && (
          <p className="mt-2 text-sm text-[#5b6685]">+{characterIds.length - 1} more unlocked</p>
        )}
        <button type="button" onClick={onDismiss} className="kids-cta mt-6 rounded-full px-8 py-3 text-base">
          Continue
        </button>
      </div>
    </div>
  );
}
