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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm animate-fade-up"
      onClick={onDismiss}
      role="dialog"
      aria-label="New hero unlocked"
    >
      <div
        className="rm-card max-w-sm border-gold/50 p-8 text-center shadow-[0_0_40px_rgba(245,158,11,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-bold uppercase tracking-widest text-gold">New Hero Unlocked!</p>
        <span className="mt-4 block text-7xl animate-pulse-soft">{character.avatar}</span>
        <h3 className="mt-4 text-2xl font-bold text-orange">{character.name}</h3>
        <p className="mt-1 text-body">{character.trait}</p>
        {characterIds.length > 1 && (
          <p className="mt-2 text-sm text-muted">+{characterIds.length - 1} more unlocked!</p>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="mt-6 rounded-full bg-gradient-to-r from-purple to-brand px-8 py-3 text-sm font-bold text-white"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
