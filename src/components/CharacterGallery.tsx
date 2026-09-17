"use client";

import { KIDS_CHARACTERS, type KidsCharacter } from "@/lib/kids-characters";
import { KidsIcon, KidsIconTitle } from "@/components/KidsIcon";
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
      className={`relative flex flex-col items-center rounded-[1.35rem] border-2 bg-white p-4 text-center transition ${
        unlocked
          ? selected
            ? "border-white shadow-[0_0_0_4px_#ff4fa3,0_0_0_8px_#ffe14a,0_12px_28px_rgba(20,20,90,0.16)]"
            : "border-white shadow-[0_0_0_3px_#38bdf8,0_10px_24px_rgba(20,20,90,0.1)] hover:-translate-y-0.5"
          : "cursor-default border-slate-200/80 bg-white/50"
      } ${compact ? "p-3" : "p-4"}`}
    >
      <span
        className={`transition ${unlocked ? "" : "opacity-30 grayscale blur-[1px]"}`}
        aria-hidden
      >
        <KidsIcon name={unlocked ? character.avatar : "mystery"} size={compact ? 44 : 56} />
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
        <span className="absolute -right-1 -top-1 inline-flex items-center gap-0.5 rounded-full border-2 border-white bg-gradient-to-b from-[#ffe14a] to-[#ffb703] px-2 py-0.5 text-[10px] font-bold text-[#1a1a6a] shadow">
          <KidsIcon name="star" size={14} />
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
      <div className="relative overflow-hidden rounded-[1.75rem] border-4 border-white shadow-[0_0_0_4px_#ff4fa3,0_18px_36px_rgba(20,20,90,0.16)]">
        <SafePicture
          src="/kids/hero-collection.webp?v=1"
          alt="Five colorful quest bots lined up at candy HQ."
          width={800}
          height={200}
          className="h-28 w-full object-cover object-[center_75%] sm:h-32"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a6a]/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-5">
          <h2 className="text-2xl font-bold tracking-tight text-amber-50 drop-shadow-md">
            <KidsIconTitle icon="hero" size={32} className="text-amber-50">
              Bot crew
            </KidsIconTitle>
          </h2>
          <p className="text-sm font-medium text-amber-100/90">Unlock quest bots by stretching and scoring</p>
        </div>
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border-2 border-white bg-white/90 px-3 py-1 text-sm font-bold text-[#1a1a6a] shadow">
          <KidsIcon name="star" size={16} /> {unlockedCount}/{total}
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
