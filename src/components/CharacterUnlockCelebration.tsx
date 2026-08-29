"use client";

import { useEffect } from "react";
import { getCharacterById } from "@/lib/kids-characters";

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-fuchsia-900/40 p-6 backdrop-blur-sm animate-fade-up"
      onClick={onDismiss}
      role="dialog"
      aria-label="New hero unlocked"
    >
      <div
        className="max-w-sm rounded-[2rem] border-4 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-fuchsia-50 p-8 text-center shadow-[0_16px_0_#f59e0b]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-black uppercase tracking-wide text-orange-600">🎉 New character!</p>
        <span className="mt-4 block text-7xl">{character.avatar}</span>
        <h3 className="mt-4 text-2xl font-black text-orange-800">{character.name}</h3>
        <p className="mt-1 font-bold text-violet-700">{character.trait}</p>
        {characterIds.length > 1 && (
          <p className="mt-2 text-sm font-black text-fuchsia-700">+{characterIds.length - 1} more unlocked! ⭐</p>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="mt-6 rounded-full bg-gradient-to-r from-orange-500 to-fuchsia-500 px-8 py-3 text-sm font-black text-white shadow-[0_5px_0_#c2410c]"
        >
          Awesome! 🚀
        </button>
      </div>
    </div>
  );
}
