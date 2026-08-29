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
      className={`relative flex flex-col items-center rounded-2xl border-4 p-4 text-center transition ${
        unlocked
          ? selected
            ? "border-orange-400 bg-gradient-to-br from-amber-100 to-orange-50 shadow-[0_6px_0_#fb923c]"
            : "border-violet-200 bg-gradient-to-br from-white to-sky-50 hover:border-fuchsia-300"
          : "cursor-default border-slate-200 bg-slate-50"
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
        <span className="absolute -right-1 -top-1 rounded-full bg-gradient-to-r from-orange-500 to-fuchsia-500 px-2 py-0.5 text-[10px] font-black text-white">
          ⭐ Active
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
      <div className="relative overflow-hidden rounded-[1.6rem] border-4 border-amber-300">
        <Image
          src="/kids/hero-collection.svg"
          alt=""
          width={800}
          height={200}
          className="h-16 w-full object-cover sm:h-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/70 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <h2 className="text-2xl font-black text-white drop-shadow">🦸 Hero Collection</h2>
          <p className="text-sm font-bold text-amber-100">Unlock heroes by completing quests</p>
        </div>
        <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-black text-orange-600 shadow">
          ⭐ {unlockedCount}/{total}
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
