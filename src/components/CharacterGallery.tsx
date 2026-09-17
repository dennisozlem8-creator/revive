"use client";

import { KIDS_CHARACTERS, type KidsCharacter } from "@/lib/kids-characters";
import { KidsIcon } from "@/components/KidsIcon";
import { SafePicture } from "@/components/SafePicture";

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
      className={`relative flex flex-col items-center rounded-[1.25rem] bg-white p-4 text-center shadow-[0_8px_24px_rgba(36,48,86,0.08)] ${
        unlocked
          ? selected
            ? "ring-2 ring-[#f5c84a]"
            : "hover:-translate-y-0.5"
          : "cursor-default opacity-55"
      } ${compact ? "p-3" : "p-4"}`}
    >
      <KidsIcon name={unlocked ? character.avatar : "mystery"} size={compact ? 48 : 64} />
      <p className="mt-2 font-semibold text-[#243056]">{unlocked ? character.name : "Locked"}</p>
      <p className="mt-0.5 text-sm text-[#5b6685]">
        {unlocked ? character.trait : character.unlockHint}
      </p>
      {selected && unlocked && (
        <span className="absolute right-2 top-2 rounded-full bg-[#f5c84a] px-2 py-0.5 text-xs font-semibold text-[#243056]">
          Playing
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
    <section>
      <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_10px_32px_rgba(36,48,86,0.08)]">
        <SafePicture
          src="/kids/hero-collection.webp?v=2"
          alt="Quest bot crew."
          width={800}
          height={200}
          className="h-36 w-full object-cover object-[center_75%] sm:h-44"
        />
        <div className="kids-caption flex items-end justify-between gap-3 px-5 py-4">
          <div>
            <h2 className="kids-title-ink text-2xl sm:text-3xl">Bot crew</h2>
            <p className="mt-1 text-base text-[#5b6685]">Tap a bot to take them on stretches.</p>
          </div>
          <p className="text-sm font-semibold text-[#5b6685]">
            {unlockedCount}/{total}
          </p>
        </div>
      </div>
      <div
        className={`mt-4 grid gap-3 ${
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
