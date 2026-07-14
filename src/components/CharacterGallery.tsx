"use client";

import Image from "next/image";
import { KIDS_CHARACTERS, type KidsCharacter } from "@/lib/kids-characters";

type CharacterGalleryProps = {
  unlockedIds: string[];
  selectedId: string;
  onSelect: (id: string) => void;
  compact?: boolean;
};

function CharacterCard({
  character,
  unlocked,
  selected,
  onSelect,
  compact,
}: {
  character: KidsCharacter;
  unlocked: boolean;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={!unlocked}
      onClick={onSelect}
      className={`relative flex flex-col items-center rounded-2xl border p-4 text-center transition ${
        unlocked
          ? selected
            ? "border-orange bg-orange/15 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
            : "border-purple/30 bg-surface/60 hover:border-orange/50 hover:bg-surface/80"
          : "cursor-default border-white/10 bg-surface/30"
      } ${compact ? "p-3" : "p-4"}`}
    >
      <span
        className={`${compact ? "text-3xl" : "text-4xl"} transition ${
          unlocked ? "" : "opacity-30 grayscale blur-[1px]"
        }`}
        aria-hidden
      >
        {unlocked ? character.avatar : "❓"}
      </span>
      <p className={`mt-2 font-bold ${unlocked ? "text-foreground" : "text-muted"}`}>
        {unlocked ? character.name : "???"}
      </p>
      {unlocked ? (
        <p className="mt-0.5 text-xs text-muted">{character.trait}</p>
      ) : (
        <p className="mt-1 text-xs text-muted/80">{character.unlockHint}</p>
      )}
      {selected && unlocked && (
        <span className="absolute -right-1 -top-1 rounded-full bg-orange px-2 py-0.5 text-[10px] font-bold text-white">
          Active
        </span>
      )}
    </button>
  );
}

export function CharacterGallery({
  unlockedIds,
  selectedId,
  onSelect,
  compact,
}: CharacterGalleryProps) {
  const unlockedCount = unlockedIds.length;
  const total = KIDS_CHARACTERS.length;

  return (
    <section className="mt-6">
      <div className="relative overflow-hidden rounded-2xl border border-orange/30">
        <Image
          src="/kids/hero-collection.svg"
          alt=""
          width={800}
          height={200}
          className="h-16 w-full object-cover opacity-80 sm:h-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0520] to-transparent" />
        <div className="absolute bottom-3 left-4">
          <h2 className="text-2xl font-bold text-orange">Hero Collection</h2>
          <p className="text-sm text-muted">Unlock heroes by completing quests</p>
        </div>
        <span className="absolute right-4 top-4 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-sm font-bold text-gold">
          {unlockedCount}/{total}
        </span>
      </div>
      <div
        className={`mt-5 grid gap-3 ${
          compact ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        }`}
      >
        {KIDS_CHARACTERS.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            unlocked={unlockedIds.includes(character.id)}
            selected={selectedId === character.id}
            onSelect={() => onSelect(character.id)}
            compact={compact}
          />
        ))}
      </div>
    </section>
  );
}
